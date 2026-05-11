"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link"; 
import { 
  Search, Package, Filter, Loader2, CheckCircle, 
  Plus, ShoppingBag, BadgeCheck, Gem, Zap, TrendingUp 
} from "lucide-react"; 
import { useCart } from "@/context/CartContext";
import { effectiveSellerTier } from "@/utils/marketplaceDiscovery";
import {
  attachStoresToProducts,
  dropProductsWithoutStore,
  fetchMergedStoreRowsForSellerIds,
} from "@/lib/storefrontCatalogMerge";
import { compactSellerRegion } from "@/lib/displayRegion";

interface FullMarketplaceClientProps {
  initialProducts: any[];
  categories: { id: string; name: string; slug: string }[]; 
}

export default function FullMarketplaceClient({ initialProducts, categories }: FullMarketplaceClientProps) {
  const { addToCart, cartCount, setIsCartOpen } = useCart();
  const BATCH_SIZE = 40;

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

  const trendingDrops = useMemo(() => {
    const now = new Date();
    return products.filter(p => 
      p.flash_drop_expiry && new Date(p.flash_drop_expiry) > now
    ).slice(0, 8);
  }, [products]);

  const handleAddToCart = (product: any) => {
    const isFlashActive = product.flash_drop_expiry && new Date(product.flash_drop_expiry) > new Date();
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
        setProducts(initialProducts);
        setHasMore(initialProducts.length >= BATCH_SIZE);
        setPage(Math.max(1, Math.ceil(initialProducts.length / BATCH_SIZE)));
        return;
      }

      setLoading(true);
      setPage(1);

      const categoryName = selectedCategory !== "all" ? categories.find((c) => c.slug === selectedCategory)?.name || null : null;
      if (selectedCategory !== "all" && !categoryName) {
        setProducts([]);
        setHasMore(false);
        setLoading(false);
        return;
      }

      const { data } = await supabase.rpc("get_storefront_marketplace_products", {
        p_limit: BATCH_SIZE,
        p_offset: 0,
        p_category: categoryName,
        p_search: debouncedSearch || null,
        p_flash_only: flashOnly,
      });
      const merged = await mergeProductRows(data);
      let processed = merged;

      if (debouncedSearch) {
        processed = processed.sort((a, b) => rankStore(b.stores) - rankStore(a.stores));
      }

      setProducts(processed);
      setHasMore(Boolean(data && data.length >= BATCH_SIZE));
      setLoading(false);
    };

    fetchFiltered();
  }, [selectedCategory, debouncedSearch, flashOnly, initialProducts, categories, BATCH_SIZE]);

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
    const { data: newProducts } = await supabase.rpc("get_storefront_marketplace_products", {
      p_limit: BATCH_SIZE,
      p_offset: from,
      p_category: categoryName,
      p_search: debouncedSearch || null,
      p_flash_only: flashOnly,
    });
    if (newProducts && newProducts.length > 0) {
      const sellerIds = [...new Set(newProducts.map((p: { seller_id?: string }) => p.seller_id).filter(Boolean))] as string[];
      const storeRows = await fetchMergedStoreRowsForSellerIds(supabase, sellerIds);
      const merged = attachStoresToProducts(newProducts, storeRows);
      const joined = dropProductsWithoutStore(merged);
      setProducts((prev) => [...prev, ...joined]);
      setPage((prev) => prev + 1);
      setHasMore(newProducts.length >= BATCH_SIZE);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      
      {trendingDrops.length > 0 && !search && !flashOnly && (
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
           <div className="flex items-center gap-2 mb-4 px-1">
              <TrendingUp size={18} className="text-amber-500" />
              <h2 className="font-black text-gray-900 uppercase tracking-tighter text-sm">Trending Live Drops</h2>
           </div>
           <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1">
              {trendingDrops.map(product => {
                const coins = product.stores?.loyalty_enabled 
                  ? Math.floor(product.price * (product.stores.loyalty_percentage / 100)) 
                  : 0;

                return (
                  <Link key={`trending-${product.id}`} href={`/product/${product.id}`} className="min-w-[150px] md:min-w-[190px] bg-white p-2 rounded-2xl border-2 border-amber-100 shadow-sm active:scale-95 transition relative">
                     <div className="aspect-square relative rounded-xl overflow-hidden mb-2">
                        {product.image_urls?.[0] ? (
                          <Image src={product.image_urls[0]} alt={product.name} fill className="object-cover" unoptimized />
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
                     <p className="text-emerald-600 font-black text-xs mt-1">₦{product.flash_drop_price?.toLocaleString()}</p>
                  </Link>
                );
              })}
           </div>
        </div>
      )}

      <div className={`sticky top-16 z-30 bg-gray-50/95 backdrop-blur-sm py-4 -mx-4 px-4 border-b border-gray-200 mb-6 transition-all duration-300 ease-in-out ${
          isVisible 
          ? "translate-y-0 opacity-100" 
          : "-translate-y-24 opacity-0 pointer-events-none md:translate-y-0 md:opacity-100 md:pointer-events-auto"
      }`}>
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              <input 
                placeholder="Search products..." 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-base font-medium"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="relative min-w-[200px]">
               <Filter className="absolute left-4 top-3.5 text-gray-500 w-4 h-4" />
               <select 
                 className="w-full pl-10 pr-8 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-700 appearance-none font-bold cursor-pointer"
                 value={selectedCategory}
                 onChange={(e) => setSelectedCategory(e.target.value)}
               >
                 <option value="all">Global Feed</option>
                 {(categories || []).map(cat => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
               </select>
            </div>
          </div>

          <div className="flex gap-2">
             <button 
                onClick={() => setFlashOnly(!flashOnly)}
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

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
        {products.map((product: any) => {
          const isFlash = product.flash_drop_expiry && new Date(product.flash_drop_expiry) > new Date();
          const isDiamond = product.stores?.subscription_plan === 'diamond';
          const rewardCoins = product.stores?.loyalty_enabled 
            ? Math.floor((isFlash ? product.flash_drop_price : product.price) * (product.stores.loyalty_percentage / 100)) 
            : 0;
          const regionLabel = product.stores ? compactSellerRegion(product.stores) : "";

          return (
            <Link 
              href={`/product/${product.id}`} 
              key={product.id} 
              className={`bg-white p-2.5 rounded-2xl border transition-all duration-500 flex flex-col relative h-full group ${
                isDiamond 
                ? 'border-purple-200 shadow-[0_10px_30px_rgba(147,51,234,0.08)] ring-1 ring-purple-50' 
                : 'border-gray-100 shadow-sm'
              } hover:shadow-2xl hover:-translate-y-2`}
            >
              <div className="aspect-square bg-gray-50 rounded-xl mb-3 relative overflow-hidden">
                {product.image_urls?.[0] ? (
                  <Image src={product.image_urls[0]} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
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
                  <span className="truncate">{product.stores?.name}</span>
                  {product.stores?.verification_status === 'verified' && <BadgeCheck size={12} className="text-blue-500 fill-blue-50" />}
                </div>
                {regionLabel ? (
                  <p className="text-[9px] font-bold text-gray-400 mb-2 truncate uppercase tracking-wider">{regionLabel}</p>
                ) : null}
                <div className="mt-auto flex items-center justify-between">
                  {isFlash ? (
                    <div>
                      <p className="text-[9px] font-bold text-gray-300 line-through">₦{product.price.toLocaleString()}</p>
                      <p className="text-emerald-700 font-black text-sm md:text-base tracking-tighter">₦{product.flash_drop_price.toLocaleString()}</p>
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
            </Link>
          );
        })}
      </div>

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