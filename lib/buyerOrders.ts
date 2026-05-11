import type { SupabaseClient } from "@supabase/supabase-js";
import { buyerOrdersOrFilter } from "@/lib/buyerOrderScope";
import { isServiceOnlyPlaceholderOrder } from "@/utils/orderPlaceholders";

/** Same rows as mobile `orders/index` buyer query — UUID `id` matches app deep links & detail screens. */
export async function fetchBuyerProductOrders(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      created_at,
      updated_at,
      status,
      total_amount,
      currency_code,
      origin_channel,
      checkout_mode,
      shipping_address,
      seller_id,
      payment_reference,
      order_items (
        id,
        quantity,
        unit_price,
        product_name,
        item_type,
        product_id
      ),
      merchant:profiles!orders_seller_id_fkey (
        display_name,
        full_name,
        logo_url,
        slug,
        is_verified
      )
    `
    )
    .or(buyerOrdersOrFilter(userId))
    .order("created_at", { ascending: false });

  if (error) throw error;

  type ItemsForPlaceholder = Array<{ item_type?: string | null; product_id?: string | null }> | null;
  return (data || []).filter((row) =>
    !isServiceOnlyPlaceholderOrder(row as { order_items?: ItemsForPlaceholder }),
  );
}
