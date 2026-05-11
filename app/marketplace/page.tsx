import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FullMarketplaceClient from "@/components/marketplace/FullMarketplaceClient";
import { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
  attachStoresToProducts,
  dropProductsWithoutStore,
  fetchMergedStoreRowsForSellerIds,
} from "@/lib/storefrontCatalogMerge";
import { fetchMarketplaceOnboardingCategories } from "@/lib/marketplaceOnboardingCategories";
import { storefrontAbsolutePath } from "@/lib/storefrontPublicUrl";

export const metadata: Metadata = {
  title: "Full Marketplace | Shop StoreLink",
  description: "Explore products from verified Nigerian vendors and discover stores beyond your personal network in one marketplace.",
  openGraph: {
    title: "Full Marketplace | Shop StoreLink",
    description: "Browse verified vendors, discover new products, and shop the heart of the StoreLink economy.",
    images: ["/og-image.png"],
    url: storefrontAbsolutePath("/marketplace"),
  },
};

export const dynamic = "force-dynamic";

export default async function MarketplacePage() {
  const { data: rawProducts } = await supabase.rpc("get_storefront_marketplace_products", {
    p_limit: 120,
    p_offset: 0,
    p_category: null,
    p_search: null,
    p_flash_only: false,
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
  const shuffledProducts = sorted.slice(0, 80);

  const categories = await fetchMarketplaceOnboardingCategories(supabase);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-7xl px-4 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-bold text-gray-500 hover:text-gray-900 transition text-sm bg-white border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50"
        >
          <ArrowLeft size={16} /> <span className="hidden md:inline">Back to Home</span>
        </Link>
      </div>

      <div className="flex-1">
        <FullMarketplaceClient initialProducts={shuffledProducts || []} categories={categories} />
      </div>
      <Footer />
    </div>
  );
}
