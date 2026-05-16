import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/shared/AddToCartButton";
import ProductHeader from "@/components/shared/ProductHeader";
import ProductGallery from "@/components/shared/ProductGallery";
import FlashTimer from "@/components/shared/FlashTimer";
import type { Metadata } from "next";
import Link from "next/link";
import type { Product } from "@/types";
import { LayoutDashboard, ShieldCheck, MapPin, Truck, Zap, Package, Coins } from "lucide-react";
import {
  PROFILE_STOREFRONT_SELECT,
  profileRowToLegacyStoreShape,
  type ProfileStorefrontRow,
} from "@/lib/profileAsStorefront";
import { compactSellerRegion, displayLocationFull } from "@/lib/displayRegion";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM } from "@/lib/mobileLayout";
import { absoluteUrlForOpenGraph, storefrontAbsolutePath } from "@/lib/storefrontPublicUrl";
import { storefrontRootDomain } from "@/lib/storefrontHosts";
import {
  isProductFlashDropActive,
  productDisplayPrice,
  productFlashEndIso,
  productFlashPriceNumber,
} from "@/lib/productFlashDrop";
import { normalizeStorefrontTheme, themeToCssVars, storefrontFontClass } from "@/lib/storefrontTheme";
import { cn } from "@/lib/utils";
import ProductMoreFromSellerGrid from "@/components/storefront/public/ProductMoreFromSellerGrid";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { data: product } = await supabase.from("storefront_products").select("*").eq("id", params.id).single();

  if (!product) return { title: "Product Not Found", robots: { index: false, follow: true } };

  const p = product as Product;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, full_name, slug")
    .eq("id", p.seller_id)
    .maybeSingle();
  const storeName = profile?.full_name?.trim() || profile?.display_name?.trim() || "Store";
  const sellerSlug = String(profile?.slug || "").trim();
  const root = storefrontRootDomain();
  const tenantHost = sellerSlug && root ? `${sellerSlug}.${root}` : "";

  const displayPrice = productDisplayPrice(p);
  const priceLine = `₦${displayPrice.toLocaleString()}`;
  const productUrl = storefrontAbsolutePath(`/product/${encodeURIComponent(p.id)}`);
  const desc =
    (p.description && String(p.description).trim()) ||
    `${p.name} — ${priceLine}. Sold by ${storeName} on StoreLink.${tenantHost ? ` Shop: ${tenantHost}.` : ""}`;

  const rawImages = Array.isArray(p.image_urls) ? p.image_urls : [];
  const legacyImg = (p as { image_url?: string | null }).image_url;
  const first = (rawImages[0] || legacyImg || "").trim();
  const ogImage = absoluteUrlForOpenGraph(first || null, "/og-image.jpg");

  const ogTitle = tenantHost ? `${p.name} · ${storeName} (${tenantHost})` : `${p.name} · ${storeName}`;

  return {
    title: `${p.name} — ${priceLine}`,
    description: desc,
    alternates: { canonical: productUrl },
    openGraph: {
      title: ogTitle,
      description: desc,
      url: productUrl,
      siteName: "StoreLink",
      locale: "en_NG",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: p.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: desc,
      images: [ogImage],
    },
  };
}

