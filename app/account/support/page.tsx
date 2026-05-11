"use client";

import { LifeBuoy, MessageCircle } from "lucide-react";

export default function AccountSupportPage() {
  const supportUrl =
    "https://wa.me/2349125951202?text=Hi%20StoreLink%20Support%2C%20I%20need%20help%20with%20my%20storefront%20account.";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Help &amp; support</h1>
        <p className="text-gray-500 text-sm font-medium mt-1">
          Need help with orders, wallet, seller onboarding, or payouts? Reach support directly.
        </p>
      </div>
      <div className="rounded-4xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
          <LifeBuoy size={26} />
        </div>
        <p className="font-black text-gray-900 uppercase tracking-tight">Talk to StoreLink support</p>
        <p className="text-sm text-gray-600 mt-2 font-medium leading-relaxed">
          Fastest response is via WhatsApp support.
        </p>
        <a
          href={supportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition"
        >
          <MessageCircle size={14} />
          Open WhatsApp support
        </a>
      </div>
    </div>
  );
}
