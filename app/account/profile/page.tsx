"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  Camera,
  User,
  Lock,
  Check,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle2,
  Wrench,
  Store,
  ShieldCheck,
  Users,
  Gift,
  Sparkles,
} from "lucide-react";
import { ACCOUNT_PROFILE_SELECT } from "@/lib/accountProfileFields";
import { checkSlugAvailability, normalizeSlug } from "@/lib/slugAvailability";
import GooglePlacesAutocomplete from "@/components/address/GooglePlacesAutocomplete";
import PlaceDerivedLocationReadout from "@/components/address/PlaceDerivedLocationReadout";
import { getGoogleMapsBrowserKey } from "@/lib/googlePlacesParsed";
import type { ParsedGooglePlace } from "@/lib/googlePlacesParsed";
import {
  coordsNearlyEqual,
  getCountryByCode,
  getPhonePrefixForCountry,
  normalizePhoneSpaces,
} from "@/lib/accountProfileParity";

type ProfileRow = {
  email: string | null;
  display_name: string | null;
  full_name: string | null;
  bio: string | null;
  phone_number: string | null;
  location_state: string | null;
  location_city: string | null;
  location: string | null;
  currency_code: string | null;
  slug: string | null;
  logo_url: string | null;
  coin_balance: number | null;
  is_seller: boolean | null;
  is_verified: boolean | null;
  verification_status: string | null;
  onboarding_completed: boolean | null;
  onboarding_step: string | null;
  discovery_city: string | null;
  discovery_state: string | null;
  discovery_latitude: number | null;
  discovery_longitude: number | null;
  service_latitude: number | null;
  service_longitude: number | null;
  location_country: string | null;
  location_country_code: string | null;
  handle_last_changed_at: string | null;
  seller_type: string | null;
  instagram_handle: string | null;
  tiktok_url: string | null;
  shop_address: string | null;
  cover_image_url: string | null;
};

