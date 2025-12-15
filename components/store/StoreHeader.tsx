"use client";

import Image from "next/image";
import { MapPin, BadgeCheck, Info } from "lucide-react"; 
import { Store } from "@/types";

interface StoreHeaderProps {
  store: Store;
  onOpenInfo: () => void;
}

export default function StoreHeader({ store, onOpenInfo }: StoreHeaderProps) {
  return (
    <div className="relative bg-white pb-4">
      
      <div className="h-40 md:h-64 w-full relative bg-gray-900 overflow-hidden">
        {store.cover_image_url ? (
          <Image 
            src={store.cover_image_url} 
            alt="Cover" 
            fill 
            className="object-cover opacity-90"
            priority 
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900" />
        )}
        <div className="absolute inset-0 bg-black/10" />
      </div>
      
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-end -mt-10 md:-mt-12 relative z-10 gap-4 md:gap-6">
          
          <div className="w-24 h-24 md:w-36 md:h-36 bg-white rounded-2xl p-1 shadow-xl flex-shrink-0">
            <div className="w-full h-full bg-gray-50 rounded-xl overflow-hidden relative border border-gray-100">
              {store.logo_url ? (
                <Image src={store.logo_url} alt={store.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-3xl font-bold text-gray-300">
                  {store.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 w-full pt-1 md:pb-4">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
               
               <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                    {store.name}
                    {store.subscription_plan === 'premium' && (
                      <BadgeCheck className="text-blue-600 fill-blue-50 w-6 h-6" />
                    )}
                  </h1>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-500 font-medium mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin size={14}/> {store.location}
                    </span>
                  </div>
               </div>

               <button 
                 onClick={onOpenInfo}
                 className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-5 py-2.5 rounded-xl text-sm font-bold transition w-fit"
               >
                 <Info size={18} /> Store Info & Socials
               </button>

             </div>
          </div>

        </div>
      </div>
    </div>
  );
}