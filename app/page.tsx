import { supabase } from "@/lib/supabase";
import LandingPageWrapper from "@/components/landing/LandingPageWrapper";
import type { Product } from "@/types";
import { shuffleArray } from "@/utils/shuffle";
import type { Metadata } from "next";
import { storefrontAbsolutePath, storefrontSiteBase } from "@/lib/storefrontPublicUrl";
import { storefrontRootDomain, storefrontShopSubdomain } from "@/lib/storefrontHosts";
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

const root = storefrontRootDomain();
const shopSub = storefrontShopSubdomain();
const hubLabel = `${shopSub}.${root}`;

export const metadata: Metadata = {
  title: "Discover shops & products",
  description: `Browse trending products from independent sellers on StoreLink. Marketplace hub at ${hubLabel} — branded shops on ${root}.`,
  alternates: {
    canonical: storefrontSiteBase().replace(/\/+$/, "") + "/",
  },
  openGraph: {
    title: `StoreLink marketplace · ${hubLabel}`,
    description:
      "Find products from verified and independent Nigerian sellers. Search, filter by category, and checkout securely.",
    url: storefrontSiteBase().replace(/\/+$/, "") + "/",
    siteName: "StoreLink",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: storefrontAbsolutePath("/og-image.jpg"),
        width: 1200,
        height: 630,
        alt: "StoreLink — marketplace and seller storefronts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `StoreLink · ${hubLabel}`,
    description: "Shop the marketplace or open any seller’s branded storefront on StoreLink.",
    images: [storefrontAbsolutePath("/og-image.jpg")],
  },
};

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
