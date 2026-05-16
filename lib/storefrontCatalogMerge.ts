import type { SupabaseClient } from "@supabase/supabase-js";
import type { Store } from "@/types";
import {
  PROFILE_STOREFRONT_SELECT,
  profileRowToLegacyStoreShape,
  type ProfileStorefrontRow,
} from "@/lib/profileAsStorefront";

async function attachProfileRegionsToStores(
  supabase: SupabaseClient,
  stores: StoreRow[],
  sellerIds: string[]
): Promise<void> {
  if (stores.length === 0 || sellerIds.length === 0) return;

  const { data: rows } = await supabase
    .from("profiles")
    .select("id, location_city, location_state, location_country, location_country_code")
    .in("id", sellerIds);

  const byId = new Map(
    (rows || []).map(
      (r: {
        id: string;
        location_city?: string | null;
        location_state?: string | null;
        location_country?: string | null;
        location_country_code?: string | null;
      }) => [
        r.id,
        {
          location_city: r.location_city ?? null,
          location_state: r.location_state ?? null,
          location_country: r.location_country ?? null,
          location_country_code: r.location_country_code ?? null,
        },
      ]
    )
  );

  for (const s of stores) {
    const r = byId.get(s.owner_id);
    if (!r) continue;
    if (r.location_city != null) s.location_city = r.location_city;
    if (r.location_state != null) s.location_state = r.location_state;
    if (r.location_country != null) s.location_country = r.location_country;
    if (r.location_country_code != null) s.location_country_code = r.location_country_code;
  }
}

export type StoreRow = Store & Record<string, unknown>;

/**
 * Seller rows for marketplace joins: built only from `profiles` (same as `[slug]` / product pages).
 */
export async function fetchMergedStoreRowsForSellerIds(
  supabase: SupabaseClient,
  sellerIds: string[]
): Promise<StoreRow[]> {
  const unique = [...new Set(sellerIds.filter(Boolean))];
  if (unique.length === 0) return [];

  const { data: profiles } = await supabase
    .from("profiles")
    .select(PROFILE_STOREFRONT_SELECT)
    .in("id", unique)
    .eq("is_seller", true);

  const stores = (profiles || []).map((row) => {
    const p = row as unknown as ProfileStorefrontRow;
    return profileRowToLegacyStoreShape(p) as unknown as StoreRow;
  });

  await attachProfileRegionsToStores(supabase, stores, unique);
  return stores;
}

/** Join store rows onto product rows using `products.seller_id` → `profiles.id` as `owner_id`. */
export function attachStoresToProducts<P extends { seller_id: string }>(
  products: P[],
  stores: StoreRow[]
): (P & { stores: StoreRow | null })[] {
  const byOwner = new Map<string, StoreRow>();
  for (const s of stores) {
    byOwner.set(s.owner_id, s);
  }
  return products.map((p) => ({
    ...p,
    stores: byOwner.get(p.seller_id) ?? null,
  }));
}

export function dropProductsWithoutStore<P extends { seller_id: string }>(
  rows: (P & { stores: StoreRow | null })[]
): (P & { stores: StoreRow })[] {
  return rows.filter((r): r is P & { stores: StoreRow } => r.stores != null);
}
