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
  /** True when the server had zero marketplace rows to show (distinct from “filters returned nothing”). */
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

  // --- 1. CORE STATES ---
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
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); 
    return () => clearTimeout(handler);
  }, [search]);

  /** Optional coarse location for ranking (same RPC fields as mobile); permission is browser-driven. */
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

  /** One-time hydrate from ?q=&category=&flash= (shareable marketplace links). */
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

  /** Keep the address bar in sync after the shopper changes filters (not on first URL-driven hydrate). */
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
    setToast({ show: true, msg: `Secured ${product.name}!` });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  const rankStore = (stores?: {
    subscription_plan?: string | null;
    subscription_expiry?: string | null;
    subscription_status?: string | null;
  }) => {
    return effectiveSellerTier(stores?.subscription_plan, stores?.subscription_expiry, stores?.subscription_status) === "diamond"
      ? 2
      : 1;
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
            if (ex.error) {
              console.error(ex.error);
              continue;
            }
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
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      {fetchError ? (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-900">{fetchError}</p>
          <button
            type="button"
            onClick={() => setFetchError(null)}
            className="shrink-0 text-[11px] font-black uppercase tracking-widest text-red-800 underline-offset-2 hover:underline"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      {trendingDrops.length > 0 && !search && !flashOnly && (
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
           <div className="flex items-center gap-2 mb-4 px-1">
              <TrendingUp size={18} className="text-amber-500" />
              <h2 className="font-black text-gray-900 uppercase tracking-tighter text-sm">Trending Live Drops</h2>
           </div>
           <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1">
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
                    className="min-w-[150px] md:min-w-[190px] bg-white p-2 rounded-2xl border-2 border-amber-100 shadow-sm active:scale-95 transition relative"
                  >
                     <div className="aspect-square relative rounded-xl overflow-hidden mb-2">
                        {product.image_urls?.[0] ? (
                          <Image
                            src={product.image_urls[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            unoptimized
                            fetchPriority={ti < 2 ? "high" : undefined}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-300 bg-gray-50">
                            <Package size={24} />
                          </div>
                        )}
                        <div className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded animate-pulse">TRENDING</div>
                        
                        {coins > 0 && (
                          <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                             <Zap size={8} fill="white" /> +₦{coins}
                          </div>
                        )}
                     </div>
                     <p className="font-bold text-gray-900 text-[10px] truncate uppercase">{product.name}</p>
                     <p className="text-emerald-600 font-black text-xs mt-1">₦{displayP.toLocaleString()}</p>
                  </MarketplaceTrackedProductLink>
                );
              })}
           </div>
        </div>
      )}

      <div className={`sticky top-16 z-30 mb-6 border-b border-gray-200 bg-gray-50/95 py-4 backdrop-blur-sm transition-all duration-300 ease-in-out ${
          isVisible 
          ? "translate-y-0 opacity-100" 
          : "-translate-y-24 opacity-0 pointer-events-none md:translate-y-0 md:opacity-100 md:pointer-events-auto"
      }`}>
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              <input
                placeholder="Search products, brands, or categories…"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-base font-medium"
                value={search}
                onChange={(e) => {
                  markFilterInteraction();
                  setSearch(e.target.value);
                }}
                aria-label="Search marketplace products"
              />
            </div>
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-4 top-3.5 text-gray-500 w-4 h-4" />
              <select
                className="w-full pl-10 pr-8 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-700 appearance-none font-bold cursor-pointer"
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
            </div>
          </div>
        

          <div className="flex gap-2">
             <button 
                onClick={() => {
                  markFilterInteraction();
                  setFlashOnly(!flashOnly);
                }}
                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border ${
                  flashOnly 
                  ? "bg-amber-500 text-white border-amber-600 shadow-lg shadow-amber-200 scale-105" 
                  : "bg-white text-amber-600 border-amber-100 hover:bg-amber-50"
                }`}
             >
                <Zap size={14} fill={flashOnly ? "white" : "currentColor"} className={flashOnly ? "animate-pulse" : ""} />
                {flashOnly ? "Viewing Active Drops" : "Show Only Live Drops"}
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mb-4 flex flex-wrap items-center gap-2 px-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Popular searches</span>
        <div className="flex flex-wrap gap-2">
          {MARKETPLACE_SUGGESTED_SEARCHES.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                markFilterInteraction();
                setSearch(term);
              }}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-bold text-gray-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50/80"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {selectedCategory !== "all" ? (
        <div className="max-w-5xl mx-auto mb-3 px-1">
          <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-widest text-gray-700">
            Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
          </span>
        </div>
      ) : null}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
        {loading && products.length === 0 ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`sk-${i}`}
              className="animate-pulse rounded-2xl border border-gray-100 bg-white p-2.5 shadow-sm"
            >
              <div className="aspect-square rounded-xl bg-gray-100" />
              <div className="mt-3 h-3 w-[78%] rounded bg-gray-100" />
              <div className="mt-2 h-3 w-[52%] rounded bg-gray-100" />
              <div className="mt-4 h-4 w-[36%] rounded bg-gray-100" />
            </div>
          ))
        ) : (
          products.map((product: any, index: number) => {
            const isFlash = isProductFlashDropActive(product);
            const isDiamond =
              effectiveSellerTier(
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
              className={`bg-white p-2.5 rounded-2xl border transition-all duration-500 flex flex-col relative h-full group ${
                isDiamond 
                ? 'border-purple-200 shadow-[0_10px_30px_rgba(147,51,234,0.08)] ring-1 ring-purple-50' 
                : 'border-gray-100 shadow-sm'
              } hover:shadow-2xl hover:-translate-y-2`}
            >
              <div className="aspect-square bg-gray-50 rounded-xl mb-3 relative overflow-hidden">
                {product.image_urls?.[0] ? (
                  <Image
                    src={product.image_urls[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized
                    fetchPriority={index < 6 ? "high" : undefined}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-300">
                    <Package size={30} />
                  </div>
                )}
                
                {isFlash ? (
                  <div className="absolute top-2 left-2 bg-amber-500 text-white text-[9px] px-2 py-1 rounded-lg font-black shadow-lg flex items-center gap-1 z-20">
                     <Zap size={10} fill="currentColor" /> LIVE DROP
                  </div>
                ) : isDiamond && (
                  <span className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-md flex items-center gap-1 z-20">
                     <Gem size={10} className="fill-white"/> TOP
                  </span>
                )}

                {rewardCoins > 0 && (
                  <div className="absolute top-2 right-2 bg-emerald-600/90 backdrop-blur-sm text-white text-[9px] px-2 py-1 rounded-lg font-black shadow-lg flex items-center gap-1 z-20 animate-in zoom-in">
                    <Zap size={10} fill="white" /> +₦{rewardCoins.toLocaleString()}
                  </div>
                )}

                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(product); }}
                  className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg hover:scale-125 transition-all z-10 ${isFlash ? 'bg-amber-500 text-white' : 'bg-gray-900 text-white'}`}
                >
                  <Plus size={18} strokeWidth={3} />
                </button>
              </div>

              <div className="px-1 flex flex-col flex-1">
                <h3 className="font-bold text-gray-900 text-xs md:text-sm truncate uppercase tracking-tight mb-0.5">{product.name}</h3>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-1 truncate font-bold">
                  <Store size={11} className="shrink-0 text-gray-300" aria-hidden />
                  <span className="truncate">{product.stores?.name}</span>
                  {verified ? (
                    <span className="inline-flex shrink-0" title="Verified seller">
                      <BadgeCheck size={12} className="text-blue-500 fill-blue-50" aria-hidden />
                    </span>
                  ) : null}
                  {isDiamond ? (
                    <span className="inline-flex shrink-0" title="Diamond visibility">
                      <Gem size={11} className="text-purple-500" aria-hidden />
                    </span>
                  ) : null}
                  {product.stores?.loyalty_enabled ? (
                    <span className="inline-flex shrink-0" title="Store Coins on">
                      <Sparkles size={11} className="text-amber-500" aria-hidden />
                    </span>
                  ) : null}
                </div>
                {regionLabel ? (
                  <p className="text-[9px] font-bold text-gray-400 mb-2 truncate uppercase tracking-wider">{regionLabel}</p>
                ) : null}
                <div className="mt-auto flex items-center justify-between">
                  {isFlash ? (
                    <div>
                      <p className="text-[9px] font-bold text-gray-300 line-through">₦{product.price.toLocaleString()}</p>
                      <p className="text-emerald-700 font-black text-sm md:text-base tracking-tighter">₦{(productFlashPriceNumber(product) ?? product.price).toLocaleString()}</p>
                    </div>
                  ) : (
                    <p className="text-emerald-700 font-black text-sm md:text-base">₦{product.price.toLocaleString()}</p>
                  )}
                  {product.stock_quantity === 0 && (
                     <span className="text-[8px] bg-red-50 text-red-600 px-2 py-1 rounded font-black uppercase tracking-widest">Sold Out</span>
                  )}
                </div>
              </div>
              {isDiamond && <div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-transparent group-hover:border-purple-500/10 transition-colors" />}
            </MarketplaceTrackedProductLink>
            );
          })
        )}
      </div>

      {!loading && products.length === 0 ? (
        initialFeedEmpty && selectedCategory === "all" && !debouncedSearch && !flashOnly ? (
          <div className="mx-auto mt-12 max-w-lg rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-10 text-center shadow-sm">
            <Store className="mx-auto mb-4 h-12 w-12 text-emerald-300" strokeWidth={1.25} />
            <h2 className="text-lg font-black uppercase tracking-tight text-gray-900">Marketplace is quiet right now</h2>
            <p className="mt-2 text-sm font-medium leading-relaxed text-gray-700">
              There are no active listings in the feed yet. Check back soon, or open a seller shop from social or WhatsApp
              using their StoreLink handle.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link
                href="/account/start-selling"
                className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-gray-800"
              >
                Start selling
              </Link>
              <Link
                href="/faq#discovery-loyalty"
                className="inline-flex items-center justify-center rounded-2xl border border-emerald-200 bg-white px-5 py-3 text-[11px] font-black uppercase tracking-widest text-emerald-900 transition hover:bg-emerald-50"
              >
                How discovery works
              </Link>
            </div>
          </div>
        ) : (
          <div className="mx-auto mt-12 max-w-lg rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center shadow-sm">
            <Package className="mx-auto mb-4 h-12 w-12 text-gray-200" strokeWidth={1.25} />
            <h2 className="text-lg font-black uppercase tracking-tight text-gray-900">No products match</h2>
            <p className="mt-2 text-sm font-medium leading-relaxed text-gray-600">
              Try a shorter search, pick <span className="font-bold text-gray-800">All categories</span>, or turn off live drops.
              Search looks at product titles; we also fetch a few related words when it helps.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => {
                  markFilterInteraction();
                  setSearch("");
                  setSelectedCategory("all");
                  setFlashOnly(false);
                }}
                className="rounded-2xl bg-gray-900 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-gray-800"
              >
                Clear filters
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 py-3 text-[11px] font-black uppercase tracking-widest text-gray-800 transition hover:bg-gray-50"
              >
                Back to home
              </Link>
            </div>
            <p className="mt-6 text-xs font-medium text-gray-500">
              Sellers: discovery is fair and capped — see{" "}
              <Link href="/faq#discovery-loyalty" className="font-bold text-emerald-700 underline-offset-2 hover:underline">
                FAQs on discovery
              </Link>
              .
            </p>
          </div>
        )
      ) : null}

      {hasMore && products.length >= 12 && (
        <div className="mt-12 flex justify-center">
          <button 
            onClick={loadMore} 
            disabled={loading}
            className="px-10 py-4 bg-white border-2 border-gray-900 text-gray-900 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-all disabled:opacity-50 flex items-center gap-3 active:scale-95 shadow-xl"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Load More Products"}
          </button>
        </div>
      )}

      {toast.show && (
        <div className="fixed top-24 right-4 z-[60] bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10">
           <CheckCircle size={20} className="text-emerald-400" />
           <span className="font-bold text-sm">{toast.msg}</span>
        </div>
      )}

      {cartCount > 0 && ( 
        <button 
          onClick={() => setIsCartOpen(true)} 
          className={`fixed bottom-8 right-8 bg-gray-900 text-white p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 transition-all active:scale-90 ${isJumping ? 'animate-bounce bg-emerald-600' : 'hover:scale-110 animate-in zoom-in'}`}
        >
          <ShoppingBag size={24} />
          <span className="absolute -top-1 -right-1 bg-emerald-500 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 border-white">
            {cartCount} 
          </span>
        </button>
      )}

    </div>
  );
}