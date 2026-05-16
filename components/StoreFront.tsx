"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Info,
  ShoppingBag,
  X,
  Instagram,
  Package,
  Phone,
  LayoutDashboard,
  ChevronRight,
  BadgeCheck,
  Gem,
  Music2,
  Copy,
} from "lucide-react";
import { compactSellerRegion } from "@/lib/displayRegion";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM, TOUCH_TARGET } from "@/lib/mobileLayout";
import type { Store } from "@/types";
import { useCart } from "@/context/CartContext";
import { isFlashDropCandidate, isProductFlashDropActive, productDisplayPrice } from "@/lib/productFlashDrop";
import { normalizeStorefrontTheme, themeToCssVars, storefrontFontClass } from "@/lib/storefrontTheme";
import { prepareStorefrontProductRows } from "@/lib/storefrontCatalogOrder";
import { isStorefrontMerchFlagOn } from "@/lib/storefrontMerchFlags";
import type { StorefrontLayoutPreset } from "@/lib/storefrontMiniSite";
import ProductGridSkeleton from "@/components/storefront/public/ProductGridSkeleton";
import StorefrontHeroSection, { CATALOG_ANCHOR } from "@/components/storefront/public/sections/StorefrontHeroSection";
import StorefrontBestSellersSection from "@/components/storefront/public/sections/StorefrontBestSellersSection";
import StorefrontNewArrivalsSection from "@/components/storefront/public/sections/StorefrontNewArrivalsSection";
import StorefrontFlashDropsSection from "@/components/storefront/public/sections/StorefrontFlashDropsSection";
import StorefrontCatalogToolbarSection from "@/components/storefront/public/sections/StorefrontCatalogToolbarSection";
import StorefrontCatalogProductCard from "@/components/storefront/public/StorefrontCatalogProductCard";
import type { StorefrontBlockPublic } from "@/components/storefront/public/storefrontPublicTypes";
import { cn } from "@/lib/utils";
import { sellerStorefrontTenantUrl } from "@/lib/storefrontPublicUrl";

export type { StorefrontBlockPublic } from "@/components/storefront/public/storefrontPublicTypes";

const VerificationBadge = ({ store }: { store: Store }) => (
  <span className="inline-flex items-center gap-1 align-middle">
    {store.verification_status === "verified" && <BadgeCheck size={16} className="fill-blue-50 text-blue-500" />}
    {store.subscription_plan === "diamond" && <Gem size={16} className="fill-purple-50 text-purple-600" />}
  </span>
);

interface StoreFrontProps {
  store: Store;
  products: any[];
  categories: { id: string; name: string }[];
  storefrontBlocks?: StorefrontBlockPublic[];
}

