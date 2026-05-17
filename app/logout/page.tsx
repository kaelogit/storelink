"use client";

import { useEffect } from "react";
import { Loader2, Heart, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM } from "@/lib/mobileLayout";

export default function LogoutSuccessPage() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    (async () => {
      await supabase.auth.signOut();
      timer = setTimeout(() => {
        window.location.assign("/login");
      }, 1200);
    })();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`flex min-h-dvh flex-col items-center justify-center bg-white text-center font-sans ${STOREFRONT_GUTTER_X} ${STOREFRONT_SAFE_BOTTOM}`}>
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-emerald-100 rounded-[32px] animate-ping opacity-20" />

        <div className="relative w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[32px] flex items-center justify-center shadow-sm">
          <Heart className="animate-pulse" size={40} fill="currentColor" />
        </div>
      </div>

      <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center justify-center">
          Signed out <Sparkles className="text-amber-400" size={24} />
        </h1>

        <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">
          Thanks for using <span className="font-black text-gray-900">StoreLink</span>.
        </p>
      </div>

      <div className="mt-12 flex items-center gap-3 text-emerald-600 font-black text-[10px] uppercase tracking-[0.25em]">
        <Loader2 className="animate-spin" size={16} />
        Loading...
      </div>
    </div>
  );
}
