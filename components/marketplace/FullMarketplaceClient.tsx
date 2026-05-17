"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link"; 
import {
  Search,
  Package,
  Filter,
  Loader2,
  CheckCircle,
  Plus,
  ShoppingBag,
  BadgeCheck,
  Gem,
  Zap,
  TrendingUp,
  Sparkles,
  Store,
} from "lucide-react"; 
import { useCart } from "@/context/CartContext";
import { effectiveSellerTier } from "@/utils/marketplaceDiscovery";
import {
  attachStoresToProducts,
  dropProductsWithoutStore,
  fetchMergedStoreRowsForSellerIds,
} from "@/lib/storefrontCatalogMerge";
import { compactSellerRegion } from "@/lib/displayRegion";
import {
  isProductFlashDropActive,
  productDisplayPrice,
  productFlashPriceNumber,
} from "@/lib/productFlashDrop";
import { expandMarketplaceSearch, MARKETPLACE_SUGGESTED_SEARCHES } from "@/lib/marketplaceSearchExpand";
import MarketplaceTrackedProductLink from "@/components/marketplace/MarketplaceTrackedProductLink";

interface FullMarketplaceClientProps {
  initialProducts: any[];
  categories: { id: string; name: string; slug: string }[];
  initialFeedEmpty: boolean;
}

