"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Loader2, CheckCircle, XCircle, Clock, ChevronDown, 
  ChevronUp, Package, Phone, MapPin, Download 
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  items?: any[];
  store?: { name: string; location: string; phone: string };
}

interface OrdersManagerProps {
  storeId: string;
  onUpdate: () => void; 
}


export default function OrdersManager({ storeId, onUpdate }: OrdersManagerProps) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const fetchOrders = async () => {
    setLoading(true);
    
    const { data: storeData } = await supabase.from("stores").select("name, location, whatsapp_number").eq("id", storeId).single();
    setStoreInfo(storeData);

    const { data: ordersData, error } = await supabase
      .from("orders")
      .select("*")
      .eq("store_id", storeId)
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    const orderIds = ordersData.map(o => o.id);
    const { data: itemsData } = await supabase.from("order_items").select("*").in("order_id", orderIds);

    const fullOrders = ordersData.map(order => ({
      ...order,
      items: itemsData?.filter(item => item.order_id === order.id) || []
    }));

    setOrders(fullOrders);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [storeId]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    if (!confirm(`Mark this order as ${newStatus}?`)) return;

    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);

    if (error) setErrorMsg(error.message);
    else {
      router.refresh(); 
      fetchOrders();  
      onUpdate();       
    }
  };

  const generateReceipt = (order: Order) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(33, 33, 33); 
    doc.rect(0, 0, pageWidth, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("VERIFIED ORDER • POWERED BY STORELINK", 10, 13);
    doc.setFont("helvetica", "normal");
    doc.text("storelink.com", pageWidth - 40, 13);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(storeInfo?.name || "Store Receipt", 20, 40);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(storeInfo?.location || "Lagos, Nigeria", 20, 46);
    doc.text(`WhatsApp: ${storeInfo?.whatsapp_number}`, 20, 51);

    doc.setFont("helvetica", "bold");
    doc.text("RECEIPT", pageWidth - 60, 40);
    doc.setFont("helvetica", "normal");
    doc.text(`#${order.id.slice(0, 8).toUpperCase()}`, pageWidth - 60, 46);
    doc.text(`${new Date(order.created_at).toLocaleDateString()}`, pageWidth - 60, 51);
    
    doc.setTextColor(0, 150, 0); // Green
    doc.setFont("helvetica", "bold");
    doc.text("PAID", pageWidth - 60, 57);
    doc.setTextColor(0, 0, 0); // Reset

    doc.setDrawColor(220, 220, 220);
    doc.line(20, 65, pageWidth - 20, 65);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("BILLED TO:", 20, 75);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(order.customer_name, 20, 82);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(order.customer_phone, 20, 88);
    doc.text(order.customer_address || "No Address Provided", 20, 93);

    const tableBody = order.items?.map(item => [
      item.product_name,
      item.quantity.toString(),
      `N${item.price.toLocaleString()}`,
      `N${(item.price * item.quantity).toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: 105,
      head: [['ITEM DESCRIPTION', 'QTY', 'PRICE', 'TOTAL']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [33, 33, 33], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 'auto' }, 
        1: { cellWidth: 20, halign: 'center' }, 
        2: { cellWidth: 30, halign: 'right' }, 
        3: { cellWidth: 30, halign: 'right' } 
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL PAID: N${order.total_amount.toLocaleString()}`, pageWidth - 20, finalY, { align: "right" });

    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setDrawColor(220, 220, 220);
    doc.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for your patronage.", 20, pageHeight - 15);
    
    doc.setFont("helvetica", "bold");
    doc.text("Create your own store at www.storelink.com", pageWidth - 20, pageHeight - 15, { align: "right" });

    doc.save(`Receipt-${order.id.slice(0,8)}.pdf`);
  };

  if (loading) return <div className="py-10 text-center"><Loader2 className="animate-spin mx-auto text-gray-400" /></div>;

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center flex flex-col items-center">
         <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
           <Package className="text-gray-300 w-8 h-8" />
         </div>
         <h3 className="text-lg font-bold text-gray-900">No orders yet</h3>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
          
          <div 
            className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer bg-gray-50/50"
            onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
          >
            <div className="flex items-center gap-4">
               <div className={`
                 w-10 h-10 rounded-full flex items-center justify-center
                 ${order.status === 'completed' ? 'bg-green-100 text-green-600' : 
                   order.status === 'cancelled' ? 'bg-red-100 text-red-600' : 
                   'bg-yellow-100 text-yellow-600'}
               `}>
                 {order.status === 'completed' ? <CheckCircle size={20}/> : 
                  order.status === 'cancelled' ? <XCircle size={20}/> : 
                  <Clock size={20}/>}
               </div>

               <div>
                 <h3 className="font-bold text-gray-900 text-sm md:text-base">{order.customer_name}</h3>
                 <p className="text-xs text-gray-500">
                    #{order.id.slice(0, 8)} • {new Date(order.created_at).toLocaleDateString()}
                 </p>
               </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pl-14 md:pl-0">
               <span className="font-bold text-gray-900">₦{order.total_amount.toLocaleString()}</span>
               {expandedOrderId === order.id ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
            </div>
          </div>

          {expandedOrderId === order.id && (
            <div className="p-4 border-t border-gray-100 bg-white animate-in slide-in-from-top-2">
               
               <div className="grid grid-cols-1 gap-3 mb-4 bg-gray-50 p-3 rounded-xl text-xs md:text-sm">
                  <div className="flex gap-2"><Phone size={14} className="text-gray-400"/> {order.customer_phone}</div>
                  <div className="flex gap-2"><MapPin size={14} className="text-gray-400"/> {order.customer_address}</div>
               </div>

               <div className="space-y-2 mb-6">
                 {order.items?.map((item: any) => (
                   <div key={item.id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                      <span className="text-gray-700">{item.quantity}x {item.product_name}</span>
                      <span className="text-gray-900 font-medium">₦{(item.price * item.quantity).toLocaleString()}</span>
                   </div>
                 ))}
               </div>

               {order.status === 'pending' && (
                 <div className="flex flex-col md:flex-row gap-2">
                    <button onClick={() => updateStatus(order.id, 'completed')} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold text-sm shadow-md hover:bg-green-700 transition">Confirm Payment</button>
                    <button onClick={() => updateStatus(order.id, 'cancelled')} className="flex-1 bg-gray-100 text-red-600 py-3 rounded-xl font-bold text-sm hover:bg-red-50 transition">Cancel Order</button>
                 </div>
               )}
               
               {order.status === 'completed' && (
                 <div className="flex flex-col gap-3">
                   <div className="text-center py-2 bg-green-50 text-green-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2">
                     <CheckCircle size={14} /> Payment Verified
                   </div>
                   {errorMsg && <p className="text-red-500 text-xs mb-2">{errorMsg}</p>}
                   <button 
                     onClick={() => generateReceipt(order)}
                     className="w-full flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
                   >
                     <Download size={16} /> Download Receipt (PDF)
                   </button>
                 </div>
               )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}