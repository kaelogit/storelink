"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Package, ShoppingBag, Settings, LogOut, 
  Plus, ExternalLink, Crown, AlertTriangle, Eye, TrendingUp, Copy, Check, Tags, Edit, Trash2, Menu, X
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import AddProductModal from "@/components/store/AddProductModal";
import CategoryManager from "@/components/store/CategoryManager";
import OrderDetailsModal from "@/components/dashboard/OrderDetailsModal";
import StoreSettings from "@/components/dashboard/StoreSettings";
import ShareStore from "./ShareStore";

interface DashboardClientProps {
  store: any;
  initialProducts: any[];
  initialOrders: any[];
  stats: { revenue: number; productCount: number; views: number };
}

export default function DashboardClient({ store, initialProducts, initialOrders, stats }: DashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("products");
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [productToEdit, setProductToEdit] = useState<any>(null);


  const isPremium = store.subscription_plan === 'premium';
  const isDiamond = store.subscription_plan === 'diamond';
  const isFree = store.subscription_plan === 'free';
  const isExpired = store.subscription_expiry && new Date(store.subscription_expiry) < new Date();
  const isFreeLimitReached = isFree && stats.productCount >= 5;


  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) router.refresh();
  };

  const openEditModal = (product: any) => {
    setProductToEdit(product);
    setIsAddModalOpen(true);
  };

  const closeProductModal = () => {
    setIsAddModalOpen(false);
    setProductToEdit(null); 
  };

  const navClick = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col md:flex-row">
      
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-30">
        <Link href="/" className="font-extrabold text-lg text-gray-900 flex items-center gap-2">
           <LayoutDashboard className="text-emerald-600" size={20}/> StoreLink
        </Link>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-700">
           <Menu size={24} />
        </button>
      </div>

      <div className={`
        fixed inset-0 z-40 transform transition-transform duration-300 md:relative md:translate-x-0 md:w-64 bg-white border-r border-gray-200 flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex justify-between items-center">
          <Link href="/" className="font-extrabold text-xl tracking-tight text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="text-emerald-600"/> StoreLink
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-500">
            <X size={24} />
          </button>
        </div>
        
        <nav className="px-4 space-y-1 flex-1">
          <button onClick={() => navClick("products")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === "products" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50"}`}>
            <Package size={18} /> Products
          </button>
          <button onClick={() => navClick("orders")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === "orders" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50"}`}>
            <ShoppingBag size={18} /> Orders
          </button>
          <button onClick={() => navClick("settings")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === "settings" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50"}`}>
            <Settings size={18} /> Settings
          </button>
          <Link href="/dashboard/subscription" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition text-gray-500 hover:bg-gray-50`}>
            <Crown size={18} className="text-yellow-500" /> Subscription
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-full">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
              Dashboard
              {isDiamond && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-md border border-purple-200 whitespace-nowrap">Diamond</span>}
              {isPremium && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-md border border-blue-200 whitespace-nowrap">Premium</span>}
              {isFree && <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md border border-gray-200 whitespace-nowrap">Free</span>}
            </h1>
            
            <p className="text-gray-500 text-sm mt-1">
              Welcome Back, <span className="font-bold text-gray-900">{store.name}</span> (Manage your Empire)
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            
            <a href={`/${store.slug}`} target="_blank" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition">
              <ExternalLink size={16} /> View Store
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp size={20}/></div>
               <span className="text-sm font-bold text-gray-500">Revenue</span>
             </div>
             <p className="text-2xl font-extrabold text-gray-900">₦{stats.revenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Package size={20}/></div>
               <span className="text-sm font-bold text-gray-500">Products</span>
             </div>
             <div className="flex items-baseline gap-2">
               <p className="text-2xl font-extrabold text-gray-900">{stats.productCount}</p>
               {isFree && <span className="text-xs font-bold text-gray-400">/ 5 Limit</span>}
             </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Eye size={20}/></div>
               <span className="text-sm font-bold text-gray-500">Views</span>
             </div>
             <p className="text-2xl font-extrabold text-gray-900">{stats.views.toLocaleString()}</p>
          </div>
        </div>

        <div className="mb-8">
           <ShareStore slug={store.slug} />
        </div>

        {isExpired && (
          <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
             <div className="flex items-center gap-3">
               <AlertTriangle className="text-red-500 shrink-0" />
               <div className="text-sm">
                 <span className="font-bold text-red-900">Plan Expired.</span> Your store is currently hidden.
               </div>
             </div>
             <Link href="/dashboard/subscription" className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 w-full md:w-auto text-center">Renew</Link>
          </div>
        )}

        {isFreeLimitReached && !isExpired && (
          <div className="mb-6 bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
             <div className="flex items-center gap-3">
               <Crown className="text-yellow-600 shrink-0" />
               <div className="text-sm">
                 <span className="font-bold text-yellow-900">Limit Reached.</span> You've hit the 5-product limit.
               </div>
             </div>
             <Link href="/dashboard/subscription" className="px-4 py-2 bg-yellow-500 text-white text-xs font-bold rounded-lg hover:bg-yellow-600 w-full md:w-auto text-center">Upgrade</Link>
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h3 className="font-bold text-lg text-gray-900">Your Products</h3>
              <div className="flex gap-2 w-full md:w-auto">
                 <button onClick={() => setIsCatModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50">
                    <Tags size={16}/> Cats
                 </button>
                 <button onClick={() => setIsAddModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-gray-800">
                    <Plus size={16}/> Add
                 </button>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
               {initialProducts.length === 0 ? (
                 <div className="p-12 text-center text-gray-400">
                   <Package size={48} className="mx-auto mb-4 opacity-20"/>
                   <p>No products yet.</p>
                 </div>
               ) : (
                 <div className="overflow-x-auto">
                   <table className="w-full text-left min-w-[600px]">
                     <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500">
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
                         <tr key={p.id} className="hover:bg-gray-50/50 transition">
                           <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-[200px]">{p.name}</td>
                           <td className="px-6 py-4 text-gray-500 text-sm">{p.categories?.name || '-'}</td>
                           <td className="px-6 py-4 text-gray-900 font-bold text-sm">₦{p.price.toLocaleString()}</td>
                           <td className="px-6 py-4 text-sm">{p.stock_quantity === 0 ? <span className="text-red-500 font-bold">Out</span> : p.stock_quantity}</td>
                           <td className="px-6 py-4 text-right flex justify-end gap-2">
                              <button onClick={() => openEditModal(p)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                 <Edit size={16}/>
                              </button>
                              <button onClick={() => deleteProduct(p.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                 <Trash2 size={16}/>
                              </button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               )}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-6">Order History</h3>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              {initialOrders.length === 0 ? (
                 <div className="p-12 text-center text-gray-400">
                   <ShoppingBag size={48} className="mx-auto mb-4 opacity-20"/>
                   <p>No orders yet.</p>
                 </div>
              ) : (
                 <div className="overflow-x-auto">
                   <table className="w-full text-left min-w-[600px]">
                     <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500">
                       <tr>
                         <th className="px-6 py-4 font-bold">Customer</th>
                         <th className="px-6 py-4 font-bold">Total</th>
                         <th className="px-6 py-4 font-bold">Status</th>
                         <th className="px-6 py-4 font-bold text-right">Action</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                       {initialOrders.map((order) => (
                         <tr key={order.id} className="hover:bg-gray-50/50 transition cursor-pointer" onClick={() => setSelectedOrder(order)}>
                           <td className="px-6 py-4">
                             <div className="font-bold text-gray-900 text-sm">{order.customer_name}</div>
                           </td>
                           <td className="px-6 py-4 text-emerald-600 font-bold text-sm">₦{order.total_amount.toLocaleString()}</td>
                           <td className="px-6 py-4 text-sm capitalize">{order.status}</td>
                           <td className="px-6 py-4 text-right">
                             <button className="text-xs font-bold text-gray-500 border border-gray-200 px-2 py-1 rounded hover:bg-gray-100">View</button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && <StoreSettings store={store} />}

      </main>

      <AddProductModal 
        storeId={store.id} 
        isOpen={isAddModalOpen} 
        onClose={closeProductModal} 
        onSuccess={() => router.refresh()} 
        productToEdit={productToEdit} 
      />
      
      <CategoryManager 
         storeId={store.id} 
         isOpen={isCatModalOpen} 
         onClose={() => setIsCatModalOpen(false)} 
      />

      <OrderDetailsModal 
         order={selectedOrder}
         storeName={store.name} // <--- Added this line
         isOpen={!!selectedOrder}
         onClose={() => setSelectedOrder(null)}
         onUpdate={() => router.refresh()}
       />

    </div>
  );
}