import { supabase } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";
import StoreFront from "@/components/StoreFront";
import type { Metadata } from "next";
import { prepareStorefrontProductRows } from "@/lib/storefrontCatalogOrder";
import ProfileStorefrontViewTracker from "@/components/ViewTracker";
import { ShieldAlert } from "lucide-react";
import {
  PROFILE_STOREFRONT_SELECT,
  profileRowToLegacyStoreShape,
  type ProfileStorefrontRow,
} from "@/lib/profileAsStorefront";
import {
  absoluteUrlForOpenGraph,
  sellerStorefrontPublicUrl,
} from "@/lib/storefrontPublicUrl";
import { storefrontRootDomain } from "@/lib/storefrontHosts";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM } from "@/lib/mobileLayout";
import { normalizeSlug } from "@/lib/slugAvailability";
import { resolveStorefrontSlugRedirect } from "@/lib/storefrontSlugRedirect";
import StorefrontSlugUnavailable from "@/components/storefront/StorefrontSlugUnavailable";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = normalizeSlug(resolvedParams.slug);
  if (!slug) return { title: "Store Not Found" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, full_name, slug, bio, logo_url, cover_image_url")
    .eq("slug", slug)
    .eq("is_seller", true)
    .maybeSingle();

  if (!profile) {
    const nextSlug = await resolveStorefrontSlugRedirect(supabase, resolvedParams.slug);
    if (nextSlug) redirect(sellerStorefrontPublicUrl(nextSlug));

    const { data: holder } = await supabase.from("profiles").select("is_seller").eq("slug", slug).maybeSingle();
    if (holder && holder.is_seller !== true) {
      return {
        title: `Not a store · ${slug}`,
        description: "This StoreLink handle is not a seller storefront.",
        robots: { index: false, follow: true },
      };
    }
    return {
      title: "Store not found",
      description: "No seller shop uses this link on StoreLink.",
      robots: { index: false, follow: true },
    };
  }

  const name = profile?.full_name?.trim() || profile?.display_name?.trim() || "StoreLink";
  const root = storefrontRootDomain();
  const tenantHost = root ? `${slug}.${root}` : slug;
  const description =
    profile?.bio?.trim() ||
    `Shop ${name} on StoreLink — ${tenantHost}. Browse products and checkout securely.`;
  const ogTitle = `${name} · ${tenantHost}`;
  const ogImage = absoluteUrlForOpenGraph(
    profile?.cover_image_url || profile?.logo_url || null,
    "/og-image.jpg",
  );

  const storeCanonical = sellerStorefrontPublicUrl(slug);
  return {
    title: name,
    description,
    openGraph: {
      title: ogTitle,
      description,
      url: storeCanonical,
      siteName: "StoreLink",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${name} storefront` }],
      locale: "en_NG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [ogImage],
    },
    alternates: { canonical: storeCanonical },
  };
}

export default async function VendorStorePage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = normalizeSlug(resolvedParams.slug);
  if (!slug) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select(`${PROFILE_STOREFRONT_SELECT}, account_status`)
    .eq("slug", slug)
    .eq("is_seller", true)
    .maybeSingle();

  if (!profile) {
    const nextSlug = await resolveStorefrontSlugRedirect(supabase, resolvedParams.slug);
    if (nextSlug) redirect(sellerStorefrontPublicUrl(nextSlug));

    const { data: holder } = await supabase
      .from("profiles")
      .select("display_name, full_name, is_seller")
      .eq("slug", slug)
      .maybeSingle();

    if (holder && holder.is_seller !== true) {
      const displayLabel =
        String(holder.full_name || "").trim() ||
        String(holder.display_name || "").trim() ||
        slug;
      return <StorefrontSlugUnavailable variant="buyer-account" slug={slug} displayLabel={displayLabel} />;
    }

    return <StorefrontSlugUnavailable variant="unknown" slug={slug} />;
  }

  const suspended = String(profile?.account_status || "").toLowerCase() === "suspended";

  if (suspended) {
    return (
      <div className={`flex min-h-dvh flex-col items-center justify-center bg-gray-50 text-center ${STOREFRONT_GUTTER_X} ${STOREFRONT_SAFE_BOTTOM}`}>
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 border border-red-200">
          <ShieldAlert size={32} className="text-red-600" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Store Suspended</h1>
        <p className="text-gray-500 max-w-md mb-6 font-medium">This storefront is currently restricted.</p>
        <div className="mt-8 pt-8 border-t border-gray-200 w-full max-w-xs">
          <p className="text-[10px] text-red-400 font-black uppercase tracking-[0.3em]">Admin Action Enforced</p>
        </div>
      </div>
    );
  }

  const sellerId = profile.id;
  const displayStore = profileRowToLegacyStoreShape(profile as ProfileStorefrontRow);

  const { data: products } = await supabase
    .from("storefront_products")
    .select("*")
    .eq("seller_id", sellerId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  let categories: { id: string; name: string }[] = [];
  const { data: bySeller } = await supabase
    .from("categories")
    .select("*")
    .eq("seller_id", sellerId)
    .eq("category_scope", "seller")
    .order("name", { ascending: true });
  categories = (bySeller || []) as { id: string; name: string }[];

  const sfTheme = displayStore.storefront_theme;
  const catalogProducts = prepareStorefrontProductRows(products || [], {
    hideOutOfStock: Boolean(sfTheme?.hide_out_of_stock),
    shuffleUnpinned: true,
  });

  let blockRows: { id: string; type: string; payload: Record<string, unknown>; sort_order: number }[] = [];
  const blocksRes = await supabase
    .from("storefront_blocks")
    .select("id, type, payload, sort_order")
    .eq("seller_id", sellerId)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });
  if (!blocksRes.error && blocksRes.data) {
    blockRows = blocksRes.data as typeof blockRows;
  }

  const shopUrl = sellerStorefrontPublicUrl(displayStore.slug);
  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: displayStore.name,
    url: shopUrl,
    description: (displayStore.description || "").trim() || `Shop ${displayStore.name} on StoreLink.`,
    image: [displayStore.cover_image_url, displayStore.logo_url].filter(Boolean) as string[],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }} />
      <ProfileStorefrontViewTracker profileId={sellerId} />
      <StoreFront
        store={displayStore}
        products={catalogProducts}
        categories={categories || []}
        storefrontBlocks={blockRows}
      />
    </>
  );
}
