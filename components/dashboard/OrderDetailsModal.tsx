"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  X, Download, CheckCircle, Lock, Coins, 
  AlertCircle, Loader2, Phone, MapPin 
} from "lucide-react"; 
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from "next/navigation";
import { describeSellerOrderPayoutFlow, formatOrderPayoutEligibleAt } from "@/lib/sellerOrderPayoutFlow";
import { enrichOrderItemsWithProductNames, orderLineLabel } from "@/lib/orderItemDisplay";
import OrderLineThumb from "@/components/orders/OrderLineThumb";

function orderCoinRedeemed(order: any): number {
  return Number(order?.coin_redeemed ?? order?.coins_redeemed ?? 0);
}

function orderBuyerProfile(order: any): { display_name?: string; full_name?: string; email?: string; phone_number?: string; logo_url?: string } | null {
  return order?.buyer ?? null;
}

function orderBuyerName(order: any): string {
  const b = orderBuyerProfile(order);
  const fromProf = String(b?.display_name?.trim() || b?.full_name?.trim() || "").trim();
  const n = String(fromProf || order?.customer_name || order?.guest_name || "").trim();
  return n || "Guest";
}

function orderBuyerPhone(order: any): string {
  const b = orderBuyerProfile(order);
  return String(b?.phone_number || order?.customer_phone || order?.guest_phone || "").trim() || "—";
}

function orderBuyerEmail(order: any): string {
  const b = orderBuyerProfile(order);
  return String(b?.email || order?.customer_email || order?.guest_email || "").trim() || "—";
}

function orderShippingAddress(order: any): string {
  return String(order?.shipping_address || order?.customer_address || "").trim() || "No address provided";
}

function lineUnitPrice(item: any): number {
  const u = item?.unit_price ?? item?.price;
  return Number(u) || 0;
}

