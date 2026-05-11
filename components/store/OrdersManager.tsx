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
import { enrichOrderItemsWithProductNames, orderLineLabel } from "@/lib/orderItemDisplay";
import OrderLineThumb from "@/components/orders/OrderLineThumb";

function lineUnitPrice(item: { unit_price?: unknown; price?: unknown }): number {
  const u = item?.unit_price ?? item?.price;
  return Number(u) || 0;
}

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
  sellerId: string;
  onUpdate: () => void;
}

export default function OrdersManager({ sellerId, onUpdate }: OrdersManagerProps) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const fetchOrders = async () => {
    setLoading(true);
    
    const { data: profileRow } = await supabase
      .from("profiles")
      .select("display_name, full_name, location, phone_number")
      .eq("id", sellerId)
      .maybeSingle();

    setStoreInfo(
      profileRow
        ? {
            name: profileRow.display_name?.trim() || profileRow.full_name?.trim() || "Store",
            location: profileRow.location,
            phone: profileRow.phone_number,
          }
        : null
    );

    const { data: ordersData, error } = await supabase
      .from("orders")
      .select("*")
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    const orderIds = ordersData.map(o => o.id);
    const { data: itemsData } = await supabase.from("order_items").select("*").in("order_id", orderIds);
    const enrichedItems = await enrichOrderItemsWithProductNames(
      supabase,
      (itemsData || []) as Record<string, unknown>[]
    );

    const fullOrders = ordersData.map(order => ({
      ...order,
      items: enrichedItems.filter((item) => item.order_id === order.id),
    }));

    setOrders(fullOrders);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [sellerId]);

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

  const generateReceipt = (order: Order & { currency_code?: string | null; payment_reference?: string | null; customer_email?: string | null }) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const currency = String(order.currency_code || "NGN").toUpperCase();
    const fmtMoney = (n: number) => `₦${n.toLocaleString()} ${currency}`;

    doc.setFillColor(33, 33, 33);
    doc.rect(0, 0, pageWidth, 20, "F");
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
    doc.text(storeInfo?.location || "", 20, 46);
    doc.text(`Contact: ${storeInfo?.phone ?? ""}`, 20, 51);

    doc.setFont("helvetica", "bold");
    doc.text("RECEIPT", pageWidth - 60, 40);
    doc.setFont("helvetica", "normal");
    doc.text(`#${order.id.slice(0, 8).toUpperCase()}`, pageWidth - 60, 46);
    doc.text(`${new Date(order.created_at).toLocaleString()}`, pageWidth - 60, 51);

    doc.setTextColor(0, 150, 0);
    doc.setFont("helvetica", "bold");
    doc.text(String(order.status || "").toUpperCase() || "PAID", pageWidth - 60, 57);
    doc.setTextColor(0, 0, 0);

    doc.setDrawColor(220, 220, 220);
    doc.line(20, 65, pageWidth - 20, 65);

    let metaY = 72;
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    if (order.payment_reference) {
      const refLines = doc.splitTextToSize(`Payment ref: ${String(order.payment_reference)}`, pageWidth - 40);
      doc.text(refLines, 20, metaY);
      metaY += refLines.length * 4 + 2;
    }
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    doc.setTextColor(100, 100, 100);
    doc.text("BILLED TO:", 20, metaY + 6);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(order.customer_name, 20, metaY + 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(order.customer_phone, 20, metaY + 20);
    let billY = metaY + 26;
    if (order.customer_email?.trim()) {
      doc.text(order.customer_email.trim(), 20, billY);
      billY += 6;
    }
    const addrLines = doc.splitTextToSize(order.customer_address || "No address provided", pageWidth - 40);
    doc.text(addrLines, 20, billY);
    billY += addrLines.length * 5;

    const tableBody = order.items?.map((item) => {
      const up = lineUnitPrice(item);
      const qty = Number(item.quantity) || 0;
      return [orderLineLabel(item), String(qty), fmtMoney(up), fmtMoney(up * qty)];
    });

    autoTable(doc, {
      startY: billY + 8,
      head: [["Item", "Qty", "Unit price", "Line total"]],
      body: tableBody,
      theme: "grid",
      headStyles: { fillColor: [33, 33, 33], textColor: 255, fontStyle: "bold" },
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: 20, halign: "center" },
        2: { cellWidth: 35, halign: "right" },
        3: { cellWidth: 35, halign: "right" },
      },
    });

    let finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL PAID: ${fmtMoney(Number(order.total_amount))}`, pageWidth - 20, finalY, { align: "right" });

    finalY += 14;
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text("Full order ID (support):", 20, finalY);
    finalY += 4;
    doc.setFont("courier", "normal");
    const idLines = doc.splitTextToSize(String(order.id), pageWidth - 40);
    doc.text(idLines, 20, finalY);
    finalY += idLines.length * 3.5 + 10;

    if (finalY > pageHeight - 28) {
      doc.addPage();
      finalY = 24;
    }
    doc.setDrawColor(220, 220, 220);
    doc.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for your patronage.", 20, pageHeight - 15);

    doc.setFont("helvetica", "bold");
    doc.text("Create your own store at www.storelink.com", pageWidth - 20, pageHeight - 15, { align: "right" });

    doc.save(`Receipt-${order.id.slice(0, 8)}.pdf`);
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
                   <div key={item.id} className="flex justify-between items-center gap-2 text-sm border-b border-gray-50 pb-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <OrderLineThumb
                          size="sm"
                          src={item._resolved_product_image_url}
                          alt={orderLineLabel(item)}
                        />
                        <span className="text-gray-700 truncate">
                          {item.quantity}x {orderLineLabel(item)}
                        </span>
                      </div>
                      <span className="text-gray-900 font-medium shrink-0">
                        ₦{(lineUnitPrice(item) * Number(item.quantity)).toLocaleString()}
                      </span>
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