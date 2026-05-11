/**
 * Storefront marketplace helpers (product-led; service-only sellers excluded).
 */

/** Global `categories.slug` values never shown as filters on the storefront marketplace. */
export const STOREFRONT_EXCLUDED_CATEGORY_SLUGS = ["services"] as const;

export function filterCategoriesForStorefront<T extends { slug: string }>(categories: T[]): T[] {
  const excluded = new Set(STOREFRONT_EXCLUDED_CATEGORY_SLUGS.map((s) => s.toLowerCase()));
  return categories.filter((c) => !excluded.has(String(c.slug).toLowerCase()));
}

/** True when `stores.category` should not appear on the web storefront (services sellers stay app-first). */
export function isExcludedStorefrontSellerCategory(category: string | null | undefined): boolean {
  const c = String(category ?? "").toLowerCase();
  return c === "services" || c === "service";
}

/** Drops rows whose store `category` is services-only (legacy app sellers); web marketplace is product-led. */
export function excludeServiceStoresFromMarketplaceProducts<
  T extends { stores?: { category?: string | null } | null },
>(products: T[]): T[] {
  return products.filter((p) => !isExcludedStorefrontSellerCategory(p.stores?.category));
}
