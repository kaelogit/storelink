"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowRight, Loader2, User } from "lucide-react";
import { fetchOnboardingContext, getOnboardingHubRedirect } from "@/lib/onboardingState";
import { checkSlugAvailability, normalizeSlug } from "@/lib/slugAvailability";

export default function BuyerIdentityPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [slug, setSlug] = useState("");
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      setUserId(user.id);

      const ctx = await fetchOnboardingContext(supabase, user.id);
      const next = getOnboardingHubRedirect(ctx);
      if (next !== "/onboarding/buyer/identity") {
        router.replace(next);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone_number, slug")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        setFullName(String(profile.full_name || ""));
        setPhone(String(profile.phone_number || ""));
        setSlug(String(profile.slug || ""));
      }
      setBooting(false);
    })();
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
    if (slugStatus === "taken" || slugStatus === "checking") {
      setErrorMsg("Please use an available slug.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          display_name: fullName.trim(),
          phone_number: phone.trim(),
          slug: normalizeSlug(slug),
          onboarding_step: "buyer_location",
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      router.push("/onboarding/buyer/location");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err?.message || "Could not save identity.");
    } finally {
      setLoading(false);
    }
  };

  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 pb-24">
      <div className="w-full max-w-xl pt-10">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-center mb-3">StoreLink · Shopper</p>
        <h1 className="text-3xl font-black text-gray-900 text-center uppercase tracking-tighter mb-2">Set your identity</h1>
        <p className="text-sm text-gray-500 text-center mb-8 font-medium leading-relaxed">
          Quick setup for web checkout and app continuity.
        </p>

        <div className="space-y-4 bg-white border border-gray-100 rounded-4xl p-6 shadow-sm">
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
            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Phone</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="+234..."
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

          {slug && (
            <p className={`text-[11px] font-bold ${slugStatus === "taken" ? "text-red-600" : "text-gray-500"}`}>
              {slugStatus === "checking" && "Checking slug..."}
              {slugStatus === "available" && `Available: @${normalizeSlug(slug)}`}
              {slugStatus === "taken" && "Slug is already in use."}
            </p>
          )}

          {errorMsg && <p className="text-xs font-bold text-red-600">{errorMsg}</p>}

          <button
            type="button"
            disabled={loading}
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <><User size={16} /> Continue <ArrowRight size={18} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
