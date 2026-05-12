"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Save, Upload, Camera, Image as ImageIcon, CheckCircle2, Check } from "lucide-react";
import GooglePlacesAutocomplete from "@/components/address/GooglePlacesAutocomplete";
import PlaceDerivedLocationReadout from "@/components/address/PlaceDerivedLocationReadout";
import { getGoogleMapsBrowserKey } from "@/lib/googlePlacesParsed";
import type { ParsedGooglePlace } from "@/lib/googlePlacesParsed";
import { ACCOUNT_PROFILE_SELECT } from "@/lib/accountProfileFields";
import { coordsNearlyEqual } from "@/lib/accountProfileParity";

type ProfileAddressRow = {
  is_seller: boolean | null;
  location: string | null;
  location_city: string | null;
  location_state: string | null;
  location_country: string | null;
  location_country_code: string | null;
  discovery_latitude: number | null;
  discovery_longitude: number | null;
  service_latitude: number | null;
  service_longitude: number | null;
};

export default function StoreSettings({ store, onUpdate }: { store: any; onUpdate?: () => void }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    instagram: store.instagram_handle || "",
    tiktok: store.tiktok_url || "",
  });

  const [isSeller, setIsSeller] = useState(false);

  const [homeAddress, setHomeAddress] = useState("");
  const [homeLat, setHomeLat] = useState<number | null>(null);
  const [homeLng, setHomeLng] = useState<number | null>(null);
  const [locationCity, setLocationCity] = useState("");
  const [locationState, setLocationState] = useState("");
  const [homeCountryName, setHomeCountryName] = useState("");
  const [homeCountryCode, setHomeCountryCode] = useState("");

  const [storeAddress, setStoreAddress] = useState("");
  const [shopLat, setShopLat] = useState<number | null>(null);
  const [shopLng, setShopLng] = useState<number | null>(null);
  const [shopCity, setShopCity] = useState("");
  const [shopState, setShopState] = useState("");
  const [useHomeAsShop, setUseHomeAsShop] = useState(false);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [logoPreview, setLogoPreview] = useState<string>(store.logo_url || "");
  const [coverPreview, setCoverPreview] = useState<string>(store.cover_image_url || "");
  const [status, setStatus] = useState("");

  const mapsKey = getGoogleMapsBrowserKey();

  const ownerId = String(store.owner_id || store.id || "");

  const loadAddresses = useCallback(async () => {
    if (!ownerId) return;

    const [{ data: p }, { data: storeData }] = await Promise.all([
      supabase.from("profiles").select(ACCOUNT_PROFILE_SELECT).eq("id", ownerId).maybeSingle(),
      supabase.from("stores").select("id, location").eq("owner_id", ownerId).maybeSingle(),
    ]);

    const prof = p as ProfileAddressRow | null;
    setIsSeller(Boolean(prof?.is_seller));

    setLocationState(prof?.location_state || "");
    setLocationCity(prof?.location_city || "");
    setHomeAddress((prof?.location || "").trim());
    setHomeLat(prof?.discovery_latitude != null ? Number(prof.discovery_latitude) : null);
    setHomeLng(prof?.discovery_longitude != null ? Number(prof.discovery_longitude) : null);
    setShopLat(prof?.service_latitude != null ? Number(prof.service_latitude) : null);
    setShopLng(prof?.service_longitude != null ? Number(prof.service_longitude) : null);

    if (
      prof?.is_seller &&
      prof.discovery_latitude != null &&
      prof.discovery_longitude != null &&
      prof.service_latitude != null &&
      prof.service_longitude != null &&
      !coordsNearlyEqual(
        Number(prof.discovery_latitude),
        Number(prof.discovery_longitude),
        Number(prof.service_latitude),
        Number(prof.service_longitude),
      )
    ) {
      setShopCity(String(prof.location_city || ""));
      setShopState(String(prof.location_state || ""));
    } else {
      setShopCity("");
      setShopState("");
    }

    if (
      prof?.is_seller &&
      prof.discovery_latitude != null &&
      prof.discovery_longitude != null &&
      prof.service_latitude != null &&
      prof.service_longitude != null &&
      coordsNearlyEqual(
        Number(prof.discovery_latitude),
        Number(prof.discovery_longitude),
        Number(prof.service_latitude),
        Number(prof.service_longitude),
      )
    ) {
      setUseHomeAsShop(true);
    } else {
      setUseHomeAsShop(false);
    }

    setHomeCountryName((prof?.location_country || "").trim());
    setHomeCountryCode((prof?.location_country_code || "").trim().toUpperCase());

    if (prof?.is_seller && storeData?.location?.trim()) {
      setStoreAddress(String(storeData.location).trim());
    } else {
      setStoreAddress("");
    }

    setFormData({
      instagram: store.instagram_handle || "",
      tiktok: store.tiktok_url || "",
    });
    setLogoPreview(store.logo_url || "");
    setCoverPreview(store.cover_image_url || "");
  }, [ownerId, store.instagram_handle, store.tiktok_url, store.logo_url, store.cover_image_url]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await loadAddresses();
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [loadAddresses]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setStatus("");

    const coordsOk = (la: number | null, lo: number | null) =>
      la != null && lo != null && Number.isFinite(la) && Number.isFinite(lo);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      if (user.id !== ownerId) throw new Error("You can only edit your own store settings.");

      const { data: profSnap } = await supabase.from("profiles").select("is_seller").eq("id", user.id).maybeSingle();
      const sellerFlag = Boolean((profSnap as { is_seller?: boolean } | null)?.is_seller);

      const sellerUseHome = Boolean(sellerFlag && useHomeAsShop && coordsOk(homeLat, homeLng));
      const effShopLat = sellerUseHome ? homeLat : shopLat;
      const effShopLng = sellerUseHome ? homeLng : shopLng;
      const effStoreLine = sellerUseHome ? homeAddress.trim() : storeAddress.trim();

      if (mapsKey && homeAddress.trim()) {
        if (!coordsOk(homeLat, homeLng)) {
          throw new Error("Choose your home address from the suggestions list so city, state, and coordinates stay in sync.");
        }
        if (!locationCity.trim() || !locationState.trim()) {
          throw new Error("Pick a full address from the list so city and region are filled.");
        }
      }

      if (sellerFlag && mapsKey && !sellerUseHome && storeAddress.trim()) {
        if (!coordsOk(shopLat, shopLng)) {
          throw new Error("Choose your shop address from the suggestions list.");
        }
        if (
          coordsOk(homeLat, homeLng) &&
          coordsOk(shopLat, shopLng) &&
          !coordsNearlyEqual(homeLat, homeLng, shopLat, shopLng) &&
          (!shopCity.trim() || !shopState.trim())
        ) {
          throw new Error("Pick a shop address that includes city and region.");
        }
      }

      let listingCity = locationCity.trim();
      let listingState = locationState.trim();
      if (
        mapsKey &&
        sellerFlag &&
        !sellerUseHome &&
        coordsOk(shopLat, shopLng) &&
        coordsOk(homeLat, homeLng) &&
        !coordsNearlyEqual(homeLat, homeLng, shopLat, shopLng)
      ) {
        listingCity = shopCity.trim() || locationCity.trim();
        listingState = shopState.trim() || locationState.trim();
      }

      const uploadKeyBase = String(store.__legacy_store_id || store.owner_id || store.id);

      let newLogoUrl = store.logo_url;
      let newCoverUrl = store.cover_image_url;

      if (logoFile) {
        const fileName = `logos/${uploadKeyBase}-${Date.now()}`;
        const { error: uploadError } = await supabase.storage.from("products").upload(fileName, logoFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("products").getPublicUrl(fileName);
        newLogoUrl = data.publicUrl;
      }

      if (coverFile) {
        const fileName = `covers/${uploadKeyBase}-${Date.now()}`;
        const { error: uploadError } = await supabase.storage.from("products").upload(fileName, coverFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("products").getPublicUrl(fileName);
        newCoverUrl = data.publicUrl;
      }

      const profilePatch: Record<string, unknown> = {
        instagram_handle: formData.instagram.trim() || null,
        tiktok_url: formData.tiktok.trim() || null,
        logo_url: newLogoUrl,
        location: homeAddress.trim() || null,
        discovery_city: locationCity.trim() || null,
        discovery_state: locationState.trim() || null,
        discovery_latitude: homeLat,
        discovery_longitude: homeLng,
        location_city: listingCity || null,
        location_state: listingState || null,
        location_country: homeCountryName.trim() || null,
        location_country_code: homeCountryCode.trim().toUpperCase() || null,
        updated_at: new Date().toISOString(),
      };

      if (sellerFlag) {
        profilePatch.service_latitude = effShopLat;
        profilePatch.service_longitude = effShopLng;
      }

      const { error: profileError } = await supabase.from("profiles").update(profilePatch).eq("id", user.id);

      if (profileError) throw profileError;

      if (store.__legacy_store_id) {
        const legacyPatch: Record<string, unknown> = {
          instagram_handle: formData.instagram.trim() || null,
          tiktok_url: formData.tiktok.trim() || null,
          logo_url: newLogoUrl,
          cover_image_url: newCoverUrl,
          location: effStoreLine || null,
          updated_at: new Date().toISOString(),
        };

        const { error: legacyError } = await supabase.from("stores").update(legacyPatch).eq("id", store.__legacy_store_id);

        if (legacyError) throw legacyError;
      }

      setStatus("✅ Brand assets saved!");
      await loadAddresses();
      if (onUpdate) onUpdate();
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      setStatus(`❌ ${error instanceof Error ? error.message : "An error occurred"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl relative">
      <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-emerald-950">
        <p className="font-bold text-gray-900">Profile editing</p>
        <p className="text-gray-600 font-medium mt-1 leading-relaxed">
          Username, legal name, phone, and verification stay in{" "}
          <Link href="/account/profile" className="font-black text-emerald-700 underline">
            Account → Profile
          </Link>
          . Here you can mirror the same home + shop addresses as the app (plus cover, logo, and socials).
        </p>
      </div>
      <h3 className="font-bold text-lg text-gray-900 mb-6">Storefront brand</h3>

      {status.includes("✅") && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500">
            <CheckCircle2 size={20} />
            <span className="font-black text-xs uppercase tracking-widest">Settings Saved Successfully</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wide">Brand Visuals</h4>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Cover Image</label>
            <div className="relative w-full h-40 md:h-52 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 group">
              {coverPreview ? (
                <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ImageIcon size={32} />
                  <span className="text-xs font-bold mt-2">Upload Cover</span>
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
                <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                  <Camera size={18} /> Change Cover
                </div>
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleCoverChange} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Recommended: 1200 x 400px</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Store Logo</label>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 bg-gray-100 rounded-full overflow-hidden border-2 border-dashed border-gray-300 group shrink-0">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <Upload size={24} />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
                  <Camera size={20} className="text-white" />
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoChange} />
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <p>This will be displayed on your profile and receipts.</p>
                <p className="text-xs text-gray-400 mt-1">Recommended: Square (400 x 400px)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wide">ADDRESSES</h4>
          <p className="text-xs text-gray-500 font-medium">Picks apply when you save — same rules as Account → Profile.</p>

          <div className="mt-3 space-y-4 rounded-[22px] border border-emerald-500/25 bg-emerald-50/35 p-5 md:p-6">
            {mapsKey ? (
              <GooglePlacesAutocomplete
                id="dashboard-store-home-address"
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
              <div>
                <p className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-[11px] font-semibold text-amber-900 mb-2">
                  Set <span className="font-mono text-[10px]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</span> for address search.
                </p>
                <label className="block text-sm font-bold text-gray-700 mb-1">Home address (manual)</label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-gray-100 bg-white p-4 text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-gray-900"
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                />
              </div>
            )}
            {mapsKey ? (
              <PlaceDerivedLocationReadout
                title="CITY & REGION (FROM HOME SELECTION)"
                city={locationCity}
                state={locationState}
                footnote="Not editable separately — pick a different address above to change them."
              />
            ) : null}
          </div>

          {isSeller ? (
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
                  id="dashboard-store-shop-address"
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
                  className="w-full rounded-2xl border border-gray-100 bg-white p-4 text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
                  value={storeAddress}
                  disabled={useHomeAsShop}
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
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wide">Social</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Instagram handle (optional)</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-gray-400 font-bold">@</span>
                <input
                  className="w-full pl-8 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="yourstore"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value.replace(/^@/, "") })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">TikTok link (optional)</label>
              <input
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="https://tiktok.com/@..."
                value={formData.tiktok}
                onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
              />
            </div>
          </div>
        </div>

        {status.includes("❌") && <p className="text-red-600 text-xs font-bold text-center bg-red-50 p-3 rounded-xl uppercase tracking-widest">{status}</p>}

        <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" /> : (
            <>
              <Save size={18} /> Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}
