/** Display + market helpers aligned with `store-link-mobile/app/settings/account.tsx`. */

const COORD_EPS = 0.00025;

export type ProfileLike = {
  discovery_city?: string | null;
  discovery_state?: string | null;
  location_city?: string | null;
  location_state?: string | null;
  service_latitude?: number | null;
  service_longitude?: number | null;
  discovery_latitude?: number | null;
  discovery_longitude?: number | null;
};

export function formatHomeBaseLabel(profile: ProfileLike | null | undefined): string {
  const city = (profile?.discovery_city ?? profile?.location_city ?? "").trim();
  const state = (profile?.discovery_state ?? profile?.location_state ?? "").trim();
  const norm = (s: string) => s.toLowerCase();
  if (city && state) {
    return norm(city) === norm(state) ? city : `${city}, ${state}`;
  }
  if (city) return city;
  if (state) return state;
  return "";
}

export function coordsNearlyEqual(
  lat1: number | null,
  lng1: number | null,
  lat2: number | null,
  lng2: number | null,
): boolean {
  if (lat1 == null || lng1 == null || lat2 == null || lng2 == null) return false;
  return Math.abs(lat1 - lat2) < COORD_EPS && Math.abs(lng1 - lng2) < COORD_EPS;
}

/** Shop / service row summary — aligned with mobile `shopLocationSummary`. */
export function shopLocationSummary(profile: ProfileLike | null | undefined): string {
  if (profile?.service_latitude == null || profile?.service_longitude == null) {
    return "";
  }
  const dLat = profile.discovery_latitude;
  const dLon = profile.discovery_longitude;
  if (dLat != null && dLon != null) {
    if (
      coordsNearlyEqual(Number(dLat), Number(dLon), Number(profile.service_latitude), Number(profile.service_longitude))
    ) {
      return "Same as home";
    }
  }
  const city = (profile?.location_city ?? "").trim();
  const state = (profile?.location_state ?? "").trim();
  const norm = (s: string) => s.toLowerCase();
  if (city && state) {
    return norm(city) === norm(state) ? city : `${city}, ${state}`;
  }
  if (city) return city;
  if (state) return state;
  return "Shop location set";
}

/** @deprecated Use shopLocationSummary — same implementation. */
export function shopPinSummary(profile: ProfileLike | null | undefined): string {
  return shopLocationSummary(profile);
}

export interface SupportedCountry {
  name: string;
  code: string;
  phonePrefix: string;
}

export const SUPPORTED_COUNTRIES: SupportedCountry[] = [
  { name: "Nigeria", code: "NG", phonePrefix: "+234" },
];

export function getCountryByCode(code: string): SupportedCountry | undefined {
  return SUPPORTED_COUNTRIES.find((c) => c.code === code);
}

export function getPhonePrefixForCountry(countryCode: string | null | undefined): string {
  const c = getCountryByCode((countryCode ?? "").trim().toUpperCase());
  return c?.phonePrefix ?? "+234";
}

export function normalizePhoneSpaces(s: string): string {
  return s.replace(/\s/g, "");
}
