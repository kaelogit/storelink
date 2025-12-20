"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link"; 
import { 
  Search, Package, Filter, Loader2, CheckCircle, 
  Plus, ShoppingBag, BadgeCheck, Gem, Zap, TrendingUp 
} from "lucide-react"; 
import { useCart } from "@/context/CartContext"; 

interface FullMarketplaceClientProps {
  initialProducts: any[];
  categories: { id: string; name: string; slug: string }[]; 
}

export default function FullMarketplaceClient({ initialProducts, categories }: FullMarketplaceClientProps) {
  const { addToCart, cartCount, setIsCartOpen } = useCart();
  const PAGE_SIZE = 12;

  // --- 1. CORE STATES ---
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(Math.ceil(initialProducts.length / PAGE_SIZE));
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); // ✨ Fix: For Global Database Search
  const [selectedCategory, setSelectedCategory] = useState("all"); 
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: "" });
  const [flashOnly, setFlashOnly] = useState(false); 
  const [isJumping, setIsJumping] = useState(false);

  // --- NEW: SCROLL DIRECTION LOGIC (FIXED) ---
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Hide bar if scrolling down > 100px, show if scrolling up
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

  // --- ✨ SEARCH DEBOUNCE LOGIC ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // Wait 500ms before querying Supabase
    return () => clearTimeout(handler);
  }, [search]);

  // --- 2. LOGIC AUDIT: REWARDS & PROTECTION ---
  const trendingDrops = useMemo(() => {
    const now = new Date();
    return products.filter(p => 
      p.flash_drop_expiry && new Date(p.flash_drop_expiry) > now
    ).slice(0, 8);
  }, [products]);

  const applyDowngradeProtection = useCallback((items: any[]) => {
    const counts = new Map();
    const now = new Date();
    return items.filter(p => {
      const plan = p.stores?.subscription_plan;
      const expiry = p.stores?.subscription_expiry;
      if (expiry && new Date(expiry) < now) return false;
      if (plan === 'premium' || plan === 'diamond') return true;
      const count = counts.get(p.store_id) || 0;
      if (count < 5) {
        counts.set(p.store_id, count + 1);
        return true;
      }
      return false;
    });
  }, []);

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
        id: product.store_id,
        name: product.stores?.name,
        slug: product.stores?.slug,
        whatsapp_number: product.stores?.whatsapp_number || "", 
    };
    addToCart(product, storeData as any);
    setToast({ show: true, msg: `Secured ${product.name}!` });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  const getRank = (plan?: string) => {
     if (plan === 'diamond') return 3;
     if (plan === 'premium') return 2;
     return 1;
  };

  // --- 3. DATA FETCHING (AUDITED FOR SERVER-SIDE SEARCH) ---
  useEffect(() => {
    const fetchFiltered = async () => {
      // If we are resetting to initial view with no filters, just use initialProducts
      if (selectedCategory === "all" && !debouncedSearch && !flashOnly) {
        setProducts(initialProducts);
        setHasMore(true);
        setPage(Math.ceil(initialProducts.length / PAGE_SIZE));
        return;
      }

      setLoading(true);
      setPage(1);

      let query = supabase
        .from("storefront_products")
        .select("*, stores!inner(name, slug, subscription_plan, category, verification_status, subscription_expiry, loyalty_enabled, loyalty_percentage)") 
        .order("created_at", { ascending: false })
        .range(0, 40); 

      if (selectedCategory !== "all") {
        query = query.eq("stores.category", selectedCategory);
      }

      // ✨ FIX: Real database search across all products
      if (debouncedSearch) {
        query = query.ilike("name", `%${debouncedSearch}%`);
      }

      // ✨ FIX: Real database filter for flash drops
      if (flashOnly) {
        query = query.gt("flash_drop_expiry", new Date().toISOString());
      }

      const { data } = await query;
      let processed = applyDowngradeProtection(data || []);
      
      // Sort by rank if searching
      if (debouncedSearch) {
        processed = processed.sort((a, b) => getRank(b.stores?.subscription_plan) - getRank(a.stores?.subscription_plan));
      }

      setProducts(processed);
      setHasMore(data && data.length >= 40 ? true : false);
      setLoading(false);
    };

    fetchFiltered();
  }, [selectedCategory, debouncedSearch, flashOnly, initialProducts, applyDowngradeProtection]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const from = page * 40;
    const to = from + 39; 

    let query = supabase
      .from("storefront_products")
      .select("*, stores!inner(name, slug, subscription_plan, category, verification_status, subscription_expiry, loyalty_enabled, loyalty_percentage)")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (selectedCategory !== "all") query = query.eq("stores.category", selectedCategory);
    if (debouncedSearch) query = query.ilike("name", `%${debouncedSearch}%`);
    if (flashOnly) query = query.gt("flash_drop_expiry", new Date().toISOString());

    const { data: newProducts } = await query;
    if (newProducts && newProducts.length > 0) {
      const protectedNewData = applyDowngradeProtection(newProducts);
      setProducts(prev => [...prev, ...protectedNewData]);
      setPage(prev => prev + 1);
      setHasMore(newProducts.length >= 40);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      
      {/* TRENDING SECTION: PRESERVED DESIGN */}
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
                        <Image src={product.image_urls?.[0]} alt="" fill className="object-cover" />
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

      {/* FILTER BAR: DYNAMIC VISIBILITY ON SCROLL (THE FIX) */}
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

      {/* GLOBAL GRID: THE CORE DATA MAPPING */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
        {products.map((product: any) => {
          const isFlash = product.flash_drop_expiry && new Date(product.flash_drop_expiry) > new Date();
          const isDiamond = product.stores?.subscription_plan === 'diamond';
          const rewardCoins = product.stores?.loyalty_enabled 
            ? Math.floor((isFlash ? product.flash_drop_price : product.price) * (product.stores.loyalty_percentage / 100)) 
            : 0;
          
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
                <Image src={product.image_urls?.[0] || ""} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                
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
                <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-3 truncate font-bold">
                  <span className="truncate">{product.stores?.name}</span>
                  {product.stores?.verification_status === 'verified' && <BadgeCheck size={12} className="text-blue-500 fill-blue-50" />}
                </div>
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

      {/* FOOTER ACTIONS: PAGINATION */}
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