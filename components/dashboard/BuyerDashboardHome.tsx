"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Coins, ExternalLink } from "lucide-react";
import BuyerProductOrdersTable from "@/components/orders/BuyerProductOrdersTable";

type Props = {
  displayName: string;
  logoUrl: string | null;
  productOrders: any[];
  coinBalance: number;
  hasStore: boolean;
  isSeller: boolean;
  /** From `profiles.onboarding_completed` — do not infer from missing `stores` row */
  onboardingCompleted: boolean;
  /** When set, shopper onboarding still needs this step (e.g. pick interests). */
  setupContinueHref?: string | null;
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
  setupContinueHref,
}: Props) {
  const orderCount = productOrders.length;

  const subtitle = hasStore
    ? "Manage sales from your storefront and track purchases below."
    : "Track product orders, Store Coins, and your profile — everything tied to this StoreLink account.";

  return (
    <div className="space-y-10 px-1 pb-20 md:px-0">
      <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.75rem] border border-gray-100 bg-gray-100">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl font-black uppercase text-gray-300">{displayName.slice(0, 1)}</span>
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900 md:text-3xl">Hi, {displayName}</h1>
            <p className="mt-2 text-sm font-medium leading-relaxed text-gray-500">{subtitle}</p>
            {!hasStore && orderCount === 0 && (
              <p className="mt-3 text-xs font-medium leading-relaxed text-gray-400">
                Product purchases show here. Other kinds of bookings aren&apos;t listed on the web shop yet.
              </p>
            )}
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-wrap gap-2 md:w-auto">
          <Link
            href="/marketplace"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-gray-800 md:flex-none"
          >
            <ExternalLink size={16} aria-hidden />
            Browse marketplace
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/account/orders"
          className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-emerald-200 hover:shadow-lg"
        >
          <ShoppingBag className="mb-3 text-emerald-600" size={26} />
          <p className="font-black uppercase tracking-tight text-gray-900">Orders</p>
          <p className="mt-1 text-xs font-medium text-gray-500">
            {orderCount} product {orderCount === 1 ? "order" : "orders"}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 transition-all group-hover:gap-3">
            View <ArrowRight size={14} />
          </span>
        </Link>

        <Link
          href="/account/wallet"
          className="group rounded-3xl border border-amber-100 bg-linear-to-br from-amber-50 to-white p-6 shadow-sm transition-all hover:border-amber-200 hover:shadow-md"
        >
          <Coins className="mb-3 text-amber-600" size={26} />
          <p className="font-black uppercase tracking-tight text-gray-900">Store Coins</p>
          <p className="mt-1 text-xs font-medium text-gray-600">{coinBalance.toLocaleString()} coins</p>
          <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-700 transition-all group-hover:gap-3">
            Wallet <ArrowRight size={14} />
          </span>
        </Link>
      </div>

      {!hasStore && !isSeller && !onboardingCompleted && (
        <Link
          href={setupContinueHref || "/onboarding"}
          className="group block rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm transition hover:border-emerald-300"
        >
          <p className="text-sm font-black uppercase tracking-tight text-emerald-900">Finish shopper setup</p>
          <p className="mt-2 text-xs font-medium leading-relaxed text-emerald-800/90">
            One step is still pending. Complete onboarding to unlock the full buyer experience.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-700 transition-all group-hover:gap-3">
            Continue onboarding <ArrowRight size={14} />
          </span>
        </Link>
      )}

      {orderCount > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">Recent orders</h2>
            <Link href="/account/orders" className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
              See all
            </Link>
          </div>
          <BuyerProductOrdersTable orders={productOrders} previewLimit={5} showSearch={false} variant="card" />
        </div>
      )}

      {!hasStore && !isSeller && (
        <Link
          href="/account/start-selling"
          className="group block rounded-3xl border border-gray-900 bg-gray-900 p-8 text-white shadow-xl transition hover:bg-gray-800"
        >
          <p className="text-lg font-black uppercase tracking-tight">Start selling</p>
          <p className="mt-2 text-xs font-medium text-gray-400">
            Open your store on StoreLink — inventory, orders, and checkout in one place.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 transition-all group-hover:gap-3">
            Get started <ArrowRight size={14} />
          </span>
        </Link>
      )}

      {!hasStore && isSeller && !onboardingCompleted && (
        <Link
          href="/account/start-selling"
          className="group block rounded-3xl border border-amber-200 bg-amber-50 p-8 shadow-sm transition hover:border-amber-300"
        >
          <p className="text-lg font-black uppercase tracking-tight text-amber-950">Finish your storefront setup</p>
          <p className="mt-2 text-xs font-medium text-amber-900/80">
            You&apos;re on the seller path — complete store details to go live.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-800 transition-all group-hover:gap-3">
            Continue setup <ArrowRight size={14} />
          </span>
        </Link>
      )}
    </div>
  );
}
