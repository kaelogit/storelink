import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Many app-originated rows leave `order_items.product_name` null; `product_id` still points at `products`.
 */
export function orderLineLabel(item: {
  product_name?: string | null;
  name?: string | null;
  _resolved_product_name?: string | null;
}): string {
  const explicit = String(item.product_name ?? item.name ?? "").trim();
  if (explicit) return explicit;
  const resolved = String(item._resolved_product_name ?? "").trim();
  if (resolved) return resolved;
  return "Product";
}

type ProductRowLite = {
  id: string;
  name?: string | null;
  image_urls?: string[] | null;
};

function firstProductImageUrl(image_urls: unknown): string | null {
  if (!Array.isArray(image_urls) || image_urls.length === 0) return null;
  const first = image_urls[0];
  const u = typeof first === "string" ? first.trim() : "";
  return u || null;
}

/**
 * Loads `products.name` and first gallery image for rows with `product_id`
 * (matches mobile `products(image_urls, name)` join).
 */
export async function enrichOrderItemsWithProductNames(
  supabase: SupabaseClient,
  items: Record<string, unknown>[]
): Promise<Record<string, unknown>[]> {
  if (!items.length) return items;

  const ids = [...new Set(items.map((i) => String(i.product_id ?? "").trim()).filter(Boolean))];
  if (!ids.length) return items;

  const { data: products } = await supabase.from("products").select("id, name, image_urls").in("id", ids);

  const byId = new Map<string, ProductRowLite>();
  for (const p of products || []) {
    const row = p as ProductRowLite;
    if (row.id) byId.set(row.id, row);
  }

  return items.map((i) => {
    const pid = String(i.product_id ?? "").trim();
    if (!pid) return i;
    const meta = byId.get(pid);
    if (!meta) return i;

    let next: Record<string, unknown> = { ...i };
    if (!String(i.product_name ?? "").trim() && meta.name) {
      next = { ...next, _resolved_product_name: String(meta.name) };
    }
    const thumb = firstProductImageUrl(meta.image_urls);
    if (thumb) next = { ...next, _resolved_product_image_url: thumb };
    return next;
  });
}
