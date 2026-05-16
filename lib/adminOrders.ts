import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * `public.orders` columns used by storefront admin and payouts (see
 * `20260811160000_create_new_order_p_seller_id.sql`, `20261010120000_create_new_order_profile_ssot.sql`). Account buyer contact is resolved in
 * `profiles` via `orders_user_id_fkey` where needed.
 */
export const ADMIN_ORDERS_CORE_COLUMNS =
  "id, user_id, seller_id, total_amount, currency_code, status, payout_status, payout_eligible_at, payout_error_log, payout_retry_count, payment_reference, origin_channel, checkout_mode, shipping_address, coin_redeemed, created_at, updated_at";

export type OrderRowWithStore<T extends { seller_id?: string | null }> = T & {
  store: { name: string | null; slug: string | null } | null;
};

/**
 * Resolve seller storefront label from `profiles` (`seller_id` = `profiles.id`).
 * Does not use `stores` (optional legacy table).
 */
export async function enrichOrdersWithStoreBySeller<T extends { seller_id?: string | null }>(
  svc: SupabaseClient,
  rows: T[],
): Promise<OrderRowWithStore<T>[]> {
  const sellerIds = [...new Set(rows.map((r) => r.seller_id).filter(Boolean))] as string[];
  if (sellerIds.length === 0) {
    return rows.map((o) => ({ ...o, store: null }));
  }
  const { data: profiles } = await svc
    .from("profiles")
    .select("id, full_name, display_name, slug")
    .in("id", sellerIds);

  const bySeller = new Map<string, { name: string | null; slug: string | null }>();
  for (const p of profiles || []) {
    const id = p.id as string;
    const name = (p.full_name as string | null)?.trim() || (p.display_name as string)?.trim() || null;
    const slug = (p.slug as string | null) ?? null;
    if (id) bySeller.set(id, { name, slug });
  }

  return rows.map((o) => ({
    ...o,
    store: o.seller_id ? bySeller.get(o.seller_id) ?? null : null,
  }));
}