function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function formatUnlock(d: Date): string {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function AccountProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [legacyStoreId, setLegacyStoreId] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [locationState, setLocationState] = useState("");
  const [locationCity, setLocationCity] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [slug, setSlug] = useState("");
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [suggestedSlugMessage, setSuggestedSlugMessage] = useState<string | null>(null);
  const [storeAddress, setStoreAddress] = useState("");
  const [homeLat, setHomeLat] = useState<number | null>(null);
  const [homeLng, setHomeLng] = useState<number | null>(null);
  const [shopLat, setShopLat] = useState<number | null>(null);
  const [shopLng, setShopLng] = useState<number | null>(null);
  /** City/state from the shop Places pick (when shop ≠ home). */
  const [shopCity, setShopCity] = useState("");
  const [shopState, setShopState] = useState("");
  const [useHomeAsShop, setUseHomeAsShop] = useState(false);
  const [homeCountryName, setHomeCountryName] = useState("");
  const [homeCountryCode, setHomeCountryCode] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [upgradeBusy, setUpgradeBusy] = useState<string | null>(null);
  const redirectAfterSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mapsKey = getGoogleMapsBrowserKey();

  useEffect(() => {
    return () => {
      if (redirectAfterSaveRef.current) {
        clearTimeout(redirectAfterSaveRef.current);
        redirectAfterSaveRef.current = null;
      }
    };
  }, []);

  const effectiveCountryCode = ((profile?.location_country_code ?? "").trim().toUpperCase() || "NG") as string;
  const phonePrefix = getPhonePrefixForCountry(effectiveCountryCode);
  const phoneNorm = normalizePhoneSpaces(phone || profile?.phone_number || "");
  const isCountryLocked =
    effectiveCountryCode === "NG" && phoneNorm.startsWith("+234") && phoneNorm.length >= 12;

  const handleUnlockDate = addDays(new Date(profile?.handle_last_changed_at || 0), 30);
  const isHandleLocked = new Date().getTime() < handleUnlockDate.getTime();

  const checkSlugAvailabilityDetailed = useCallback(
    async (targetSlug: string) => {
      const normalized = normalizeSlug(targetSlug);
      if (!normalized) {
        setSlugStatus("idle");
        setSuggestedSlugMessage(null);
        return;
      }
      const current = normalizeSlug(profile?.slug || "");
      if (normalized === current) {
        setSlugStatus("available");
        setSuggestedSlugMessage(null);
        return;
      }
      if (!userId) return;
      setSlugStatus("checking");
      setSuggestedSlugMessage(null);
      const first = await checkSlugAvailability(supabase, normalized, userId);
      if (first === "available") {
        setSlugStatus("available");
        return;
      }
      const base = normalized.replace(/\d+$/, "") || normalized;
      for (let i = 2; i <= 99; i++) {
        const candidate = `${base}${i}`;
        const st = await checkSlugAvailability(supabase, candidate, userId);
        if (st === "available") {
          setSlug(candidate);
          setSlugStatus("available");
          setSuggestedSlugMessage(
            `That handle was taken. We suggest @${candidate} — change it below if you prefer.`,
          );
          return;
        }
      }
      setSlugStatus("taken");
    },
    [profile?.slug, userId],
  );

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);
      setAuthEmail(user.email || "");

      const [{ data, error }, { data: storeData }] = await Promise.all([
        supabase.from("profiles").select(ACCOUNT_PROFILE_SELECT).eq("id", user.id).maybeSingle(),
        supabase.from("stores").select("id, slug, location, cover_image_url").eq("owner_id", user.id).maybeSingle(),
      ]);

      if (error) {
        setLoadError(error.message);
        setLoading(false);
        return;
      }

      const p = data as ProfileRow | null;
      setProfile(p);
      setFullName(p?.full_name?.trim() || p?.display_name?.trim() || "");
      setBio(p?.bio || "");
      setPhone(p?.phone_number || "");
      setLogoUrl(p?.logo_url?.trim() || "");
      setLocationState(p?.location_state || "");
      setLocationCity(p?.location_city || "");
      setHomeAddress(p?.location || "");
      setHomeLat(p?.discovery_latitude != null ? Number(p.discovery_latitude) : null);
      setHomeLng(p?.discovery_longitude != null ? Number(p.discovery_longitude) : null);
      setShopLat(p?.service_latitude != null ? Number(p.service_latitude) : null);
      setShopLng(p?.service_longitude != null ? Number(p.service_longitude) : null);
      if (
        p?.is_seller &&
        p.discovery_latitude != null &&
        p.discovery_longitude != null &&
        p.service_latitude != null &&
        p.service_longitude != null &&
        !coordsNearlyEqual(
          Number(p.discovery_latitude),
          Number(p.discovery_longitude),
          Number(p.service_latitude),
          Number(p.service_longitude),
        )
      ) {
        setShopCity(String(p.location_city || ""));
        setShopState(String(p.location_state || ""));
      } else {
        setShopCity("");
        setShopState("");
      }
      if (
        p?.is_seller &&
        p.discovery_latitude != null &&
        p.discovery_longitude != null &&
        p.service_latitude != null &&
        p.service_longitude != null &&
        coordsNearlyEqual(
          Number(p.discovery_latitude),
          Number(p.discovery_longitude),
          Number(p.service_latitude),
          Number(p.service_longitude),
        )
      ) {
        setUseHomeAsShop(true);
      } else {
        setUseHomeAsShop(false);
      }
      setSlug(p?.slug || "");
      setInstagram((p?.instagram_handle ?? "").replace(/^@/, ""));
      setTiktok(p?.tiktok_url || "");

      if (p?.is_seller && storeData) {
        setLegacyStoreId(storeData.id);
        const fromStore = storeData.location?.trim() ? String(storeData.location) : "";
        setStoreAddress(fromStore || (p.shop_address?.trim() ? String(p.shop_address) : ""));
        const storeCover = storeData.cover_image_url?.trim() ? String(storeData.cover_image_url) : "";
        setCoverUrl(storeCover || (p.cover_image_url?.trim() ? String(p.cover_image_url) : ""));
      } else if (p?.is_seller) {
        setLegacyStoreId(null);
        setStoreAddress(p.shop_address?.trim() ? String(p.shop_address) : "");
        setCoverUrl(p.cover_image_url?.trim() ? String(p.cover_image_url) : "");
      } else {
        setLegacyStoreId(null);
        setStoreAddress("");
        setCoverUrl("");
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const trimmed = normalizeSlug(slug);
      const currentSlug = normalizeSlug(profile?.slug || "");
      if (!trimmed) {
        setSlugStatus("idle");
        return;
      }
      if (trimmed === currentSlug) {
        setSlugStatus("available");
        return;
      }
      setSlugStatus("checking");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const status = await checkSlugAvailability(supabase, trimmed, user?.id || null);
      setSlugStatus(status);
    }, 350);

    return () => clearTimeout(timer);
  }, [slug, profile?.slug]);

  const handleLogoUpload = async (file: File | null) => {
    if (!file || !userId) return;
    setUploadingLogo(true);
    setMsg(null);
    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const filePath = `${userId}/logo_${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("profiles").upload(filePath, file, {
        upsert: true,
        contentType: file.type || "image/jpeg",
      });
      if (uploadError) {
        const pathProducts = `profiles/${userId}/logo_${Date.now()}.${ext}`;
        const { error: e2 } = await supabase.storage.from("products").upload(pathProducts, file, {
          upsert: true,
          contentType: file.type || "image/jpeg",
        });
        if (e2) throw e2;
        const { data } = supabase.storage.from("products").getPublicUrl(pathProducts);
        setLogoUrl(data.publicUrl);
      } else {
        const { data } = supabase.storage.from("profiles").getPublicUrl(filePath);
        setLogoUrl(data.publicUrl);
      }
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : "Logo upload failed.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleCoverPick = (file: File | null) => {
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    setMsg(null);
    if (redirectAfterSaveRef.current) {
      clearTimeout(redirectAfterSaveRef.current);
      redirectAfterSaveRef.current = null;
    }
    try {
      if (!isHandleLocked && normalizeSlug(slug) !== normalizeSlug(profile?.slug || "")) {
        if (slugStatus === "taken") {
          setMsg("Username taken — blur the username field to get a suggested handle, then save.");
          setSaving(false);
          return;
        }
      }

      const fn = fullName.trim() || null;
      const digits = phone.startsWith(phonePrefix)
        ? phonePrefix + phone.slice(phonePrefix.length).replace(/\D/g, "")
        : phonePrefix + phone.replace(/\D/g, "");

      const coordsOk = (la: number | null, lo: number | null) =>
        la != null && lo != null && Number.isFinite(la) && Number.isFinite(lo);

      const sellerUseHome =
        Boolean(profile?.is_seller && useHomeAsShop && coordsOk(homeLat, homeLng));
      const effShopLat = sellerUseHome ? homeLat : shopLat;
      const effShopLng = sellerUseHome ? homeLng : shopLng;
      const effStoreLine = sellerUseHome ? homeAddress.trim() : storeAddress.trim();

      if (mapsKey && homeAddress.trim()) {
        if (!coordsOk(homeLat, homeLng)) {
          setMsg("Choose your home address from the suggestions list so city, state, and coordinates stay in sync.");
          setSaving(false);
          return;
        }
        if (!locationCity.trim() || !locationState.trim()) {
          setMsg("Pick a full address from the list so city and region are filled.");
          setSaving(false);
          return;
        }
      }

      if (profile?.is_seller && mapsKey && !sellerUseHome && storeAddress.trim()) {
        if (!coordsOk(shopLat, shopLng)) {
          setMsg("Choose your shop address from the suggestions list.");
          setSaving(false);
          return;
        }
        if (
          coordsOk(homeLat, homeLng) &&
          coordsOk(shopLat, shopLng) &&
          !coordsNearlyEqual(homeLat, homeLng, shopLat, shopLng) &&
          (!shopCity.trim() || !shopState.trim())
        ) {
          setMsg("Pick a shop address that includes city and region.");
          setSaving(false);
          return;
        }
      }

      let listingCity = locationCity.trim();
      let listingState = locationState.trim();
      if (
        mapsKey &&
        profile?.is_seller &&
        !sellerUseHome &&
        coordsOk(shopLat, shopLng) &&
        coordsOk(homeLat, homeLng) &&
        !coordsNearlyEqual(homeLat, homeLng, shopLat, shopLng)
      ) {
        listingCity = shopCity.trim() || locationCity.trim();
        listingState = shopState.trim() || locationState.trim();
      }

      let resolvedCover: string | null = coverUrl.trim() || null;
      if (coverFile && userId) {
        const path = legacyStoreId ? `covers/${legacyStoreId}-${Date.now()}` : `covers/profile-${userId}-${Date.now()}`;
        const { error: upErr } = await supabase.storage.from("products").upload(path, coverFile, {
          upsert: true,
          contentType: coverFile.type || "image/jpeg",
        });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("products").getPublicUrl(path);
        resolvedCover = data.publicUrl;
        setCoverFile(null);
        setCoverPreview(null);
        setCoverUrl(resolvedCover || "");
      }

      const profilePatch: Record<string, unknown> = {
        display_name: fn,
        full_name: fn,
        bio: bio.trim() || null,
        phone_number: digits.trim() || null,
        logo_url: logoUrl.trim() || null,
        instagram_handle: instagram.trim() || null,
        tiktok_url: tiktok.trim() || null,
        location_state: listingState || null,
        location_city: listingCity || null,
        location: homeAddress.trim() || null,
        discovery_city: locationCity.trim() || null,
        discovery_state: locationState.trim() || null,
        discovery_latitude: homeLat,
        discovery_longitude: homeLng,
        location_country: homeCountryName.trim() || null,
        location_country_code: homeCountryCode.trim().toUpperCase() || null,
        updated_at: new Date().toISOString(),
      };

      if (!isHandleLocked && normalizeSlug(slug) !== normalizeSlug(profile?.slug || "")) {
        profilePatch.slug = normalizeSlug(slug) || null;
        profilePatch.handle_last_changed_at = new Date().toISOString();
      } else {
        delete profilePatch.slug;
        delete profilePatch.handle_last_changed_at;
      }

      if (profile?.is_seller) {
        profilePatch.service_latitude = effShopLat;
        profilePatch.service_longitude = effShopLng;
        profilePatch.shop_address = effStoreLine || null;
        profilePatch.cover_image_url = resolvedCover;
      }

      const { error } = await supabase.from("profiles").update(profilePatch).eq("id", userId);
      if (error) throw error;

      if (profile?.is_seller && legacyStoreId) {
        const { error: storeError } = await supabase
          .from("stores")
          .update({
            slug: normalizeSlug(slug) || null,
            location: effStoreLine || null,
            cover_image_url: resolvedCover,
            instagram_handle: instagram.trim() || null,
            tiktok_url: tiktok.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", legacyStoreId);
        if (storeError) throw storeError;
      }

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              display_name: fn,
              full_name: fn,
              bio: bio.trim() || null,
              phone_number: digits.trim() || null,
              logo_url: logoUrl.trim() || null,
              slug: (!isHandleLocked ? normalizeSlug(slug) : prev.slug) || null,
              handle_last_changed_at:
                !isHandleLocked && normalizeSlug(slug) !== normalizeSlug(prev.slug || "")
                  ? new Date().toISOString()
                  : prev.handle_last_changed_at,
              location_state: listingState || null,
              location_city: listingCity || null,
              location: homeAddress.trim() || null,
              discovery_city: locationCity.trim() || null,
              discovery_state: locationState.trim() || null,
              discovery_latitude: homeLat,
              discovery_longitude: homeLng,
              location_country: homeCountryName.trim() || null,
              location_country_code: homeCountryCode.trim().toUpperCase() || null,
              instagram_handle: instagram.trim() || null,
              tiktok_url: tiktok.trim() || null,
              service_latitude: prev.is_seller ? effShopLat : prev.service_latitude,
              service_longitude: prev.is_seller ? effShopLng : prev.service_longitude,
              shop_address: prev.is_seller ? effStoreLine || null : prev.shop_address,
              cover_image_url: prev.is_seller ? resolvedCover : prev.cover_image_url,
            }
          : prev,
      );
      setMsg("Changes saved. Redirecting to your dashboard…");
      if (redirectAfterSaveRef.current) clearTimeout(redirectAfterSaveRef.current);
      redirectAfterSaveRef.current = setTimeout(() => {
        redirectAfterSaveRef.current = null;
        router.push("/dashboard");
      }, 1600);
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpgradeToBoth = async (mode: "add_services" | "add_products") => {
    if (!userId) return;
    setUpgradeBusy(mode);
    setMsg(null);
    try {
      const { error } = await supabase.rpc("upgrade_seller_type_to_both", {
        p_profile_id: userId,
        p_target_mode: mode,
      });
      if (error) throw error;
      setMsg(
        mode === "add_services"
          ? "You can now create service listings from your store."
          : "You can now add products to your service store.",
      );
      router.push("/onboarding/seller?upgrade=1");
      router.refresh();
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : "Upgrade failed.");
    } finally {
      setUpgradeBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-emerald-600" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-900 font-medium">
        Could not load profile: {loadError}
      </div>
    );
  }

  const showAvatar = logoUrl.trim() || profile?.logo_url;
  const displayCover = coverPreview || coverUrl;

  return (
    <div className="max-w-lg mx-auto space-y-0 pb-24" id="personal-information">
      <header className="mb-8 border-b border-gray-200 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            <ArrowLeft size={18} aria-hidden />
            Back to dashboard
          </Link>
          <button
            type="submit"
            form="account-profile-form"
            disabled={saving || uploadingLogo || slugStatus === "taken" || slugStatus === "checking"}
            className="inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" aria-label="Saving" /> : "Save changes"}
          </button>
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">Account &amp; profile</h1>
        <p className="mt-1 text-sm text-gray-500">Update how you appear on StoreLink and where you operate from.</p>
      </header>

      {msg ? (
        <div
          role="status"
          className={`mb-6 rounded-lg border px-4 py-3 text-center text-sm font-medium ${
            msg.startsWith("Changes saved") || msg.startsWith("You can now")
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-900"
          }`}
        >
          {msg}
        </div>
      ) : null}

      <form id="account-profile-form" onSubmit={handleSave} className="space-y-8 pt-2">
        {/* Web-only: cover (sellers with storefront row) */}
        {profile?.is_seller ? (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">Cover image</p>
            <div className="relative h-36 w-full overflow-hidden rounded-[22px] border border-gray-200 bg-gray-100 md:h-44">
              {displayCover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={displayCover} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-gray-400">
                  <span className="text-xs font-semibold">Upload cover</span>
                </div>
              )}
              <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/0 transition hover:bg-black/30">
                <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-900 opacity-0 transition hover:opacity-100">
                  Change
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCoverPick(e.target.files?.[0] || null)} />
              </label>
            </div>
          </div>
        ) : null}

        {/* Avatar — same as app */}
        <div className="flex flex-col items-center gap-3">
          <label className="relative h-[110px] w-[110px] cursor-pointer overflow-hidden rounded-[40px] border-[1.5px] border-gray-200 bg-gray-50 shadow-sm">
            {showAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={(logoUrl.trim() || profile?.logo_url) as string} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-gray-300">
                <User size={44} strokeWidth={1.5} />
              </span>
            )}
            <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-tl-[14px] bg-gray-900 text-white">
              {uploadingLogo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera size={14} />}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingLogo}
              onChange={(e) => void handleLogoUpload(e.target.files?.[0] || null)}
            />
          </label>
          <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-gray-500">Tap to change photo</p>
        </div>

        {/* Web-only: Instagram & TikTok */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">Instagram</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">@</span>
              <input
                className="w-full rounded-[20px] border border-gray-200 bg-gray-50 py-3.5 pl-9 pr-4 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-gray-900"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value.replace(/^@/, ""))}
                placeholder="username"
                autoComplete="off"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">TikTok</label>
            <input
              className="w-full rounded-[20px] border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-gray-900"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              placeholder="Profile link or @handle"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="space-y-6 px-1 sm:px-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">Public identity</p>

          <div>
            <div className="mb-1 flex justify-between">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Display name</label>
              <span className="text-[10px] font-medium text-gray-400">{fullName.length}/40</span>
            </div>
            <input
              maxLength={40}
              className="h-[60px] w-full rounded-[20px] border border-gray-200 bg-gray-50 px-4 text-base font-bold text-gray-900 outline-none focus:ring-2 focus:ring-gray-900"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">Username (@)</label>
            <div
              className={`flex h-[60px] items-center rounded-[20px] border border-gray-200 bg-gray-50 px-4 ${
                isHandleLocked ? "opacity-50" : ""
              } ${slugStatus === "taken" ? "border-red-300" : ""}`}
            >
              <input
                className="min-w-0 flex-1 bg-transparent text-base font-bold text-gray-900 outline-none disabled:text-gray-500"
                value={slug}
                disabled={isHandleLocked}
                onChange={(e) => {
                  setSlug(e.target.value.toLowerCase().trim());
                  setSlugStatus("idle");
                  setSuggestedSlugMessage(null);
                }}
                onBlur={() => {
                  if (!isHandleLocked && slug.trim()) void checkSlugAvailabilityDetailed(slug);
                }}
                autoCapitalize="none"
              />
              {!isHandleLocked && slugStatus === "checking" ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-emerald-600" />
              ) : null}
              {!isHandleLocked && slugStatus === "available" ? (
                <CheckCircle2 className="h-[18px] w-[18px] shrink-0 text-emerald-600" strokeWidth={3} />
              ) : null}
              {!isHandleLocked && slugStatus === "taken" ? (
                <AlertCircle className="h-[18px] w-[18px] shrink-0 text-red-500" strokeWidth={3} />
              ) : null}
              {isHandleLocked ? <Lock className="h-3.5 w-3.5 shrink-0 text-gray-400" /> : null}
            </div>
            {isHandleLocked ? (
              <p className="mt-1.5 text-xs font-semibold text-red-600">Locked until {formatUnlock(handleUnlockDate)}</p>
            ) : null}
            {!isHandleLocked && suggestedSlugMessage ? (
              <p className="mt-1.5 text-xs text-gray-500">{suggestedSlugMessage}</p>
            ) : null}
          </div>

          {profile?.is_seller ? (
            <>
              <p className="pt-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">Seller account</p>

              {profile.seller_type === "product" ? (
                <button
                  type="button"
                  onClick={() => void handleUpgradeToBoth("add_services")}
                  disabled={!!upgradeBusy}
                  className="w-full rounded-3xl border-[1.5px] border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-emerald-200 disabled:opacity-60"
                >
                  {upgradeBusy === "add_services" ? (
                    <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-emerald-500/35 bg-emerald-500/10">
                          <Wrench className="text-emerald-600" size={18} />
                        </span>
                        <span className="flex-1 text-[11px] font-black uppercase tracking-wide text-gray-900">
                          Add services to your store
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-medium leading-snug text-gray-600">
                        Turn your products into a full storefront: buyers can book services and you unlock the Services
                        side (without losing your product setup).
                      </p>
                      <ul className="mt-3 space-y-2 text-sm font-semibold text-gray-800">
                        <li className="flex gap-2">
                          <Sparkles className="mt-0.5 shrink-0 text-emerald-600" size={16} /> Enable service listings +
                          bookings
                        </li>
                        <li className="flex gap-2">
                          <Check className="mt-0.5 shrink-0 text-emerald-600" size={16} /> Keep your store profile
                          (name/logo/slug)
                        </li>
                        <li className="flex gap-2">
                          <ArrowRight className="mt-0.5 shrink-0 text-emerald-600" size={16} /> Let buyers see distance
                          when location is enabled
                        </li>
                      </ul>
                      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-[11px] font-bold uppercase tracking-wide text-gray-900">
                        Continue <ArrowRight size={18} />
                      </div>
                    </>
                  )}
                </button>
              ) : null}

              {profile.seller_type === "service" ? (
                <button
                  type="button"
                  onClick={() => void handleUpgradeToBoth("add_products")}
                  disabled={!!upgradeBusy}
                  className="flex w-full items-center justify-center rounded-full border-[1.5px] border-gray-200 bg-gray-50 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-gray-900 disabled:opacity-60"
                >
                  {upgradeBusy === "add_products" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Add products to your store"
                  )}
                </button>
              ) : null}
            </>
          ) : null}

          <div>
            <div className="mb-1 flex justify-between">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Bio</label>
              <span className="text-[10px] font-medium text-gray-400">{bio.length}/150</span>
            </div>
            <textarea
              maxLength={150}
              rows={4}
              className="min-h-[120px] w-full rounded-[20px] border border-gray-200 bg-gray-50 px-4 py-3 text-base font-bold text-gray-900 outline-none focus:ring-2 focus:ring-gray-900"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <p className="pt-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">ADDRESSES</p>
          <p className="text-xs font-medium text-gray-500 opacity-85">Picks apply when you save the form.</p>

          <div className="mt-3 space-y-4 rounded-[22px] border border-emerald-500/25 bg-emerald-50/35 p-5 md:p-6">
            {mapsKey ? (
              <GooglePlacesAutocomplete
                id="profile-home-address"
                label="SEARCH AND SELECT YOUR HOME ADDRESS"
                value={homeAddress}
                onChangeText={setHomeAddress}
                onResolved={(p: ParsedGooglePlace) => {
                  setHomeLat(p.lat);
                  setHomeLng(p.lng);
                  setLocationCity(p.city ?? "");
                  setLocationState(p.state ?? "");
                  if (p.country) setHomeCountryName(p.country);
                  if (p.countryCode) setHomeCountryCode(p.countryCode);
                }}
                onSelectionInvalidated={() => {
                  setHomeLat(null);
                  setHomeLng(null);
                  setLocationCity("");
                  setLocationState("");
                  setHomeCountryName("");
                  setHomeCountryCode("");
                }}
                countryBias="ng"
              />
            ) : (
              <p className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-[11px] font-semibold text-amber-900">
                Set <span className="font-mono text-[10px]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</span> for address search.
              </p>
            )}
            <PlaceDerivedLocationReadout
              title="CITY & REGION (FROM HOME SELECTION)"
              city={locationCity}
              state={locationState}
              footnote="Not editable separately — pick a different address above to change them."
            />
          </div>

          {profile?.is_seller ? (
            <div className="mt-2 space-y-4 rounded-[22px] border border-gray-200 bg-gray-50/80 p-5 md:p-6">
              <button
                type="button"
                onClick={() => {
                  setUseHomeAsShop((prev) => {
                    const next = !prev;
                    if (next) {
                      setShopLat(homeLat);
                      setShopLng(homeLng);
                      setStoreAddress(homeAddress);
                      setShopCity(locationCity);
                      setShopState(locationState);
                    } else {
                      setShopLat(null);
                      setShopLng(null);
                      setStoreAddress("");
                      setShopCity("");
                      setShopState("");
                    }
                    return next;
                  });
                }}
                className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left transition hover:bg-gray-50"
              >
                <span className="text-sm font-black text-gray-900">Use home address as shop location</span>
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                    useHomeAsShop ? "border-emerald-500 bg-emerald-500 text-white" : "border-gray-300 bg-white"
                  }`}
                >
                  {useHomeAsShop ? <Check size={14} strokeWidth={3} /> : null}
                </span>
              </button>
              {mapsKey ? (
                <GooglePlacesAutocomplete
                  id="profile-shop-address"
                  label="SEARCH SHOP, STUDIO, OR PICKUP POINT"
                  hint="Pick a suggestion — city and region below follow that choice."
                  value={storeAddress}
                  onChangeText={setStoreAddress}
                  disabled={useHomeAsShop}
                  onResolved={(p: ParsedGooglePlace) => {
                    setShopLat(p.lat);
                    setShopLng(p.lng);
                    setShopCity(p.city ?? "");
                    setShopState(p.state ?? "");
                  }}
                  onSelectionInvalidated={() => {
                    setShopLat(null);
                    setShopLng(null);
                    setShopCity("");
                    setShopState("");
                  }}
                  countryBias="ng"
                />
              ) : (
                <textarea
                  rows={2}
                  className="w-full rounded-2xl border border-gray-100 bg-white p-4 text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-gray-900"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  placeholder="Shop address"
                />
              )}
              <PlaceDerivedLocationReadout
                title="CITY & REGION (FROM SHOP SELECTION)"
                muted={useHomeAsShop}
                city={
                  useHomeAsShop || coordsNearlyEqual(homeLat, homeLng, shopLat, shopLng)
                    ? locationCity
                    : shopCity || locationCity
                }
                state={
                  useHomeAsShop || coordsNearlyEqual(homeLat, homeLng, shopLat, shopLng)
                    ? locationState
                    : shopState || locationState
                }
                footnote={
                  useHomeAsShop
                    ? "Mirrors your home address. Turn off “Use home as shop” to pick a separate shop address."
                    : coordsNearlyEqual(homeLat, homeLng, shopLat, shopLng)
                      ? "Same coordinates as home — city and region match your home selection."
                      : "From your shop pick — not editable separately."
                }
              />
            </div>
          ) : null}

          <p className="pt-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">MARKET</p>
          <div className="flex items-start justify-between rounded-[22px] border-[1.2px] border-gray-200 bg-gray-50 p-5">
            <div className="min-w-0 pr-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Country</p>
              <p className="mt-1.5 text-base font-bold text-gray-900">
                {(getCountryByCode(effectiveCountryCode)?.code === "NG" ? "🇳🇬 " : "") +
                  (getCountryByCode(effectiveCountryCode)?.name ?? "Nigeria")}
              </p>
            </div>
            {isCountryLocked ? <Lock className="mt-1 h-4 w-4 shrink-0 text-gray-400" /> : null}
          </div>

          <p className="pt-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">Private information</p>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">Email address</label>
            <div className="flex h-[60px] items-center rounded-[20px] border border-gray-200 bg-gray-50 px-4 opacity-50">
              <Mail className="mr-2.5 shrink-0 text-gray-500" size={18} />
              <input readOnly className="min-w-0 flex-1 bg-transparent text-base font-bold text-gray-600 outline-none" value={profile?.email || authEmail} />
              <Lock className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            </div>
            <p className="mt-1 text-xs text-gray-500 opacity-70">Email cannot be changed manually.</p>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">Phone number</label>
            <div className="flex h-[60px] items-center rounded-[20px] border border-gray-200 bg-gray-50 px-4">
              <Phone className="mr-2 shrink-0 text-gray-500" size={18} />
              <span className="mr-1 text-base font-bold text-gray-500">{phonePrefix}</span>
              <input
                className="min-w-0 flex-1 bg-transparent text-base font-bold text-gray-900 outline-none focus:ring-0"
                inputMode="numeric"
                placeholder="8012345678"
                value={
                  phone.startsWith(phonePrefix)
                    ? phone.slice(phonePrefix.length).replace(/\D/g, "")
                    : phone.replace(/\D/g, "")
                }
                onChange={(e) => setPhone(phonePrefix + e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>
        </div>

        {!profile?.is_seller ? (
          <div className="mt-10 overflow-hidden rounded-[28px] border-[1.5px] border-emerald-500/45 bg-gradient-to-br from-emerald-500/10 via-indigo-500/8 to-gray-50 p-6 shadow-sm">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1">
              <Store size={15} className="text-emerald-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Become a seller</span>
            </div>
            <p className="text-xl font-black tracking-tight text-gray-900">Open a real shop — not just another post</p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-gray-600">
              Spotlight reels are for showing off what you bought. Selling is different: list products or bookable services,
              chat with buyers, and get paid with protection built in.
            </p>
            <ul className="mt-5 space-y-3 text-sm font-semibold text-gray-800">
              <li className="flex gap-2">
                <Sparkles className="mt-0.5 shrink-0 text-emerald-600" size={16} />
                Get discovered in feed, explore, and search — not only your followers
              </li>
              <li className="flex gap-2">
                <ShieldCheck className="mt-0.5 shrink-0 text-emerald-600" size={16} />
                Escrow-friendly orders so serious buyers trust your store
              </li>
              <li className="flex gap-2">
                <Users className="mt-0.5 shrink-0 text-emerald-600" size={16} />
                Run bookings, reels, stories, and a storefront from one profile
              </li>
              <li className="flex gap-2">
                <Gift className="mt-0.5 shrink-0 text-emerald-600" size={16} />
                Start selling free on Standard — we walk you through logo, category, and location
              </li>
            </ul>
            <Link
              href="/account/start-selling"
              className="mt-6 flex items-center justify-center gap-2 rounded-[18px] bg-gray-900 py-4 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-emerald-600"
            >
              Start seller setup
              <ArrowRight size={20} strokeWidth={2.8} />
            </Link>
            <p className="mt-4 text-xs font-medium leading-relaxed text-gray-500">
              You&apos;ll complete the same storefront steps as new merchants: brand, what you sell, city, and phone — then
              your store is ready to sell.
            </p>
          </div>
        ) : null}
      </form>
    </div>
  );
}
