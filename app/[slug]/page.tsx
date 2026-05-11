import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import StoreFront from "@/components/StoreFront";
import type { Metadata } from "next";
import { shuffleArray } from "@/utils/shuffle";
import ProfileStorefrontViewTracker from "@/components/ViewTracker";
import { ShieldAlert } from "lucide-react";
import {
  PROFILE_STOREFRONT_SELECT,
  profileRowToLegacyStoreShape,
  type ProfileStorefrontRow,
} from "@/lib/profileAsStorefront";
import { storefrontAbsolutePath } from "@/lib/storefrontPublicUrl";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const [{ data: profile }, { data: legacyStore }] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, full_name, slug, bio, logo_url")
      .eq("slug", slug)
      .eq("is_seller", true)
      .maybeSingle(),
    supabase.from("stores").select("name, description, logo_url, cover_image_url").eq("slug", slug).maybeSingle(),
  ]);

  if (!profile && !legacyStore) return { title: "Store Not Found" };

  const name =
    profile?.full_name?.trim() || profile?.display_name?.trim() || legacyStore?.name?.trim() || "StoreLink";
  const description =
    profile?.bio?.trim() || legacyStore?.description?.trim() || `Check out ${name} on StoreLink.`;
  const ogImage =
    legacyStore?.cover_image_url ||
    legacyStore?.logo_url ||
    profile?.logo_url ||
    storefrontAbsolutePath("/og-image.png");

  return {
    title: name,
    description,
    openGraph: {
      title: name,
      description,
      url: storefrontAbsolutePath(`/${slug}`),
      siteName: "StoreLink",
      images: [{ url: ogImage, width: 1200, height: 630, alt: name }],
      locale: "en_NG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      images: [ogImage],
    },
  };
}

export default async function VendorStorePage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const [{ data: profile }, { data: legacyStore }] = await Promise.all([
    supabase
      .from("profiles")
      .select(`${PROFILE_STOREFRONT_SELECT}, account_status`)
      .eq("slug", slug)
      .eq("is_seller", true)
      .maybeSingle(),
    supabase.from("stores").select("*, owner_email").eq("slug", slug).maybeSingle(),
  ]);

  if (!profile && !legacyStore) return notFound();

  const suspended =
    String(profile?.account_status || "").toLowerCase() === "suspended" || legacyStore?.status === "banned";

  if (suspended) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 border border-red-200">
          <ShieldAlert size={32} className="text-red-600" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Store Suspended</h1>
        <p className="text-gray-500 max-w-md mb-6 font-medium">
          This storefront is currently restricted.
        </p>
        <div className="mt-8 pt-8 border-t border-gray-200 w-full max-w-xs">
          <p className="text-[10px] text-red-400 font-black uppercase tracking-[0.3em]">Admin Action Enforced</p>
        </div>
      </div>
    );
  }

  const sellerId = profile?.id ?? legacyStore?.owner_id;
  if (!sellerId) return notFound();

  let displayStore = profile
    ? profileRowToLegacyStoreShape(profile as ProfileStorefrontRow, {
        legacyStoreId: legacyStore?.id ?? null,
        ownerEmail: legacyStore?.owner_email ?? null,
      })
    : legacyStore!;

  if (profile && legacyStore) {
    const p = profile as ProfileStorefrontRow;
    const leg = legacyStore as {
      location?: string | null;
      cover_image_url?: string | null;
      instagram_handle?: string | null;
      tiktok_url?: string | null;
    };
    const shopLine = leg.location?.trim();
    displayStore = {
      ...displayStore,
      cover_image_url: leg.cover_image_url ?? displayStore.cover_image_url,
      /** Shop/pickup line lives on `stores`; profile fields are home-oriented — prefer explicit shop string when present. */
      location: shopLine || displayStore.location,
      instagram_handle: (p.instagram_handle?.trim() || leg.instagram_handle || displayStore.instagram_handle || "").trim() || undefined,
      tiktok_url: (p.tiktok_url?.trim() || leg.tiktok_url || displayStore.tiktok_url || "").trim() || undefined,
    };
  }

  const { data: products } = await supabase
    .from("storefront_products")
    .select("*")
    .eq("seller_id", sellerId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  let categories: { id: string; name: string }[] = [];
  if (sellerId) {
    const { data: bySeller } = await supabase
      .from("categories")
      .select("*")
      .eq("seller_id", sellerId)
      .eq("category_scope", "seller")
      .order("name", { ascending: true });
    categories = (bySeller || []) as { id: string; name: string }[];
  }

  const shuffledProducts = shuffleArray(products || []);

  return (
    <>
      <ProfileStorefrontViewTracker profileId={sellerId} />
      <StoreFront store={displayStore} products={shuffledProducts} categories={categories || []} />
    </>
  );
}
