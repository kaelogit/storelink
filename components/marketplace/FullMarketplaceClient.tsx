"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link"; 
import { Search, Package, Filter, Loader2, CheckCircle, Plus, ShoppingBag, BadgeCheck, Gem } from "lucide-react"; 
import { useCart } from "@/context/CartContext"; 

interface FullMarketplaceClientProps {
  initialProducts: any[];
  categories: { id: string; name: string; slug: string }[]; // 👈 Changed from 'stores'
}

export default function FullMarketplaceClient({ initialProducts, categories }: FullMarketplaceClientProps) {
  const { addToCart, cartCount, setIsCartOpen } = useCart();
  const PAGE_SIZE = 12;

  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(Math.ceil(initialProducts.length / PAGE_SIZE));
  
  const [search, setSearch] = useState("");
  // 👇 Filtering by Category Slug now
  const [selectedCategory, setSelectedCategory] = useState("all"); 
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: "" });

  const handleAddToCart = (product: any) => {
    const storeData = {
        id: product.store_id,
        name: product.stores?.name,
        slug: product.stores?.slug,
        whatsapp_number: product.stores?.whatsapp_number || "", 
    };
    addToCart(product, storeData as any);
    setToast({ show: true, msg: `Added ${product.name} to bag` });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      setPage(1);

      let query = supabase
        .from("storefront_products")
        .select("*, stores!inner(name, slug, subscription_plan, category)") 
        .order("created_at", { ascending: false })
        .range(0, PAGE_SIZE - 1);

      if (selectedCategory !== "all") {
        query = query.eq("stores.category", selectedCategory);
      }

      const { data } = await query;
      setProducts(data || []);
      setHasMore(data && data.length === PAGE_SIZE ? true : false);
      setLoading(false);
    };

    if (selectedCategory !== "all") {
      fetchFiltered();
    } else if (page === 1) {
        // Reset to initial if 'all' is clicked and we aren't using the shuffled initial data
        setProducts(initialProducts);
    }
  }, [selectedCategory]);

  const loadMore = async () => {
    setLoading(true);
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("storefront_products")
      .select("*, stores!inner(name, slug, subscription_plan, category)")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (selectedCategory !== "all") {
      query = query.eq("stores.category", selectedCategory);
    }

    const { data: newProducts } = await query;
    
    if (newProducts && newProducts.length > 0) {
      setProducts([...products, ...newProducts]);
      setPage(page + 1);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  const filteredProducts = products.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      
      <div className="sticky top-16 z-30 bg-gray-50/95 backdrop-blur-sm py-4 -mx-4 px-4 border-b border-gray-200 mb-6 transition-all">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input 
              placeholder="Search products..." 
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-base"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="relative min-w-[200px]">
             <Filter className="absolute left-4 top-3.5 text-gray-500 w-4 h-4" />
             <select 
               className="w-full pl-10 pr-8 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-700 appearance-none font-medium cursor-pointer"
               value={selectedCategory}
               onChange={(e) => setSelectedCategory(e.target.value)}
             >
               <option value="all">All Categories</option>
               {(categories || []).map(cat => (
                 <option key={cat.id} value={cat.slug}>{cat.name}</option>
               ))}
             </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
        {filteredProducts.map((product: any) => (
          <Link 
            href={`/product/${product.id}`} 
            key={product.id} 
            className="bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full flex flex-col relative"
          >
            <div className="aspect-square bg-gray-100 rounded-xl mb-3 relative overflow-hidden">
              {product.image_urls?.[0] ? (
                <Image src={product.image_urls[0]} alt="" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300"><Package /></div>
              )}
              
              {product.stores?.subscription_plan === 'diamond' && (
                <span className="absolute top-2 left-2 bg-purple-600/90 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm flex items-center gap-1 z-20">
                   <Gem size={10} className="fill-white"/> TOP
                </span>
              )}

              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(product); }}
                className="absolute bottom-2 right-2 bg-white text-gray-900 p-2 rounded-full shadow-lg hover:scale-110 active:scale-95 transition z-10"
              >
                <Plus size={18} strokeWidth={3} />
              </button>
            </div>

            <div className="px-1 flex flex-col flex-1">
              <h3 className="font-bold text-gray-900 text-sm truncate">{product.name}</h3>
              
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-2 truncate">
                <span className="truncate">{product.stores?.name}</span>
                {product.stores?.subscription_plan === 'diamond' && <Gem size={12} className="text-purple-600 fill-purple-50 shrink-0"/>}
                {product.stores?.subscription_plan === 'premium' && <BadgeCheck size={12} className="text-blue-600 fill-blue-50 shrink-0"/>}
              </div>

              <div className="mt-auto flex items-center justify-between">
                <p className="text-emerald-700 font-extrabold text-sm md:text-base">₦{product.price.toLocaleString()}</p>
                {product.stock_quantity === 0 && (
                   <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">Sold Out</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {toast.show && (
        <div className="fixed top-24 right-4 z-[60] bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-right-10 fade-in">
           <CheckCircle size={20} className="text-green-400" />
           <span className="font-bold text-sm">{toast.msg}</span>
        </div>
      )}

      {hasMore && !search && selectedCategory === 'all' && (
        <div className="mt-12 text-center pb-20">
           <button onClick={loadMore} disabled={loading} className="px-8 py-3 bg-white border border-gray-200 text-gray-900 font-bold rounded-xl hover:bg-gray-50 transition shadow-sm flex items-center gap-2 mx-auto disabled:opacity-50">
             {loading ? <Loader2 className="animate-spin" /> : "Load More Products"}
           </button>
        </div>
      )}

      {cartCount > 0 && ( 
        <button 
          onClick={() => setIsCartOpen(true)} 
          className="fixed bottom-8 right-8 bg-gray-900 text-white p-4 rounded-full shadow-2xl z-50 hover:scale-110 transition animate-in zoom-in"
        >
          <ShoppingBag size={24} />
          <span className="absolute -top-1 -right-1 bg-red-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
            {cartCount} 
          </span>
        </button>
      )}

    </div>
  );
}