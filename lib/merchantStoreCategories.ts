/**
 * Product-store categories aligned with store-link-mobile `onboarding/setup.tsx` MERCHANT_CATEGORIES
 * (web storefront is product-led — no service-only categories here).
 */
export const MERCHANT_STORE_CATEGORY_OPTIONS = [
  { label: "Fashion", slug: "fashion" },
  { label: "Beauty", slug: "beauty" },
  { label: "Electronics", slug: "electronics" },
  { label: "Home", slug: "home" },
  { label: "Wellness", slug: "wellness" },
  { label: "Real Estate", slug: "real-estate" },
  { label: "Automotive", slug: "automotive" },
] as const;
