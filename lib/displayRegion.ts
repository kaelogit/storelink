import type { Store } from "@/types";

/**
 * Canonical location display rules (mirror `store-link-mobile/src/lib/locationDisplay.ts`).
 *
 * - **Full line** (`profiles.location`): formatted Places address — used on detail / legal contexts.
 * - **Compact**: city + state for cards; then ISO country code; then country name; truncated full line; finally default market code.
 */

export type LocationParts = {
  location?: string | null;
  location_city?: string | null;
  location_state?: string | null;
  location_country?: string | null;
  /** ISO 3166-1 alpha-2 — filters & cross-border UX */
  location_country_code?: string | null;
};

export function getDefaultMarketCountryCode(): string {
  const raw =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_DEFAULT_MARKET_COUNTRY_CODE?.trim()) || "";
  return raw ? raw.toUpperCase() : "NG";
}

/** Detail screens & profile summaries: prefer stored formatted line; else structured fields without duplication. */
export function displayLocationFull(parts: LocationParts): string {
  const line = parts.location?.trim();
  const city = parts.location_city?.trim();
  const state = parts.location_state?.trim();
  const country = parts.location_country?.trim();

  if (line) {
    const lower = line.toLowerCase();
    const extras = [city, state, country].filter((part) => part && !lower.includes(part.toLowerCase()));
    if (!extras.length) return line;
    return [line, ...extras].join(", ");
  }

  const core = [city, state].filter(Boolean).join(", ");
  if (core) {
    if (country && !core.toLowerCase().includes(country.toLowerCase())) return `${core}, ${country}`;
    return core;
  }
  if (country) return country;
  const cc = parts.location_country_code?.trim();
  if (cc) return cc.toUpperCase();
  return "";
}

/** City + state only (no country name) — building blocks for compact strings. */
export function formatCompactRegion(parts: {
  city?: string | null;
  state?: string | null;
  country?: string | null;
}): string {
  const city = parts.city?.trim();
  const state = parts.state?.trim();
  const country = parts.country?.trim();

  const core = [city, state].filter(Boolean).join(", ");
  if (core) return core;
  if (country) return country;
  return "";
}

/**
 * Dense UI (product cards, storefront pins) — matches mobile `ProductCard` / `ServiceCard`.
 * Uppercase when `uppercase: true` (default) for parity with native styling.
 */
export function displayLocationCompact(
  parts: LocationParts,
  opts?: { uppercase?: boolean; withDefaultCountryFallback?: boolean }
): string {
  const uppercase = opts?.uppercase !== false;
  const withDefaultFallback = opts?.withDefaultCountryFallback !== false;

  let s = formatCompactRegion({
    city: parts.location_city,
    state: parts.location_state,
    country: null,
  });

  if (!s && parts.location_country_code?.trim()) {
    s = parts.location_country_code.trim().toUpperCase();
  }
  if (!s && parts.location_country?.trim()) {
    s = parts.location_country.trim();
  }
  if (!s && parts.location?.trim()) {
    const raw = parts.location.trim();
    s = raw.length > 42 ? `${raw.slice(0, 39)}…` : raw;
  }
  if (!s && withDefaultFallback) {
    s = getDefaultMarketCountryCode();
  }

  if (!s) return "";
  return uppercase ? s.toUpperCase() : s;
}

/** Legacy alias — storefront `Store` merge rows. */
export function compactSellerRegion(
  store: Pick<Store, "location" | "location_city" | "location_state" | "location_country" | "location_country_code">
): string {
  return displayLocationCompact(store);
}
