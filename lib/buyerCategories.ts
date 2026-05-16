/**
 * Storefront marketplace helpers (product-led; service-only sellers excluded).
 */

/** Global `categories.slug` values never shown as filters on the storefront marketplace. */
export const STOREFRONT_EXCLUDED_CATEGORY_SLUGS = ["services"] as const;

export function filterCategoriesForStorefront<T extends { slug: string }>(categories: T[]): T[] {
  const excluded = new Set(STOREFRONT_EXCLUDED_CATEGORY_SLUGS.map((s) => s.toLowerCase()));
  return categories.filter((c) => !excluded.has(String(c.slug).toLowerCase()));
}

/** True when seller category / type should not appear on the web storefront (services-only sellers stay app-first). */
export function isExcludedStorefrontSellerCategory(category: string | null | undefined): boolean {
  const c = String(category ?? "").toLowerCase();
  return c === "services" || c === "service";
}

/** Drops rows whose joined seller is services-only; web marketplace is product-led. */
export function excludeServiceStoresFromMarketplaceProducts<
  T extends { stores?: { category?: string | null; seller_type?: string | null } | null },
>(products: T[]): T[] {
  return products.filter((p) => {
    const s = p.stores;
    if (!s) return true;
    if (isExcludedStorefrontSellerCategory(s.category)) return false;
    const st = String(s.seller_type || "").toLowerCase();
    if (st === "service") return false;
    return true;
  });
}
