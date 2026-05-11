"use client";

import { CreditCard, ShoppingBag, Store, TrendingUp } from "lucide-react";

type Props = {
  sellers: number;
  listingsTotal: number;
  listingsActive: number;
  listingsActiveQueryFailed: boolean;
  platformFeesNgn: number;
  gmvNgn: number;
  platformFeesNote: string | null;
};

export default function StorefrontStatsGrid({
  sellers,
  listingsTotal,
  listingsActive,
  listingsActiveQueryFailed,
  platformFeesNgn,
  gmvNgn,
  platformFeesNote,
}: Props) {
  const items = [
    {
      label: "Sellers (profiles)",
      value: sellers.toLocaleString(),
      sub: "is_seller on profiles",
      icon: Store,
      color: "text-blue-400",
    },
    {
      label: "Catalog listings",
      value: listingsTotal.toLocaleString(),
      sub: listingsActiveQueryFailed
        ? "active filter unavailable — showing total only"
        : `${listingsActive.toLocaleString()} active (is_active) · ${listingsTotal.toLocaleString()} total`,
      icon: ShoppingBag,
      color: "text-purple-400",
    },
    {
      label: "Storefront GMV (paid)",
      value: `₦${Math.round(gmvNgn).toLocaleString()}`,
      sub: "PAID + COMPLETED orders · storefront only",
      icon: TrendingUp,
      color: "text-sky-400",
    },
    {
      label: "Platform take (fees)",
      value: `₦${Math.round(platformFeesNgn).toLocaleString()}`,
      sub: platformFeesNote || "Sum of platform_fee, else 2.5% of order total",
      icon: CreditCard,
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-gray-900/40 border border-gray-800 p-6 rounded-3xl backdrop-blur-sm transition-all hover:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
            <div className={`p-2.5 rounded-xl bg-opacity-10 ${item.color.replace("text-", "bg-")}`}>
              <item.icon className={item.color} size={18} />
            </div>
          </div>
          <p className="text-3xl font-black text-white tracking-tighter italic">{item.value}</p>
          <p className="text-[11px] text-gray-500 font-medium mt-2 leading-snug">{item.sub}</p>
        </div>
      ))}
    </div>
  );
}
