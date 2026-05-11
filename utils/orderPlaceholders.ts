/** Mirrors store-link-mobile `orderPlaceholders` — hide service-only placeholder rows from buyer lists. */
export function isServiceOnlyPlaceholderOrder(order: {
  order_items?: Array<{ item_type?: string | null; product_id?: string | null }> | null;
}): boolean {
  const items = Array.isArray(order?.order_items) ? order.order_items : [];
  if (items.length === 0) return false;
  const hasDiscriminator = items.some(
    (it) => it && (typeof it.item_type !== "undefined" || typeof it.product_id !== "undefined")
  );
  if (!hasDiscriminator) return false;
  return items.every(
    (it) => String(it?.item_type ?? "").toLowerCase() === "service" || !it?.product_id
  );
}
