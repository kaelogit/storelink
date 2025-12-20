"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Package, ShoppingBag, Settings, Plus, ExternalLink, 
  Crown, AlertTriangle, Eye, TrendingUp, Tags, Edit, Trash2,
  Lock, Sparkles, X, BarChart3, Calendar, Zap, LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import AddProductModal from "@/components/store/AddProductModal";
import CategoryManager from "@/components/store/CategoryManager";
import OrderDetailsModal from "@/components/dashboard/OrderDetailsModal";
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
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };
  
  const [activeTab, setActiveTab] = useState("products");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [productToEdit, setProductToEdit] = useState<any>(null);

  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  const isPremium = store.subscription_plan === 'premium';
  const isDiamond = store.subscription_plan === 'diamond';
  const isFree = store.subscription_plan === 'free';
  const isFreeLimitReached = isFree && stats.productCount >= 5;

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { console.error(error); alert("Could not delete product."); } 
    else { router.refresh(); }
  };

  const openEditModal = (product: any) => {
    setProductToEdit(product);
    setIsAddModalOpen(true);
  };

  const closeProductModal = () => {
    setIsAddModalOpen(false);
    setProductToEdit(null); 
  };

  const [selectedFlashProduct, setSelectedFlashProduct] = useState<any>(null);

  return (
    <div className="space-y-6 px-1 md:px-0">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-2 flex-wrap tracking-tight">
              Dashboard
              {isLocked ? (
                <span className="bg-red-100 text-red-700 text-[10px] px-2 py-1 rounded-md border border-red-200 whitespace-nowrap font-black uppercase flex items-center gap-1">
                  <Lock size={12} /> Store Offline
                </span>
              ) : (
                <>
                  {isDiamond && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-md border border-purple-200 whitespace-nowrap font-bold">Diamond</span>}
                  {isPremium && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-md border border-blue-200 whitespace-nowrap font-bold">Premium</span>}
                  {isFree && <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md border border-gray-200 whitespace-nowrap font-bold">Free</span>}
                </>
              )}
            </h1>
            <p className="text-gray-500 text-sm mt-1">Welcome Back, <span className="font-bold text-gray-900">{store.name}</span> (Manage your Empire)</p>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {isLocked ? (
              <Link href="/dashboard/subscription" className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-black hover:bg-red-700 transition shadow-lg shadow-red-200 animate-pulse">
                <Lock size={16} /> Renew to Unlock
              </Link>
            ) : (
              <a href={`/${store.slug}`} target="_blank" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition shadow-lg shadow-gray-200">
                <ExternalLink size={16} /> View Store
              </a>
            )}
            
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* REVENUE CARD: Interactive & Subscription Based */}
          <button 
            onClick={() => !isLocked && setIsAnalyticsOpen(true)}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left relative overflow-hidden group w-full"
          >
             <div className={`flex flex-col h-full transition-all duration-500 ${isLocked ? 'blur-md grayscale opacity-50' : ''}`}>
               <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition"><TrendingUp size={20}/></div>
                   <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Monthly Revenue</span>
                 </div>
                 {!isLocked && <BarChart3 size={16} className="text-emerald-400 opacity-40 md:opacity-0 md:group-hover:opacity-100 transition" />}
               </div>
               <p className="text-2xl md:text-3xl font-black text-gray-900">₦{stats.revenue.toLocaleString()}</p>
               <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-tighter flex items-center gap-1">
                    <Sparkles size={10} /> Subscription Cycle
                  </span>
                  <span className="text-[10px] font-bold text-gray-300 group-hover:text-emerald-500 transition">View Details →</span>
               </div>
             </div>
             {isLocked && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/10 text-red-600 z-10">
                 <Lock size={20} className="mb-1" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Locked</span>
               </div>
             )}
          </button>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Package size={20}/></div>
               <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Products</span>
             </div>
             <div className="flex items-baseline gap-2">
               <p className="text-2xl md:text-3xl font-black text-gray-900">{stats.productCount}</p>
               {isFree && <span className="text-xs font-bold text-gray-400">/ 5 Limit</span>}
             </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition relative overflow-hidden group">
             <div className={`flex flex-col h-full transition-all duration-500 ${isLocked ? 'blur-md grayscale opacity-50' : ''}`}>
               <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Eye size={20}/></div>
                 <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Empire Views</span>
               </div>
               <p className="text-2xl md:text-3xl font-black text-gray-900">{stats.views.toLocaleString()}</p>
             </div>
             {isLocked && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/10 text-red-600 z-10">
                 <Lock size={20} className="mb-1" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Locked</span>
               </div>
             )}
          </div>
        </div>

        <ShareStore slug={store.slug} />

        {isAnalyticsOpen && (
          <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl h-[90vh] md:h-auto md:rounded-[40px] rounded-t-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300 flex flex-col">
              <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-emerald-600 text-white rounded-xl md:rounded-2xl shadow-lg">
                    <TrendingUp size={24}/>
                  </div>
                  <div>
                    <h2 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight">Financial Empire Overview</h2>
                    <p className="text-[10px] md:text-sm text-gray-500">Monthly subscription cycle analytics</p>
                  </div>
                </div>
                <button onClick={() => setIsAnalyticsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400"><X /></button>
              </div>

              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div className="flex items-center justify-between uppercase tracking-widest text-[9px] md:text-[10px] font-black text-gray-400">
                    <span>Monthly Revenue (30d)</span>
                    <span className="text-emerald-600">Active Cycle</span>
                  </div>
                  <div className="bg-gray-50 p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-gray-100 h-40 md:h-48 flex items-end justify-between gap-1 px-4 md:px-8">
                    {[30, 60, 40, 80, 55, 95, 70, 45, 100, 85, 60, 90].map((h, i) => (
                      <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-emerald-500 rounded-full opacity-80" />
                    ))}
                  </div>
                  <p className="text-[11px] font-bold text-gray-500 text-center uppercase tracking-tighter">Your daily revenue flow this month</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between uppercase tracking-widest text-[9px] md:text-[10px] font-black text-gray-400">
                    <span>Yearly Revenue (2025)</span>

                    <p className="text-[11px] font-bold text-gray-500 text-center uppercase tracking-tighter">
                      Total Empire Revenue this year: <span className="text-purple-600">₦{stats.revenue.toLocaleString()}</span>
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-gray-100 h-40 md:h-48 flex items-end justify-between gap-1.5 px-4 md:px-8">
                    {[20, 35, 30, 50, 65, 80].map((h, i) => (
                      <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-gray-900 rounded-t-lg opacity-20" />
                    ))}
                    <div style={{ height: '90%' }} className="flex-1 bg-purple-600 rounded-t-lg shadow-lg" />
                    {[40, 40, 40, 40, 40].map((h, i) => (
                      <div key={i} style={{ height: `${h}%` }} className="flex-1 border-t-2 border-dashed border-gray-200" />
                    ))}
                  </div>
                  <p className="text-[11px] font-bold text-gray-500 text-center uppercase tracking-tighter">Projected expansion of your business</p>
                </div>
              </div>

              <div className="p-6 md:p-8 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center border-t border-gray-100">
                 <div className="flex gap-6 w-full md:w-auto justify-around md:justify-start">
                   <div>
                       <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase">Avg Order</p>
                       <p className="font-bold text-gray-900">₦{(stats.revenue / (initialOrders.length || 1)).toLocaleString()}</p>
                   </div>
                   <div className="border-x border-gray-200 px-6">
                       <p className="font-bold text-gray-900">
                         ₦{initialOrders.length > 0 
                         ? (stats.revenue / initialOrders.length).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) 
                         : "0.00"}
                       </p>
                       <p className="font-bold text-gray-900">{initialOrders.length}</p>
                   </div>
                 </div>
                 <button onClick={() => setIsAnalyticsOpen(false)} className="w-full md:w-auto px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm shadow-xl">Close Report</button>
              </div>
            </div>
          </div>
        )}

        {isLocked && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-l-4 border-l-red-600">
             <div className="flex items-center gap-3">
               <AlertTriangle className="text-red-500 shrink-0" />
               <div className="text-sm">
                 <span className="font-bold text-red-900">Subscription Expired.</span> Your business is currently paused and invisible to customers.
               </div>
             </div>
             <Link href="/dashboard/subscription" className="w-full md:w-auto px-6 py-2 bg-red-600 text-white text-xs font-black rounded-lg hover:bg-red-700 text-center uppercase tracking-wider">Unlock My Store</Link>
          </div>
        )}

        {isFreeLimitReached && !isLocked && (
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
             <div className="flex items-center gap-3">
               <Crown className="text-amber-600 shrink-0" />
               <div className="text-sm">
                 <span className="font-bold text-amber-900">Limit Reached.</span> You've hit the 5-product limit.
               </div>
             </div>
             <Link href="/dashboard/subscription" className="px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-lg hover:bg-amber-600 w-full md:w-auto text-center">Upgrade Plan</Link>
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-100 no-scrollbar">
           {['products', 'orders', 'settings'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all whitespace-nowrap ${
                 activeTab === tab 
                   ? 'bg-gray-900 text-white shadow-lg' 
                   : 'text-gray-500 hover:bg-gray-100'
               }`}
             >
               {tab}
             </button>
           ))}
        </div>

        {activeTab === "products" && (
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

            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
               {initialProducts.length === 0 ? (
                 <div className="p-12 text-center text-gray-400">
                   <Package size={48} className="mx-auto mb-4 opacity-20"/>
                   <p>No products yet. Add your first one!</p>
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
                     {initialProducts.map((p) => (
                       <tr key={p.id} className="hover:bg-gray-50/80 transition">
                         <td className="px-6 py-4 font-bold text-gray-900 truncate max-w-[150px] md:max-w-[200px] text-sm md:text-base">{p.name}</td>
                         <td className="px-6 py-4 text-gray-500 text-xs md:text-sm">
                           <span className="px-2 py-1 bg-gray-100 rounded-lg font-bold">{p.categories?.name || 'Uncategorized'}</span>
                         </td>
                         <td className="px-6 py-4 text-emerald-600 font-bold text-xs md:text-sm whitespace-nowrap">₦{p.price.toLocaleString()}</td>
                         <td className="px-6 py-4 text-xs md:text-sm">
                           {p.stock_quantity === 0 
                             ? <span className="text-red-500 font-bold bg-red-50 px-2 py-1 rounded-lg">Sold Out</span> 
                             : <span className="text-gray-600 font-bold">{p.stock_quantity}</span>
                           }
                         </td>
                         <td className="px-6 py-4 text-right flex justify-end gap-1 md:gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFlashProduct(p);
                              }} 
                              className={`p-2 transition-all duration-500 rounded-lg ${
                                p.flash_drop_expiry && new Date(p.flash_drop_expiry) > new Date() 
                                  ? 'text-amber-500 bg-amber-50 shadow-inner scale-110' // Gold glow when active
                                  : 'text-gray-300 hover:text-amber-500 hover:bg-gray-50'
                              }`}
                              title={p.flash_drop_expiry && new Date(p.flash_drop_expiry) > new Date() ? "Active Drop" : "Start Flash Drop"}
                            >
                              <Zap 
                                size={18} 
                                fill={p.flash_drop_expiry && new Date(p.flash_drop_expiry) > new Date() ? "currentColor" : "none"} 
                                className={p.flash_drop_expiry && new Date(p.flash_drop_expiry) > new Date() ? "animate-pulse" : ""}
                              />
                            </button>
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(p);
                              }} 
                              className="p-2 text-gray-400 hover:text-blue-600 transition"
                            >
                              <Edit size={16}/>
                            </button>

                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteProduct(p.id);
                              }} 
                              className="p-2 text-gray-400 hover:text-red-600 transition"
                            >
                              <Trash2 size={16}/>
                            </button>
                          </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               )}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="font-bold text-lg text-gray-900 mb-6">Recent Orders</h3>
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
              {initialOrders.length === 0 ? (
                 <div className="p-12 text-center text-gray-400">
                   <ShoppingBag size={48} className="mx-auto mb-4 opacity-20"/>
                   <p>No orders yet. Share your store link!</p>
                 </div>
              ) : (
                 <table className="w-full text-left min-w-[600px]">
                   <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase text-gray-500">
                     <tr>
                       <th className="px-6 py-4 font-bold">Customer</th>
                       <th className="px-6 py-4 font-bold">Total</th>
                       <th className="px-6 py-4 font-bold">Status</th>
                       <th className="px-6 py-4 font-bold text-right">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     {initialOrders.map((order) => (
                       <tr key={order.id} className="hover:bg-gray-50/80 transition cursor-pointer" onClick={() => setSelectedOrder(order)}>
                         <td className="px-6 py-4">
                           <div className="font-bold text-gray-900 text-sm">{order.customer_name}</div>
                           <div className="text-[10px] text-gray-400">{new Date(order.created_at).toLocaleDateString()}</div>
                         </td>
                         <td className="px-6 py-4 text-emerald-600 font-bold text-sm whitespace-nowrap">₦{order.total_amount.toLocaleString()}</td>
                         <td className="px-6 py-4 text-sm">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                              order.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                              order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {order.status}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-right whitespace-nowrap">
                           <button className="text-[10px] font-bold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg">Details</button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <StoreSettings store={store} onUpdate={() => router.refresh()} />
           </div>
        )}

      <AddProductModal storeId={store.id} isOpen={isAddModalOpen} onClose={closeProductModal} onSuccess={() => router.refresh()} productToEdit={productToEdit} />
      <CategoryManager storeId={store.id} isOpen={isCatModalOpen} onClose={() => setIsCatModalOpen(false)} onSuccess={() => router.refresh()} />
      <OrderDetailsModal order={selectedOrder} storeName={store.name} isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} onUpdate={() => router.refresh()} />

      <FlashDropModal 
        product={selectedFlashProduct} 
        isOpen={!!selectedFlashProduct} 
        onClose={() => setSelectedFlashProduct(null)} 
        onSuccess={() => router.refresh()} 
      />
    </div>
  );
}