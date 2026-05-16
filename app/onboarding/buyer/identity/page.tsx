"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { buildR2Key, uploadFileToR2 } from "@/lib/mediaUpload";
import { ArrowRight, Loader2, User } from "lucide-react";
import { fetchOnboardingContext, getOnboardingHubRedirect, type ProfileGender } from "@/lib/onboardingState";
import { checkSlugAvailability, normalizeSlug } from "@/lib/slugAvailability";
import { getClientUserSafe } from "@/lib/getClientUserSafe";

const BIO_MAX = 150;
const GENDER_OPTIONS: { value: ProfileGender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export default function BuyerIdentityPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [slug, setSlug] = useState("");
  const [gender, setGender] = useState<ProfileGender | "">("");
  const [bio, setBio] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const user = await getClientUserSafe(supabase);
        if (!user) {
          router.replace("/login");
          return;
        }
        setUserId(user.id);

        const ctx = await fetchOnboardingContext(supabase, user.id);
        const next = getOnboardingHubRedirect(ctx);
        if (next !== "/onboarding/buyer/identity" && next !== "/onboarding/setup") {
          router.replace(next);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
        .select("full_name, display_name, phone_number, slug, bio, gender, logo_url")
          .eq("id", user.id)
          .maybeSingle();

        const meta = (user.user_metadata || {}) as Record<string, unknown>;
        const metaName = String(meta.full_name || meta.name || "").trim();
        const metaPhone = String(meta.phone || meta.phone_number || "").trim();

        if (profile) {
          setFullName(String(profile.full_name || profile.display_name || metaName || ""));
          setPhone(String(profile.phone_number || metaPhone || ""));
          setSlug(String(profile.slug || ""));
          setBio(String(profile.bio || "").slice(0, BIO_MAX));
          setLogoPreview(String(profile.logo_url || ""));
          const g = String(profile.gender || "").toLowerCase();
          if (g === "male" || g === "female" || g === "other") setGender(g);
        } else {
          setFullName(metaName);
          setPhone(metaPhone);
        }
      } catch {
        if (!cancelled) {
          setErrorMsg("Could not load this step. Check your connection and try again.");
        }
      } finally {
        if (!cancelled) setBooting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const normalized = normalizeSlug(slug);
      if (!normalized) {
        setSlugStatus("idle");
        return;
      }
      setSlugStatus("checking");
      const status = await checkSlugAvailability(supabase, normalized, userId || null);
      setSlugStatus(status);
    }, 300);
    return () => clearTimeout(timer);
  }, [slug, userId]);

  const handleContinue = async () => {
    if (!fullName.trim() || !phone.trim() || !slug.trim()) {
      setErrorMsg("Name, phone, and slug are required.");
      return;
    }
    if (!logoPreview && !logoFile) {
      setErrorMsg("Please upload your profile logo.");
      return;
    }
    if (!gender) {
      setErrorMsg("Please select a gender.");
      return;
    }
    if (slugStatus === "taken" || slugStatus === "checking") {
      setErrorMsg("Please use an available slug.");
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      setErrorMsg("Enter a valid phone number (at least 10 digits).");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      const user = await getClientUserSafe(supabase);
      if (!user) return;

      let normalizedPhone = phone.trim();
      if (!normalizedPhone.startsWith("+") && !normalizedPhone.startsWith("234")) {
        normalizedPhone = phoneDigits.startsWith("0") ? `234${phoneDigits.slice(1)}` : `234${phoneDigits}`;
      }

      let logoUrl = logoPreview || "";
      if (logoFile) {
        const fileExt = logoFile.name.split(".").pop() || "jpg";
        const key = buildR2Key("profiles", `${user.id}/buyer-logo-${Date.now()}.${fileExt}`);
        logoUrl = await uploadFileToR2({
          bucket: "profiles",
          key,
          file: logoFile,
        });
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          is_seller: false,
          full_name: fullName.trim(),
          display_name: fullName.trim(),
          phone_number: normalizedPhone,
          slug: normalizeSlug(slug),
          gender,
          bio: bio.trim() || null,
          logo_url: logoUrl || null,
          onboarding_completed: false,
          onboarding_step: "buyer_location",
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      router.push("/onboarding/buyer/location");
      router.refresh();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Could not save identity.");
    } finally {
      setLoading(false);
    }
  };

  if (booting) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col items-center p-6 pb-24">
      <div className="w-full max-w-xl pt-10">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-center mb-3">
          StoreLink · Shopper · Step 2 of 4
        </p>
        <h1 className="text-3xl font-black text-gray-900 text-center uppercase tracking-tighter mb-2">Your profile</h1>
        <p className="text-sm text-gray-500 text-center mb-8 font-medium leading-relaxed">
          Same core fields as the app: name, handle, phone, gender, and a short bio. Home address is next.
        </p>

        <div className="space-y-4 bg-white border border-gray-100 rounded-4xl p-6 shadow-sm">
          <div className="block">
            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Profile logo</span>
            <div className="flex items-center gap-3">
              <label className="inline-flex cursor-pointer items-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-700 hover:bg-gray-100">
                Upload logo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setLogoFile(file);
                    if (file) setLogoPreview(URL.createObjectURL(file));
                  }}
                />
              </label>
              {logoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoPreview} alt="Logo preview" className="h-12 w-12 rounded-xl object-cover border border-gray-200" />
              ) : (
                <span className="text-[11px] font-medium text-gray-400">No logo yet</span>
              )}
            </div>
          </div>

          <label className="block">
            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Full name</span>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Your full name"
              required
            />
          </label>

          <label className="block">
            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Profile slug</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="your-name"
              required
            />
          </label>

          {slug ? (
            <p className={`text-[11px] font-bold ${slugStatus === "taken" ? "text-red-600" : "text-gray-500"}`}>
              {slugStatus === "checking" && "Checking slug..."}
              {slugStatus === "available" && `Available: @${normalizeSlug(slug)}`}
              {slugStatus === "taken" && "Slug is already in use."}
            </p>
          ) : null}

          <div>
            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Gender</span>
            <div className="grid grid-cols-3 gap-2">
              {GENDER_OPTIONS.map((opt) => {
                const selected = gender === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setGender(opt.value)}
                    className={`rounded-2xl border px-3 py-3 text-[10px] font-black uppercase tracking-widest transition ${
                      selected
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block">
            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Phone</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="+2348012345678"
              required
            />
          </label>

          <label className="block">
            <span className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
              <span>Bio</span>
              <span className="font-medium text-gray-400">{bio.length}/{BIO_MAX}</span>
            </span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
              maxLength={BIO_MAX}
              rows={3}
              className="w-full resize-none p-4 rounded-2xl bg-gray-50 border border-gray-100 font-medium text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Fashion lover, shop local…"
            />
          </label>

          {errorMsg ? <p className="text-xs font-bold text-red-600">{errorMsg}</p> : null}

          <button
            type="button"
            disabled={loading || slugStatus === "checking" || slugStatus === "taken" || !gender}
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <User size={16} /> Continue <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
