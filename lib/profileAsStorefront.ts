import type { Store } from "@/types";
import { displayLocationFull } from "@/lib/displayRegion";

/**
 * Single source of truth for public seller identity: `profiles` (aligned with mobile).
 * Legacy `stores` rows remain supported for back-compat until fully migrated.
 *
 * Column mapping (profile → storefront UI fields that used to come from `stores`):
 * - display_name / full_name → name
 * - slug → slug (public URL)
 * - bio → description
 * - logo_url → logo_url (cover uses logo until a dedicated cover exists on profile)
 * - phone_number → whatsapp_number (normalized digits)
 * - location*, location → location string
 * - subscription_plan, subscription_expiry, subscription_status → visibility tier
 * - verification_status → verification_status
 * - loyalty_*, view_count → loyalty + views
 */
export const PROFILE_STOREFRONT_SELECT =
  "id, display_name, full_name, slug, bio, logo_url, phone_number, location, location_state, location_city, location_country, location_country_code, " +
  "instagram_handle, tiktok_url, " +
  "is_seller, email, subscription_plan, subscription_expiry, subscription_status, " +
  "verification_status, loyalty_enabled, loyalty_percentage, view_count, account_status, " +
  "is_store_open, coin_balance, seller_type";

export type ProfileStorefrontRow = {
  id: string;
  display_name?: string | null;
  full_name?: string | null;
  slug?: string | null;
  bio?: string | null;
  logo_url?: string | null;
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
};

function normalizeWhatsApp(raw: string | null | undefined): string {
  let wa = String(raw || "").replace(/\D/g, "");
  if (!wa) return "";
  if (wa.startsWith("0")) wa = "234" + wa.substring(1);
  else if (!wa.startsWith("234")) wa = "234" + wa;
  return wa;
}

/** @deprecated Use `displayLocationFull` — kept for `ensureWebStorefront` imports. */
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
 * Maps a profile row into the legacy `Store` shape used by StoreFront / dashboard.
 * `owner_id` is always the profile id. `id` is the linked `stores.id` when one exists, else the profile id.
 * Checkout uses `owner_id` as `p_seller_id` for `create_new_order` (no `stores` row required).
 */
export function profileRowToLegacyStoreShape(
  p: ProfileStorefrontRow,
  opts?: { legacyStoreId?: string | null; ownerEmail?: string | null }
): Store & {
  __surface: "profile";
  __legacy_store_id?: string | null;
  owner_email?: string;
  status?: string;
} {
  const name = p.full_name?.trim() || p.display_name?.trim() || "Store";
  const slug = String(p.slug || "").trim() || "store";
  const wa = normalizeWhatsApp(p.phone_number) || "2340000000001";

  return {
    __surface: "profile",
    __legacy_store_id: opts?.legacyStoreId ?? null,
    id: opts?.legacyStoreId ?? p.id,
    owner_id: p.id,
    slug,
    name,
    owner_email: opts?.ownerEmail ?? p.email ?? undefined,
    description: p.bio?.trim() ?? null,
    location:
      displayLocationFull({
        location: p.location,
        location_city: p.location_city,
        location_state: p.location_state,
        location_country: p.location_country,
        location_country_code: p.location_country_code,
      }) ||
      p.location_country?.trim() ||
      "Nigeria",
    location_city: p.location_city?.trim() || null,
    location_state: p.location_state?.trim() || null,
    location_country: p.location_country?.trim() || null,
    location_country_code: p.location_country_code?.trim().toUpperCase() || null,
    whatsapp_number: wa,
    logo_url: p.logo_url?.trim() || null,
    cover_image_url: p.logo_url?.trim() || null,
    instagram_handle: p.instagram_handle?.trim() || undefined,
    tiktok_url: p.tiktok_url?.trim() || undefined,
    verification_status: (p.verification_status as Store["verification_status"]) ?? "none",
    view_count: Number(p.view_count ?? 0),
    subscription_plan: (p.subscription_plan as Store["subscription_plan"]) || "standard",
    subscription_expiry: p.subscription_expiry ?? null,
    subscription_status: p.subscription_status ?? "active",
    loyalty_enabled: p.loyalty_enabled ?? false,
    loyalty_percentage: Number(p.loyalty_percentage ?? 0),
    status: p.account_status === "suspended" ? "banned" : "active",
    seller_type: p.seller_type ?? undefined,
  };
}

export function isProfileBackedStore(store: { __surface?: string } | null | undefined): boolean {
  return store?.__surface === "profile" || store?.__surface === "merged";
}
