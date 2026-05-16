"use client";

import Link from "next/link";
import { Package, ShoppingCart, Store, UserPlus } from "lucide-react";

export type AdminSnapshot = {
  people: { totalProfiles: number; sellers: number; buyerProfiles: number };
  catalog: { listingsTotal: number; listingsActive: number; listingsActiveQueryFailed: boolean };
  storefront: {
    ordersLifetime: number;
    ordersLast7Days: number;
    gmvNgn: number;
    platformFeesNgn: number;
    platformFeesNote: string | null;
  };
  recentSellers: Array<{
    id: string;
    email: string | null;
    full_name: string | null;
    display_name: string;
    is_seller: boolean | null;
    acquisition_channel: string | null;
    created_at: string | null;
  }>;
  recentStorefrontOrders: Array<{
    id: string;
    status: string | null;
    total_amount: number;
    currency_code: string | null;
    origin_channel: string | null;
    checkout_mode: string | null;
    created_at: string | null;
    user_id: string | null;
    buyer?: {
      display_name: string | null;
      full_name: string | null;
      email: string | null;
    } | null;
  }>;
};

export type AdminFullSnapshot = AdminSnapshot & {
  payoutSummary: {
    failed: number;
    payoutQueued: number;
    storefrontPaidSettlement: number;
  };
};

export function AdminStorefrontPulseGrid({ snap }: { snap: AdminSnapshot }) {
  const items = [
    {
      label: "Storefront orders (all time)",
      value: snap.storefront.ordersLifetime,
      sub: "origin_channel = storefront",
      icon: ShoppingCart,
      color: "text-emerald-400",
    },
    {
      label: "Last 7 days",
      value: snap.storefront.ordersLast7Days,
      sub: "New storefront orders",
      icon: ShoppingCart,
      color: "text-amber-400",
    },
    {
      label: "Sellers",
      value: snap.people.sellers,
      sub: "profiles.is_seller (shared accounts; this admin is storefront-scoped for orders)",
      icon: Store,
      color: "text-sky-400",
    },
    {
      label: "Listings (catalog)",
      value: snap.catalog.listingsTotal,
      sub: snap.catalog.listingsActiveQueryFailed
        ? "active split unavailable"
        : `${snap.catalog.listingsActive} active`,
      icon: Package,
      color: "text-violet-400",
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
            <item.icon className={item.color} size={18} />
          </div>
          <p className="text-3xl font-black text-white tracking-tighter italic">{item.value.toLocaleString()}</p>
          <p className="text-[11px] text-gray-500 font-medium mt-2 leading-snug">{item.sub}</p>
        </div>
      ))}
    </div>
  );
}

export function AdminRecentActivity({ snap }: { snap: AdminSnapshot }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-lg text-white italic uppercase tracking-tighter flex items-center gap-2">
            <UserPlus size={18} className="text-emerald-500" />
            Recent sellers
          </h3>
          <Link href="/admin/stores" className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline">
            Manage →
          </Link>
        </div>
        <div className="bg-gray-900/40 border border-gray-800 rounded-[2rem] p-4 space-y-2">
          {snap.recentSellers.length === 0 && <p className="text-gray-500 text-sm p-4">No seller profiles yet.</p>}
          {snap.recentSellers.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 bg-gray-800/60 rounded-xl gap-3">
              <div className="min-w-0">
                <p className="font-bold text-sm text-white truncate">
                  {p.full_name?.trim() || p.display_name || "—"}
                </p>
                <p className="text-[10px] text-gray-500 font-mono truncate">{p.email || p.id.slice(0, 8)}</p>
              </div>
              <span className="text-[9px] text-gray-500 shrink-0">
                {p.created_at ? new Date(p.created_at).toLocaleDateString() : ""}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-lg text-white italic uppercase tracking-tighter">Latest storefront checkouts</h3>
          <Link href="/admin/orders" className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline">
            Orders →
          </Link>
        </div>
        <div className="bg-gray-900/40 border border-gray-800 rounded-[2rem] p-4 space-y-2">
          {snap.recentStorefrontOrders.length === 0 && (
            <p className="text-gray-500 text-sm p-4">No storefront orders yet.</p>
          )}
          {snap.recentStorefrontOrders.map((o) => {
            const b = o.buyer;
            const buyer =
              b?.full_name?.trim() || b?.display_name?.trim() || b?.email?.trim() || "Buyer account";
            return (
              <div key={o.id} className="flex items-center justify-between p-3 bg-gray-800/60 rounded-xl gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-sm text-white truncate">{buyer}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-black">
                    {o.status || "—"} · {o.checkout_mode}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-emerald-400">
                    {String(o.currency_code || "NGN")} {Number(o.total_amount).toLocaleString()}
                  </p>
                  <p className="text-[9px] text-gray-500">
                    {o.created_at ? new Date(o.created_at).toLocaleString() : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
