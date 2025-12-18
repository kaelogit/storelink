"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Package, ShoppingBag, Settings, Plus, ExternalLink, 
  Crown, AlertTriangle, Eye, TrendingUp, Tags, Edit, Trash2
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
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [productToEdit, setProductToEdit] = useState<any>(null);

  const isPremium = store.subscription_plan === 'premium';
  const isDiamond = store.subscription_plan === 'diamond';
  const isFree = store.subscription_plan === 'free';
  const isExpired = store.subscription_expiry && new Date(store.subscription_expiry) < new Date();
  const isFreeLimitReached = isFree && stats.productCount >= 5;

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
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

  const closeProductModal = () => {
    setIsAddModalOpen(false);
    setProductToEdit(null); 
  };

  return (
    <div className="space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2 flex-wrap tracking-tight">
              Dashboard
              {isDiamond && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-md border border-purple-200 whitespace-nowrap font-bold">Diamond</span>}
              {isPremium && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-md border border-blue-200 whitespace-nowrap font-bold">Premium</span>}
              {isFree && <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md border border-gray-200 whitespace-nowrap font-bold">Free</span>}
            </h1>
            
            <p className="text-gray-500 text-sm mt-1">
              Welcome Back, <span className="font-bold text-gray-900">{store.name}</span> (Manage your Empire)
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <a href={`/${store.slug}`} target="_blank" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition shadow-lg shadow-gray-200">
              <ExternalLink size={16} /> View Store
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp size={20}/></div>
               <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Revenue</span>
             </div>
             <p className="text-3xl font-black text-gray-900">₦{stats.revenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Package size={20}/></div>
               <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Products</span>
             </div>
             <div className="flex items-baseline gap-2">
               <p className="text-3xl font-black text-gray-900">{stats.productCount}</p>
               {isFree && <span className="text-xs font-bold text-gray-400">/ 5 Limit</span>}
             </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Eye size={20}/></div>
               <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Views</span>
             </div>
             <p className="text-3xl font-black text-gray-900">{stats.views.toLocaleString()}</p>
          </div>
        </div>

        <ShareStore slug={store.slug} />

        {isExpired && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 animate-pulse">
             <div className="flex items-center gap-3">
               <AlertTriangle className="text-red-500 shrink-0" />
               <div className="text-sm">
                 <span className="font-bold text-red-900">Plan Expired.</span> Your store is currently hidden.
               </div>
             </div>
             <Link href="/dashboard/subscription" className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 w-full md:w-auto text-center">Renew Now</Link>
          </div>
        )}

        {isFreeLimitReached && !isExpired && (
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

        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-100">
           {['products', 'orders', 'settings'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                 activeTab === tab 
                   ? 'bg-gray-900 text-white shadow-lg shadow-gray-200' 
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
                    <Tags size={16}/> Categories
                 </button>
                 <button onClick={() => setIsAddModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-500 transition">
                    <Plus size={16}/> Add Product
                 </button>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
               {initialProducts.length === 0 ? (
                 <div className="p-12 text-center text-gray-400">
                   <Package size={48} className="mx-auto mb-4 opacity-20"/>
                   <p>No products yet. Add your first one!</p>
                 </div>
               ) : (
                 <div className="overflow-x-auto">
                   <table className="w-full text-left min-w-[600px]">
                     <thead className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500">
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
                           <td className="px-6 py-4 font-bold text-gray-900 truncate max-w-[200px]">{p.name}</td>
                           <td className="px-6 py-4 text-gray-500 text-sm">
                             <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-bold">{p.categories?.name || 'Uncategorized'}</span>
                           </td>
                           <td className="px-6 py-4 text-emerald-600 font-bold text-sm">₦{p.price.toLocaleString()}</td>
                           <td className="px-6 py-4 text-sm">
                             {p.stock_quantity === 0 
                               ? <span className="text-red-500 font-bold bg-red-50 px-2 py-1 rounded-lg text-xs">Out of Stock</span> 
                               : <span className="text-gray-600 font-bold">{p.stock_quantity}</span>
                             }
                           </td>
                           <td className="px-6 py-4 text-right flex justify-end gap-2">
                              <button onClick={() => openEditModal(p)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition">
                                 <Edit size={16}/>
                              </button>
                              <button onClick={() => deleteProduct(p.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition">
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
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="font-bold text-lg text-gray-900 mb-6">Recent Orders</h3>
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
              {initialOrders.length === 0 ? (
                 <div className="p-12 text-center text-gray-400">
                   <ShoppingBag size={48} className="mx-auto mb-4 opacity-20"/>
                   <p>No orders yet. Share your store link!</p>
                 </div>
              ) : (
                 <div className="overflow-x-auto">
                   <table className="w-full text-left min-w-[600px]">
                     <thead className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500">
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
                             <div className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</div>
                           </td>
                           <td className="px-6 py-4 text-emerald-600 font-bold text-sm">₦{order.total_amount.toLocaleString()}</td>
                           <td className="px-6 py-4 text-sm">
                              <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase ${
                                order.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {order.status}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                             <button className="text-xs font-bold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-900 hover:text-white transition">View Details</button>
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

        {activeTab === "settings" && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <StoreSettings store={store} />
           </div>
        )}

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
         storeName={store.name}
         isOpen={!!selectedOrder}
         onClose={() => setSelectedOrder(null)}
         onUpdate={() => router.refresh()}
       />

    </div>
  );
}