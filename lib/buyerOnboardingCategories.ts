import { STOREFRONT_EXCLUDED_CATEGORY_SLUGS } from "@/lib/buyerCategories";

/** Matches mobile buyer onboarding pick-categories (product-led; services excluded on web). */
export const BUYER_ONBOARDING_CATEGORY_OPTIONS = [
  { label: "Fashion", slug: "fashion" },
  { label: "Beauty", slug: "beauty" },
  { label: "Electronics", slug: "electronics" },
  { label: "Home", slug: "home" },
  { label: "Wellness", slug: "wellness" },
  { label: "Automotive", slug: "automotive" },
  { label: "Real Estate", slug: "real-estate" },
] as const;

export function filterBuyerPickSlugsForStorefront(slugs: readonly string[]): string[] {
  const excluded = new Set(STOREFRONT_EXCLUDED_CATEGORY_SLUGS.map((s) => s.toLowerCase()));
  return slugs.filter((s) => !excluded.has(String(s).toLowerCase()));
}
