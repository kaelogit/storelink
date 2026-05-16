"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { buildR2Key, uploadFileToR2 } from "@/lib/mediaUpload";
import { X, Loader2, Phone, Globe, Camera, Image as ImageIcon } from "lucide-react";
import { Store } from "@/types";
import Image from "next/image";
import GooglePlacesAutocomplete from "@/components/address/GooglePlacesAutocomplete";
import PlaceDerivedLocationReadout from "@/components/address/PlaceDerivedLocationReadout";
import { getGoogleMapsBrowserKey } from "@/lib/googlePlacesParsed";
import type { ParsedGooglePlace } from "@/lib/googlePlacesParsed";
import { assertShopCityStateIfAddressFilled } from "@/lib/addressCityState";

interface EditProfileModalProps {
  store: Store;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function normalizeInstagramFromStore(s: Store): string {
  const h = (s.instagram_handle || "").replace(/^@/, "").trim();
  if (h) return (h.split(/[/?#]/)[0] || h).trim();
  const u = (s.instagram_url || "").trim();
  if (!u) return "";
  const x = u.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "");
  return (x.split(/[/?#]/)[0] || "").replace(/^@/, "").trim();
}

function normalizeWhatsAppDigits(raw: string): string {
  let wa = raw.replace(/\D/g, "");
  if (!wa) return "";
  if (wa.startsWith("0")) wa = "234" + wa.substring(1);
  else if (!wa.startsWith("234")) wa = "234" + wa;
  return wa;
}

export default function EditProfileModal({ store, isOpen, onClose, onSuccess }: EditProfileModalProps) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: store.name,
    description: store.description || "",
    whatsapp: store.whatsapp_number,
    instagram: normalizeInstagramFromStore(store),
    tiktok: store.tiktok_url || "",
  });

  const [shopAddress, setShopAddress] = useState(store.location || "");
  const [shopLat, setShopLat] = useState<number | null>(null);
  const [shopLng, setShopLng] = useState<number | null>(null);
  const [shopCity, setShopCity] = useState(store.location_city?.trim() || "");
  const [shopState, setShopState] = useState(store.location_state?.trim() || "");
  const [shopCountryName, setShopCountryName] = useState(store.location_country?.trim() || "");
  const [shopCountryCode, setShopCountryCode] = useState((store.location_country_code || "").trim().toUpperCase());

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(store.logo_url);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(store.cover_image_url);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const storeRef = useRef(store);
  storeRef.current = store;

  const mapsKey = getGoogleMapsBrowserKey();

  useEffect(() => {
    if (!isOpen) return;
    const s = storeRef.current;

    setFormData({
      name: s.name,
      description: s.description || "",
      whatsapp: s.whatsapp_number,
      instagram: normalizeInstagramFromStore(s),
      tiktok: s.tiktok_url || "",
    });
    setShopAddress(s.location || "");
    setShopLat(null);
    setShopLng(null);
    setShopCity(s.location_city?.trim() || "");
    setShopState(s.location_state?.trim() || "");
    setShopCountryName(s.location_country?.trim() || "");
    setShopCountryCode((s.location_country_code || "").trim().toUpperCase());
    setLogoFile(null);
    setLogoPreview(s.logo_url);
    setCoverFile(null);
    setCoverPreview(s.cover_image_url);
    setErrorMsg("");

    let cancelled = false;
    void (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("service_latitude, service_longitude, location_city, location_state, location_country, location_country_code")
        .eq("id", s.owner_id)
        .maybeSingle();
      if (cancelled || !data) return;
      const la = data.service_latitude != null ? Number(data.service_latitude) : null;
      const lo = data.service_longitude != null ? Number(data.service_longitude) : null;
      if (la != null && lo != null && Number.isFinite(la) && Number.isFinite(lo)) {
        setShopLat(la);
        setShopLng(lo);
        setShopCity(String(data.location_city ?? s.location_city ?? "").trim());
        setShopState(String(data.location_state ?? s.location_state ?? "").trim());
        setShopCountryName(String(data.location_country ?? s.location_country ?? "").trim());
        setShopCountryCode(String(data.location_country_code ?? s.location_country_code ?? "").trim().toUpperCase());
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, store.id]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const coordsOk = (la: number | null, lo: number | null) =>
      la != null && lo != null && Number.isFinite(la) && Number.isFinite(lo);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id) throw new Error("Sign in to save changes.");
      if (user.id !== store.owner_id) throw new Error("You can only edit your own storefront.");

      if (!shopAddress.trim()) throw new Error("Add your shop address.");

      if (mapsKey && shopAddress.trim()) {
        if (!coordsOk(shopLat, shopLng)) {
          throw new Error("Choose your shop address from the suggestions list so coordinates stay in sync.");
        }
      }
      assertShopCityStateIfAddressFilled(shopAddress, shopCity, shopState);

      let finalLogoUrl = store.logo_url;
      let finalCoverUrl = store.cover_image_url;

      if (logoFile) {
        const ext = (logoFile.name.split(".").pop() || "jpg").toLowerCase();
        const key = buildR2Key("merchant-assets", `${store.owner_id}/storefront-edit/logo-${Date.now()}.${ext}`);
        finalLogoUrl = await uploadFileToR2({
          bucket: "merchant-assets",
          key,
          file: logoFile,
        });
      }

      if (coverFile) {
        const ext = (coverFile.name.split(".").pop() || "jpg").toLowerCase();
        const key = buildR2Key("merchant-assets", `${store.owner_id}/storefront-edit/cover-${Date.now()}.${ext}`);
        finalCoverUrl = await uploadFileToR2({
          bucket: "merchant-assets",
          key,
          file: coverFile,
        });
      }

      const wa = normalizeWhatsAppDigits(formData.whatsapp);
      const ig = formData.instagram.replace(/^@/, "").trim();
      const tt = formData.tiktok.trim();

      const profilePatch: Record<string, unknown> = {
        display_name: formData.name.trim(),
        full_name: formData.name.trim(),
        bio: formData.description.trim() || null,
        phone_number: wa,
        instagram_handle: ig || null,
        tiktok_url: tt || null,
        logo_url: finalLogoUrl || null,
        cover_image_url: finalCoverUrl || null,
        shop_address: shopAddress.trim() || null,
        updated_at: new Date().toISOString(),
      };

      if (coordsOk(shopLat, shopLng)) {
        profilePatch.service_latitude = shopLat;
        profilePatch.service_longitude = shopLng;
        profilePatch.location_city = shopCity.trim() || null;
        profilePatch.location_state = shopState.trim() || null;
        profilePatch.location_country = shopCountryName.trim() || null;
        profilePatch.location_country_code = shopCountryCode.trim().toUpperCase() || null;
      }

      const { error: profileError } = await supabase.from("profiles").update(profilePatch).eq("id", store.owner_id);
      if (profileError) throw profileError;

      onSuccess();
      onClose();
    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : "Could not save.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-lg text-gray-900">Edit Shop Profile</h2>
          <button type="button" onClick={onClose} className="p-2 bg-white rounded-full shadow-sm text-gray-500 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-0 overflow-y-auto bg-gray-50">
          <form onSubmit={handleSubmit}>
            <div className="relative mb-16">
              <div
                className="h-32 bg-gray-300 w-full relative group cursor-pointer"
                onClick={() => coverInputRef.current?.click()}
              >
                {coverPreview ? (
                  <Image src={coverPreview} alt="Cover" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                    <ImageIcon size={24} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span className="text-white font-bold text-sm flex items-center gap-2">
                    <Camera size={16} /> Edit Cover
                  </span>
                </div>
                <input ref={coverInputRef} type="file" hidden accept="image/*" onChange={handleCoverChange} />
              </div>

              <div
                className="absolute -bottom-10 left-6 w-24 h-24 rounded-full border-4 border-white bg-white shadow-md cursor-pointer group overflow-hidden"
                onClick={() => logoInputRef.current?.click()}
              >
                <div className="w-full h-full relative rounded-full overflow-hidden bg-gray-100">
                  {logoPreview ? (
                    <Image src={logoPreview} alt="Logo" fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full font-bold text-2xl text-gray-300">{formData.name[0]}</div>
                  )}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <Camera size={20} className="text-white" />
                  </div>
                </div>
                <input ref={logoInputRef} type="file" hidden accept="image/*" onChange={handleLogoChange} />
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Store Name</label>
                <input
                  required
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bio</label>
                <textarea
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl h-20 resize-none focus:ring-2 focus:ring-gray-900 outline-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">ADDRESSES</p>
              <p className="text-xs font-medium text-gray-500">Shop / pickup — pick from suggestions when Maps is configured.</p>

              <div className="space-y-4 rounded-[22px] border border-gray-200 bg-gray-50/80 p-5 md:p-6">
                {mapsKey ? (
                  <GooglePlacesAutocomplete
                    id="edit-profile-shop-address"
                    label="SEARCH SHOP, STUDIO, OR PICKUP POINT"
                    hint="City and region below follow the address you pick."
                    value={shopAddress}
                    onChangeText={setShopAddress}
                    onResolved={(p: ParsedGooglePlace) => {
                      setShopLat(p.lat);
                      setShopLng(p.lng);
                      setShopCity(p.city ?? "");
                      setShopState(p.state ?? "");
                      if (p.country) setShopCountryName(p.country);
                      if (p.countryCode) setShopCountryCode(p.countryCode);
                    }}
                    onSelectionInvalidated={() => {
                      setShopLat(null);
                      setShopLng(null);
                      setShopCity("");
                      setShopState("");
                      setShopCountryName("");
                      setShopCountryCode("");
                    }}
                    countryBias="ng"
                  />
                ) : (
                  <div>
                    <p className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-[11px] font-semibold text-amber-900 mb-2">
                      Set <span className="font-mono text-[10px]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</span> for address search and structured city/region.
                    </p>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Shop address (manual)</label>
                    <textarea
                      required
                      rows={2}
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gray-900"
                      value={shopAddress}
                      onChange={(e) => setShopAddress(e.target.value)}
                    />
                  </div>
                )}
                {mapsKey ? (
                  <PlaceDerivedLocationReadout
                    title="CITY & REGION (FROM SHOP SELECTION)"
                    city={shopCity}
                    state={shopState}
                  />
                ) : null}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                  <input
                    required
                    className="w-full p-3 pl-9 bg-white border border-gray-200 rounded-xl outline-none"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Socials</label>
                <div className="space-y-2">
                  <div className="relative">
                    <Globe className="absolute left-3 top-3.5 text-pink-500 w-4 h-4" />
                    <span className="pointer-events-none absolute left-9 top-3.5 text-sm font-bold text-gray-400">@</span>
                    <input
                      className="w-full p-3 pl-12 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                      placeholder="Instagram handle"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value.replace(/^@/, "") })}
                    />
                  </div>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3.5 text-black w-4 h-4" />
                    <input
                      className="w-full p-3 pl-9 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                      placeholder="TikTok URL"
                      value={formData.tiktok}
                      onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {errorMsg ? (
                <div className="text-red-600 text-sm font-bold text-center mb-4 bg-red-50 p-2 rounded-lg">⚠️ {errorMsg}</div>
              ) : null}
              <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg mt-4">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
