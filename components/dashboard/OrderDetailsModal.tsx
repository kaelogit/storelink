"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X, Download, CheckCircle, Lock, Coins, AlertCircle, Loader2 } from "lucide-react"; 
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from "next/navigation";

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

  // 1. ✨ INITIALIZE DATA & LOCAL STATUS
  useEffect(() => {
    if (isOpen && order) {
      setLocalStatus(order.status);
      const fetchItems = async () => {
        const { data, error } = await supabase.from("order_items").select("*").eq("order_id", order.id);
        if (error) console.error("Error fetching items:", error.message);
        setItems(data || []);
      };
      fetchItems();
    }
  }, [isOpen, order]);

  // 2. ✨ UPDATE STATUS (Handles Empire Refund Logic + Instant UI)
  const updateStatus = async (status: string) => {
    const displayStatus = status === 'completed' ? 'Paid' : status;
    
    // ✨ STRICT AUDIT: Matches Database column 'coins_redeemed'
    const redeemedAmount = order.coins_redeemed || 0;
    
    const confirmMsg = status === 'cancelled' && (redeemedAmount > 0)
      ? `Cancel order? This will automatically REFUND ₦${redeemedAmount.toLocaleString()} coins to the customer.`
      : `Mark order as ${displayStatus}?`;

    if (!confirm(confirmMsg)) return;
    
    setIsProcessing(true);
    try {
      let response;

      if (status === 'cancelled') {
        // Atomic Refund RPC - Database handles coins_redeemed internally
        response = await supabase.rpc('cancel_and_refund_order', { 
          order_id_param: order.id 
        });
      } else {
        // Standard update for 'completed'
        response = await supabase.from("orders").update({ status }).eq("id", order.id);
      }
      
      if (response.error) throw response.error;

      // ✨ THE FIX: Update local status immediately to flip the UI buttons
      setLocalStatus(status);
      
      router.refresh();
      onUpdate();
    } catch (error: any) {
      console.error("Detailed Error Output:", error);
      // REVEALS THE EXACT DB ERROR (e.g., column mismatch in trigger)
      alert(`Update Failed: ${error.message || "Unknown Error. Check Supabase Triggers."}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. ✨ PDF RECEIPT ENGINE (Line-by-line Audited - No Word Changed)
  const downloadReceipt = () => {
    const doc = new jsPDF();
    doc.setFillColor(17, 24, 39); 
    doc.rect(0, 0, 210, 24, 'F'); 
    doc.setTextColor(255, 255, 255); 
    doc.setFontSize(10); doc.setFont("helvetica", "bold");
    doc.text("VERIFIED BY STORELINK™ SECURE CHECKOUT", 105, 15, { align: "center" });

    doc.setTextColor(0, 0, 0); doc.setFontSize(24);
    doc.text(storeName.toUpperCase(), 105, 45, { align: "center" }); 
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    doc.text("OFFICIAL RECEIPT", 105, 52, { align: "center" });
    doc.line(14, 60, 196, 60); 

    doc.text(`Order #: ${order.id.slice(0, 8).toUpperCase()}`, 14, 70);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 14, 76);
    doc.text(`Status: ${localStatus?.toUpperCase()}`, 14, 82);

    doc.setFont("helvetica", "bold"); doc.text("Bill To:", 140, 70);
    doc.setFont("helvetica", "normal");
    doc.text(order.customer_name, 140, 76);
    doc.text(order.customer_phone, 140, 82);
    doc.text(doc.splitTextToSize(order.customer_address, 60), 140, 88);

    const tableData = items.map(item => [
      item.product_name, item.quantity, `N${item.price.toLocaleString()}`, `N${(item.price * item.quantity).toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: 105, head: [['Item', 'Qty', 'Price', 'Total']], body: tableData, theme: 'grid',
      headStyles: { fillColor: [17, 24, 39], textColor: [255, 255, 255] }
    });

    let currentY = (doc as any).lastAutoTable.finalY + 15;
    const redeemedAmount = order.coins_redeemed || 0;
    
    if (redeemedAmount > 0) {
      doc.text("SUBTOTAL:", 140, currentY);
      doc.text(`N${(order.total_amount + redeemedAmount).toLocaleString()}`, 196, currentY, { align: "right" });
      currentY += 7;
      doc.setTextColor(180, 83, 9);
      doc.text("EMPIRE COINS USED:", 140, currentY);
      doc.text(`-N${redeemedAmount.toLocaleString()}`, 196, currentY, { align: "right" });
      currentY += 10;
    }

    doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(0, 0, 0); 
    doc.text("GRAND TOTAL:", 140, currentY);
    doc.setTextColor(16, 185, 129);
    doc.text(`N${order.total_amount.toLocaleString()}`, 196, currentY, { align: "right" });

    doc.save(`${storeName.replace(/\s+/g, '_')}_Receipt_${order.id.slice(0,6)}.pdf`);
  };

  if (!isOpen || !order) return null;
  const subTotal = order.total_amount + (order.coins_redeemed || 0);

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] md:rounded-[2.5rem] h-[90vh] md:h-auto max-h-[90vh] shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* STICKY HEADER */}
        <div className="sticky top-0 z-30 bg-white p-6 border-b border-gray-100 flex justify-between items-center">
           <span className="font-black text-gray-900 uppercase tracking-tighter">Order Detail</span>
           <button onClick={onClose} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition active:scale-90"><X size={20}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar pb-10">
          <div className="text-center mb-8">
             <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${localStatus === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
               {localStatus === 'cancelled' ? <AlertCircle size={28} /> : <CheckCircle size={28} />}
             </div>
             <h2 className="font-black text-2xl text-gray-900 uppercase tracking-tighter">Order Summary</h2>
          </div>

          <div className="bg-gray-50 p-6 rounded-[2rem] mb-8 border border-gray-100 relative overflow-hidden">
             <div className="grid grid-cols-2 gap-6 relative z-10">
               <div>
                  <h3 className="font-black text-[10px] text-gray-400 uppercase tracking-widest mb-2">Customer</h3>
                  <p className="text-sm font-black text-gray-900 leading-tight">{order.customer_name}</p>
               </div>
               <div className="text-right">
                  <h3 className="font-black text-[10px] text-gray-400 uppercase tracking-widest mb-2">Status</h3>
                  <span className={`inline-block px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter ${
                      localStatus === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      localStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                  }`}>{localStatus === 'completed' ? 'Paid' : localStatus}</span>
               </div>
             </div>
             {localStatus === 'cancelled' && order.coins_redeemed > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-[10px] font-bold text-red-600 uppercase tracking-tight animate-in zoom-in">
                  <Coins size={14} fill="currentColor"/> ₦{order.coins_redeemed.toLocaleString()} Coins Refunded
                </div>
             )}
          </div>

          <div className="space-y-4 mb-8">
             {items.map(item => (
               <div key={item.id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-3">
                  <span className="font-bold text-gray-900 uppercase text-xs">{item.quantity}x {item.product_name}</span>
                  <span className="font-black text-gray-900">₦{item.price.toLocaleString()}</span>
               </div>
             ))}
          </div>

          <div className="space-y-2 pt-6 border-t border-gray-100 mb-6">
             <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest"><span>Subtotal</span><span>₦{subTotal.toLocaleString()}</span></div>
             {order.coins_redeemed > 0 && (
               <div className="flex justify-between items-center text-xs font-black text-amber-600 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Coins size={14} fill="currentColor"/> Empire Coins</span>
                  <span>-₦{order.coins_redeemed.toLocaleString()}</span>
               </div>
             )}
             <div className="flex justify-between items-center text-2xl font-black text-gray-900 tracking-tighter pt-2">
                <span className="uppercase text-sm tracking-widest text-gray-400">Net Payable</span>
                <span className="text-emerald-600 font-black">₦{order.total_amount.toLocaleString()}</span>
             </div>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-gray-50 grid grid-cols-2 gap-4 sticky bottom-0">
           {localStatus === 'completed' ? (
             <button onClick={downloadReceipt} className="col-span-2 py-4 bg-gray-900 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all active:scale-95 shadow-xl"><Download size={18} /> Download Receipt</button>
           ) : localStatus === 'cancelled' ? (
             <button disabled className="col-span-2 py-4 bg-gray-50 text-gray-300 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 border border-gray-100">Cancelled</button>
           ) : (
             <>
               <button disabled={isProcessing} onClick={() => updateStatus('cancelled')} className="py-4 bg-white border-2 border-red-50 text-red-600 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center">
                 {isProcessing ? <Loader2 className="animate-spin" size={16}/> : "Cancel"}
               </button>
               <button disabled={isProcessing} onClick={() => updateStatus('completed')} className="py-4 bg-emerald-600 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center shadow-lg">
                 {isProcessing ? <Loader2 className="animate-spin" size={16}/> : "Mark Paid"}
               </button>
             </>
           )}
        </div>
      </div>
    </div>
  );
}