import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/shared/AddToCartButton";
import ProductHeader from "@/components/shared/ProductHeader";
import ProductGallery from "@/components/shared/ProductGallery";
import FlashTimer from "@/components/shared/FlashTimer";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, ShieldCheck, MapPin, Truck, Zap, Package, Coins } from "lucide-react";
import {
  PROFILE_STOREFRONT_SELECT,
  profileRowToLegacyStoreShape,
  type ProfileStorefrontRow,
} from "@/lib/profileAsStorefront";
import { compactSellerRegion, displayLocationFull } from "@/lib/displayRegion";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { data: product } = await supabase.from("storefront_products").select("*").eq("id", params.id).single();

  if (!product) return { title: "Product Not Found" };

  const p: any = product;
  const [{ data: profile }, { data: legacyStore }] = await Promise.all([
    supabase.from("profiles").select("display_name, full_name").eq("id", p.seller_id).maybeSingle(),
    supabase.from("stores").select("name").eq("owner_id", p.seller_id).maybeSingle(),
  ]);
  const storeName =
    profile?.full_name?.trim() || profile?.display_name?.trim() || legacyStore?.name?.trim() || "Store";

  const isFlashActive = p.flash_drop_expiry && new Date(p.flash_drop_expiry) > new Date();
  const displayPrice = isFlashActive ? p.flash_drop_price : p.price;

  return {
    title: `${p.name} - ₦${displayPrice.toLocaleString()} | StoreLink`,
    description: p.description || `Buy ${p.name} from ${storeName} on StoreLink.`,
    openGraph: {
      title: `${p.name} | ${storeName}`,
      description: `Price: ₦${displayPrice.toLocaleString()}. Checkout securely on StoreLink.`,
      images: p.image_urls || [],
    },
  };
}

export default async function ProductPage(props: PageProps) {
  const params = await props.params;
  const { data: product } = await supabase.from("storefront_products").select("*").eq("id", params.id).single();

  if (!product) return notFound();

  const [{ data: profile }, { data: legacyStore }] = await Promise.all([
    supabase.from("profiles").select(`${PROFILE_STOREFRONT_SELECT}, account_status`).eq("id", product.seller_id).maybeSingle(),
    supabase.from("stores").select("*, owner_email").eq("owner_id", product.seller_id).maybeSingle(),
  ]);

  if (!profile && !legacyStore) return notFound();

  const store = profile
    ? profileRowToLegacyStoreShape(profile as ProfileStorefrontRow, {
        legacyStoreId: legacyStore?.id ?? null,
        ownerEmail: legacyStore?.owner_email ?? null,
      })
    : legacyStore!;

  const isStockAvailable = product.stock_quantity > 0;
  const isFlashActive = product.flash_drop_expiry && new Date(product.flash_drop_expiry) > new Date();

  const currentPrice = isFlashActive ? product.flash_drop_price : product.price;
  const potentialReward = store.loyalty_enabled
    ? Math.floor(currentPrice * ((store.loyalty_percentage || 0) / 100))
    : 0;

  const { data: moreRows } = await supabase
    .from("storefront_products")
    .select("id, name, price, image_urls, stock_quantity, flash_drop_expiry, flash_drop_price")
    .eq("seller_id", product.seller_id)
    .eq("is_active", true)
    .neq("id", product.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const moreFromSeller = moreRows || [];

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <ProductHeader storeSlug={store.slug} storeLogo={store.logo_url} />

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          <div className="relative">
            <ProductGallery images={product.image_urls || [product.image_url]} stockCount={product.stock_quantity} />
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-8">
              {isFlashActive && (
                <div className="mb-6 text-emerald-600">
                  <FlashTimer expiry={product.flash_drop_expiry} />
                </div>
              )}

              <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-4 leading-[1.1] tracking-tight uppercase italic">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4">
                {isFlashActive ? (
                  <div className="flex items-center gap-3">
                    <p className="text-3xl font-black text-emerald-600 tracking-tighter">
                      ₦ {product.flash_drop_price.toLocaleString()}
                    </p>
                    <p className="text-sm font-bold text-gray-400 line-through tracking-tighter decoration-red-500/50 decoration-2">
                      ₦ {product.price.toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-3xl font-black text-emerald-600 tracking-tighter">₦ {product.price.toLocaleString()}</p>
                )}

                <span
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${
                    isStockAvailable
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
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

            <div className="mb-6 flex items-center gap-4 p-4 bg-emerald-50/30 rounded-[2rem] border border-emerald-100/50 group transition-all hover:bg-emerald-50">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-600 border border-emerald-50 group-hover:scale-110 transition-transform">
                <MapPin size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black text-emerald-800/50 uppercase tracking-[0.2em] leading-none mb-1">Ships From</p>
                <p className="text-base font-black text-emerald-900 tracking-tight">
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
          <section className="max-w-6xl mx-auto w-full px-4 md:px-12 mt-16 md:mt-24 pb-8">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight">More from this seller</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Up to 10 recent listings</p>
              </div>
              {store.slug ? (
                <Link
                  href={`/${store.slug}`}
                  className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:underline shrink-0"
                >
                  View store
                </Link>
              ) : null}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
              {moreFromSeller.map((p: { id: string; name: string; price: number; image_urls?: string[]; stock_quantity?: number; flash_drop_expiry?: string | null; flash_drop_price?: number | null }) => {
                const flash = p.flash_drop_expiry && new Date(p.flash_drop_expiry) > new Date();
                const showPrice = flash && p.flash_drop_price != null ? p.flash_drop_price : p.price;
                const img = p.image_urls?.[0];
                return (
                  <Link
                    key={p.id}
                    href={`/product/${p.id}`}
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:border-emerald-200 hover:shadow-md transition-all"
                  >
                    <div className="relative aspect-square bg-gray-50">
                      {img ? (
                        <Image src={img} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-200">
                          <Package size={28} />
                        </div>
                      )}
                      {p.stock_quantity === 0 && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                          <span className="text-[9px] font-black uppercase text-red-600">Sold out</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight line-clamp-2 min-h-[2.5rem]">{p.name}</p>
                      <p className="text-sm font-black text-emerald-700 mt-2">₦{Number(showPrice).toLocaleString()}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
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
          <LayoutDashboard size={20} className="text-emerald-600" />
          <span className="font-black text-gray-900 uppercase tracking-widest text-sm">StoreLink social engine</span>
        </Link>
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.4em] mt-6">Secure Cloud Infrastructure • 2025</p>
      </footer>
    </div>
  );
}