export default function StoreFront({
  store,
  products: initialProducts,
  categories,
  storefrontBlocks = [],
}: StoreFrontProps) {
  const { addToCart, cartCount, setIsCartOpen, isCartOpen } = useCart();
  const initialProductsRef = useRef(initialProducts);

  const [products, setProducts] = useState(initialProducts);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const [isJumping, setIsJumping] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  const theme = normalizeStorefrontTheme(store.storefront_theme);
  const layout: StorefrontLayoutPreset = theme.layout;
  const isMinimal = layout === "minimal";
  const isHeroFeaturedLayout = layout === "hero_featured";
  const isEditorial = layout === "editorial";

  useEffect(() => {
    initialProductsRef.current = initialProducts;
    setProducts(initialProducts);
  }, [initialProducts]);

  const newArrivals = useMemo(() => {
    return [...products]
      .filter((p) => isStorefrontMerchFlagOn((p as { storefront_new_arrival?: unknown }).storefront_new_arrival))
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, 12);
  }, [products]);

  const bestSelling = useMemo(() => {
    return [...products]
      .filter((p) =>
        isStorefrontMerchFlagOn((p as { storefront_best_seller?: unknown }).storefront_best_seller),
      )
      .sort((a, b) => {
        const pa = Boolean(a.pinned_at);
        const pb = Boolean(b.pinned_at);
        if (pa !== pb) return pb ? 1 : -1;
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      })
      .slice(0, 12);
  }, [products]);

  /** Includes expired-but-configured rows so the flash strip can count down and disappear client-side. */
  const flashDropCandidates = useMemo(
    () => products.filter((p) => isFlashDropCandidate(p)).slice(0, 12),
    [products],
  );

  const [trendingProduct, setTrendingProduct] = useState<(typeof products)[0] | null>(null);
  const trendingPickedRef = useRef(false);
  useEffect(() => {
    if (trendingPickedRef.current) return;
    trendingPickedRef.current = true;
    const pool = initialProductsRef.current.filter((p) => Number(p.stock_quantity) > 0);
    if (!pool.length) {
      setTrendingProduct(null);
      return;
    }
    const idx = Math.floor(Math.random() * pool.length);
    setTrendingProduct(pool[idx]);
  }, []);

  const showNewRow = newArrivals.length > 0;
  /** Best-sellers strip stays visible on minimal layout (hero/catalog stay tight; merch strip uses `dense`). */
  const showBestSellingRow = bestSelling.length > 0;
  /** Flash strip matches best sellers: visible on minimal layout too (`dense` on section). */
  const showFlashRow = flashDropCandidates.length > 0;
  const showTrendingRow = Boolean(trendingProduct) && !isMinimal;
  const handleCopyLink = () => {
    if (!store?.slug) return;
    navigator.clipboard.writeText(sellerStorefrontTenantUrl(store.slug));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const prev = lastScrollYRef.current;
      if (currentScrollY > prev && currentScrollY > 100) setIsVisible(false);
      else setIsVisible(true);
      lastScrollYRef.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const fetchStoreProducts = async () => {
      if (activeCategory === "All" && !debouncedSearch) {
        setProducts(initialProductsRef.current);
        setLoading(false);
        return;
      }

      setLoading(true);

      let query = supabase
        .from("storefront_products")
        .select("*")
        .eq("seller_id", store.owner_id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (activeCategory !== "All") {
        const cat = categories.find((c) => c.name === activeCategory);
        if (!cat?.id) {
          setProducts([]);
          setLoading(false);
          return;
        }
        query = query.eq("category_id", cat.id);
      }

      if (debouncedSearch) {
        query = query.ilike("name", `%${debouncedSearch}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Filter Error:", error.message || JSON.stringify(error));
        setProducts([]);
      } else {
        setProducts(
          prepareStorefrontProductRows(data || [], {
            hideOutOfStock: theme.hide_out_of_stock,
            shuffleUnpinned: false,
          }),
        );
      }

      setLoading(false);
    };

    void fetchStoreProducts();
  }, [activeCategory, debouncedSearch, store.owner_id, categories, theme.hide_out_of_stock]);

  const handleAddToCart = (product: any) => {
    if (isProductFlashDropActive(product)) {
      const audio = new Audio("/sounds/empire-drop.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 600);
    addToCart(product, store);
  };

  const displayedProducts = products.slice(0, visibleCount);
  const heroFeaturedEligible = isHeroFeaturedLayout && activeCategory === "All" && !debouncedSearch && displayedProducts.length > 0;

  return (
    <div
      id="seller-storefront"
      className={cn(
        "storefront-root flex min-h-dvh flex-col bg-white selection:bg-[var(--sf-accent-soft)] selection:text-[var(--sf-accent-foreground)]",
        theme.font === "sans" ? "font-sans" : storefrontFontClass(theme.font),
        STOREFRONT_SAFE_BOTTOM,
      )}
      style={themeToCssVars(theme)}
      data-sf-layout={layout}
      data-sf-font={theme.font}
    >
      <nav
        aria-label="Storefront identity"
        className={cn(
          "sticky top-0 z-40 flex items-center justify-between gap-2 border-b border-gray-100 bg-white/90 shadow-sm backdrop-blur-xl",
          isMinimal ? "h-14" : "h-16",
          STOREFRONT_GUTTER_X,
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-1">
            <LayoutDashboard size={18} className="sf-accent-text" />
            <span className="hidden font-black uppercase tracking-tighter text-gray-900 md:block md:text-[10px]">StoreLink</span>
          </Link>
          <span className="shrink-0 text-gray-200 font-thin text-xl">/</span>
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-inner">
            {store.logo_url ? (
              <Image src={store.logo_url} alt="" fill className="object-cover" unoptimized />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-900 text-sm font-black text-white">{store.name.charAt(0)}</div>
            )}
          </div>
          <h1
            className={cn(
              "sf-heading min-w-0 flex-1 truncate text-sm tracking-tight text-gray-900 md:text-base",
              isEditorial ? "font-semibold normal-case" : "font-bold",
            )}
          >
            {store.name} <VerificationBadge store={store} />
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleCopyLink}
            className={cn("rounded-full p-2 text-gray-600 transition hover:bg-gray-100 active:scale-90", TOUCH_TARGET)}
            aria-label={copied ? "Link copied" : "Copy shop link"}
            title="Copy shop link"
          >
            <Copy size={20} className={copied ? "text-emerald-600" : ""} />
          </button>
          <button
            onClick={() => setIsInfoOpen(true)}
            type="button"
            className={cn("rounded-full p-2 text-gray-600 transition hover:bg-gray-100 active:scale-90", TOUCH_TARGET)}
            aria-label="About this shop"
          >
            <Info size={20} />
          </button>
        </div>
      </nav>

      {theme.banner_secondary_url ? (
        <div className="relative h-16 w-full border-b border-gray-100 bg-gray-100 md:h-20">
          <Image src={theme.banner_secondary_url} alt="" fill className="object-cover" unoptimized />
        </div>
      ) : null}

      <StorefrontHeroSection
        storefrontBlocks={storefrontBlocks}
        accent={theme.accent}
        font={theme.font}
        logoUrl={store.logo_url}
        storeSlug={store.slug}
        fallbackStoreName={store.name}
        fallbackTagline={store.description}
        dense={isMinimal}
        editorial={isEditorial}
      />

      {showNewRow ? (
        <StorefrontNewArrivalsSection
          products={newArrivals}
          store={store}
          onAddToCart={handleAddToCart}
          dense={isMinimal}
          editorial={isEditorial}
        />
      ) : null}

      {showBestSellingRow ? (
        <div className={cn(!showNewRow && "pt-8 md:pt-14")}>
          <StorefrontBestSellersSection
            products={bestSelling}
            store={store}
            onAddToCart={handleAddToCart}
            dense={isMinimal}
            editorial={isEditorial}
          />
        </div>
      ) : null}

      {showFlashRow ? <StorefrontFlashDropsSection products={flashDropCandidates} dense={isMinimal} editorial={isEditorial} /> : null}

      {showTrendingRow && trendingProduct ? (
        <section aria-label="Trending now" className="border-b border-gray-200 bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 py-10 md:py-14">
          <div className={cn("mx-auto max-w-7xl", STOREFRONT_GUTTER_X)}>
            <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/45">Trending now</p>
                <h2
                  className={cn(
                    "sf-heading mt-1 text-xl text-white md:text-2xl",
                    isEditorial ? "font-semibold normal-case tracking-tight" : "font-black uppercase tracking-tight",
                  )}
                >
                  One pick shoppers see first
                </h2>
              </div>
            </div>
            <Link
              href={`/product/${trendingProduct.id}`}
              className="group mx-auto flex max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl ring-1 ring-white/10 backdrop-blur-md transition hover:border-white/20 md:flex-row"
            >
              <div className="relative aspect-[4/3] w-full bg-zinc-900 md:aspect-auto md:w-1/2 md:min-h-[280px]">
                {trendingProduct.image_urls?.[0] ? (
                  <Image
                    src={trendingProduct.image_urls[0]}
                    alt={trendingProduct.name || ""}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full min-h-[200px] items-center justify-center text-zinc-600">
                    <Package size={40} />
                  </div>
                )}
                <span className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur">
                  Trending
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-center gap-4 p-6 md:p-10">
                <h3 className="text-balance text-2xl leading-tight text-white md:text-3xl">
                  <span
                    className={cn(
                      isEditorial ? "font-semibold normal-case tracking-tight" : "font-black uppercase tracking-tight",
                    )}
                  >
                    {trendingProduct.name}
                  </span>
                </h3>
                <p className="sf-price text-3xl font-black text-emerald-300">
                  ₦{productDisplayPrice({ ...trendingProduct, price: Number(trendingProduct.price) }).toLocaleString()}
                </p>
                <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-900">
                  View product <ChevronRight size={14} />
                </span>
              </div>
            </Link>
          </div>
        </section>
      ) : null}

      <StorefrontCatalogToolbarSection
        catalogAnchorId={CATALOG_ANCHOR}
        categories={categories}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        activeCategory={activeCategory}
        onActiveCategoryChange={setActiveCategory}
        isMinimal={isMinimal}
        editorial={isEditorial}
        toolbarVisible={isVisible}
      />

      <main aria-label="Product catalog" className="flex-1 bg-white">
        <div
          className={cn(
            "mx-auto max-w-7xl",
            isMinimal ? "py-5 md:py-8" : isEditorial ? "py-8 md:py-14" : "py-6 md:py-10",
            STOREFRONT_GUTTER_X,
          )}
        >
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div
              className={cn(
                "grid gap-3 md:gap-6",
                heroFeaturedEligible ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-4" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
              )}
            >
              {displayedProducts.map((product, index) => {
                const featured = heroFeaturedEligible && index === 0;

                return (
                  <StorefrontCatalogProductCard
                    key={product.id}
                    product={product}
                    store={store}
                    featured={featured}
                    isMinimal={isMinimal}
                    editorial={isEditorial}
                    onAddToCart={handleAddToCart}
                  />
                );
              })}
            </div>
          )}

          {visibleCount < products.length && !loading ? (
            <div className="mt-12 pb-10 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((p) => p + 20)}
                className="sf-load-more rounded-2xl border-2 px-10 py-4 text-xs font-black uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95"
              >
                Load more products
              </button>
            </div>
          ) : null}

          {!loading && products.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <Package size={40} className="mb-2 text-gray-100" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No products in this view</p>
              <p className="mt-2 max-w-sm text-xs font-medium text-gray-500">Try another category or clear your search.</p>
            </div>
          ) : null}
        </div>
      </main>

      <footer
        aria-label="Storefront footer"
        className="mt-auto border-t border-gray-800 bg-gradient-to-b from-gray-950 via-gray-900 to-black py-14 text-center text-white"
      >
        <div className={cn("mx-auto max-w-3xl space-y-6", STOREFRONT_GUTTER_X)}>
          <p className="font-mono text-4xl font-black uppercase tracking-tighter text-white md:text-6xl">{store.slug}</p>
          {(store.description || "").trim() ? (
            <p className="mx-auto max-w-xl text-sm font-medium leading-relaxed text-white/70">
              {(store.description || "").trim().slice(0, 220)}
              {(store.description || "").trim().length > 220 ? "…" : ""}
            </p>
          ) : (
            <p className="text-sm font-medium text-white/50">StoreLink mini-site</p>
          )}
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400/90">
            {products.length} product{products.length === 1 ? "" : "s"} in this catalog
          </p>
          <div className="border-t border-white/10 pt-8">
            <Link href="/" className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 transition hover:text-white">
              Powered by StoreLink
            </Link>
            <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.35em] text-white/35">Secure checkout · {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>

      {cartCount > 0 && !isCartOpen && (
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className={cn(
            "sf-btn-accent fixed bottom-6 right-6 z-50 rounded-2xl p-4 text-white shadow-2xl transition-all active:scale-90",
            isJumping ? "animate-bounce" : "animate-in zoom-in hover:scale-110",
          )}
        >
          <ShoppingBag size={24} />
          <span className="sf-bg-accent absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full border-2 border-white text-[10px] font-black text-white shadow-sm">
            {cartCount}
          </span>
        </button>
      )}

      {isInfoOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <button type="button" className="absolute inset-0" aria-label="Close" onClick={() => setIsInfoOpen(false)} />
          <div className="relative flex h-full w-full max-w-sm flex-col overflow-y-auto rounded-l-[2rem] bg-white shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="relative h-36 w-full shrink-0 overflow-hidden bg-gray-900">
              {store.cover_image_url ? (
                <Image src={store.cover_image_url} alt="" fill className="object-cover" unoptimized />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-6 right-6 flex items-end justify-between gap-2">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-lg">
                  {store.logo_url ? (
                    <Image src={store.logo_url} alt="" fill className="object-cover" unoptimized />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gray-900 text-lg font-black text-white">
                      {store.name.charAt(0)}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsInfoOpen(false)}
                  className="rounded-full bg-white/90 p-2 shadow-md backdrop-blur"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-8 pt-6">
            <div className="mb-6 text-center">
              <h3 className="sf-heading flex items-center justify-center gap-1 text-xl font-black uppercase tracking-tighter text-gray-900">
                {store.name} <VerificationBadge store={store} />
              </h3>
              <p className="mt-1 flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <MapPin size={12} className="sf-accent-text" /> {compactSellerRegion(store)}
              </p>
            </div>

            <div className="mb-8 rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <p className="text-center text-sm font-medium italic text-gray-600">
                &ldquo;{store.description || "Welcome to our store — thanks for visiting on StoreLink."}&rdquo;
              </p>
            </div>

            <div className="mt-auto space-y-3">
              <h4 className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Connect</h4>

              {store.whatsapp_number ? (
                <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-4">
                  <div className="sf-bg-accent rounded-lg p-2 text-white">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest sf-accent-text">Business chat</p>
                    <p className="text-sm font-bold text-gray-900">{store.whatsapp_number}</p>
                  </div>
                </div>
              ) : null}

              {store.instagram_handle ? (
                <a
                  href={`https://instagram.com/${store.instagram_handle.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-4 text-xs font-bold uppercase tracking-widest transition active:scale-95"
                >
                  <span className="flex items-center gap-3">
                    <Instagram size={18} className="text-pink-600" /> Instagram
                  </span>
                  <ChevronRight size={14} className="text-gray-400" />
                </a>
              ) : null}

              {store.tiktok_url ? (
                <a
                  href={store.tiktok_url.startsWith("http") ? store.tiktok_url : `https://tiktok.com/@${store.tiktok_url.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-4 text-xs font-bold uppercase tracking-widest transition active:scale-95"
                >
                  <span className="flex items-center gap-3">
                    <Music2 size={18} className="text-black" /> TikTok
                  </span>
                  <ChevronRight size={14} className="text-gray-400" />
                </a>
              ) : null}
            </div>
            <p className="mt-8 text-center text-[9px] font-black text-gray-300">Shop link: {store.slug}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
