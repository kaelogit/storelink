import type { SupabaseClient } from "@supabase/supabase-js";
import { BUYER_ONBOARDING_CATEGORY_OPTIONS } from "@/lib/buyerOnboardingCategories";

/** Platform rows for the same slugs used in buyer onboarding (pick categories). */
export type MarketplaceCategoryFilter = { id: string; name: string; slug: string };

/**
 * Loads standard marketplace category filters. Always returns every onboarding option so the
 * `/marketplace` dropdown is never empty when `categories` platform seed rows are missing.
 * DB `id` is used when present (stable keys); otherwise a deterministic `onb-{slug}` id.
 */
export async function fetchMarketplaceOnboardingCategories(
  supabase: SupabaseClient
): Promise<MarketplaceCategoryFilter[]> {
  const slugs = BUYER_ONBOARDING_CATEGORY_OPTIONS.map((o) => o.slug);
  const { data } = await supabase
    .from("categories")
    .select("id,name,slug")
    .eq("category_scope", "platform")
    .in("slug", slugs);

  const bySlug = new Map((data || []).map((c) => [String(c.slug || "").toLowerCase(), c]));
  const out: MarketplaceCategoryFilter[] = [];
  for (const opt of BUYER_ONBOARDING_CATEGORY_OPTIONS) {
    const row = bySlug.get(opt.slug.toLowerCase());
    out.push({
      id: row?.id ? String(row.id) : `onb-${opt.slug}`,
      name: opt.label,
      slug: opt.slug,
    });
  }
  return out;
}

/** URL-safe slug from a seller profile `category` label (for extra filters not in onboarding). */
export function slugifyMarketplaceCategorySlug(label: string): string {
  const s = label
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || "category";
}

/**
 * Adds distinct `profiles.category` values seen on product rows so shoppers can filter by labels
 * that exist in the feed but are not in the fixed onboarding list.
 */
export function mergeCategoriesFromProductRows(
  base: MarketplaceCategoryFilter[],
  rows: ReadonlyArray<Record<string, unknown>>,
): MarketplaceCategoryFilter[] {
  const usedNames = new Set(base.map((c) => c.name.trim().toLowerCase()));
  const usedSlugs = new Set(base.map((c) => c.slug.trim().toLowerCase()));
  const extras: MarketplaceCategoryFilter[] = [];

  for (const row of rows) {
    const name = String(row.category ?? "").trim();
    if (!name) continue;
    const nk = name.toLowerCase();
    if (usedNames.has(nk)) continue;
    usedNames.add(nk);

    let slug = slugifyMarketplaceCategorySlug(name);
    let slugKey = slug;
    let n = 0;
    while (usedSlugs.has(slugKey)) {
      n += 1;
      slugKey = `${slug}-${n}`;
    }
    usedSlugs.add(slugKey);
    extras.push({ id: `mkp-${slugKey}`, name, slug: slugKey });
  }

  extras.sort((a, b) => a.name.localeCompare(b.name));
  return [...base, ...extras];
}
