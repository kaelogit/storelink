"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  ShoppingBag, Loader2, Search, Coins, TrendingUp, 
  Wallet, FileSpreadsheet,
} from "lucide-react";
import OrderDetailsModal from "@/components/dashboard/OrderDetailsModal";
import { formatOrderPayoutEligibleAt, orderCountsTowardSellerRevenue } from "@/lib/sellerOrderPayoutFlow";

function orderStatusBadgeClass(status: string | null | undefined) {
  const s = String(status || "").toUpperCase();
  if (["COMPLETED", "PAID"].includes(s)) return "bg-emerald-100 text-emerald-700";
  if (["AWAITING_PAYMENT", "PENDING"].includes(s)) return "bg-amber-100 text-amber-700";
  if (s === "CANCELLED") return "bg-red-100 text-red-700";
  if (s === "SHIPPED") return "bg-blue-100 text-blue-800";
  return "bg-gray-100 text-gray-600";
}

function orderStatusLabel(status: string | null | undefined) {
  const s = String(status || "").toUpperCase();
  if (s === "AWAITING_PAYMENT") return "Awaiting payment";
  return s || "—";
}

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

    const [{ data: store }, { data: profile }] = await Promise.all([
      supabase.from("stores").select("id, name").eq("owner_id", user.id).maybeSingle(),
      supabase.from("profiles").select("display_name, full_name").eq("id", user.id).maybeSingle(),
    ]);

    const displayName =
      profile?.display_name?.trim() ||
      profile?.full_name?.trim() ||
      store?.name ||
      "Your storefront";

    setStoreName(displayName);

    const { data } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          quantity,
          unit_price,
          product_name,
          product_id,
          item_type
        ),
        buyer:profiles!orders_user_id_fkey (
          id,
          display_name,
          full_name,
          email,
          phone_number,
          logo_url,
          slug
        )
      `
      )
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

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
      return (
        orderCountsTowardSellerRevenue(o.status) &&
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      );
    });

    const revenue = monthlyData.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const coins = monthlyData.reduce((sum, o) => sum + Number(o.coin_redeemed ?? o.coins_redeemed ?? 0), 0);

    setMonthlyRevenue(revenue);
    setTotalCoinsGiven(coins);
  };

  const downloadStatement = () => {
    const now = new Date();
    const monthName = now.toLocaleString('default', { month: 'long' });
    
    let csvContent =
      "Order ID,Date,Customer,Subtotal,Coins Used,Cash Paid,Status,Payout Status,Payout Eligible At\n";

    const currentMonthData = orders.filter(o => {
      const d = new Date(o.created_at);
      return orderCountsTowardSellerRevenue(o.status) && d.getMonth() === now.getMonth();
    });

    currentMonthData.forEach(o => {
      const coinUsed = Number(o.coin_redeemed ?? o.coins_redeemed ?? 0);
      const subtotal = Number(o.total_amount || 0) + coinUsed;
      const b = o.buyer as { display_name?: string; full_name?: string; email?: string } | null;
      const custLabel = String(
        b?.display_name?.trim() ||
          b?.full_name?.trim() ||
          b?.email?.trim() ||
          o.customer_name ||
          o.guest_name ||
          "",
      ).replace(/,/g, "");
      const row = [
        o.id.slice(0, 8),
        new Date(o.created_at).toLocaleDateString(),
        custLabel,
        subtotal,
        coinUsed,
        o.total_amount,
        o.status,
        String(o.payout_status ?? "").replace(/,/g, ""),
        formatOrderPayoutEligibleAt(o).replace(/,/g, " "),
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

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const buyer = o.buyer as { display_name?: string; full_name?: string; email?: string } | null;
    const nameBlob = [
      o.customer_name,
      o.guest_name,
      buyer?.display_name,
      buyer?.full_name,
      buyer?.email,
    ]
      .map((x) => String(x || "").toLowerCase())
      .join(" ");
    return nameBlob.includes(q) || o.id.toLowerCase().includes(q);
  });

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
          <p className="text-gray-500 font-medium">Product orders from your public storefront and checkout.</p>
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
        <div className="bg-gray-900 p-6 rounded-4xl text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">True Profit (This Month)</p>
            <h2 className="text-4xl font-black tracking-tighter">₦{monthlyRevenue.toLocaleString()}</h2>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
               <TrendingUp size={14}/> Net Cash Received
            </div>
          </div>
          <Wallet size={120} className="absolute -right-8 -bottom-8 text-white/5 rotate-12" />
        </div>

        <div className="bg-white border-2 border-amber-100 p-6 rounded-4xl shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 mb-1">Store Coin discounts given</p>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter">₦{totalCoinsGiven.toLocaleString()}</h2>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
               <Coins size={14} fill="currentColor"/> Loyalty Contribution
            </div>
          </div>
          <Coins size={120} className="absolute -right-8 -bottom-8 text-amber-500/5 -rotate-12" />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-4xl overflow-hidden shadow-sm">
        {filteredOrders.length === 0 ? (
           <div className="p-20 text-center text-gray-400">
             <ShoppingBag size={48} className="mx-auto mb-4 opacity-20"/>
             <p className="font-bold uppercase text-[10px] tracking-widest">No orders found.</p>
           </div>
        ) : (
           <div className="overflow-x-auto">
             <table className="w-full text-left min-w-[720px]">
               <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase text-gray-400 tracking-widest">
                 <tr>
                   <th className="px-6 py-5 font-black">Order ID</th>
                   <th className="px-6 py-5 font-black">Customer</th>
                   <th className="px-6 py-5 font-black">Store Coins</th>
                   <th className="px-6 py-5 font-black">Cash total</th>
                   <th className="px-6 py-5 font-black">Status</th>
                   <th className="px-6 py-5 font-black">Date</th>
                   <th className="px-6 py-5 font-black text-right">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {filteredOrders.map((order) => {
                   const coinUsed = Number(order.coin_redeemed ?? order.coins_redeemed ?? 0);
                   const buyerProf = order.buyer as {
                     display_name?: string | null;
                     full_name?: string | null;
                     logo_url?: string | null;
                     email?: string | null;
                   } | null;
                   const buyerLabel =
                     String(
                       buyerProf?.display_name?.trim() ||
                         buyerProf?.full_name?.trim() ||
                         order.customer_name ||
                         order.guest_name ||
                         "",
                     ).trim() || "Guest";
                   return (
                   <tr key={order.id} className="hover:bg-gray-50/80 transition group">
                     <td className="px-6 py-4 font-mono text-[10px] text-gray-400">#{order.id.slice(0, 8)}</td>
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                         {buyerProf?.logo_url ? (
                           // eslint-disable-next-line @next/next/no-img-element
                           <img
                             src={buyerProf.logo_url}
                             alt=""
                             className="w-9 h-9 rounded-xl object-cover border border-gray-100 shrink-0"
                           />
                         ) : (
                           <div className="w-9 h-9 rounded-xl bg-gray-100 shrink-0" />
                         )}
                         <div className="min-w-0">
                           <p className="font-bold text-gray-900 text-sm truncate">{buyerLabel}</p>
                           {buyerProf?.email ? (
                             <p className="text-[10px] text-gray-500 truncate">{buyerProf.email}</p>
                           ) : null}
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-4">
                        {coinUsed > 0 ? (
                          <div className="flex items-center gap-1.5 text-amber-600 font-black text-sm">
                            <Coins size={14} fill="currentColor" />
                            <span>-₦{coinUsed.toLocaleString()}</span>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                     </td>
                     <td className="px-6 py-4 text-emerald-700 font-black text-sm">₦{Number(order.total_amount || 0).toLocaleString()}</td>
                     <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${orderStatusBadgeClass(order.status)}`}>
                          {orderStatusLabel(order.status)}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-xs font-bold text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                     <td className="px-6 py-4 text-right">
                       <button
                         type="button"
                         className="text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 px-4 py-2 rounded-xl group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900 transition-all"
                         onClick={() => setSelectedOrder(order)}
                       >
                         View
                       </button>
                     </td>
                   </tr>
                 );
                 })}
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