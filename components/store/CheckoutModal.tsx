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

/** Legacy single-store checkout; main flow uses `GlobalCartSidebar` + Paystack. Guest RPC draft only. */
export default function CheckoutModal({ isOpen, onClose, cart, store, onRemoveItem }: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "", email: "" });
  const [checkoutError, setCheckoutError] = useState("");

  if (!isOpen) return null;

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  const formatPhoneNumber = (phone: string) => {
    let clean = phone.replace(/\D/g, "");
    if (clean.startsWith("0")) clean = clean.substring(1);
    if (!clean.startsWith("234")) clean = "234" + clean;
    return clean;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCheckoutError("");

    const cleanPhone = customer.phone.replace(/\D/g, "").slice(-10);
    const email = customer.email.trim().toLowerCase();

    if (cleanPhone.length < 10) {
      setCheckoutError("Enter a valid phone number.");
      setLoading(false);
      return;
    }
    if (!email) {
      setCheckoutError("Email is required for checkout.");
      setLoading(false);
      return;
    }

    try {
      const { data: orderId, error: orderError } = await supabase.rpc("create_new_order", {
        p_seller_id: store.owner_id,
        customer_name: customer.name.trim(),
        customer_phone: cleanPhone,
        customer_address: customer.address.trim() || "No Address Provided",
        total_amount_paid: cartTotal,
        coins_used: 0,
        checkout_mode: "guest",
        origin_channel: "storefront",
        is_guest_checkout: true,
        p_user_id: null,
        customer_email: email,
        order_items_array: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.qty,
        })),
      });

      if (orderError) throw orderError;
      if (!orderId) throw new Error("Order was not created.");

      const ownerEmail = store.owner_email?.trim();
      if (ownerEmail) {
        try {
          await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: ownerEmail,
              type: "CHECKOUT_ALERT",
              data: {
                productName: cart.map((item) => item.product.name),
                storeName: store.name,
                customerName: customer.name,
                orderId: String(orderId).slice(0, 8),
              },
            }),
          });
        } catch {
          /* non-fatal */
        }
      }

      const itemsList = cart
        .map((item) => `- ${item.qty}x ${item.product.name} (₦${(item.product.price * item.qty).toLocaleString()})`)
        .join("\n");

      const finalPhone = formatPhoneNumber(customer.phone);
      const vendorNumber = formatPhoneNumber(store.whatsapp_number);
      const message = `*New Order #${String(orderId).slice(0, 8)}* 📦\n\n${itemsList}\n\n*Total: ₦${cartTotal.toLocaleString()}*\n\n*Customer Details:*\nName: ${customer.name}\nPhone: ${finalPhone}\nAddress: ${customer.address}\n\n(I have placed this order on your website)`;

      const whatsappUrl = `https://wa.me/${vendorNumber}?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, "_blank");
      onClose();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to process order.";
      setCheckoutError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-black text-lg text-gray-900 uppercase tracking-tighter">Checkout</h2>
          <button type="button" onClick={onClose} className="p-2 bg-white rounded-full shadow-sm text-gray-500 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          {cart.map((item) => (
            <div key={item.product.id} className="flex justify-between items-center mb-4">
              <div className="flex gap-3 text-left">
                <div className="h-12 w-12 bg-gray-100 rounded-lg relative overflow-hidden border border-gray-200 shrink-0">
                  {item.product.image_urls?.[0] && (
                    <Image src={item.product.image_urls[0]} alt="" fill className="object-cover" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900 uppercase">{item.product.name}</p>
                  <p className="text-xs text-gray-500 font-medium">
                    {item.qty} x ₦{item.product.price.toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemoveItem(item.product.id)}
                className="text-red-400 p-2 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center">
            <span className="font-black text-[10px] uppercase tracking-widest text-gray-400">Total to Pay</span>
            <span className="font-black text-xl text-emerald-600">₦{cartTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="p-5 bg-gray-50 border-t border-gray-100">
          <form onSubmit={handleCheckout} className="space-y-3">
            <input
              required
              placeholder="Your Name"
              className="w-full p-4 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            />
            <input
              required
              placeholder="Phone Number"
              type="tel"
              className="w-full p-4 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            />
            <input
              required
              placeholder="Email"
              type="email"
              className="w-full p-4 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            />
            <input
              required
              placeholder="Delivery Address"
              className="w-full p-4 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              value={customer.address}
              onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
            />

            {checkoutError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                <AlertTriangle size={16} />
                {checkoutError}
              </div>
            )}
            <button
              type="submit"
              disabled={cart.length === 0 || loading}
              className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition mt-2 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <MessageCircle size={20} fill="currentColor" /> Send order to vendor
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
