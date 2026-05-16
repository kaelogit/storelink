/**
 * Public seller mini-site (`/[slug]`) — section model and layout presets.
 *
 * Layout is stored inside `profiles.storefront_theme` JSON (`layout` key) so we do not
 * require a separate DB column. Web storefront only (not mobile app).
 */

export const STOREFRONT_LAYOUT_PRESETS = ["editorial", "grid", "hero_featured", "minimal"] as const;

export type StorefrontLayoutPreset = (typeof STOREFRONT_LAYOUT_PRESETS)[number];

/** Landmark sections we render on the public storefront (see `StoreFront.tsx`). */
export const STOREFRONT_MINI_SITE_SECTIONS = [
  "identity_nav", // StoreLink + store name, info
  "hero", // CMS or fallback hero (`StorefrontHeroSection`)
  "new_arrivals", // Seller-flagged strip (`StorefrontNewArrivalsSection`)
  "best_sellers", // Curated strip (`StorefrontBestSellersSection`)
  "flash_drops", // Active flash SKUs (horizontal band)
  "catalog_toolbar", // Search + category filters (sticky)
  "product_grid", // Main catalog (layout preset changes density / hero tile)
  "site_footer", // Slug, bio snippet, product count, StoreLink credit
] as const;

export type StorefrontMiniSiteSectionId = (typeof STOREFRONT_MINI_SITE_SECTIONS)[number];

export function normalizeStorefrontLayout(raw: unknown): StorefrontLayoutPreset {
  const s = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  if (s === "editorial" || s === "hero_featured" || s === "minimal") return s;
  return "grid";
}
