"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X, Printer, Download, CheckCircle, Lock } from "lucide-react"; 
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
  const router = useRouter();

  useEffect(() => {
    if (isOpen && order) {
      const fetchItems = async () => {
        const { data } = await supabase.from("order_items").select("*").eq("order_id", order.id);
        setItems(data || []);
      };
      fetchItems();
    }
  }, [isOpen, order]);

  const updateStatus = async (status: string) => {
    if (!confirm(`Mark order as ${status}?`)) return;
    
    await supabase.from("orders").update({ status }).eq("id", order.id);
    
    router.refresh();
    onUpdate();
    onClose();
  };

  const downloadReceipt = () => {
    const doc = new jsPDF();

    doc.setFillColor(17, 24, 39); 
    doc.rect(0, 0, 210, 24, 'F'); 

    doc.setTextColor(255, 255, 255); 
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("VERIFIED BY STORELINK™ SECURE CHECKOUT", 105, 15, { align: "center" });

    doc.setTextColor(0, 0, 0); 
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(storeName.toUpperCase(), 105, 45, { align: "center" }); 

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("OFFICIAL RECEIPT", 105, 52, { align: "center" });

    doc.setDrawColor(200, 200, 200);
    doc.line(14, 60, 196, 60); // Divider Line

    doc.setFontSize(10);
    doc.text(`Order #: ${order.id.slice(0, 8).toUpperCase()}`, 14, 70);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 14, 76);
    doc.text(`Status: ${order.status.toUpperCase()}`, 14, 82);

    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 140, 70);
    doc.setFont("helvetica", "normal");
    doc.text(order.customer_name, 140, 76);
    doc.text(order.customer_phone, 140, 82);
    const splitAddress = doc.splitTextToSize(order.customer_address, 60);
    doc.text(splitAddress, 140, 88);

    const tableData = items.map(item => [
      item.product_name,
      item.quantity,
      `N${item.price.toLocaleString()}`,
      `N${(item.price * item.quantity).toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: 105,
      head: [['Item', 'Qty', 'Price', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [17, 24, 39], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 80 }, 
        3: { fontStyle: 'bold' } 
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("GRAND TOTAL:", 140, finalY);
    doc.setTextColor(16, 185, 129); // Emerald Green
    doc.text(`N${order.total_amount.toLocaleString()}`, 196, finalY, { align: "right" });

    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for your patronage.", 105, 280, { align: "center" });
    doc.text("Powered by StoreLink", 105, 285, { align: "center" });

    doc.save(`${storeName.replace(/\s+/g, '_')}_Receipt_${order.id.slice(0,6)}.pdf`);
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={20}/></button>

        <div className="text-center mb-6">
           <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
             <CheckCircle className="text-green-600" size={24} />
           </div>
           <h2 className="font-bold text-xl text-gray-900">Order Details</h2>
           <p className="text-gray-500 text-xs mt-1">ID: {order.id}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
           <div className="grid grid-cols-2 gap-4">
             <div>
                <h3 className="font-bold text-xs text-gray-500 uppercase mb-1">Customer</h3>
                <p className="text-sm font-bold text-gray-900">{order.customer_name}</p>
                <p className="text-xs text-gray-500">{order.customer_phone}</p>
             </div>
             <div className="text-right">
                <h3 className="font-bold text-xs text-gray-500 uppercase mb-1">Status</h3>
                <span className={`inline-block px-2 py-1 rounded text-xs font-bold capitalize ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                }`}>
                    {order.status}
                </span>
             </div>
           </div>
           <div className="mt-3 pt-3 border-t border-gray-200">
             <h3 className="font-bold text-xs text-gray-500 uppercase mb-1">Delivery Address</h3>
             <p className="text-sm text-gray-700">{order.customer_address}</p>
           </div>
        </div>

        <div className="space-y-3 mb-6 max-h-40 overflow-y-auto pr-2">
           {items.map(item => (
             <div key={item.id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                <div className="flex items-center gap-2">
                   <span className="font-bold text-gray-400">{item.quantity}x</span>
                   <span className="text-gray-900">{item.product_name}</span>
                </div>
                <span className="font-bold text-gray-900">₦{item.price.toLocaleString()}</span>
             </div>
           ))}
        </div>

        <div className="flex justify-between items-center text-xl font-extrabold text-gray-900 mb-8 pt-4 border-t border-gray-100">
           <span>Total</span>
           <span className="text-emerald-600">₦{order.total_amount.toLocaleString()}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
           {order.status === 'completed' ? (
             <button onClick={downloadReceipt} className="col-span-2 py-3.5 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 shadow-lg active:scale-95 transition">
               <Download size={18} /> Download Official Receipt
             </button>
           ) : (
             <button disabled className="col-span-2 py-3.5 bg-gray-100 text-gray-400 rounded-xl font-bold flex items-center justify-center gap-2 border border-gray-200 cursor-not-allowed">
               <Lock size={18} /> Receipt Locked (Mark as Paid First)
             </button>
           )}
           
           {order.status === 'pending' && (
             <>
               <button onClick={() => updateStatus('cancelled')} className="py-3 bg-white border border-red-100 text-red-600 rounded-xl font-bold hover:bg-red-50 text-sm">
                 Cancel Order
               </button>
               <button onClick={() => updateStatus('completed')} className="py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 text-sm shadow-md">
                 Mark Paid
               </button>
             </>
           )}
        </div>

      </div>
    </div>
  );
}