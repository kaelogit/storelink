"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShoppingBag, Loader2, Search, Filter } from "lucide-react";
import OrderDetailsModal from "@/components/dashboard/OrderDetailsModal"; // 👈 Importing your existing component

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [storeName, setStoreName] = useState("Your Store"); // 👈 To pass to the receipt
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: store } = await supabase
      .from('stores')
      .select('id, name')
      .eq('owner_id', user.id)
      .single();

    if (!store) return;
    setStoreName(store.name);

    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('store_id', store.id)
      .order('created_at', { ascending: false });

    if (data) setOrders(data);
    setLoading(false);
  }

  const filteredOrders = orders.filter(o => 
     o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
     o.id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-gray-300" size={32}/>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Orders</h1>
          <p className="text-gray-500">Manage and track your customer orders.</p>
        </div>
        
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
           <input 
             className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 transition"
             placeholder="Search customer or ID..."
             value={search}
             onChange={e => setSearch(e.target.value)}
           />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        {filteredOrders.length === 0 ? (
           <div className="p-20 text-center text-gray-400">
             <ShoppingBag size={48} className="mx-auto mb-4 opacity-20"/>
             <p>No orders found.</p>
           </div>
        ) : (
           <div className="overflow-x-auto">
             <table className="w-full text-left min-w-[700px]">
               <thead className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500">
                 <tr>
                   <th className="px-6 py-4 font-bold">Order ID</th>
                   <th className="px-6 py-4 font-bold">Customer</th>
                   <th className="px-6 py-4 font-bold">Total</th>
                   <th className="px-6 py-4 font-bold">Status</th>
                   <th className="px-6 py-4 font-bold">Date</th>
                   <th className="px-6 py-4 font-bold text-right">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {filteredOrders.map((order) => (
                   <tr key={order.id} className="hover:bg-gray-50/80 transition cursor-pointer" onClick={() => setSelectedOrder(order)}>
                     <td className="px-6 py-4 font-mono text-xs text-gray-400">#{order.id.slice(0, 8)}</td>
                     <td className="px-6 py-4 font-bold text-gray-900">{order.customer_name}</td>
                     <td className="px-6 py-4 text-emerald-600 font-bold">₦{order.total_amount.toLocaleString()}</td>
                     <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase ${
                          order.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                          order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {order.status}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                     <td className="px-6 py-4 text-right">
                       <button className="text-xs font-bold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-900 hover:text-white transition">
                         View
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        )}
      </div>

      <OrderDetailsModal 
         order={selectedOrder}
         storeName={storeName} // 👈 Passes the real store name for the PDF receipt
         isOpen={!!selectedOrder}
         onClose={() => setSelectedOrder(null)}
         onUpdate={fetchOrders}
       />
    </div>
  );
}