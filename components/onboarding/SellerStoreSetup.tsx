"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { buildR2Key, uploadFileToR2 } from "@/lib/mediaUpload";
import { useRouter } from "next/navigation";
import { isEmailVerifiedForStorefront } from "@/lib/authVerification";
import type { User } from "@supabase/supabase-js";
import { MERCHANT_STORE_CATEGORY_OPTIONS } from "@/lib/merchantStoreCategories";
import { checkSlugAvailability, normalizeSlug } from "@/lib/slugAvailability";
import {
  fetchOnboardingContext,
  getOnboardingHubRedirect,
  getSellerOnboardingPathForStep,
  isProfileOnboardingComplete,
} from "@/lib/onboardingState";
import GooglePlacesAutocomplete from "@/components/address/GooglePlacesAutocomplete";
import PlaceDerivedLocationReadout from "@/components/address/PlaceDerivedLocationReadout";
import { coordsNearlyEqual } from "@/lib/accountProfileParity";
import { missingCityOrState } from "@/lib/addressCityState";
import { sellerStorefrontTenantUrl } from "@/lib/storefrontPublicUrl";
import { getGoogleMapsBrowserKey } from "@/lib/googlePlacesParsed";
import type { ParsedGooglePlace } from "@/lib/googlePlacesParsed";
import {
  Loader2,
  Store,
  ShieldCheck,
  Zap,
  Camera,
  Image as ImageIcon,
  Instagram,
  Music2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const sellerDraftKey = (uid: string) => `storelink_seller_onboarding_draft_${uid}`;

type Props = {
  /** Buyer → seller upgrade: sync profile after web merchant setup */
  upgradeFromBuyer?: boolean;
  initialStep?: number;
  onStepChange?: (step: number) => void;
};

export default function SellerStoreSetup({ upgradeFromBuyer, initialStep = 1, onStepChange }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("Uploading brand assets...");
  const [user, setUser] = useState<User | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState(initialStep);
  useEffect(() => {
    if (initialStep >= 1 && initialStep <= 3) {
      setStep(initialStep);
    }
  }, [initialStep]);

  const persistSellerStep = async (nextStep: number) => {
    if (!user?.id) return;
    const stepMap: Record<number, string> = {
      1: "seller_identity",
      2: "seller_location",
      3: "seller_brand",
    };
    await supabase
      .from("profiles")
      .update({ onboarding_step: stepMap[nextStep] || "seller_identity", updated_at: new Date().toISOString() })
      .eq("id", user.id);
  };

  const persistSellerStep1Profile = async () => {
    if (!user?.id) return;
    let cleanWhatsApp = formData.whatsapp.replace(/\D/g, "");
    if (cleanWhatsApp.startsWith("0")) {
      cleanWhatsApp = "234" + cleanWhatsApp.substring(1);
    } else if (!cleanWhatsApp.startsWith("234")) {
      cleanWhatsApp = "234" + cleanWhatsApp;
    }
    const hs = homeState.trim();
    const hc = homeCity.trim();
    let listingCity = hc;
    let listingState = hs;
    if (
      homeLat != null &&
      homeLng != null &&
      shopLat != null &&
      shopLng != null &&
      !coordsNearlyEqual(homeLat, homeLng, shopLat, shopLng)
    ) {
      listingCity = shopCity.trim() || hc;
      listingState = shopState.trim() || hs;
    }
    await supabase
      .from("profiles")
      .update({
        is_seller: true,
        display_name: formData.name.trim() || null,
        full_name: formData.name.trim() || null,
        slug: normalizeSlug(formData.profileSlug) || null,
        phone_number: cleanWhatsApp || null,
        location: homeAddress.trim() || null,
        location_state: listingState || null,
        location_city: listingCity || null,
        discovery_state: hs || null,
        discovery_city: hc || null,
        discovery_latitude: homeLat,
        discovery_longitude: homeLng,
        shop_address: shopAddress.trim() || null,
        service_latitude: shopLat,
        service_longitude: shopLng,
        location_country: homeCountryName.trim() || null,
        location_country_code: homeCountryCode.trim().toUpperCase() || null,
        onboarding_step: "seller_location",
        onboarding_completed: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
  };

  const goToStep = (nextStep: number) => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setStep(nextStep);
    void persistSellerStep(nextStep);
    onStepChange?.(nextStep);
  };


  const [profileSlugStatus, setProfileSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");

  const [formData, setFormData] = useState({
    name: "",
    profileSlug: "",
    category: "fashion",
    whatsapp: "",
    description: "",
    instagram: "",
    tiktok: "",
  });

  const [homeAddress, setHomeAddress] = useState("");
  const [homeState, setHomeState] = useState("");
  const [homeCity, setHomeCity] = useState("");
  const [homeLat, setHomeLat] = useState<number | null>(null);
  const [homeLng, setHomeLng] = useState<number | null>(null);
  const [shopAddress, setShopAddress] = useState("");
  const [shopLat, setShopLat] = useState<number | null>(null);
  const [shopLng, setShopLng] = useState<number | null>(null);
  const [shopCity, setShopCity] = useState("");
  const [shopState, setShopState] = useState("");
  const [homeCountryName, setHomeCountryName] = useState("");
  const [homeCountryCode, setHomeCountryCode] = useState("");

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const verified = await isEmailVerifiedForStorefront(supabase, user);
      if (!verified) {
        router.push(`/verify?email=${encodeURIComponent(user.email!)}`);
        return;
      }

      const ctx = await fetchOnboardingContext(supabase, user.id);
      if (isProfileOnboardingComplete(ctx.profile)) {
        router.push("/dashboard");
        return;
      }

      const expectedPath = getSellerOnboardingPathForStep(
        initialStep >= 1 && initialStep <= 3 ? (initialStep as 1 | 2 | 3) : 1,
      );
      const hubNext = getOnboardingHubRedirect(ctx);
      const hubPath = hubNext.split("?")[0];
      if (hubPath !== expectedPath && hubPath.startsWith("/onboarding/seller")) {
        const suffix = upgradeFromBuyer ? "?upgrade=1" : "";
        router.replace(`${hubPath}${suffix}`);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select(
          "slug, display_name, full_name, phone_number, location, location_state, location_city, discovery_latitude, discovery_longitude, shop_address, service_latitude, service_longitude, logo_url, cover_image_url",
        )
        .eq("id", user.id)
        .maybeSingle();

      type DraftShape = {
        formData?: Partial<{
          name: string;
          profileSlug: string;
          category: string;
          whatsapp: string;
          description: string;
          instagram: string;
          tiktok: string;
        }>;
        homeAddress?: string;
        homeState?: string;
        homeCity?: string;
        homeLat?: number | null;
        homeLng?: number | null;
        shopAddress?: string;
        shopLat?: number | null;
        shopLng?: number | null;
        shopCity?: string;
        shopState?: string;
        homeCountryName?: string;
        homeCountryCode?: string;
      };

      let draft: DraftShape | null = null;
      if (typeof window !== "undefined") {
        try {
          const raw = sessionStorage.getItem(sellerDraftKey(user.id));
          if (raw) draft = JSON.parse(raw) as DraftShape;
        } catch {
          draft = null;
        }
      }

      setFormData((prev) => ({
        ...prev,
        profileSlug: String(profile?.slug || ""),
        name: String(profile?.display_name || profile?.full_name || prev.name || ""),
        whatsapp: String(profile?.phone_number || prev.whatsapp || "").replace(/^\+?234/, ""),
        ...(draft?.formData || {}),
      }));

      if (!draft?.homeAddress && profile?.location) {
        setHomeAddress(String(profile.location));
        setHomeState(String(profile.location_state || ""));
        setHomeCity(String(profile.location_city || ""));
        setHomeLat(profile.discovery_latitude != null ? Number(profile.discovery_latitude) : null);
        setHomeLng(profile.discovery_longitude != null ? Number(profile.discovery_longitude) : null);
      }
      if (!draft?.shopAddress && profile?.shop_address) {
        setShopAddress(String(profile.shop_address));
        setShopLat(profile.service_latitude != null ? Number(profile.service_latitude) : null);
        setShopLng(profile.service_longitude != null ? Number(profile.service_longitude) : null);
      }
      if (profile?.logo_url) setLogoPreview(String(profile.logo_url));
      if (profile?.cover_image_url) setCoverPreview(String(profile.cover_image_url));

      if (draft) {
        if (typeof draft.homeAddress === "string") setHomeAddress(draft.homeAddress);
        if (typeof draft.homeState === "string") setHomeState(draft.homeState);
        if (typeof draft.homeCity === "string") setHomeCity(draft.homeCity);
        if (draft.homeLat !== undefined) setHomeLat(draft.homeLat ?? null);
        if (draft.homeLng !== undefined) setHomeLng(draft.homeLng ?? null);
        if (typeof draft.shopAddress === "string") setShopAddress(draft.shopAddress);
        if (draft.shopLat !== undefined) setShopLat(draft.shopLat ?? null);
        if (draft.shopLng !== undefined) setShopLng(draft.shopLng ?? null);
        if (typeof draft.shopCity === "string") setShopCity(draft.shopCity);
        if (typeof draft.shopState === "string") setShopState(draft.shopState);
        if (typeof draft.homeCountryName === "string") setHomeCountryName(draft.homeCountryName);
        if (typeof draft.homeCountryCode === "string") setHomeCountryCode(draft.homeCountryCode);
      }

      setUser(user);
    };
    checkUser();
  }, [router, initialStep, upgradeFromBuyer]);

  useEffect(() => {
    if (!user?.id || typeof window === "undefined") return;
    const payload = {
      formData,
      homeAddress,
      homeState,
      homeCity,
      homeLat,
      homeLng,
      homeCountryName,
      homeCountryCode,
      shopAddress,
      shopLat,
      shopLng,
      shopCity,
      shopState,
    };
    try {
      sessionStorage.setItem(sellerDraftKey(user.id), JSON.stringify(payload));
    } catch {
      /* quota / private mode */
    }
  }, [
    user?.id,
    formData,
    homeAddress,
    homeState,
    homeCity,
    homeLat,
    homeLng,
    homeCountryName,
    homeCountryCode,
    shopAddress,
    shopLat,
    shopLng,
    shopCity,
    shopState,
  ]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const trimmed = normalizeSlug(formData.profileSlug);
      if (!trimmed) {
        setProfileSlugStatus("idle");
        return;
      }
      setProfileSlugStatus("checking");
      const status = await checkSlugAvailability(supabase, trimmed, user?.id || null);
      setProfileSlugStatus(status);
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.profileSlug, user]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({ ...formData, name });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "cover") => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (type === "logo") {
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
      } else {
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
      }
    }
  };

  const syncSellerProfile = async (
    uid: string,
    extras: { logoUrl: string; coverUrl: string; phoneDigits: string; shopLine: string },
  ) => {
    const hs = homeState.trim();
    const hc = homeCity.trim();
    const ha = homeAddress.trim();
    const sc = shopCity.trim();
    const ss = shopState.trim();
    let listingCity = hc;
    let listingState = hs;
    if (
      homeLat != null &&
      homeLng != null &&
      shopLat != null &&
      shopLng != null &&
      !coordsNearlyEqual(homeLat, homeLng, shopLat, shopLng)
    ) {
      listingCity = sc || hc;
      listingState = ss || hs;
    }
    if (missingCityOrState(hc, hs)) {
      throw new Error("Home city and region are required.");
    }
    if (missingCityOrState(listingCity, listingState)) {
      throw new Error("Store listing city and region are required.");
    }
    const patch = {
      is_seller: true,
      seller_type: "product",
      subscription_plan: "standard",
      subscription_status: "active",
      prestige_weight: 2,
      onboarding_completed: true,
      onboarding_step: "done",
      is_store_open: true,
      slug: normalizeSlug(formData.profileSlug) || null,
      display_name: formData.name.trim() || null,
      phone_number: extras.phoneDigits || null,
      bio: formData.description.trim() || null,
      instagram_handle: formData.instagram.trim() || null,
      tiktok_url: formData.tiktok.trim() || null,
      logo_url: extras.logoUrl.trim() || null,
      cover_image_url: extras.coverUrl.trim() || null,
      shop_address: extras.shopLine.trim() || null,
      location_state: listingState || null,
      location_city: listingCity || null,
      discovery_state: hs || null,
      discovery_city: hc || null,
      location: ha || null,
      discovery_latitude: homeLat,
      discovery_longitude: homeLng,
      location_country: homeCountryName.trim() || null,
      location_country_code: homeCountryCode.trim().toUpperCase() || null,
      service_latitude: shopLat,
      service_longitude: shopLng,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("profiles").update(patch).eq("id", uid);
    if (error) throw error;

    if (upgradeFromBuyer) {
      try {
        await supabase.rpc("mark_profile_as_seller", {
          p_profile_id: uid,
          p_initial_seller_type: "product",
        });
      } catch {
        /* RPC optional — profile row already updated */
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (profileSlugStatus === "taken") {
      setErrorMsg("Profile slug is taken. Use another one.");
      return;
    }

    const hasLogoAsset = Boolean(logoFile || logoPreview);
    const hasCoverAsset = Boolean(coverFile || coverPreview);
    if (!hasLogoAsset || !hasCoverAsset) {
      setErrorMsg("Please upload both a Logo and a Cover Image to continue.");
      return;
    }

    const mk = getGoogleMapsBrowserKey();
    if (!mk) {
      setErrorMsg("Google Maps API key is required to complete seller setup with valid locations.");
      return;
    }
    if (
      homeLat == null ||
      homeLng == null ||
      shopLat == null ||
      shopLng == null ||
      !homeAddress.trim() ||
      !shopAddress.trim() ||
      !homeCity.trim() ||
      !homeState.trim()
    ) {
      setErrorMsg("Go back to step 1 and pick both addresses from the suggestions lists.");
      return;
    }
    if (
      !coordsNearlyEqual(homeLat, homeLng, shopLat, shopLng) &&
      (!shopCity.trim() || !shopState.trim())
    ) {
      setErrorMsg("Go back to step 1 and pick a shop address that includes city and region.");
      return;
    }

    setLoading(true);
    setSubmitStatus("Uploading brand assets...");
    setErrorMsg("");

    if (!user) {
      setLoading(false);
      setErrorMsg("Session expired. Please sign in again.");
      return;
    }

    try {
      let logoUrl = logoPreview.trim();
      let coverUrl = coverPreview.trim();

      let cleanWhatsApp = formData.whatsapp.replace(/\D/g, "");
      if (cleanWhatsApp.startsWith("0")) {
        cleanWhatsApp = "234" + cleanWhatsApp.substring(1);
      } else if (!cleanWhatsApp.startsWith("234")) {
        cleanWhatsApp = "234" + cleanWhatsApp;
      }

      if (logoFile) {
        const fileExt = logoFile.name.split(".").pop() || "jpg";
        const key = buildR2Key("merchant-assets", `${user.id}/logos/${Date.now()}.${fileExt}`);
        logoUrl = await uploadFileToR2({ bucket: "merchant-assets", key, file: logoFile });
      }

      if (coverFile) {
        const fileExt = coverFile.name.split(".").pop() || "jpg";
        const key = buildR2Key("merchant-assets", `${user.id}/covers/${Date.now()}.${fileExt}`);
        coverUrl = await uploadFileToR2({ bucket: "merchant-assets", key, file: coverFile });
      }

      const shopLoc = shopAddress.trim();

      setSubmitStatus("Finalizing storefront profile...");
      await syncSellerProfile(user.id, {
        logoUrl,
        coverUrl,
        phoneDigits: cleanWhatsApp,
        shopLine: shopLoc,
      });

      try {
        sessionStorage.removeItem(sellerDraftKey(user.id));
      } catch {
        /* ignore */
      }

      setSubmitStatus("Done! Opening dashboard...");
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Could not complete setup.");
      setLoading(false);
    }
  };

  if (!user) return null;

  const mapsKey = getGoogleMapsBrowserKey();

  return (
    <div className="min-h-0 bg-gray-50 font-sans selection:bg-emerald-100 pb-10">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-8">
              <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Building your storefront...</h3>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">{submitStatus}</p>
            </div>
          )}

          <div className="bg-gray-900 p-8 text-white text-center relative">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
              <Store className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-black tracking-tight uppercase italic">Merchant setup</h1>
            <p className="text-[11px] font-medium text-gray-400 mt-2 max-w-sm mx-auto leading-relaxed">
              Product storefront setup: name, public link, category, location, WhatsApp, logo and cover, and a short pitch.
            </p>
            {upgradeFromBuyer && (
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3">
                You’re upgrading from shopper to seller — Standard plan is free.
              </p>
            )}
            <div className="mt-4 flex items-center justify-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? "w-8 bg-emerald-500" : "w-2 bg-gray-700"}`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {step === 1 && (
              <div className="space-y-5 animate-in slide-in-from-right-5 duration-300">
                <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-2">
                  <CheckCircle2 size={14} /> Step 1: Core Details
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-1 ml-1">Profile Slug</label>
                  <input
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none font-bold text-gray-900"
                    placeholder="your-name"
                    value={formData.profileSlug}
                    onChange={(e) => setFormData({ ...formData, profileSlug: e.target.value })}
                  />
                  {formData.profileSlug && (
                    <div className="mt-2 ml-1">
                      {profileSlugStatus === "checking" && (
                        <p className="text-[9px] font-bold text-gray-400 uppercase animate-pulse">Checking slug availability...</p>
                      )}
                      {profileSlugStatus === "available" && (
                        <p className="text-[9px] font-bold text-emerald-600 uppercase">
                          ✅ URL Available:{" "}
                          {sellerStorefrontTenantUrl(normalizeSlug(formData.profileSlug)).replace(/^https?:\/\//, "")}
                        </p>
                      )}
                      {profileSlugStatus === "taken" && (
                        <p className="text-[9px] font-black text-red-500 uppercase">❌ Slug taken. Try another one.</p>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-1 ml-1">Display Name</label>
                  <input
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none font-bold text-gray-900"
                    placeholder="e.g. Mira's Perfume"
                    value={formData.name}
                    onChange={handleNameChange}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-1 ml-1">Category</label>
                  <select
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none font-bold appearance-none text-gray-900"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {MERCHANT_STORE_CATEGORY_OPTIONS.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">ADDRESSES</p>

                <div className="space-y-4 rounded-[22px] border border-emerald-500/25 bg-emerald-50/35 p-5">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900/90">Home address</p>
                   
                  </div>
                  {!mapsKey && (
                    <p className="text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-100 rounded-xl p-3 leading-relaxed">
                      Add <span className="font-mono text-[10px]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</span> to search addresses. City and region are set from the suggestion you pick — not typed separately.
                    </p>
                  )}
                  {mapsKey ? (
                    <GooglePlacesAutocomplete
                      id="seller-onboard-home"
                      label="SEARCH AND SELECT YOUR HOME ADDRESS"
                      value={homeAddress}
                      onChangeText={setHomeAddress}
                      onResolved={(p: ParsedGooglePlace) => {
                        setHomeLat(p.lat);
                        setHomeLng(p.lng);
                        setHomeCity(p.city ?? "");
                        setHomeState(p.state ?? "");
                        if (p.country) setHomeCountryName(p.country);
                        if (p.countryCode) setHomeCountryCode(p.countryCode);
                      }}
                      onSelectionInvalidated={() => {
                        setHomeLat(null);
                        setHomeLng(null);
                        setHomeCity("");
                        setHomeState("");
                        setHomeCountryName("");
                        setHomeCountryCode("");
                      }}
                      countryBias="ng"
                    />
                  ) : null}
                  {mapsKey ? (
                    <PlaceDerivedLocationReadout
                      title="CITY & REGION (FROM HOME SELECTION)"
                      city={homeCity}
                      state={homeState}
                    />
                  ) : null}
                </div>

                <div className="space-y-4 rounded-[22px] border border-gray-200 bg-gray-50/80 p-5">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-700">Shop / pickup location</p>
                    
                  </div>
                  {mapsKey ? (
                    <GooglePlacesAutocomplete
                      id="seller-onboard-shop"
                      label="SEARCH SHOP, STUDIO, OR PICKUP POINT"
                      value={shopAddress}
                      onChangeText={setShopAddress}
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
                    <p className="text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-100 rounded-xl p-3">
                      Add <span className="font-mono text-[10px]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</span> to set your shop address the same way as home.
                    </p>
                  )}
                  {mapsKey ? (
                    <PlaceDerivedLocationReadout
                      title="CITY & REGION (FROM SHOP SELECTION)"
                      city={
                        homeLat != null &&
                        homeLng != null &&
                        shopLat != null &&
                        shopLng != null &&
                        coordsNearlyEqual(homeLat, homeLng, shopLat, shopLng)
                          ? homeCity
                          : shopCity || homeCity
                      }
                      state={
                        homeLat != null &&
                        homeLng != null &&
                        shopLat != null &&
                        shopLng != null &&
                        coordsNearlyEqual(homeLat, homeLng, shopLat, shopLng)
                          ? homeState
                          : shopState || homeState
                      }
                    />
                  ) : null}
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-1 ml-1">Phone Number</label>
                  <input
                    required
                    type="tel"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none font-bold text-gray-900"
                    placeholder="Calling or Whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                </div>
                <button
                  type="button"
                  disabled={profileSlugStatus !== "available"}
                  onClick={() => {
                    if (!formData.name || !formData.whatsapp) {
                      setErrorMsg("Store name and WhatsApp are required.");
                      return;
                    }
                    if (!mapsKey) {
                      setErrorMsg("Google Maps API key is required to pick home and shop addresses.");
                      return;
                    }
                    if (
                      homeLat == null ||
                      homeLng == null ||
                      !homeCity.trim() ||
                      !homeState.trim() ||
                      !homeAddress.trim()
                    ) {
                      setErrorMsg("Pick your home address from the suggestions list (city and region fill automatically).");
                      return;
                    }
                    if (shopLat == null || shopLng == null || !shopAddress.trim()) {
                      setErrorMsg("Pick your shop address from the suggestions list.");
                      return;
                    }
                    if (
                      !coordsNearlyEqual(homeLat, homeLng, shopLat, shopLng) &&
                      (!shopCity.trim() || !shopState.trim())
                    ) {
                      setErrorMsg("Pick a shop address that includes city and region (choose a full suggestion from the list).");
                      return;
                    }
                    setErrorMsg("");
                    void (async () => {
                      try {
                        await persistSellerStep1Profile();
                        goToStep(2);
                      } catch (e: unknown) {
                        setErrorMsg(e instanceof Error ? e.message : "Could not save store details.");
                      }
                    })();
                  }}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition ${
                    profileSlugStatus === "available" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Next: Brand Identity <ArrowRight size={18} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-in slide-in-from-right-5 duration-300">
                <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-2">
                  <CheckCircle2 size={14} /> Step 2: Identity
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Store Cover Image (Compulsory)</label>
                  <div
                    className={`relative h-32 bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed group transition-all ${coverPreview ? "border-emerald-500" : "border-gray-200"}`}
                  >
                    {coverPreview ? (
                      <img src={coverPreview} className="w-full h-full object-cover" alt="Cover Preview" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <ImageIcon size={24} />
                        <span className="text-[10px] font-black uppercase mt-2 text-center px-4">Tap to Upload Cover Photo</span>
                      </div>
                    )}
                    <input
                      type="file"
                      required={!coverPreview}
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleFileChange(e, "cover")}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Logo</label>
                    <div
                      className={`relative w-20 h-20 bg-gray-100 rounded-full overflow-hidden border-2 border-dashed transition-all ${logoPreview ? "border-emerald-500" : "border-gray-200"}`}
                    >
                      {logoPreview ? (
                        <img src={logoPreview} className="w-full h-full object-cover" alt="Logo Preview" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <Camera size={20} />
                        </div>
                      )}
                      <input
                        type="file"
                        required={!logoPreview}
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleFileChange(e, "logo")}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-gray-900 leading-tight uppercase tracking-tight">Identity is everything.</p>
                    <p className="text-[10px] font-medium text-gray-400 leading-relaxed mt-1">
                      Vendors with a Logo & Cover sell <span className="text-emerald-600 font-black">4x faster</span> on StoreLink.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => goToStep(1)} className="w-1/3 bg-gray-100 text-gray-500 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition">
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const hasLogoAsset = Boolean(logoFile || logoPreview);
                      const hasCoverAsset = Boolean(coverFile || coverPreview);
                      if (!hasLogoAsset || !hasCoverAsset) {
                        setErrorMsg("Logo and Cover image are compulsory!");
                        return;
                      }
                      setErrorMsg("");
                      goToStep(3);
                    }}
                    className="w-2/3 bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
                  >
                    Next: Final Step <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5 animate-in slide-in-from-right-5 duration-300">
                <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-2">
                  <CheckCircle2 size={14} /> Step 3: Connection
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-1 ml-1">Store Description</label>
                  <textarea
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none h-24 resize-none font-bold text-sm text-gray-900"
                    placeholder="Tell customers what makes your brand special..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Instagram className="absolute left-4 top-4 text-gray-400" size={18} />
                    <input
                      className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none font-bold text-sm text-gray-900"
                      placeholder="Instagram"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <Music2 className="absolute left-4 top-4 text-gray-400" size={18} />
                    <input
                      className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none font-bold text-sm text-gray-900"
                      placeholder="TikTok Link"
                      value={formData.tiktok}
                      onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => goToStep(2)} className="w-1/3 bg-gray-100 text-gray-500 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition">
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    Launch storefront
                  </button>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 bg-red-50 text-red-600 text-[10px] font-black rounded-xl text-center border border-red-100 uppercase tracking-widest animate-pulse">
                ⚠️ ERROR: {errorMsg}
              </div>
            )}
          </form>
        </div>
      </main>

      <footer className="p-8 text-center space-y-4">
        <div className="flex items-center justify-center gap-6 text-gray-400">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter">
            <ShieldCheck size={14} className="text-emerald-500" /> Secure Encryption
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter">
            <Zap size={14} className="text-amber-500" /> Instant Access
          </div>
        </div>
        <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest">© 2026 StoreLink Engine</p>
      </footer>
    </div>
  );
}