export default function FullMarketplaceClient({ initialProducts, categories, initialFeedEmpty }: FullMarketplaceClientProps) {
  const { addToCart, cartCount, setIsCartOpen } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const BATCH_SIZE = 40;

  const userAdjustedFilters = useRef(false);
  const urlInitRan = useRef(false);

  const [viewerId, setViewerId] = useState<string | null>(null);
  const [viewerLat, setViewerLat] = useState<number | null>(null);
  const [viewerLon, setViewerLon] = useState<number | null>(null);

  const viewerRpc = useMemo(
    () => ({
      p_viewer_id: viewerId,
      p_viewer_latitude: viewerLat,
      p_viewer_longitude: viewerLon,
    }),
    [viewerId, viewerLat, viewerLon],
  );

  // --- CORE STATES ---
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length >= BATCH_SIZE);
  const [page, setPage] = useState(Math.max(1, Math.ceil(initialProducts.length / BATCH_SIZE)));
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); 
  const [selectedCategory, setSelectedCategory] = useState("all"); 
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: "" });
  const [flashOnly, setFlashOnly] = useState(false); 
  const [isJumping, setIsJumping] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  // --- SCROLL HANDLER (Optimized) ---
  useEffect(() => {
    let lastScroll = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          if (Math.abs(currentScrollY - lastScroll) < 15) {
            ticking = false;
            return;
          }

          if (currentScrollY > lastScroll && currentScrollY > 120) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
          lastScroll = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); 
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    void supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) setViewerId(data.user?.id ?? null);
    });
    if (typeof navigator === "undefined" || !navigator.geolocation) return () => { cancelled = true; };
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (cancelled) return;
        setViewerLat(pos.coords.latitude);
        setViewerLon(pos.coords.longitude);
      },
      () => {},
      { enableHighAccuracy: false, maximumAge: 600_000, timeout: 12_000 },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (urlInitRan.current) return;
    urlInitRan.current = true;
    const q = searchParams.get("q")?.trim() || "";
    const cat = searchParams.get("category")?.trim() || "all";
    const flash = searchParams.get("flash") === "1";
    if (q) setSearch(q);
    if (cat !== "all" && categories.some((c) => c.slug === cat)) setSelectedCategory(cat);
    if (flash) setFlashOnly(true);
  }, [searchParams, categories]);

  useEffect(() => {
    if (!userAdjustedFilters.current) return;
    const next = new URLSearchParams();
    if (debouncedSearch.trim()) next.set("q", debouncedSearch.trim());
    if (selectedCategory !== "all") next.set("category", selectedCategory);
    if (flashOnly) next.set("flash", "1");
    const qs = next.toString();
    const href = qs ? `${pathname}?${qs}` : pathname;
    router.replace(href, { scroll: false });
  }, [debouncedSearch, selectedCategory, flashOnly, pathname, router]);

  const markFilterInteraction = useCallback(() => {
    userAdjustedFilters.current = true;
  }, []);

  const trendingDrops = useMemo(() => {
    const now = new Date();
    return products.filter((p) => isProductFlashDropActive(p, now)).slice(0, 8);
  }, [products]);

  const handleAddToCart = (product: any) => {
    const isFlashActive = isProductFlashDropActive(product);
    if (isFlashActive) {
      const audio = new Audio('/sounds/empire-drop.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => null);
    }
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 600);
    const storeData = {
        id: product.stores?.id,
        name: product.stores?.name,
        slug: product.stores?.slug,
        whatsapp_number: product.stores?.whatsapp_number || "", 
    };
    addToCart(product, storeData as any);
    setToast({ show: true, msg: `Added ${product.name} to bag` });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  const rankStore = (stores?: {
    subscription_plan?: string | null;
    subscription_expiry?: string | null;
    subscription_status?: string | null;
  }) => {
    return effectiveSellerTier(stores?.subscription_plan, stores?.subscription_expiry, stores?.subscription_status) === "diamond" ? 2 : 1;
  };

  useEffect(() => {
    const mergeProductRows = async (rows: any[] | null) => {
      const list = rows || [];
      const sellerIds = [...new Set(list.map((p: { seller_id?: string }) => p.seller_id).filter(Boolean))] as string[];
      if (sellerIds.length === 0) return [];
      const storeRows = await fetchMergedStoreRowsForSellerIds(supabase, sellerIds);
      const merged = attachStoresToProducts(list, storeRows);
      return dropProductsWithoutStore(merged);
    };

    const fetchFiltered = async () => {
      if (selectedCategory === "all" && !debouncedSearch && !flashOnly) {
        setFetchError(null);
        setProducts(initialProducts);
        setHasMore(initialProducts.length >= BATCH_SIZE);
        setPage(Math.max(1, Math.ceil(initialProducts.length / BATCH_SIZE)));
        return;
      }

      setLoading(true);
      setPage(1);
      setFetchError(null);

      const categoryName = selectedCategory !== "all" ? categories.find((c) => c.slug === selectedCategory)?.name || null : null;
      if (selectedCategory !== "all" && !categoryName) {
        setProducts([]);
        setHasMore(false);
        setLoading(false);
        return;
      }

      const rpcBase = {
        p_limit: BATCH_SIZE,
        p_offset: 0,
        p_category: categoryName,
        p_flash_only: flashOnly,
        ...viewerRpc,
      };

      let dataRows: any[] | null = null;

      if (debouncedSearch.trim()) {
        const { primary, alternatives } = expandMarketplaceSearch(debouncedSearch);
        const { data: primaryData, error: e0 } = await supabase.rpc("get_storefront_marketplace_products", {
          ...rpcBase,
          p_search: primary,
        });
        if (e0) {
          console.error(e0);
          setFetchError("Could not refresh search results. Check your connection and try again.");
          setProducts([]);
          setHasMore(false);
          setLoading(false);
          return;
        }
        const byId = new Map<string, any>();
        for (const row of primaryData || []) {
          byId.set(row.id, row);
        }
        if (alternatives.length) {
          const extraResults = await Promise.all(
            alternatives.map((term) =>
              supabase.rpc("get_storefront_marketplace_products", {
                ...rpcBase,
                p_search: term,
              }),
            ),
          );
          for (const ex of extraResults) {
            if (ex.error) continue;
            for (const row of ex.data || []) {
              if (!byId.has(row.id)) byId.set(row.id, row);
            }
          }
        }
        dataRows = [...byId.values()].sort(
          (a, b) => Number(b.ranking_score ?? 0) - Number(a.ranking_score ?? 0),
        );
      } else {
        const { data, error: e1 } = await supabase.rpc("get_storefront_marketplace_products", {
          ...rpcBase,
          p_search: null,
        });
        if (e1) {
          console.error(e1);
          setFetchError("Could not load marketplace products. Try again shortly.");
          setProducts([]);
          setHasMore(false);
          setLoading(false);
          return;
        }
        dataRows = data;
      }

      const merged = await mergeProductRows(dataRows);
      let processed = merged;

      if (debouncedSearch) {
        processed = processed.sort((a, b) => rankStore(b.stores) - rankStore(a.stores));
      }

      setProducts(processed);
      setFetchError(null);
      setHasMore(Boolean((dataRows?.length ?? 0) >= BATCH_SIZE));
      setLoading(false);
    };

    fetchFiltered();
  }, [selectedCategory, debouncedSearch, flashOnly, initialProducts, categories, BATCH_SIZE, viewerRpc]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const from = page * 40;

    const categoryName = selectedCategory !== "all" ? categories.find((c) => c.slug === selectedCategory)?.name || null : null;
    if (selectedCategory !== "all" && !categoryName) {
      setHasMore(false);
      setLoading(false);
      return;
    }
    const { primary } = expandMarketplaceSearch(debouncedSearch);
    const searchForPaging = debouncedSearch.trim() ? primary : null;

    const { data: newProducts, error: pageErr } = await supabase.rpc("get_storefront_marketplace_products", {
      p_limit: BATCH_SIZE,
      p_offset: from,
      p_category: categoryName,
      p_search: searchForPaging,
      p_flash_only: flashOnly,
      ...viewerRpc,
    });
    if (pageErr) {
      console.error(pageErr);
      setFetchError("Could not load more products.");
      setHasMore(false);
      setLoading(false);
      return;
    }
    if (newProducts && newProducts.length > 0) {
      const sellerIds = [...new Set(newProducts.map((p: { seller_id?: string }) => p.seller_id).filter(Boolean))] as string[];
      const storeRows = await fetchMergedStoreRowsForSellerIds(supabase, sellerIds);
      const merged = attachStoresToProducts(newProducts, storeRows);
      const joined = dropProductsWithoutStore(merged);
      setProducts((prev) => [...prev, ...joined]);
      setPage((prev) => prev + 1);
      setHasMore(newProducts.length >= BATCH_SIZE);
      setFetchError(null);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-10 bg-gray-50/30 min-h-screen">
      
      {/* ERROR TOAST */}
      {fetchError && (
        <div className="mb-6 flex items-start justify-between gap-3 rounded-2xl border border-red-100 bg-red-50/80 px-4 py-4 backdrop-blur-md">
          <p className="text-sm font-medium text-red-900">{fetchError}</p>
          <button
            type="button"
            onClick={() => setFetchError(null)}
            className="shrink-0 text-xs font-bold uppercase tracking-wide text-red-800 hover:text-red-600 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TRENDING CAROUSEL */}
      {trendingDrops.length > 0 && !search && !flashOnly && (
        <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="flex items-center gap-2 mb-5 px-1">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600">
                <TrendingUp size={16} strokeWidth={2.5} />
              </div>
              <h2 className="font-extrabold text-gray-900 uppercase tracking-wide text-sm md:text-base">Trending Live Drops</h2>
           </div>
           
           <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 -mx-4 px-4 md:-mx-1 md:px-1 snap-x snap-mandatory">
              {trendingDrops.map((product, ti) => {
                const displayP = productDisplayPrice({ ...product, price: Number(product.price) });
                const coins = product.stores?.loyalty_enabled 
                  ? Math.floor(displayP * (product.stores.loyalty_percentage / 100)) 
                  : 0;

                return (
                  <MarketplaceTrackedProductLink
                    key={`trending-${product.id}`}
                    href={`/product/${product.id}`}
                    product={{ id: product.id, seller_id: product.seller_id }}
                    position={ti}
                    band="trending"
                    className="group min-w-[160px] md:min-w-[200px] snap-start bg-white p-2.5 rounded-3xl border border-amber-100/60 shadow-[0_4px_20px_-4px_rgba(251,191,36,0.15)] hover:shadow-[0_8px_30px_-4px_rgba(251,191,36,0.25)] hover:-translate-y-1 active:scale-95 transition-all duration-300 relative"
                  >
                     <div className="aspect-[4/5] relative rounded-2xl overflow-hidden mb-3 bg-gray-50">
                        {product.image_urls?.[0] ? (
                          <Image
                            src={product.image_urls[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            unoptimized
                            fetchPriority={ti < 2 ? "high" : undefined}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-300">
                            <Package size={28} strokeWidth={1.5} />
                          </div>
                        )}
                        
                        {/* Gradient overlay for better text contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                          <Zap size={10} fill="currentColor" className="animate-pulse" /> TRENDING
                        </div>
                        
                        {coins > 0 && (
                          <div className="absolute top-2 right-2 bg-gray-900/90 backdrop-blur-md text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                             <Sparkles size={10} /> +₦{coins}
                          </div>
                        )}
                     </div>
                     <div className="px-1">
                        <p className="font-semibold text-gray-900 text-xs md:text-sm truncate">{product.name}</p>
                        <p className="text-emerald-600 font-extrabold text-sm mt-1">₦{displayP.toLocaleString()}</p>
                     </div>
                  </MarketplaceTrackedProductLink>
                );
              })}
           </div>
        </div>
      )}

      {/* STICKY SEARCH & FILTERS */}
      <div className={`sticky top-16 z-30 mb-8 rounded-3xl border border-white/40 bg-white/70 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-transform duration-500 ease-out ${
          isVisible 
          ? "translate-y-0" 
          : "-translate-y-[150%] md:translate-y-0"
      }`}>
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-gray-900 transition-colors" />
              <input
                placeholder="Search products, brands, or categories…"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-none bg-gray-100/50 text-gray-900 placeholder-gray-500 font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
                value={search}
                onChange={(e) => {
                  markFilterInteraction();
                  setSearch(e.target.value);
                }}
                aria-label="Search marketplace products"
              />
            </div>

            {/* Category Select */}
            <div className="relative min-w-[220px] group">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-gray-900 transition-colors" />
              <select
                className="w-full pl-11 pr-10 py-3.5 rounded-2xl border-none bg-gray-100/50 text-gray-800 font-semibold appearance-none cursor-pointer shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
                value={selectedCategory}
                onChange={(e) => {
                  markFilterInteraction();
                  setSelectedCategory(e.target.value);
                }}
                aria-label="Filter by product category"
              >
                <option value="all">All categories</option>
                {(categories || []).map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {/* Flash Toggle */}
          <div className="flex gap-2">
             <button 
                onClick={() => {
                  markFilterInteraction();
                  setFlashOnly(!flashOnly);
                }}
                className={`px-5 py-2.5 rounded-full text-[11px] font-bold tracking-wide transition-all flex items-center gap-2 border-2 ${
                  flashOnly 
                  ? "bg-amber-400 text-amber-950 border-amber-400 shadow-[0_4px_15px_-3px_rgba(251,191,36,0.4)] scale-[1.02]" 
                  : "bg-white text-gray-600 border-gray-100 hover:border-amber-200 hover:text-amber-700"
                }`}
             >
                <Zap size={14} className={flashOnly ? "fill-amber-950" : "text-amber-500"} />
                {flashOnly ? "Viewing Active Drops" : "Show Only Live Drops"}
             </button>
          </div>
        </div>
      </div>

      {/* Active Category Indicator */}
      {selectedCategory !== "all" && (
        <div className="max-w-5xl mx-auto mb-6 px-1 animate-in fade-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-bold tracking-wide text-gray-800 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-gray-900"></span>
            {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
          </span>
        </div>
      )}

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {loading && products.length === 0 ? (
          // Skeleton Loaders
          Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`sk-${i}`}
              className="animate-pulse rounded-3xl bg-white p-3 shadow-sm ring-1 ring-gray-900/5"
            >
              <div className="aspect-square rounded-2xl bg-gray-100 mb-4" />
              <div className="h-4 w-3/4 rounded-lg bg-gray-100 mb-2" />
              <div className="h-3 w-1/2 rounded-lg bg-gray-100 mb-4" />
              <div className="flex justify-between items-end mt-4">
                 <div className="h-5 w-1/3 rounded-lg bg-gray-100" />
                 <div className="h-8 w-8 rounded-full bg-gray-100" />
              </div>
            </div>
          ))
        ) : (
          products.map((product: any, index: number) => {
            const isFlash = isProductFlashDropActive(product);
            const isDiamond = effectiveSellerTier(
                product.stores?.subscription_plan,
                product.stores?.subscription_expiry,
                product.stores?.subscription_status,
              ) === "diamond";
            const displayPrice = productDisplayPrice({ ...product, price: Number(product.price) });
            const rewardCoins = product.stores?.loyalty_enabled
              ? Math.floor(displayPrice * (product.stores.loyalty_percentage / 100))
              : 0;
            const regionLabel = product.stores ? compactSellerRegion(product.stores) : "";
            const verified = product.stores?.verification_status === "verified";

            return (
            <MarketplaceTrackedProductLink
              key={product.id}
              href={`/product/${product.id}`}
              product={{ id: product.id, seller_id: product.seller_id }}
              position={index}
              band="grid"
              className={`group flex flex-col bg-white p-3 rounded-3xl transition-all duration-300 relative h-full ${
                isDiamond 
                ? 'shadow-[0_8px_30px_rgba(147,51,234,0.06)] ring-1 ring-purple-100 hover:shadow-[0_12px_40px_rgba(147,51,234,0.12)]' 
                : 'shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] ring-1 ring-gray-900/5 hover:shadow-[0_12px_30px_-4px_rgba(0,0,0,0.1)]'
              } hover:-translate-y-1`}
            >
              {/* Image Container */}
              <div className="aspect-square bg-gray-50/50 rounded-2xl mb-4 relative overflow-hidden">
                {product.image_urls?.[0] ? (
                  <Image
                    src={product.image_urls[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    unoptimized
                    fetchPriority={index < 6 ? "high" : undefined}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-300">
                    <Package size={32} strokeWidth={1} />
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-20 items-start">
                    {isFlash ? (
                    <div className="bg-amber-500 text-white text-[10px] px-2.5 py-1 rounded-full font-black shadow-md flex items-center gap-1">
                        <Zap size={10} fill="currentColor" /> LIVE DROP
                    </div>
                    ) : isDiamond && (
                    <span className="bg-purple-600/90 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-full font-bold shadow-md flex items-center gap-1">
                        <Gem size={10} className="fill-white"/> TOP
                    </span>
                    )}

                    {rewardCoins > 0 && (
                    <div className="bg-gray-900/80 backdrop-blur-md text-emerald-400 text-[10px] px-2.5 py-1 rounded-full font-bold shadow-md flex items-center gap-1">
                        <Sparkles size={10} /> +₦{rewardCoins.toLocaleString()}
                    </div>
                    )}
                </div>

                {/* Quick Add Button */}
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(product); }}
                  className={`absolute bottom-2.5 right-2.5 p-2.5 rounded-full shadow-lg hover:scale-110 active:scale-90 transition-all z-10 ${
                      isFlash ? 'bg-amber-500 text-white' : 'bg-white text-gray-900 ring-1 ring-gray-900/10'
                  }`}
                  aria-label="Add to cart"
                >
                  <Plus size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* Product Info */}
              <div className="px-1 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight mb-1.5 group-hover:text-emerald-700 transition-colors">{product.name}</h3>
                
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-2 truncate font-medium">
                  <Store size={12} className="shrink-0 text-gray-400" />
                  <span className="truncate">{product.stores?.name}</span>
                  {verified && <BadgeCheck size={14} className="text-blue-500 fill-blue-50 shrink-0" />}
                </div>
                
                {regionLabel && (
                  <p className="text-[10px] font-bold text-gray-400 mb-3 truncate uppercase tracking-widest">{regionLabel}</p>
                )}

                <div className="mt-auto flex items-end justify-between pt-2 border-t border-gray-100">
                  {isFlash ? (
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 line-through mb-0.5">₦{product.price.toLocaleString()}</span>
                      <span className="text-emerald-600 font-black text-base tracking-tight">₦{(productFlashPriceNumber(product) ?? product.price).toLocaleString()}</span>
                    </div>
                  ) : (
                    <span className="text-gray-900 font-extrabold text-base tracking-tight">₦{product.price.toLocaleString()}</span>
                  )}
                  
                  {product.stock_quantity === 0 && (
                     <span className="text-[9px] bg-red-50 text-red-600 px-2 py-1 rounded-md font-black uppercase tracking-wider ring-1 ring-red-100">Sold Out</span>
                  )}
                </div>
              </div>
            </MarketplaceTrackedProductLink>
            );
          })
        )}
      </div>

      {/* EMPTY STATES */}
      {!loading && products.length === 0 ? (
        initialFeedEmpty && selectedCategory === "all" && !debouncedSearch && !flashOnly ? (
          <div className="mx-auto mt-16 max-w-lg rounded-[2rem] border border-gray-100 bg-white p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                <Store className="h-10 w-10 text-emerald-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Marketplace is quiet right now</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-gray-500">
              There are no active listings in the feed yet. Check back soon, or open a seller shop from social or WhatsApp using their specific handle.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/account/start-selling"
                className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-6 py-3.5 text-xs font-bold tracking-wide text-white transition hover:bg-gray-800 shadow-lg shadow-gray-900/20"
              >
                Start selling
              </Link>
            </div>
          </div>
        ) : (
          <div className="mx-auto mt-16 max-w-lg rounded-[2rem] border border-gray-100 bg-white p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
                <Search className="h-10 w-10 text-gray-400" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">No products match</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-gray-500">
              Try a shorter search, pick <span className="font-bold text-gray-800">All categories</span>, or turn off live drops to see more results.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => {
                  markFilterInteraction();
                  setSearch("");
                  setSelectedCategory("all");
                  setFlashOnly(false);
                }}
                className="rounded-2xl bg-gray-900 px-6 py-3.5 text-xs font-bold tracking-wide text-white transition hover:bg-gray-800 shadow-lg shadow-gray-900/20"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )
      ) : null}

      {/* LOAD MORE */}
      {hasMore && products.length >= 12 && (
        <div className="mt-16 flex justify-center">
          <button 
            onClick={loadMore} 
            disabled={loading}
            className="group px-8 py-4 bg-white border border-gray-200 text-gray-900 rounded-full font-bold text-sm hover:border-gray-900 transition-all disabled:opacity-50 flex items-center gap-3 active:scale-95 shadow-sm hover:shadow-md"
          >
            {loading ? <Loader2 className="animate-spin text-gray-400" size={18} /> : "Load More Products"}
          </button>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className="fixed top-24 right-4 z-[60] bg-gray-900/95 backdrop-blur-md text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-8 fade-in duration-300">
           <div className="bg-emerald-500/20 p-1 rounded-full">
               <CheckCircle size={18} className="text-emerald-400" />
           </div>
           <span className="font-semibold text-sm tracking-wide">{toast.msg}</span>
        </div>
      )}

      {/* FLOATING CART (PWA Style) */}
      {cartCount > 0 && ( 
        <button 
          onClick={() => setIsCartOpen(true)} 
          className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-gray-900 text-white p-4 md:p-5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] z-50 transition-all duration-300 ${isJumping ? 'scale-110 bg-emerald-600 shadow-emerald-600/40' : 'hover:scale-105 hover:bg-gray-800 active:scale-95 animate-in slide-in-from-bottom-8 zoom-in'}`}
          aria-label="Open cart"
        >
          <ShoppingBag size={24} strokeWidth={2} />
          <span className="absolute -top-1 -right-1 bg-amber-500 min-w-[24px] h-6 px-1.5 rounded-full flex items-center justify-center text-[11px] font-black border-2 border-gray-900 shadow-sm transition-transform duration-300">
            {cartCount} 
          </span>
        </button>
      )}

    </div>
  );
}