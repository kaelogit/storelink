import { supabase } from "@/lib/supabase";
import LandingPageWrapper from "@/components/landing/LandingPageWrapper";
import type { Product } from "@/types";
import { shuffleArray } from "@/utils/shuffle";
import {
  isExcludedStorefrontSellerCategory,
} from "@/lib/buyerCategories";
import {
  attachStoresToProducts,
  dropProductsWithoutStore,
  fetchMergedStoreRowsForSellerIds,
} from "@/lib/storefrontCatalogMerge";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const { data: rawProducts } = await supabase.rpc("get_storefront_trending_products", {
    p_limit: 120,
  });

  const sellerIds = [...new Set((rawProducts || []).map((p: { seller_id?: string }) => p.seller_id).filter(Boolean))] as string[];
  const storeRows = await fetchMergedStoreRowsForSellerIds(supabase, sellerIds);

  const merged = attachStoresToProducts(rawProducts || [], storeRows);
  const joined = dropProductsWithoutStore(merged);

  const sorted = [...joined].sort(
    (a, b) =>
      new Date(String((b as { created_at?: string }).created_at || 0)).getTime() -
      new Date(String((a as { created_at?: string }).created_at || 0)).getTime(),
  );
  const products = sorted.slice(0, 100);

  const sellerSet = new Set(products.map((p: { seller_id?: string }) => p.seller_id).filter(Boolean) as string[]);
  const storesForTrending = storeRows.filter(
    (s) => sellerSet.has(s.owner_id) && !isExcludedStorefrontSellerCategory(s.category as string | null | undefined),
  );

  /** Trending = newest eligible listings first (fairness caps already applied). */
  const shuffledProducts = products;
  const shuffledStores = shuffleArray(storesForTrending);

  return <LandingPageWrapper products={shuffledProducts as unknown as Product[]} stores={shuffledStores} />;
}
