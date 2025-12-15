"use client";
import { X, MapPin, Globe, MessageCircle, Clock, CheckCircle } from "lucide-react";
import { Store } from "@/types";
import Image from "next/image";

interface StoreInfoModalProps {
  store: Store;
  isOpen: boolean;
  onClose: () => void;
  productCount: number;
}

export default function StoreInfoModal({ store, isOpen, onClose, productCount }: StoreInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 flex flex-col max-h-[90vh]">
        
        <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-100">
           <span className="font-bold text-gray-900">Store Profile</span>
           <button onClick={onClose} className="bg-white p-2 rounded-full shadow-sm text-gray-500 hover:bg-gray-100"><X size={20}/></button>
        </div>

        <div className="p-6 overflow-y-auto">
           <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-gray-50 bg-white shadow-sm relative overflow-hidden mb-3">
                 {store.logo_url ? <Image src={store.logo_url} alt="" fill className="object-cover" /> : <div className="w-full h-full bg-gray-200" />}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{store.name}</h2>
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                <MapPin size={14} /> {store.location}
              </p>
           </div>

           <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-2xl text-center">
                 <p className="text-2xl font-bold text-gray-900">{productCount}</p>
                 <p className="text-xs text-gray-400 font-bold uppercase">Products</p>
              </div>
              <div className="bg-green-50 p-4 rounded-2xl text-center">
                 <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                 <p className="text-xs text-green-700 font-bold uppercase">Verified</p>
              </div>
           </div>

           <div className="mb-8">
             <h3 className="text-sm font-bold text-gray-900 uppercase mb-2">About Us</h3>
             <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
               {store.description || "No description provided."}
             </p>
           </div>

           <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase mb-1">Contact & Socials</h3>
              
              <a href={`https://wa.me/${store.whatsapp_number}`} target="_blank" className="flex items-center justify-center gap-3 w-full p-4 bg-green-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-green-700 active:scale-95 transition">
                 <MessageCircle size={20} /> Chat on WhatsApp
               </a>

             {store.instagram_url && (
               <a href={store.instagram_url} target="_blank" className="flex items-center justify-center gap-3 w-full p-4 bg-pink-50 text-pink-700 rounded-xl text-sm font-bold hover:bg-pink-100 transition">
                 <Globe size={20} /> Instagram Page
               </a>
             )}
             
             {store.tiktok_url && (
               <a href={store.tiktok_url} target="_blank" className="flex items-center justify-center gap-3 w-full p-4 bg-gray-100 text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-200 transition">
                 <Globe size={20} /> TikTok Page
               </a>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}