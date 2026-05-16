import type { Store } from "@/types";
import { displayLocationFull } from "@/lib/displayRegion";
import { normalizeStorefrontTheme } from "@/lib/storefrontTheme";

/**
 * Single source of truth for public seller identity: `profiles` (aligned with mobile / web app).
 *
 * Column mapping (profile → storefront `Store` UI shape):
 * - display_name / full_name → name
 * - slug → slug (public URL)
 * - bio → description
 * - logo_url → logo_url; cover_image_url → header image (falls back to logo)
 * - shop_address → public shop / pickup line when set
 * - phone_number → whatsapp_number (normalized digits)
 * - location*, location → location string
 * - subscription_plan, subscription_expiry, subscription_status → visibility tier
 * - verification_status → verification_status
 * - loyalty_*, view_count → loyalty + views
 */
export const PROFILE_STOREFRONT_SELECT =
  "id, display_name, full_name, slug, bio, logo_url, cover_image_url, shop_address, phone_number, location, location_state, location_city, location_country, location_country_code, " +
  "instagram_handle, tiktok_url, " +
  "is_seller, email, subscription_plan, subscription_expiry, subscription_status, " +
  "verification_status, loyalty_enabled, loyalty_percentage, view_count, account_status, " +
  "is_store_open, coin_balance, seller_type, storefront_theme, service_latitude, service_longitude";

export type ProfileStorefrontRow = {
  id: string;
  display_name?: string | null;
  full_name?: string | null;
  slug?: string | null;
  bio?: string | null;
  logo_url?: string | null;
  cover_image_url?: string | null;
  shop_address?: string | null;
  phone_number?: string | null;
  location?: string | null;
  location_state?: string | null;
  location_city?: string | null;
  location_country?: string | null;
  location_country_code?: string | null;
  instagram_handle?: string | null;
  tiktok_url?: string | null;
  is_seller?: boolean | null;
  email?: string | null;
  subscription_plan?: string | null;
  subscription_expiry?: string | null;
  subscription_status?: string | null;
  verification_status?: string | null;
  loyalty_enabled?: boolean | null;
  loyalty_percentage?: number | string | null;
  view_count?: number | null;
  account_status?: string | null;
  is_store_open?: boolean | null;
  seller_type?: string | null;
  storefront_theme?: unknown;
};

function normalizeStoreVerificationStatus(value: string | null | undefined): Store["verification_status"] {
  const status = String(value || "").trim().toLowerCase();
  if (status === "approved" || status === "verified") return "verified";
  if (status === "pending") return "pending";
  if (status === "rejected") return "rejected";
  return "none";
}

function normalizeWhatsApp(raw: string | null | undefined): string {
  let wa = String(raw || "").replace(/\D/g, "");
  if (!wa) return "";
  if (wa.startsWith("0")) wa = "234" + wa.substring(1);
  else if (!wa.startsWith("234")) wa = "234" + wa;
  return wa;
}

/** @deprecated Use `displayLocationFull` instead. */
export function joinProfileDisplayLocation(p: ProfileStorefrontRow): string {
  const full = displayLocationFull({
    location: p.location,
    location_city: p.location_city,
    location_state: p.location_state,
    location_country: p.location_country,
    location_country_code: p.location_country_code,
  });
  if (full) return full;
  return p.location_country?.trim() || "Nigeria";
}

/**
 * Maps a profile row into the `Store` shape used by StoreFront / dashboard.
 * `id` and `owner_id` are both the profile id. Orders use `owner_id` as seller id.
 */
export function profileRowToLegacyStoreShape(
  p: ProfileStorefrontRow,
  opts?: { ownerEmail?: string | null }
): Store & {
  __surface: "profile";
  __legacy_store_id: null;
  owner_email?: string;
  status?: string;
} {
  const name = p.full_name?.trim() || p.display_name?.trim() || "Store";
  const slug = String(p.slug || "").trim() || "store";
  const wa = normalizeWhatsApp(p.phone_number) || "2340000000001";

  const homeLine =
    displayLocationFull({
      location: p.location,
      location_city: p.location_city,
      location_state: p.location_state,
      location_country: p.location_country,
      location_country_code: p.location_country_code,
    }) ||
    p.location_country?.trim() ||
    "Nigeria";
  const shopLine = p.shop_address?.trim();

  return {
    __surface: "profile",
    __legacy_store_id: null,
    id: p.id,
    owner_id: p.id,
    slug,
    name,
    owner_email: opts?.ownerEmail ?? p.email ?? undefined,
    description: p.bio?.trim() ?? null,
    location: shopLine || homeLine,
    location_city: p.location_city?.trim() || null,
    location_state: p.location_state?.trim() || null,
    location_country: p.location_country?.trim() || null,
    location_country_code: p.location_country_code?.trim().toUpperCase() || null,
    whatsapp_number: wa,
    logo_url: p.logo_url?.trim() || null,
    cover_image_url: p.cover_image_url?.trim() || p.logo_url?.trim() || null,
    instagram_handle: p.instagram_handle?.trim() || undefined,
    tiktok_url: p.tiktok_url?.trim() || undefined,
    verification_status: normalizeStoreVerificationStatus(p.verification_status),
    view_count: Number(p.view_count ?? 0),
    subscription_plan: (p.subscription_plan as Store["subscription_plan"]) || "standard",
    subscription_expiry: p.subscription_expiry ?? null,
    subscription_status: p.subscription_status ?? "active",
    loyalty_enabled: p.loyalty_enabled ?? false,
    loyalty_percentage: Number(p.loyalty_percentage ?? 0),
    storefront_theme: normalizeStorefrontTheme(p.storefront_theme),
    status: p.account_status === "suspended" ? "banned" : "active",
    seller_type: p.seller_type ?? undefined,
  };
}

export function isProfileBackedStore(store: { __surface?: string } | null | undefined): boolean {
  return store?.__surface === "profile" || store?.__surface === "merged";
}
