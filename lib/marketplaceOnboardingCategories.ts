import type { SupabaseClient } from "@supabase/supabase-js";
import { BUYER_ONBOARDING_CATEGORY_OPTIONS } from "@/lib/buyerOnboardingCategories";

/** Platform rows for the same slugs used in buyer onboarding (pick categories). */
export type MarketplaceCategoryFilter = { id: string; name: string; slug: string };

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
    if (row?.id) {
      out.push({ id: String(row.id), name: opt.label, slug: opt.slug });
    }
  }
  return out;
}
