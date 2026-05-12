"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  MessageCircle,
  Package,
  ShieldCheck,
  Sparkles,
  Store,
  Wrench,
} from "lucide-react";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM } from "@/lib/mobileLayout";

/**
 * Buyer → seller: same informational beat as the mobile “What is selling?” screen,
 * then continue into storefront wizard (no profile writes until setup completes).
 */
export default function StartSellingPage() {
  const router = useRouter();

  const continueToSetup = () => {
    router.push("/onboarding/seller/identity?upgrade=1");
    router.refresh();
  };

  return (
    <div className={`min-h-[calc(100dvh-8rem)] bg-gray-50 py-8 ${STOREFRONT_GUTTER_X} ${STOREFRONT_SAFE_BOTTOM}`}>
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
          <Link
            href="/account/profile"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-gray-900 transition hover:bg-gray-100"
            aria-label="Back"
          >
            <ArrowLeft size={22} strokeWidth={2.4} />
          </Link>
          <h1 className="flex-1 text-center text-sm font-black uppercase tracking-wide text-gray-900">
            What is selling?
          </h1>
          <span className="h-11 w-11" />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex gap-3 rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
            <Store className="mt-0.5 shrink-0 text-emerald-600" size={20} strokeWidth={2.2} />
            <p className="text-sm font-semibold leading-relaxed text-gray-800">
              This page is read-only. Opening it does not make you a seller. You finish activation in the next steps.
            </p>
          </div>

          <p className="mt-6 text-lg font-black leading-snug tracking-tight text-gray-900">
            Selling on StoreLink means running a real storefront — not just posting a reel.
          </p>
          <p className="mt-2 text-sm font-medium leading-relaxed text-gray-600">
            Spotlight reels are for buyers to show what they bought. Your shop is where you list products or bookable
            services, take orders, chat, and get paid with protection built in.
          </p>

          <p className="mt-8 text-[11px] font-black uppercase tracking-widest text-gray-400">What you get</p>

          <ul className="mt-4 space-y-5">
            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                <Package className="text-emerald-600" size={20} strokeWidth={2.2} />
              </span>
              <div>
                <p className="font-black text-gray-900">Products & listings</p>
                <p className="mt-1 text-sm font-medium text-gray-600">
                  List inventory with photos and prices. Buyers discover you in feed, explore, and search — not only your
                  followers.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                <Wrench className="text-emerald-600" size={20} strokeWidth={2.2} />
              </span>
              <div>
                <p className="font-black text-gray-900">Bookable services</p>
                <p className="mt-1 text-sm font-medium text-gray-600">
                  If you offer services, customers can request and book you in-app with clear expectations.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                <MessageCircle className="text-emerald-600" size={20} strokeWidth={2.2} />
              </span>
              <div>
                <p className="font-black text-gray-900">Orders & chat</p>
                <p className="mt-1 text-sm font-medium text-gray-600">
                  Manage conversations and orders in one place so serious buyers can trust your store.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                <MapPin className="text-emerald-600" size={20} strokeWidth={2.2} />
              </span>
              <div>
                <p className="font-black text-gray-900">Local discovery</p>
                <p className="mt-1 text-sm font-medium text-gray-600">
                  Distance and location help nearby customers find you when it matters.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                <ShieldCheck className="text-violet-600" size={20} strokeWidth={2.2} />
              </span>
              <div>
                <p className="font-black text-gray-900">Verification & safety</p>
                <p className="mt-1 text-sm font-medium text-gray-600">
                  Sellers verify identity before payouts. That keeps the marketplace safer for everyone.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                <Sparkles className="text-emerald-600" size={20} strokeWidth={2.2} />
              </span>
              <div>
                <p className="font-black text-gray-900">Free Standard plan</p>
                <p className="mt-1 text-sm font-medium text-gray-600">
                  When you continue, you&apos;ll fill in brand, category, location, and phone — then your storefront is
                  ready to sell.
                </p>
              </div>
            </li>
          </ul>

          <button
            type="button"
            onClick={continueToSetup}
            className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 text-sm font-black uppercase tracking-widest text-white shadow-md transition hover:bg-gray-800"
          >
            Continue to shop setup
            <ArrowRight size={20} strokeWidth={2.8} />
          </button>

          <div className="mt-4 text-center">
            <Link href="/account/profile" className="text-sm font-bold text-gray-500 hover:text-gray-800">
              Not now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
