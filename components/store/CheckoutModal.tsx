"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Trash2, MessageCircle, Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase"; 
import { Store, Product } from "@/types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: { product: Product; qty: number }[];
  store: Store;
  onRemoveItem: (id: string) => void;
}

export default function CheckoutModal({ isOpen, onClose, cart, store, onRemoveItem }: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "", email: "" });
  const [checkoutError, setCheckoutError] = useState("");

  if (!isOpen) return null;

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  const formatPhoneNumber = (phone: string) => {
    let clean = phone.replace(/\D/g, ''); 
    if (clean.startsWith('0')) clean = clean.substring(1); 
    if (!clean.startsWith('234')) clean = '234' + clean;   
    return clean;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("--- STARTING CHECKOUT PROCESS ---");
    alert("Check 1: handleCheckout Triggered"); // This WILL stop the browser
    
    setLoading(true);
    setCheckoutError(""); 

    try {
      // 1. Data Verification
      console.log("Store Object:", store);
      if (!store.owner_email) {
        console.warn("WARNING: store.owner_email is MISSING!");
      }

      // 2. Database Entry: Create the Order
      console.log("Step 2: Inserting Order to Supabase...");
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          store_id: store.id,
          customer_name: customer.name,
          customer_phone: customer.phone,
          customer_email: customer.email,
          customer_address: customer.address,
          total_amount: cartTotal,
          status: 'pending' 
        })
        .select()
        .single();

      if (orderError) {
        console.error("Supabase Order Error:", orderError);
        throw orderError;
      }
      
      alert("Check 2: Order Saved to DB. ID: " + orderData.id);

      // 3. Database Entry: Link Order Items
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.qty,
        price: item.product.price
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      // 4. 🔥 EMPIRE TRIGGER: Notify the Vendor via Email
      if (store.owner_email) {
        console.log("Step 4: Dispatching Email to:", store.owner_email);
        try {
          const res = await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: store.owner_email,
              type: "CHECKOUT_ALERT",
              data: {
                productName: cart.map(item => item.product.name),
                storeName: store.name,
                customerName: customer.name,
                orderId: orderData.id.slice(0, 8)
              }
            }),
          });
          const emailStatus = await res.json();
          console.log("Email Server Response:", emailStatus);
        } catch (emailErr) {
          console.error("Email API failed:", emailErr);
        }
      }

      alert("Check 3: Email Dispatched. About to open WhatsApp.");

      // 5. Construct WhatsApp Message
      const itemsList = cart
        .map((item) => `- ${item.qty}x ${item.product.name} (₦${(item.product.price * item.qty).toLocaleString()})`)
        .join("\n");

      const finalPhone = formatPhoneNumber(customer.phone);
      const vendorNumber = formatPhoneNumber(store.whatsapp_number);
      const message = `*New Order #${orderData.id.slice(0,8)}* 📦\n\n${itemsList}\n\n*Total: ₦${cartTotal.toLocaleString()}*\n\n*Customer Details:*\nName: ${customer.name}\nPhone: ${finalPhone}\nAddress: ${customer.address}\n\n(I have placed this order on your website)`;

      const whatsappUrl = `https://wa.me/${vendorNumber}?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, "_blank");
      onClose();

    } catch (error: any) {
      console.error("FULL ERROR:", error); 
      alert("CRITICAL ERROR: " + error.message);
      setCheckoutError(error.message || "Failed to process order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
<h2 className="font-black text-lg text-red-600 uppercase tracking-tighter">EMPIRE TEST</h2>          <button onClick={onClose} className="p-2 bg-white rounded-full shadow-sm text-gray-500 hover:bg-gray-100"><X size={20} /></button>
        </div>

        {/* Cart Items */}
        <div className="p-5 overflow-y-auto flex-1">
          {cart.map((item) => (
            <div key={item.product.id} className="flex justify-between items-center mb-4">
              <div className="flex gap-3 text-left">
                <div className="h-12 w-12 bg-gray-100 rounded-lg relative overflow-hidden border border-gray-200 shrink-0">
                  {item.product.image_urls && item.product.image_urls[0] && (
                    <Image src={item.product.image_urls[0]} alt="" fill className="object-cover" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900 uppercase">{item.product.name}</p>
                  <p className="text-xs text-gray-500 font-medium">{item.qty} x ₦{item.product.price.toLocaleString()}</p>
                </div>
              </div>
              <button onClick={() => onRemoveItem(item.product.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-lg transition">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center">
            <span className="font-black text-[10px] uppercase tracking-widest text-gray-400">Total to Pay</span>
            <span className="font-black text-xl text-emerald-600">₦{cartTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="p-5 bg-gray-50 border-t border-gray-100">
          <form onSubmit={handleCheckout} className="space-y-3">
            <input required placeholder="Your Name" className="w-full p-4 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})}/>
            <input required placeholder="Phone Number" type="tel" className="w-full p-4 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})}/>
            <input placeholder="Email (Optional)" type="email" className="w-full p-4 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})}/>
            <input required placeholder="Delivery Address" className="w-full p-4 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})}/>
            
            {checkoutError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                    <AlertTriangle size={16} />
                    {checkoutError}
                </div>
            )}
            <button 
              type="submit" disabled={cart.length === 0 || loading}
              className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition mt-2 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><MessageCircle size={20} fill="currentColor" /> Send Order via WhatsApp</>}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}