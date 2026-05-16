"use client";

import Image from "next/image";
import { MapPin, BadgeCheck, Info, Gem } from "lucide-react";
import { Store } from "@/types";
import { effectiveSellerTier } from "@/utils/marketplaceDiscovery";
import { compactSellerRegion } from "@/lib/displayRegion";

interface StoreHeaderProps {
  store: Store;
  onOpenInfo: () => void;
}

export default function StoreHeader({ store, onOpenInfo }: StoreHeaderProps) {
  const diamondBoost =
    effectiveSellerTier(store.subscription_plan, store.subscription_expiry, store.subscription_status) === "diamond";

  return (
    <div className="relative bg-white pb-4">
      
      {/* Cover — smaller on mobile */}
      <div className="h-32 sm:h-40 md:h-56 w-full relative bg-gray-900 overflow-hidden">
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
        <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-8 sm:-mt-10 md:-mt-12 relative z-10 gap-3 sm:gap-4 md:gap-6">
          
          {/* Logo — smaller on mobile */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white rounded-xl sm:rounded-2xl p-1 shadow-xl flex-shrink-0">
            <div className="w-full h-full bg-gray-50 rounded-lg sm:rounded-xl overflow-hidden relative border border-gray-100">
              {store.logo_url ? (
                <Image src={store.logo_url} alt={store.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-2xl sm:text-3xl font-bold text-gray-300">
                  {store.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 w-full pt-0 sm:pt-1 md:pb-3">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
               
               <div className="min-w-0">
                  {/* Name — responsive size, wraps if needed */}
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="truncate">{store.name}</span>
                    {diamondBoost && (
                      <Gem
                        className="w-5 h-5 sm:w-6 sm:h-6 shrink-0"
                        style={{ color: "#8B5CF6", fill: "#8B5CF6" }}
                        aria-hidden
                      />
                    )}
                    {store.verification_status === "verified" && (
                      <BadgeCheck className="text-blue-600 fill-blue-50 w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                    )}
                  </h1>
                  
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="sm:w-[14px] sm:h-[14px]" /> 
                      <span className="truncate">{compactSellerRegion(store)}</span>
                    </span>
                  </div>
               </div>

               <button 
                 onClick={onOpenInfo}
                 className="flex items-center gap-1.5 sm:gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition w-fit shrink-0"
               >
                 <Info size={14} className="sm:w-[18px] sm:h-[18px]" /> 
                 <span className="hidden sm:inline">Store Info & Socials</span>
                 <span className="sm:hidden">Info</span>
               </button>

             </div>
          </div>

        </div>
      </div>
    </div>
  );
}