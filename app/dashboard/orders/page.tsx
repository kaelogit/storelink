"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  ShoppingBag, Loader2, Search, Coins, TrendingUp, 
  Wallet, FileSpreadsheet, Calendar 
} from "lucide-react";
import OrderDetailsModal from "@/components/dashboard/OrderDetailsModal";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [storeName, setStoreName] = useState("Your Store");
  const [search, setSearch] = useState("");
  
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [totalCoinsGiven, setTotalCoinsGiven] = useState(0);

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

    if (data) {
      setOrders(data);
      calculateStats(data);
    }
    setLoading(false);
  }

  const calculateStats = (allOrders: any[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyData = allOrders.filter(o => {
      const orderDate = new Date(o.created_at);
      return o.status === 'completed' && 
             orderDate.getMonth() === currentMonth && 
             orderDate.getFullYear() === currentYear;
    });

    const revenue = monthlyData.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const coins = monthlyData.reduce((sum, o) => sum + (o.coins_redeemed || 0), 0);

    setMonthlyRevenue(revenue);
    setTotalCoinsGiven(coins);
  };

  const downloadStatement = () => {
    const now = new Date();
    const monthName = now.toLocaleString('default', { month: 'long' });
    
    let csvContent = "Order ID,Date,Customer,Subtotal,Coins Used,Cash Paid,Status\n";

    const currentMonthData = orders.filter(o => {
      const d = new Date(o.created_at);
      return o.status === 'completed' && d.getMonth() === now.getMonth();
    });

    currentMonthData.forEach(o => {
      const subtotal = o.total_amount + (o.coins_redeemed || 0);
      const row = [
        o.id.slice(0, 8),
        new Date(o.created_at).toLocaleDateString(),
        o.customer_name.replace(/,/g, ""), 
        subtotal,
        o.coins_redeemed || 0,
        o.total_amount,
        o.status
      ].join(",");
      csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `StoreLink_Statement_${monthName}_${now.getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Orders</h1>
          <p className="text-gray-500 font-medium">Manage and track your customer orders.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
             <input 
               className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 transition font-bold text-sm"
               placeholder="Search orders..."
               value={search}
               onChange={e => setSearch(e.target.value)}
             />
          </div>
          <button 
            onClick={downloadStatement}
            className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm text-gray-600 group"
            title="Download Statement"
          >
            <FileSpreadsheet size={20} className="group-hover:text-emerald-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">True Profit (This Month)</p>
            <h2 className="text-4xl font-black tracking-tighter">₦{monthlyRevenue.toLocaleString()}</h2>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
               <TrendingUp size={14}/> Net Cash Received
            </div>
          </div>
          <Wallet size={120} className="absolute -right-8 -bottom-8 text-white/5 rotate-12" />
        </div>

        <div className="bg-white border-2 border-amber-100 p-6 rounded-[2rem] shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 mb-1">Empire Discounts Given</p>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter">₦{totalCoinsGiven.toLocaleString()}</h2>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
               <Coins size={14} fill="currentColor"/> Loyalty Contribution
            </div>
          </div>
          <Coins size={120} className="absolute -right-8 -bottom-8 text-amber-500/5 -rotate-12" />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        {filteredOrders.length === 0 ? (
           <div className="p-20 text-center text-gray-400">
             <ShoppingBag size={48} className="mx-auto mb-4 opacity-20"/>
             <p className="font-bold uppercase text-[10px] tracking-widest">No orders found.</p>
           </div>
        ) : (
           <div className="overflow-x-auto">
             <table className="w-full text-left min-w-[850px]">
               <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase text-gray-400 tracking-widest">
                 <tr>
                   <th className="px-6 py-5 font-black">Order ID</th>
                   <th className="px-6 py-5 font-black">Customer</th>
                   <th className="px-6 py-5 font-black">Empire Coins</th>
                   <th className="px-6 py-5 font-black">Cash Total</th>
                   <th className="px-6 py-5 font-black">Status</th>
                   <th className="px-6 py-5 font-black">Date</th>
                   <th className="px-6 py-5 font-black text-right">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {filteredOrders.map((order) => (
                   <tr key={order.id} className="hover:bg-gray-50/80 transition cursor-pointer group" onClick={() => setSelectedOrder(order)}>
                     <td className="px-6 py-4 font-mono text-[10px] text-gray-400">#{order.id.slice(0, 8)}</td>
                     <td className="px-6 py-4 font-bold text-gray-900 text-sm">{order.customer_name}</td>
                     <td className="px-6 py-4">
                        {order.coins_redeemed > 0 ? (
                          <div className="flex items-center gap-1.5 text-amber-600 font-black text-sm">
                            <Coins size={14} fill="currentColor" />
                            <span>-₦{order.coins_redeemed.toLocaleString()}</span>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                     </td>
                     <td className="px-6 py-4 text-emerald-700 font-black text-sm">₦{order.total_amount.toLocaleString()}</td>
                     <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${
                          order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {order.status === 'completed' ? 'Paid' : order.status}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-xs font-bold text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                     <td className="px-6 py-4 text-right">
                       <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 px-4 py-2 rounded-xl group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900 transition-all">
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
          storeName={storeName} 
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={fetchOrders}
       />
    </div>
  );
}