"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { isProductFlashDropActive } from "@/lib/productFlashDrop";
import { isStorefrontMerchFlagOn } from "@/lib/storefrontMerchFlags";
import { X, Zap, Loader2, CheckCircle2 } from "lucide-react";

interface FlashDropModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FlashDropModal({ product, isOpen, onClose, onSuccess }: FlashDropModalProps) {
  const [loading, setLoading] = useState(false);
  const [dropPrice, setDropPrice] = useState("");
  const [duration, setDuration] = useState("1"); 
  const [status, setStatus] = useState("");

  if (!isOpen || !product) return null;

  const handleActivate = async () => {
    if (
      isStorefrontMerchFlagOn(product.storefront_new_arrival) ||
      isStorefrontMerchFlagOn(product.storefront_best_seller)
    ) {
      alert("Turn off New arrivals and Best seller labels on this product before starting a flash drop.");
      return;
    }
    const listPrice = Number(product.price);
    const flash = parseFloat(dropPrice);
    if (!dropPrice || !Number.isFinite(flash) || flash >= listPrice) {
      alert("Flash price must be lower than the original price!");
      return;
    }

    setLoading(true);
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + parseInt(duration, 10));

    const { data, error } = await supabase
      .from("products")
      .update({
        is_flash_drop: true,
        flash_price: flash,
        flash_end_time: expiry.toISOString(),
        flash_expiry: null,
      })
      .eq("id", product.id)
      .eq("seller_id", product.seller_id)
      .select("id")
      .maybeSingle();

    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
      return;
    }
    if (!data?.id) {
      alert("Could not save flash drop (no row updated). Check you own this product.");
      setLoading(false);
      return;
    }

    setStatus("success");
    setTimeout(() => {
      onSuccess();
      onClose();
      setStatus("");
      setDropPrice("");
      setLoading(false);
    }, 1500);
  };

  const deactivateDrop = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .update({
        is_flash_drop: false,
        flash_price: null,
        flash_end_time: null,
        flash_expiry: null,
      })
      .eq("id", product.id)
      .eq("seller_id", product.seller_id)
      .select("id")
      .maybeSingle();

    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
      return;
    }
    if (!data?.id) {
      alert("Could not end flash drop (no row updated).");
      setLoading(false);
      return;
    }

    onSuccess();
    onClose();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        
        {status === "success" ? (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Flash Drop Live!</h2>
            <p className="text-gray-500 text-sm mt-2">The countdown has started.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
                  <Zap size={20} fill="currentColor" />
                </div>
                <h2 className="font-black text-lg text-gray-900 uppercase tracking-tight">Flash Drop</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition"><X size={20} /></button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Product</p>
                <p className="font-bold text-gray-900 truncate">{product.name}</p>
                <p className="text-sm text-gray-500">Original: ₦{Number(product.price).toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2 text-emerald-600">Flash Sale Price (₦)</label>
                <input 
                  type="number" 
                  autoFocus
                  className="w-full p-4 bg-gray-50 border-2 border-emerald-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 font-black text-xl text-emerald-600 transition-all"
                  placeholder="e.g. 15000"
                  value={dropPrice}
                  onChange={(e) => setDropPrice(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Duration</label>
                <div className="grid grid-cols-5 gap-2 max-[380px]:grid-cols-3">
                  {["1", "3", "6", "12", "24"].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setDuration(h)}
                      className={`rounded-xl py-3 text-xs font-bold border-2 transition-all ${
                        duration === h 
                        ? 'border-gray-900 bg-gray-900 text-white shadow-lg' 
                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      {h}H
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <button 
                  onClick={handleActivate}
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Zap size={18} fill="currentColor" /> Start Drop Now</>}
                </button>

                {(product.is_flash_drop === true || isProductFlashDropActive(product)) && (
                  <button 
                    onClick={deactivateDrop}
                    className="w-full text-red-500 py-2 text-xs font-black uppercase tracking-widest hover:bg-red-50 rounded-xl transition"
                  >
                    Cancel Current Drop
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}