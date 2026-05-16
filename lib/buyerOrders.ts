import type { SupabaseClient } from "@supabase/supabase-js";
import { isServiceOnlyPlaceholderOrder } from "@/utils/orderPlaceholders";

const BUYER_ORDER_SELECT = `
      id,
      created_at,
      updated_at,
      status,
      total_amount,
      coin_redeemed,
      currency_code,
      origin_channel,
      checkout_mode,
      shipping_address,
      seller_id,
      payment_reference,
      guest_email
    `;

const ORDER_ITEMS_SELECT = "id, order_id, quantity, unit_price, product_name, item_type, product_id";

async function hydrateMerchantProfiles(supabase: SupabaseClient, rows: any[]): Promise<any[]> {
  const sellerIds = Array.from(
    new Set(
      rows
        .map((row) => String(row?.seller_id || "").trim())
        .filter((v) => v.length > 0)
    )
  );
  if (sellerIds.length === 0) return rows;

  const { data: sellers } = await supabase
    .from("profiles")
    .select("id, display_name, full_name, email, logo_url, slug, is_verified")
    .in("id", sellerIds);
  const sellerMap = new Map<string, any>((sellers || []).map((s: any) => [String(s.id), s]));
  return rows.map((row) => ({
    ...row,
    merchant: row?.merchant || sellerMap.get(String(row?.seller_id || "")) || null,
  }));
}

async function fetchOrdersByColumn(
  supabase: SupabaseClient,
  column: "user_id" | "claimed_by_user_id",
  value: string
): Promise<any[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(BUYER_ORDER_SELECT)
    .eq(column, value)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as any[];
}

/** Same rows as mobile `orders/index` buyer query — UUID `id` matches app deep links & detail screens. */
export async function fetchBuyerProductOrders(
  supabase: SupabaseClient,
  userId: string,
  buyerEmail?: string | null
) {
  let merged: any[] = [];
  try {
    merged = await fetchOrdersByColumn(supabase, "user_id", userId);
  } catch {
    merged = [];
  }

  // `claimed_by_user_id` is optional across environments; ignore if absent.
  try {
    const claimedRows = await fetchOrdersByColumn(supabase, "claimed_by_user_id", userId);
    if (claimedRows.length > 0) merged = [...merged, ...claimedRows];
  } catch {
    // no-op
  }

  const email = String(buyerEmail || "").trim().toLowerCase();
  if (email.includes("@")) {
    try {
      const { data: emailRows } = await supabase
        .from("orders")
        .select(BUYER_ORDER_SELECT)
        .eq("guest_email", email)
        .is("user_id", null)
        .order("created_at", { ascending: false });
      if (Array.isArray(emailRows) && emailRows.length > 0) {
        const byId = new Map<string, any>();
        for (const row of [...merged, ...emailRows]) byId.set(String(row.id), row);
        merged = Array.from(byId.values()).sort(
          (a, b) => new Date(String(b.created_at || 0)).getTime() - new Date(String(a.created_at || 0)).getTime()
        );
      }
    } catch {
      // no-op
    }
  }

  // Dedupe before enrichments.
  {
    const byId = new Map<string, any>();
    for (const row of merged) byId.set(String(row.id), row);
    merged = Array.from(byId.values()).sort(
      (a, b) => new Date(String(b.created_at || 0)).getTime() - new Date(String(a.created_at || 0)).getTime()
    );
  }

  // Best-effort order_items hydration (do not fail buyer list if blocked by policy).
  try {
    const orderIds = merged.map((row) => String(row.id));
    if (orderIds.length > 0) {
      const { data: items } = await supabase
        .from("order_items")
        .select(ORDER_ITEMS_SELECT)
        .in("order_id", orderIds);
      const itemMap = new Map<string, any[]>();
      for (const it of items || []) {
        const oid = String((it as any).order_id || "");
        if (!itemMap.has(oid)) itemMap.set(oid, []);
        itemMap.get(oid)!.push(it);
      }
      merged = merged.map((row) => ({
        ...row,
        order_items: itemMap.get(String(row.id)) || [],
      }));
    }
  } catch {
    merged = merged.map((row) => ({ ...row, order_items: row.order_items || [] }));
  }

  merged = await hydrateMerchantProfiles(supabase, merged);

  type ItemsForPlaceholder = Array<{ item_type?: string | null; product_id?: string | null }> | null;
  let filtered = merged.filter((row) =>
    !isServiceOnlyPlaceholderOrder(row as { order_items?: ItemsForPlaceholder }),
  );

  // Final safety-net: if client-side RLS still yields zero, ask server route (service-role, user-scoped).
  if (filtered.length === 0 && typeof window !== "undefined") {
    try {
      const res = await fetch("/api/buyer/orders", { method: "GET", credentials: "include" });
      if (res.ok) {
        const json = (await res.json()) as { orders?: unknown[] };
        const rows = Array.isArray(json.orders) ? json.orders : [];
        filtered = rows.filter(
          (row) => !isServiceOnlyPlaceholderOrder(row as { order_items?: ItemsForPlaceholder })
        );
      }
    } catch {
      // keep empty list
    }
  }

  return filtered;
}