interface OrderDetailsModalProps {
  order: any;
  storeName: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function OrderDetailsModal({ order, storeName, isOpen, onClose, onUpdate }: OrderDetailsModalProps) {
  const [items, setItems] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false); 
  const [localStatus, setLocalStatus] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen || !order) return;
    setLocalStatus(order.status);

    let cancelled = false;

    const load = async () => {
      const embedded = ((order.order_items as unknown[]) || []) as Record<string, unknown>[];
      let raw: Record<string, unknown>[] =
        embedded.length > 0 ? embedded : [];
      if (!raw.length) {
        const { data, error } = await supabase.from("order_items").select("*").eq("order_id", order.id);
        if (error) console.error("Error fetching items:", error.message);
        raw = (data || []) as Record<string, unknown>[];
      }
      const enriched = await enrichOrderItemsWithProductNames(supabase, raw);
      if (!cancelled) setItems(enriched as any[]);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [isOpen, order]);

  const handleStockDeduction = async () => {
    try {
      for (const item of items) {
        const { data: product } = await supabase.from("products").select("stock_quantity").eq("id", item.product_id).maybeSingle();

        if (product) {
          const currentStock = product.stock_quantity || 0;
          const newStock = Math.max(0, currentStock - item.quantity);
          
          const updatePayload: any = { stock_quantity: newStock };
          
          if (newStock === 0 && currentStock > 0) {
            updatePayload.sold_out_at = new Date().toISOString();
          }

          await supabase
            .from("products") 
            .update(updatePayload)
            .eq("id", item.product_id);
            
        }
      }
    } catch (err) {
      console.error("Stock Deduction Error:", err);
    }
  };

  const updateStatus = async (status: string) => {
    const displayStatus = status === "COMPLETED" ? "completed (paid out flow)" : status;
    const redeemedAmount = orderCoinRedeemed(order);
    
    const confirmMsg = status === "CANCELLED" && (redeemedAmount > 0)
      ? `Cancel order? This will automatically REFUND ₦${redeemedAmount.toLocaleString()} coins to the customer.`
      : `Mark order as ${displayStatus}? This will deduct purchased items from your stock.`;

    if (!confirm(confirmMsg)) return;
    
    setIsProcessing(true);
    try {
      let response;

      if (status === "CANCELLED") {
        response = await supabase.rpc('cancel_and_refund_order', { 
          order_id_param: order.id 
        });
      } else {
        response = await supabase.from("orders").update({ status }).eq("id", order.id);
        
        if (!response.error && status === "COMPLETED") {
          await handleStockDeduction();
        }
      }
      
      if (response.error) throw response.error;

      setLocalStatus(status);
      if (onUpdate) onUpdate(); 
      setTimeout(() => onClose(), 800);

    } catch (error: any) {
      console.error("Dashboard Update Error:", error);
      alert(`Update Failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const downloadReceipt = () => {
    const doc = new jsPDF();
    const currency = String(order.currency_code || "NGN").toUpperCase();
    const fmtMoney = (n: number) => `₦${n.toLocaleString()} ${currency}`;

    doc.setFillColor(17, 24, 39);
    doc.rect(0, 0, 210, 24, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("VERIFIED BY STORELINK™ SECURE CHECKOUT", 105, 15, { align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(24);
    doc.text(storeName.toUpperCase(), 105, 45, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("OFFICIAL RECEIPT", 105, 52, { align: "center" });
    doc.line(14, 60, 196, 60);

    doc.text(`Order #: ${order.id.slice(0, 8).toUpperCase()}`, 14, 70);
    doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`, 14, 76);
    doc.text(`Status: ${String(localStatus || order.status || "").toUpperCase()}`, 14, 82);

    let leftY = 88;
    const origin = String(order.origin_channel || "").toLowerCase();
    const channelLabel =
      origin === "storefront"
        ? "Web storefront"
        : origin === "mobile_app"
          ? "Mobile app"
          : origin === "web_app"
            ? "Web"
            : origin
              ? origin.replace(/_/g, " ")
              : "";
    if (channelLabel) {
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(`Channel: ${channelLabel}`, 14, leftY);
      leftY += 5;
    }
    if (order.payment_reference) {
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      const refLines = doc.splitTextToSize(`Payment ref: ${String(order.payment_reference)}`, 90);
      doc.text(refLines, 14, leftY);
      leftY += refLines.length * 4 + 2;
    }
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 140, 70);
    doc.setFont("helvetica", "normal");
    let rightY = 76;
    doc.text(orderBuyerName(order), 140, rightY);
    rightY += 6;
    doc.text(orderBuyerPhone(order), 140, rightY);
    rightY += 6;
    const buyerEmail = orderBuyerEmail(order);
    if (buyerEmail && buyerEmail !== "—") {
      doc.text(buyerEmail, 140, rightY);
      rightY += 6;
    }
    const shipLines = doc.splitTextToSize(orderShippingAddress(order), 55);
    doc.text(shipLines, 140, rightY);
    rightY += shipLines.length * 5;

    const tableStartY = Math.max(leftY + 6, rightY + 8);

    const tableData = items.map((item) => {
      const up = lineUnitPrice(item);
      const qty = Number(item.quantity) || 0;
      return [orderLineLabel(item), qty, fmtMoney(up), fmtMoney(up * qty)];
    });

    autoTable(doc, {
      startY: tableStartY,
      head: [["Item", "Qty", "Unit price", "Line total"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [17, 24, 39], textColor: [255, 255, 255] },
    });

    let currentY = (doc as any).lastAutoTable.finalY + 15;
    const redeemedAmount = orderCoinRedeemed(order);

    if (redeemedAmount > 0) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text("SUBTOTAL:", 140, currentY);
      doc.text(fmtMoney(Number(order.total_amount || 0) + redeemedAmount), 196, currentY, { align: "right" });
      currentY += 7;
      doc.setTextColor(180, 83, 9);
      doc.text("STORE COINS USED:", 140, currentY);
      doc.text(`-₦${redeemedAmount.toLocaleString()} ${currency}`, 196, currentY, { align: "right" });
      currentY += 10;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("AMOUNT PAID:", 140, currentY);
    doc.setTextColor(16, 185, 129);
    doc.text(fmtMoney(Number(order.total_amount || 0)), 196, currentY, { align: "right" });

    const pageH = doc.internal.pageSize.getHeight();
    let footY = currentY + 14;
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text("Full order ID (include when contacting support):", 14, footY);
    footY += 4;
    doc.setFont("courier", "normal");
    const idLines = doc.splitTextToSize(String(order.id), 182);
    doc.text(idLines, 14, footY);
    footY += idLines.length * 3.5 + 6;

    if (footY > pageH - 24) {
      doc.addPage();
      footY = 24;
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      doc.splitTextToSize(
        "Thank you for your purchase. This document is your purchase record from StoreLink checkout.",
        182,
      ),
      14,
      footY,
    );

    doc.save(`${storeName.replace(/\s+/g, "_")}_Receipt_${order.id.slice(0, 6)}.pdf`);
  };

  if (!isOpen || !order) return null;
  const coinsUsed = orderCoinRedeemed(order);
  const subTotal = Number(order.total_amount || 0) + coinsUsed;
  const storefrontOrder = String(order.origin_channel || "").toLowerCase() === "storefront";
  const normStatus = String(localStatus || order.status || "").toUpperCase();
  const payoutFlow = describeSellerOrderPayoutFlow(order);
  const canDownloadReceipt = ["PAID", "COMPLETED", "SHIPPED"].includes(normStatus);

  return (
    <div className="fixed inset-0 z-200 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="bg-white w-full max-w-2xl rounded-t-[2.5rem] md:rounded-[2.5rem] h-[90vh] md:h-auto max-h-[90vh] shadow-2xl relative overflow-hidden flex flex-col">
        
        <div className="sticky top-0 z-30 bg-white p-6 border-b border-gray-100 flex justify-between items-center">
           <span className="font-black text-gray-900 uppercase tracking-tighter">Order Detail</span>
           <button onClick={onClose} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition active:scale-90"><X size={20}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar pb-10">
          <div className="text-center mb-8">
             <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${normStatus === "CANCELLED" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
               {normStatus === "CANCELLED" ? <AlertCircle size={28} /> : <CheckCircle size={28} />}
             </div>
             <h2 className="font-black text-2xl text-gray-900 uppercase tracking-tighter">Order Summary</h2>
          </div>

          <div className="bg-gray-50 p-6 rounded-4xl mb-8 border border-gray-100 relative overflow-hidden">
             <div className="grid grid-cols-2 gap-6 relative z-10">
               <div>
                  <h3 className="font-black text-[10px] text-gray-400 uppercase tracking-widest mb-2">Buyer</h3>
                  <div className="flex items-start gap-3">
                    {orderBuyerProfile(order)?.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={orderBuyerProfile(order)!.logo_url}
                        alt=""
                        className="w-12 h-12 rounded-2xl object-cover border border-gray-200 shrink-0"
                      />
                    ) : null}
                    <p className="text-sm font-black text-gray-900 leading-tight">{orderBuyerName(order)}</p>
                  </div>
                  
                  <div className="mt-3 space-y-1.5 border-t border-gray-200/50 pt-3">
                     <div className="flex items-center gap-2 text-gray-500">
                        <Phone size={12} className="text-emerald-600" />
                        <span className="text-[11px] font-bold">{orderBuyerPhone(order)}</span>
                     </div>
                     <p className="text-[11px] font-medium text-gray-600">
                       <span className="font-black uppercase tracking-wider text-gray-400 text-[9px]">Email </span>
                       {orderBuyerEmail(order)}
                     </p>
                     <div className="flex items-start gap-2 text-gray-500">
                        <MapPin size={12} className="text-emerald-600 mt-0.5 shrink-0" />
                        <span className="text-[11px] font-medium leading-relaxed">
                           {orderShippingAddress(order)}
                        </span>
                     </div>
                  </div>
               </div>
               
               <div className="text-right">
                  <h3 className="font-black text-[10px] text-gray-400 uppercase tracking-widest mb-2">Status</h3>
                  <span className={`inline-block px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter ${
                      normStatus === "COMPLETED" || normStatus === "PAID" ? "bg-emerald-100 text-emerald-700" :
                      normStatus === "CANCELLED" ? "bg-red-100 text-red-700" :
                      "bg-amber-100 text-amber-700"
                  }`}>{normStatus.replace(/_/g, " ")}</span>
               </div>
             </div>
             <div className="mt-4 p-4 bg-white border border-gray-100 rounded-2xl">
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Payout</p>
               <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{payoutFlow.headline}</p>
               {payoutFlow.detail ? (
                 <p className="text-xs text-gray-600 font-medium mt-2 leading-relaxed">{payoutFlow.detail}</p>
               ) : null}
               {(order.payment_reference || order.payout_status || order.payout_eligible_at || storefrontOrder) && (
                 <dl className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-[11px]">
                   {order.payment_reference ? (
                     <div className="flex justify-between gap-3">
                       <dt className="font-black uppercase tracking-wider text-gray-400 shrink-0">Paystack ref</dt>
                       <dd className="font-mono text-gray-800 text-right truncate max-w-[200px]" title={order.payment_reference}>
                         {String(order.payment_reference)}
                       </dd>
                     </div>
                   ) : null}
                   {order.payout_status ? (
                     <div className="flex justify-between gap-3">
                       <dt className="font-black uppercase tracking-wider text-gray-400 shrink-0">Payout status</dt>
                       <dd className="font-bold text-gray-900 text-right uppercase">{String(order.payout_status)}</dd>
                     </div>
                   ) : null}
                   {order.payout_eligible_at ? (
                     <div className="flex justify-between gap-3">
                       <dt className="font-black uppercase tracking-wider text-gray-400 shrink-0">Payout timing</dt>
                       <dd className="font-medium text-gray-800 text-right">{formatOrderPayoutEligibleAt(order)}</dd>
                     </div>
                   ) : null}
                   {storefrontOrder ? (
                     <div className="flex justify-between gap-3">
                       <dt className="font-black uppercase tracking-wider text-gray-400 shrink-0">Channel</dt>
                       <dd className="font-medium text-gray-800 text-right">Storefront</dd>
                     </div>
                   ) : null}
                 </dl>
               )}
             </div>
             {normStatus === "CANCELLED" && coinsUsed > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-[10px] font-bold text-red-600 uppercase tracking-tight animate-in zoom-in">
                  <Coins size={14} fill="currentColor"/> ₦{coinsUsed.toLocaleString()} Coins Refunded
                </div>
             )}
          </div>

          <div className="space-y-4 mb-8">
             <h3 className="font-black text-[10px] text-gray-400 uppercase tracking-widest mb-2">Line items</h3>
             {items.map((item) => {
               const up = lineUnitPrice(item);
               const qty = Number(item.quantity) || 0;
               const label = orderLineLabel(item);
               return (
               <div key={item.id} className="flex flex-wrap justify-between gap-3 items-center text-sm border-b border-gray-50 pb-3">
                  <div className="flex gap-3 min-w-0 flex-1 items-center">
                    <OrderLineThumb
                      src={(item as { _resolved_product_image_url?: string })._resolved_product_image_url}
                      alt={label}
                    />
                    <span className="font-bold text-gray-900 uppercase text-xs min-w-0">
                      {qty}× {label}
                      <span className="block text-[10px] font-medium text-gray-400 normal-case mt-0.5">₦{up.toLocaleString()} each</span>
                    </span>
                  </div>
                  <span className="font-black text-gray-900 shrink-0">₦{(up * qty).toLocaleString()}</span>
               </div>
             );
             })}
          </div>

          <div className="space-y-2 pt-6 border-t border-gray-100 mb-6">
             <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest"><span>Subtotal</span><span>₦{subTotal.toLocaleString()}</span></div>
             {coinsUsed > 0 && (
               <div className="flex justify-between items-center text-xs font-black text-amber-600 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Coins size={14} fill="currentColor"/> Store Coins</span>
                  <span>-₦{coinsUsed.toLocaleString()}</span>
               </div>
             )}
             <div className="flex justify-between items-center text-2xl font-black text-gray-900 tracking-tighter pt-2">
                <span className="uppercase text-sm tracking-widest text-gray-400">Net Payable</span>
                <span className="text-emerald-600 font-black">₦{Number(order.total_amount || 0).toLocaleString()}</span>
             </div>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-gray-50 grid grid-cols-2 gap-4 sticky bottom-0">
           {storefrontOrder ? (
             normStatus === "CANCELLED" ? (
               <button disabled className="col-span-2 py-4 bg-gray-50 text-gray-300 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 border border-gray-100">Cancelled</button>
             ) : canDownloadReceipt ? (
               <button onClick={downloadReceipt} className="col-span-2 py-4 bg-gray-900 text-white rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all active:scale-95 shadow-xl"><Download size={18} /> Download Receipt</button>
             ) : (
               <div className="col-span-2 py-4 px-4 rounded-3xl bg-gray-50 border border-gray-100 text-center text-xs font-medium text-gray-600 leading-relaxed">
                 Storefront checkout drives this order — there is no seller confirm or cancel step here. Status updates when payment and settlement run.
               </div>
             )
           ) : normStatus === "COMPLETED" || normStatus === "PAID" ? (
             <button onClick={downloadReceipt} className="col-span-2 py-4 bg-gray-900 text-white rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all active:scale-95 shadow-xl"><Download size={18} /> Download Receipt</button>
           ) : normStatus === "CANCELLED" ? (
             <button disabled className="col-span-2 py-4 bg-gray-50 text-gray-300 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 border border-gray-100">Cancelled</button>
           ) : (
             <>
               <button disabled={isProcessing} onClick={() => updateStatus("CANCELLED")} className="py-4 bg-white border-2 border-red-50 text-red-600 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center">
                 {isProcessing ? <Loader2 className="animate-spin" size={16}/> : "Cancel"}
               </button>
               <button disabled={isProcessing} onClick={() => updateStatus("COMPLETED")} className="py-4 bg-emerald-600 text-white rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center shadow-lg">
                 {isProcessing ? <Loader2 className="animate-spin" size={16}/> : "Mark complete"}
               </button>
             </>
           )}
        </div>
      </div>
    </div>
  );
}