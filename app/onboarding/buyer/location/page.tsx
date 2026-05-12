"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowRight, Loader2, MapPin } from "lucide-react";
import { fetchOnboardingContext, getOnboardingHubRedirect } from "@/lib/onboardingState";
import GooglePlacesAutocomplete from "@/components/address/GooglePlacesAutocomplete";
import PlaceDerivedLocationReadout from "@/components/address/PlaceDerivedLocationReadout";
import { getGoogleMapsBrowserKey } from "@/lib/googlePlacesParsed";
import type { ParsedGooglePlace } from "@/lib/googlePlacesParsed";

export default function BuyerLocationPage() {
  const router = useRouter();
  const [stateValue, setStateValue] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [locationCountry, setLocationCountry] = useState("");
  const [locationCountryCode, setLocationCountryCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const mapsKey = getGoogleMapsBrowserKey();

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      const ctx = await fetchOnboardingContext(supabase, user.id);
      const next = getOnboardingHubRedirect(ctx);

      if (next !== "/onboarding/buyer/location") {
        router.replace(next);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("location_state, location_city, location, location_country, location_country_code, discovery_latitude, discovery_longitude")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        setStateValue(String(profile.location_state || ""));
        setCityValue(String(profile.location_city || ""));
        setHomeAddress(String(profile.location || ""));
        setLat(profile.discovery_latitude != null ? Number(profile.discovery_latitude) : null);
        setLng(profile.discovery_longitude != null ? Number(profile.discovery_longitude) : null);
        setLocationCountry(String(profile.location_country || ""));
        setLocationCountryCode(String(profile.location_country_code || ""));
      }

      setBooting(false);
    })();
  }, [router]);

  const handleContinue = async () => {
    if (!mapsKey) {
      setErrorMsg("Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY so you can pick your address from suggestions (city and region are set automatically).");
      return;
    }
    if (!homeAddress.trim() || lat == null || lng == null || !cityValue.trim() || !stateValue.trim()) {
      setErrorMsg("Search your address and pick a suggestion from the list so city, region, and coordinates are saved together.");
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
          location_state: stateValue.trim(),
          location_city: cityValue.trim(),
          discovery_state: stateValue.trim(),
          discovery_city: cityValue.trim(),
          location: homeAddress.trim(),
          location_country: locationCountry.trim() || null,
          location_country_code: locationCountryCode.trim().toUpperCase() || null,
          discovery_latitude: lat,
          discovery_longitude: lng,
          onboarding_completed: false,
          onboarding_step: "buyer_interests",
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      router.push("/onboarding/buyer/interests");
      router.refresh();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Could not save location.");
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
    <div className="flex min-h-dvh flex-col items-center bg-gray-50 p-6 pb-24">
      <div className="w-full max-w-xl pt-8">
        <p className="mb-3 text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">StoreLink · Shopper</p>
        <h1 className="mb-2 text-center text-3xl font-black uppercase tracking-tighter text-gray-900">Set your home location</h1>
        <p className="mb-6 text-center text-sm font-medium leading-relaxed text-gray-500">
          Same flow as Account settings: search, pick one suggestion — city and region are filled from that choice.
        </p>

        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">ADDRESSES</p>
        <p className="mb-4 text-xs font-medium text-gray-500 opacity-90">Picks apply when you continue.</p>

        <div className="space-y-4 rounded-[22px] border border-emerald-500/25 bg-emerald-50/35 p-6 shadow-sm">
          {!mapsKey ? (
            <p className="text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-100 rounded-xl p-3 leading-relaxed">
              Add <span className="font-mono text-[10px]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</span> to enable address search. City and region are not entered separately — they come from the address you pick.
            </p>
          ) : (
            <GooglePlacesAutocomplete
              id="onboarding-buyer-home"
              label="SEARCH AND SELECT YOUR HOME ADDRESS"
              hint="Pick a suggestion from the list."
              value={homeAddress}
              onChangeText={setHomeAddress}
              onResolved={(p: ParsedGooglePlace) => {
                setLat(p.lat);
                setLng(p.lng);
                setCityValue(p.city ?? "");
                setStateValue(p.state ?? "");
                if (p.country) setLocationCountry(p.country);
                if (p.countryCode) setLocationCountryCode(p.countryCode);
              }}
              onSelectionInvalidated={() => {
                setLat(null);
                setLng(null);
                setCityValue("");
                setStateValue("");
                setLocationCountry("");
                setLocationCountryCode("");
              }}
              countryBias="ng"
            />
          )}

          {mapsKey ? (
            <PlaceDerivedLocationReadout
              title="CITY & REGION (FROM HOME SELECTION)"
              city={cityValue}
              state={stateValue}
              footnote="Pick a different address above to change them."
            />
          ) : null}

          {errorMsg && <p className="text-xs font-bold text-red-600">{errorMsg}</p>}

          <button
            type="button"
            disabled={loading || !mapsKey}
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <><MapPin size={16} /> Continue <ArrowRight size={18} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