export default async function ProductPage(props: PageProps) {
  const params = await props.params;
  const { data: product } = await supabase.from("storefront_products").select("*").eq("id", params.id).single();

  if (!product) return notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select(`${PROFILE_STOREFRONT_SELECT}, account_status`)
    .eq("id", product.seller_id)
    .maybeSingle();

  if (!profile) return notFound();

  const store = profileRowToLegacyStoreShape(profile as ProfileStorefrontRow);

  const isStockAvailable = product.stock_quantity > 0;
  const isFlashActive = isProductFlashDropActive(product);

  const currentPrice = productDisplayPrice(product);
  const potentialReward = store.loyalty_enabled
    ? Math.floor(currentPrice * ((store.loyalty_percentage || 0) / 100))
    : 0;

  const { data: moreRows } = await supabase
    .from("storefront_products")
    .select("*")
    .eq("seller_id", product.seller_id)
    .eq("is_active", true)
    .neq("id", product.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const moreFromSeller = moreRows || [];

  const sfTheme = normalizeStorefrontTheme(store.storefront_theme);

  return (
    <div
      className={cn(
        "storefront-root flex min-h-dvh flex-col bg-white font-sans",
        sfTheme.font === "sans" ? "font-sans" : storefrontFontClass(sfTheme.font),
        STOREFRONT_SAFE_BOTTOM,
      )}
      style={themeToCssVars(sfTheme)}
      data-sf-font={sfTheme.font}
    >
      <ProductHeader storeSlug={store.slug} storeLogo={store.logo_url ?? undefined} />

      <main className={`mx-auto w-full max-w-6xl flex-1 py-4 pb-8 md:py-12 md:pb-12 ${STOREFRONT_GUTTER_X}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          <div className="relative">
            <ProductGallery images={product.image_urls || [product.image_url]} stockCount={product.stock_quantity} />
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-8">
              {isFlashActive && (
                <div className="mb-6 sf-accent-text">
                  <FlashTimer expiry={productFlashEndIso(product)!} />
                </div>
              )}

              <h1 className="sf-heading text-2xl md:text-4xl font-black text-gray-900 mb-4 leading-[1.1] tracking-tight uppercase italic">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4">
                {isFlashActive ? (
                  <div className="flex items-center gap-3">
                    <p className="sf-price text-3xl font-black tracking-tighter">
                      ₦ {(productFlashPriceNumber(product) ?? product.price).toLocaleString()}
                    </p>
                    <p className="text-sm font-bold text-gray-400 line-through tracking-tighter decoration-red-500/50 decoration-2">
                      ₦ {product.price.toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <p className="sf-price text-3xl font-black tracking-tighter">₦ {product.price.toLocaleString()}</p>
                )}

                <span
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${
                    isStockAvailable
                      ? "border-[color:var(--sf-accent-soft)] bg-[var(--sf-accent-softer)] sf-accent-text"
                      : "bg-red-50 text-red-700 border-red-100"
                  }`}
                >
                  {isStockAvailable ? `${product.stock_quantity} IN STOCK` : "OUT OF STOCK"}
                </span>
              </div>
            </div>

            <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 mb-6 relative">
              <div className="absolute -top-3 left-8 bg-white px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 border border-gray-100 rounded-full shadow-sm">
                Product Intel
              </div>
              <div className="prose prose-sm text-gray-600 leading-relaxed font-bold uppercase text-xs">
                <p className="whitespace-pre-line">{product.description || "No detailed description provided for this item."}</p>
              </div>
            </div>

            <div className="mb-6 flex items-center gap-4 rounded-[2rem] border border-[color:var(--sf-accent-soft)] bg-[var(--sf-accent-softer)] p-4 transition-colors group hover:bg-[var(--sf-accent-soft)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/60 bg-white shadow-sm sf-accent-text transition-transform group-hover:scale-110">
                <MapPin size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-[10px] font-black uppercase leading-none tracking-[0.2em] text-gray-500">Ships From</p>
                <p className="text-base font-black tracking-tight text-gray-900">
                  {displayLocationFull({
                    location: store.location,
                    location_city: store.location_city,
                    location_state: store.location_state,
                    location_country: store.location_country,
                    location_country_code: store.location_country_code,
                  }) || compactSellerRegion(store)}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <AddToCartButton product={product} store={store} />
            </div>

            {store.loyalty_enabled && potentialReward > 0 && (
              <div className="mb-10 bg-amber-500 text-white rounded-[2.5rem] p-6 flex items-center justify-between shadow-2xl shadow-amber-200 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="flex items-center gap-5">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                    <Coins size={28} className="text-white fill-white/20" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80 leading-none mb-1.5">Store Coin reward</p>
                    <p className="text-xl font-black tracking-tighter">Earn +₦{potentialReward.toLocaleString()} Coins</p>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end">
                  <div className="flex items-center gap-1 bg-white text-amber-600 px-3 py-1 rounded-full text-[10px] font-black shadow-sm uppercase tracking-tighter">
                    <Zap size={10} fill="currentColor" /> {store.loyalty_percentage}% BACK
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-start gap-4 hover:border-blue-200 transition-colors">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Truck size={20} />
                </div>
                <div>
                  <h3 className="font-black text-xs text-gray-900 mb-1 uppercase tracking-widest">Naija Delivery</h3>
                  <p className="text-[11px] text-gray-500 font-bold leading-snug uppercase tracking-tight">
                    Reach out to {store.name} for delivery rates after secure checkout.
                  </p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-start gap-4 hover:border-amber-200 transition-colors">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="font-black text-xs text-gray-900 mb-1 uppercase tracking-widest">Verified Vendor</h3>
                  <p className="text-[11px] text-gray-500 font-bold leading-snug uppercase tracking-tight">
                    Order confirmation and receipt are generated as soon as your payment is confirmed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {moreFromSeller.length > 0 && (
          <section className="mx-auto mt-16 w-full max-w-6xl pb-8 md:mt-24">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight">More from this seller</h2>
              </div>
              {store.slug ? (
                <Link
                  href={`/${store.slug}`}
                  className="text-[10px] font-black uppercase tracking-widest sf-accent-text hover:underline shrink-0"
                >
                  View store
                </Link>
              ) : null}
            </div>
            <ProductMoreFromSellerGrid products={moreFromSeller} store={store} />
          </section>
        )}
      </main>

      <footer className="bg-gray-50 border-t border-gray-100 py-12 md:py-20 text-center mt-12">
        <div className="flex justify-center items-center gap-8 mb-10">
          <div className="flex flex-col items-center gap-3 opacity-30">
            <ShieldCheck size={32} className="text-gray-900" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Safe Shop</span>
          </div>
          <div className="w-px h-10 bg-gray-200"></div>
          <div className="flex flex-col items-center gap-3 opacity-30">
            <Package size={32} className="text-gray-900" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Quality Check</span>
          </div>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity duration-500"
        >
          <LayoutDashboard size={20} className="sf-accent-text" />
          <span className="font-black text-gray-900 uppercase tracking-widest text-sm">StoreLink social engine</span>
        </Link>
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.4em] mt-6">Secure Cloud Infrastructure • 2025</p>
      </footer>
    </div>
  );
}
