"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Heart, Sparkles } from "lucide-react";

export default function LogoutSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-emerald-100 rounded-[32px] animate-ping opacity-20" />
        
        <div className="relative w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[32px] flex items-center justify-center shadow-sm">
          <Heart className="animate-pulse" size={40} fill="currentColor" />
        </div>
      </div>
      
      <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center justify-center">
          See you soon Founder <Sparkles className="text-amber-400" size={24} />
        </h1>
        
        <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">
          Your progress is securely saved. Thank you for building your empire with <span className="font-black text-gray-900">StoreLink</span>.
        </p>
      </div>

      <div className="mt-12 flex items-center gap-3 text-emerald-600 font-black text-[10px] uppercase tracking-[0.25em]">
        <Loader2 className="animate-spin" size={16} />
        Finalizing Session
      </div>
    </div>
  );
}