/** Normalize Google Places details into profile columns (aligned with mobile geometry fields). */

export type ParsedGooglePlace = {
  formattedAddress: string;
  lat: number;
  lng: number;
  city: string | null;
  state: string | null;
  /** Long name (e.g. Nigeria) — stored in `profiles.location_country`. */
  country: string | null;
  /** ISO 3166-1 alpha-2 from Places `country` short_name — `profiles.location_country_code`. */
  countryCode: string | null;
};

/** Works with `PlaceResult` from `google.maps.places.Autocomplete`. */
export function parseGooglePlace(place: {
  formatted_address?: string | null;
  geometry?: { location?: { lat?: () => number; lng?: () => number } | null } | null;
  address_components?: Array<{ long_name: string; short_name: string; types: string[] }> | null;
}): ParsedGooglePlace | null {
  const loc = place.geometry?.location;
  if (!loc || typeof loc.lat !== "function" || typeof loc.lng !== "function") return null;
  const lat = loc.lat();
  const lng = loc.lng();
  if (typeof lat !== "number" || typeof lng !== "number" || Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  let city: string | null = null;
  let state: string | null = null;
  let country: string | null = null;
  let countryCode: string | null = null;

  for (const c of place.address_components || []) {
    const types = c.types || [];
    if (types.includes("locality")) {
      city = c.long_name || null;
    } else if (!city && types.includes("postal_town")) {
      city = c.long_name || null;
    } else if (!city && (types.includes("sublocality") || types.includes("sublocality_level_1"))) {
      city = c.long_name || null;
    }
    if (types.includes("administrative_area_level_1")) {
      state = c.long_name || null;
    }
    if (types.includes("country")) {
      country = c.long_name || null;
      countryCode = c.short_name?.trim() || null;
    }
  }

  return {
    formattedAddress: String(place.formatted_address || "").trim(),
    lat,
    lng,
    city,
    state,
    country,
    countryCode,
  };
}

export function getGoogleMapsBrowserKey(): string {
  return (typeof process !== "undefined" && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim()) || "";
}
