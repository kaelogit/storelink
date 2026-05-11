"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Coins, ChevronRight, ExternalLink } from "lucide-react";
type Props = {
  displayName: string;
  logoUrl: string | null;
  productOrders: any[];
  coinBalance: number;
  hasStore: boolean;
  isSeller: boolean;
  /** From `profiles.onboarding_completed` — do not infer from missing `stores` row */
  onboardingCompleted: boolean;
};

/** Buyer-focused overview when the user has no storefront row yet — fits inside unified /dashboard shell. */
export default function BuyerDashboardHome({
  displayName,
  logoUrl,
  productOrders,
  coinBalance,
  hasStore,
  isSeller,
  onboardingCompleted,
}: Props) {
  const recent = productOrders.slice(0, 3);
  const orderCount = productOrders.length;

  const subtitle = hasStore
    ? "Manage sales from your storefront and track purchases below."
    : "Track product orders, Store Coins, and your profile — everything tied to this StoreLink account.";

  return (
    <div className="space-y-10 px-1 md:px-0 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 min-w-0 flex-1">
          <div className="w-20 h-20 rounded-[1.75rem] overflow-hidden bg-gray-100 border border-gray-100 shrink-0 flex items-center justify-center">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-black text-gray-300 uppercase">{displayName.slice(0, 1)}</span>
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">Hi, {displayName}</h1>
            <p className="text-gray-500 font-medium mt-2 text-sm leading-relaxed">{subtitle}</p>
            {!hasStore && orderCount === 0 && (
              <p className="text-xs text-gray-400 font-medium mt-3 leading-relaxed">
                Product purchases show here. Other kinds of bookings aren&apos;t listed on the web shop yet.
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto flex-wrap shrink-0">
          <Link
            href="/marketplace"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition shadow-lg"
          >
            <ExternalLink size={16} aria-hidden />
            Browse marketplace
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/account/orders"
          className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all"
        >
          <ShoppingBag className="text-emerald-600 mb-3" size={26} />
          <p className="font-black text-gray-900 uppercase tracking-tight">Orders</p>
          <p className="text-xs text-gray-500 font-medium mt-1">
            {orderCount} product {orderCount === 1 ? "order" : "orders"}
          </p>
          <span className="inline-flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest text-emerald-600 group-hover:gap-3 transition-all">
            View <ArrowRight size={14} />
          </span>
        </Link>

        <Link
          href="/account/wallet"
          className="group rounded-3xl border border-amber-100 bg-linear-to-br from-amber-50 to-white p-6 shadow-sm hover:shadow-md hover:border-amber-200 transition-all"
        >
          <Coins className="text-amber-600 mb-3" size={26} />
          <p className="font-black text-gray-900 uppercase tracking-tight">Store Coins</p>
          <p className="text-xs text-gray-600 font-medium mt-1">{coinBalance.toLocaleString()} coins</p>
          <span className="inline-flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest text-amber-700 group-hover:gap-3 transition-all">
            Wallet <ArrowRight size={14} />
          </span>
        </Link>
      </div>

      {recent.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">Recent orders</h2>
            <Link href="/account/orders" className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">
              See all
            </Link>
          </div>
          <ul className="space-y-2">
            {recent.map((o) => {
              const merchant = o.merchant as { display_name?: string; full_name?: string } | null;
              const sellerName =
                merchant?.display_name?.trim() || merchant?.full_name?.trim() || "Seller";
              return (
                <li key={o.id}>
                  <Link
                    href={`/account/orders/${o.id}`}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-4 hover:border-emerald-200 transition"
                  >
                    <div className="min-w-0">
                      <p className="font-black text-gray-900 text-sm truncate">{sellerName}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                        {new Date(o.created_at).toLocaleDateString()} · {String(o.status || "").replace(/_/g, " ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-black text-emerald-700">₦{Number(o.total_amount || 0).toLocaleString()}</span>
                      <ChevronRight className="text-gray-300" size={18} />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {!hasStore && !isSeller && (
        <Link
          href="/account/start-selling"
          className="group block rounded-3xl border border-gray-900 bg-gray-900 p-8 shadow-xl hover:bg-gray-800 transition text-white"
        >
          <p className="font-black uppercase tracking-tight text-lg">Start selling</p>
          <p className="text-xs text-gray-400 font-medium mt-2">Open your store on StoreLink — inventory, orders, and checkout in one place.</p>
          <span className="inline-flex items-center gap-2 mt-6 text-[10px] font-black uppercase tracking-widest text-emerald-400 group-hover:gap-3 transition-all">
            Get started <ArrowRight size={14} />
          </span>
        </Link>
      )}

      {!hasStore && isSeller && !onboardingCompleted && (
        <Link
          href="/account/start-selling"
          className="group block rounded-3xl border border-amber-200 bg-amber-50 p-8 shadow-sm hover:border-amber-300 transition"
        >
          <p className="font-black uppercase tracking-tight text-lg text-amber-950">Finish your storefront setup</p>
          <p className="text-xs text-amber-900/80 font-medium mt-2">You&apos;re on the seller path — complete store details to go live.</p>
          <span className="inline-flex items-center gap-2 mt-6 text-[10px] font-black uppercase tracking-widest text-amber-800 group-hover:gap-3 transition-all">
            Continue setup <ArrowRight size={14} />
          </span>
        </Link>
      )}
    </div>
  );
}
