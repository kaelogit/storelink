"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Package, ExternalLink, 
  Crown, AlertTriangle, Eye, TrendingUp, Tags, Edit, Trash2,
  Lock, Sparkles, X, BarChart3, Zap, Search, Plus // ✅ Fixed: Added Plus
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import AddProductModal from "@/components/store/AddProductModal";
import CategoryManager from "@/components/store/CategoryManager";
import StoreSettings from "@/components/dashboard/StoreSettings";
import ShareStore from "./ShareStore";
import FlashDropModal from "@/components/dashboard/FlashDropModal";

interface DashboardClientProps {
  store: any;
  initialProducts: any[];
  initialOrders: any[];
  stats: { revenue: number; productCount: number; views: number };
  isLocked: boolean; 
}

export default function DashboardClient({ store, initialProducts, initialOrders, stats, isLocked }: DashboardClientProps) {
  const router = useRouter();
  
  // --- 🛡️ STATE MANAGEMENT ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<any>(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [selectedFlashProduct, setSelectedFlashProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- ⚡ PERFORMANCE FILTERING ---
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categories?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, initialProducts]);

  const isFree = store.subscription_plan === 'free';
  const isFreeLimitReached = isFree && stats.productCount >= 5;

  // --- 🛠️ ACTIONS ---
  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    // 🔥 FIX: Target "products" table, NOT "storefront_products" view
    const { error } = await supabase.from("products").delete().eq("id", id);
    
    if (error) { 
      console.error(error); 
      alert("Could not delete product."); 
    } else { 
      router.refresh(); 
    }
  };

  const openEditModal = (product: any) => {
    setProductToEdit(product);
    setIsAddModalOpen(true);
  };

  const isRecentlySoldOut = (product: any) => {
    if (!product.sold_out_at || product.stock_quantity > 0) return false;
    const soldOutDate = new Date(product.sold_out_at);
    const hoursDiff = (new Date().getTime() - soldOutDate.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24;
  };

  return (
    <div className="space-y-6 px-1 md:px-0 pb-20">
        {/* 1. HEADER (Your Original Style) */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-2 tracking-tight uppercase italic">
              Dashboard
              {isLocked && <span className="bg-red-100 text-red-700 text-[10px] px-2 py-1 rounded-md border border-red-200">OFFLINE</span>}
            </h1>
            <p className="text-gray-500 text-sm mt-1">Welcome Back, <span className="font-bold text-gray-900">{store.name}</span></p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {!isLocked && (
              <a href={`/${store.slug}`} target="_blank" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition shadow-lg">
                <ExternalLink size={16} /> View Store
              </a>
            )}
          </div>
        </header>

        {/* 2. QUICK STATS (Your Original Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp size={20}/></div>
               <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Revenue</span>
             </div>
             <p className="text-2xl font-black text-gray-900">₦{stats.revenue.toLocaleString()}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Package size={20}/></div>
               <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Products</span>
             </div>
             <p className="text-2xl font-black text-gray-900">{stats.productCount}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Eye size={20}/></div>
               <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Views</span>
             </div>
             <p className="text-2xl font-black text-gray-900">{stats.views.toLocaleString()}</p>
          </div>
        </div>

        <ShareStore slug={store.slug} />

        {/* 3. 🔥 PRODUCT SECTION (Removed Orders/Settings tabs as requested) */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h3 className="font-bold text-lg text-gray-900">Inventory</h3>
            <div className="flex gap-2 w-full md:w-auto">
               <button onClick={() => setIsCatModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition">
                  <Tags size={16}/> <span className="md:inline">Categories</span>
               </button>
               <button onClick={() => setIsAddModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-emerald-500 transition">
                  <Plus size={16}/> <span className="md:inline">Add Product</span>
               </button>
            </div>
          </div>

          {/* 🔍 SEARCH BAR (Integrated perfectly into your design) */}
          <div className="relative mb-6 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-gray-900 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-gray-100 rounded-full hover:bg-gray-200">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="mb-4 px-1 flex justify-between items-center">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
               {filteredProducts.length} items found
             </p>
             {/* ✅ FIXED: Red line error resolved here */}
             {filteredProducts.some(p => isRecentlySoldOut(p)) && (
               <span className="text-[9px] font-bold text-amber-600 italic">Stock visibility active</span>
             )}
          </div>

          {/* INVENTORY TABLE (Reverted to your original styling) */}
          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
             {filteredProducts.length === 0 ? (
               <div className="p-12 text-center text-gray-400">
                 <Package size={48} className="mx-auto mb-4 opacity-20"/>
                 <p>{searchTerm ? "No products match your search." : "No products yet."}</p>
               </div>
             ) : (
               <table className="w-full text-left min-w-[600px]">
                 <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase text-gray-500">
                   <tr>
                     <th className="px-6 py-4 font-bold">Product</th>
                     <th className="px-6 py-4 font-bold">Category</th>
                     <th className="px-6 py-4 font-bold">Price</th>
                     <th className="px-6 py-4 font-bold">Stock</th>
                     <th className="px-6 py-4 font-bold text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {filteredProducts.map((p) => {
                     const soldOut = isRecentlySoldOut(p);
                     return (
                      <tr key={p.id} className="hover:bg-gray-50/80 transition">
                        <td className="px-6 py-4 font-bold text-gray-900 text-sm md:text-base">
                          {p.name}
                          {soldOut && <span className="block text-[8px] text-amber-600 font-black uppercase">Recent Sale</span>}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs md:text-sm">
                          <span className="px-2 py-1 bg-gray-100 rounded-lg font-bold">{p.categories?.name || 'General'}</span>
                        </td>
                        <td className="px-6 py-4 text-emerald-600 font-bold text-xs md:text-sm">₦{p.price.toLocaleString()}</td>
                        <td className="px-6 py-4 text-xs md:text-sm">
                          {p.stock_quantity === 0 
                            ? <span className="text-red-500 font-bold bg-red-50 px-2 py-1 rounded-lg">Sold Out</span> 
                            : <span className="text-gray-600 font-bold">{p.stock_quantity}</span>
                          }
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-1 md:gap-2">
                           <button onClick={() => setSelectedFlashProduct(p)} className={`p-2 rounded-lg transition-all ${p.flash_drop_expiry && new Date(p.flash_drop_expiry) > new Date() ? 'text-amber-500 bg-amber-50' : 'text-gray-300 hover:text-amber-500'}`}>
                             <Zap size={18} fill={p.flash_drop_expiry && new Date(p.flash_drop_expiry) > new Date() ? "currentColor" : "none"} />
                           </button>
                           <button onClick={() => openEditModal(p)} className="p-2 text-gray-400 hover:text-blue-600 transition"><Edit size={16}/></button>
                           <button onClick={() => deleteProduct(p.id)} className="p-2 text-gray-400 hover:text-red-600 transition"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                     );
                   })}
                 </tbody>
               </table>
             )}
          </div>
        </div>

      {/* MODALS */}
      <AddProductModal storeId={store.id} isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); setProductToEdit(null); }} onSuccess={() => router.refresh()} productToEdit={productToEdit} />
      <CategoryManager storeId={store.id} isOpen={isCatModalOpen} onClose={() => setIsCatModalOpen(false)} onSuccess={() => router.refresh()} />
      <FlashDropModal product={selectedFlashProduct} isOpen={!!selectedFlashProduct} onClose={() => setSelectedFlashProduct(null)} onSuccess={() => router.refresh()} />
    </div>
  );
}