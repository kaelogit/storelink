import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import FullMarketplaceClient from "@/components/marketplace/FullMarketplaceClient";
import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
  attachStoresToProducts,
  dropProductsWithoutStore,
  fetchMergedStoreRowsForSellerIds,
} from "@/lib/storefrontCatalogMerge";
import {
  fetchMarketplaceOnboardingCategories,
  mergeCategoriesFromProductRows,
} from "@/lib/marketplaceOnboardingCategories";
import { storefrontAbsolutePath } from "@/lib/storefrontPublicUrl";
import { STOREFRONT_GUTTER_X } from "@/lib/mobileLayout";

export const metadata: Metadata = {
  title: "Marketplace — Discover products on StoreLink",
  description:
    "Browse products from verified and independent StoreLink sellers. Search by title, filter by category, and shop with structured checkout. Discovery uses fair ranking—Diamond adds visibility, not a guaranteed #1 slot.",
  keywords: [
    "StoreLink marketplace",
    "Nigeria online shopping",
    "independent sellers",
    "verified vendors",
    "Store Coins",
  ],
  openGraph: {
    title: "Marketplace — Discover products on StoreLink",
    description:
      "Search and filter products from StoreLink sellers. Trust badges show verification, Diamond visibility, and Store Coins where enabled.",
    images: [storefrontAbsolutePath("/og-image.png")],
    url: storefrontAbsolutePath("/marketplace"),
    type: "website",
  },
  alternates: {
    canonical: storefrontAbsolutePath("/marketplace"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Marketplace — Discover products on StoreLink",
    description:
      "Search and filter products from StoreLink sellers. Verification and Diamond badges explain trust at a glance.",
    images: [storefrontAbsolutePath("/og-image.png")],
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

  const baseCategories = await fetchMarketplaceOnboardingCategories(supabase);
  const categories = mergeCategoriesFromProductRows(baseCategories, joined as ReadonlyArray<Record<string, unknown>>);

  const faqMainEntity = [
    {
      "@type": "Question",
      name: "How does StoreLink rank products on the marketplace?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ranking blends freshness (newer listings get a modest boost), optional Diamond visibility uplift when a subscription is active, and sometimes location or state relevance when shoppers share location for nearby results. Diamond does not buy a permanent #1 position.",
      },
    },
    {
      "@type": "Question",
      name: "What does the blue verification tick mean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It means the seller completed StoreLink merchant verification review. It is separate from Diamond, which is an optional visibility plan.",
      },
    },
    {
      "@type": "Question",
      name: "What do the badges on a listing mean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Verification means the seller completed merchant review where shown. Diamond is an optional visibility plan. Store Coins appear when a shop runs loyalty rewards.",
      },
    },
    {
      "@type": "Question",
      name: "Does the marketplace guarantee sales?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Marketplace discovery helps shoppers find new stores; sellers still win with clear listings, fair pricing, and reliable fulfilment.",
      },
    },
    {
      "@type": "Question",
      name: "Can I share a marketplace link with search or category pre-filled?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Use /marketplace with query parameters: q for search text, category with a valid category slug, and flash=1 for live drops only. The site updates the URL when you change filters.",
      },
    },
  ];

  const sampleProducts = (shuffledProducts || []).slice(0, 12).map((row) => {
    const p = row as { id?: string; name?: string | null };
    return { id: p.id ?? "", name: p.name };
  }).filter((p) => p.id);
  const itemListElements = sampleProducts.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: (p.name || "Product").trim() || "Product",
    url: storefrontAbsolutePath(`/product/${p.id}`),
  }));

  const marketplaceStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "FAQPage", mainEntity: faqMainEntity },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: storefrontAbsolutePath("/") },
          { "@type": "ListItem", position: 2, name: "Marketplace", item: storefrontAbsolutePath("/marketplace") },
        ],
      },
      ...(itemListElements.length
        ? [
            {
              "@type": "ItemList",
              name: "Featured marketplace products",
              numberOfItems: itemListElements.length,
              itemListElement: itemListElements,
            },
          ]
        : []),
    ],
  };

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(marketplaceStructuredData) }}
      />
      <Navbar />
      <div className={`mx-auto w-full max-w-7xl py-4 ${STOREFRONT_GUTTER_X}`}>
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
        >
          <ArrowLeft size={16} /> <span className="hidden md:inline">Back to Home</span>
        </Link>
      </div>

      <section className={`mx-auto w-full max-w-5xl pb-2 ${STOREFRONT_GUTTER_X}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Discover</p>
        <h1 className="mt-1 text-2xl font-black uppercase tracking-tight text-gray-900 md:text-3xl">Marketplace</h1>
        <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-gray-600">
          Browse products from independent StoreLink sellers in one place.
        </p>
      </section>

      <div className="flex-1">
        <Suspense
          fallback={
            <div className="flex min-h-[40vh] items-center justify-center bg-gray-50">
              <Loader2 className="h-10 w-10 animate-spin text-gray-300" aria-hidden />
            </div>
          }
        >
          <FullMarketplaceClient
            initialProducts={shuffledProducts || []}
            categories={categories}
            initialFeedEmpty={(shuffledProducts || []).length === 0}
          />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
