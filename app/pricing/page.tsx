"use client";
import React from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Check, Zap, Star, Shield, ArrowRight, MessageCircle, Sparkles, Wand2, ShieldCheck, Minus } from "lucide-react";
import Link from "next/link";
import { SELLER_DIAMOND_PRICE_NGN } from "@/lib/subscriptionPricing";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM } from "@/lib/mobileLayout";
import { PRICING_MATRIX_ROWS } from "@/lib/pricingComparisonMatrix";
import type { PricingMatrixRow } from "@/lib/pricingComparisonMatrix";
import PricingJsonLd from "@/components/landing/PricingJsonLd";

const diamondPriceDisplay = SELLER_DIAMOND_PRICE_NGN.toLocaleString("en-NG");

function PlanMatrixCell({ cell }: { cell: PricingMatrixRow["standard"] }) {
  if (cell.kind === "yes") {
    return (
      <div className="flex justify-center">
        <Check className="h-5 w-5 text-emerald-600" strokeWidth={3} aria-label="Included" />
      </div>
    );
  }
  if (cell.kind === "no") {
    return (
      <div className="flex justify-center text-gray-300" aria-label="Not included">
        <Minus className="h-5 w-5" strokeWidth={2} />
      </div>
    );
  }
  return (
    <p className="text-center text-xs font-extrabold text-gray-700 leading-snug px-1">{cell.detail ?? "—"}</p>
  );
}

const tiers = [
  {
    name: "Standard",
    price: "0",
    id: "standard",
    description:
      "Sell from your storefront forever—no trial, no paywall. Matches Standard in the StoreLink app (buyers always shop free).",
    features: [
      "Unlimited products",
      "Your branded store link",
      "Secure checkout",
      "Inventory & orders in dashboard",
      "Included marketplace discovery (fair caps)",
    ],
    buttonText: "Start selling free",
    color: "slate",
    isFree: true,
  },
  {
    name: "Diamond",
    price: diamondPriceDisplay,
    id: "diamond",
    description:
      "Paid seller boost—same Diamond tier as the app: stronger discovery, spotlight placements, and flagship tools.",
    features: [
      "Higher discovery caps & ranking priority",
      "Trending / spotlight placements",
      "Expanded catalog room vs Standard",
      "AI background removal",
      "Flash Drop spotlight",
      "Priority placement",
    ],
    buttonText: "Start free, go Diamond anytime",
    popular: true,
    color: "purple",
  },
];

export default function PricingPage() {
  return (
    <main className={`min-h-dvh bg-[#F8FAFC] selection:bg-emerald-100 ${STOREFRONT_SAFE_BOTTOM}`}>
      <PricingJsonLd />
      <Navbar />

      <section className={`relative overflow-hidden bg-gray-900 pb-24 pt-32 ${STOREFRONT_GUTTER_X}`}>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full mb-8">
            <Sparkles size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Seller plans</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[0.9] md:leading-none">
            Take your hustle <span className="text-emerald-500 italic">digital.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
            Standard stays free forever for sellers. Diamond is the single paid upgrade—priced in line with the StoreLink mobile app (₦
            {diamondPriceDisplay}/mo).
          </p>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto font-semibold leading-relaxed border border-white/10 rounded-2xl bg-white/5 px-5 py-4">
            <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px] block mb-1">Billing</span>
            Standard is ₦0/month—no subscription to keep your storefront live. Diamond is billed monthly in NGN when you subscribe in the
            app; you can start on Standard and upgrade only when the extra discovery and tools make sense for you.
          </p>
        </div>

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -ml-24 -mb-24"></div>
      </section>

      <section className={`relative z-20 -mt-16 py-12 md:py-24 ${STOREFRONT_GUTTER_X}`}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-white rounded-[3.5rem] p-8 md:p-10 lg:p-12 border-4 transition-all duration-500 flex flex-col group ${
                tier.popular
                  ? "border-purple-400 shadow-[0_30px_60px_-15px_rgba(147,51,234,0.25)] md:scale-[1.02] z-10"
                  : "border-white bg-white shadow-xl hover:border-gray-100"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl whitespace-nowrap">
                  Maximum visibility
                </div>
              )}

              <div className="mb-10">
                <div
                  className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner transition-transform group-hover:scale-110 duration-300 ${
                    tier.color === "purple"
                      ? "bg-purple-50 text-purple-600"
                      : "bg-slate-50 text-slate-400"
                  }`}
                >
                  {tier.id === "standard" ? <Shield size={32} /> : <Star size={32} />}
                </div>

                <h3 className="text-3xl font-black uppercase tracking-tighter mb-3 text-gray-900">{tier.name}</h3>

                <div className="flex items-baseline gap-2">
                  <span className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900">₦{tier.price}</span>
                  {!tier.isFree && (
                    <span className="text-gray-400 font-black text-xs uppercase tracking-widest">/ Month</span>
                  )}
                </div>

                <p className="text-sm mt-6 font-bold leading-relaxed text-gray-500">{tier.description}</p>
              </div>

              <div className="space-y-5 mb-12 flex-grow">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-gray-900">What&apos;s Included</p>
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-4">
                    <div
                      className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        tier.color === "purple"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Check size={12} strokeWidth={4} />
                    </div>
                    <span className="text-sm md:text-base font-extrabold tracking-tight text-gray-900">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/signup?next=%2Fpost-login"
                className={`flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[2rem] py-6 text-center font-black uppercase text-[11px] tracking-[0.2em] shadow-xl transition-all active:scale-95 group/btn ${
                  tier.color === "purple"
                    ? "bg-purple-500 text-white hover:bg-purple-700 shadow-purple-200"
                    : "bg-gray-900 text-white hover:bg-black shadow-gray-200"
                }`}
              >
                {tier.buttonText}
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className={`bg-[#F0F4F8] py-16 md:py-20 ${STOREFRONT_GUTTER_X}`}>
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2 mb-14">
            <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Who Standard is for</p>
              <p className="text-gray-800 font-bold leading-relaxed">
                New sellers, side hustles, and anyone who wants a serious storefront and checkout without a monthly fee. You still get
                marketplace discovery under fair caps—perfect while you prove product–market fit.
              </p>
            </div>
            <div className="rounded-[2rem] border-2 border-purple-200 bg-white p-8 shadow-md">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-600 mb-2">Who Diamond is for</p>
              <p className="text-gray-800 font-bold leading-relaxed">
                Sellers who want stronger discovery, AI catalog polish, and spotlight-style tools when competition is higher. Best when
                you are reinvesting in growth—not a substitute for good photos and fulfilment.
              </p>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter text-center mb-3">
            Compare at a glance
          </h2>
          <p className="text-center text-gray-600 text-sm font-medium mb-10 max-w-2xl mx-auto">
            Same core commerce for everyone—Diamond adds reach and flagship tools. No hidden “Standard tax”; payment processors still
            charge their own processing fees on card payments.
          </p>

          <div className="overflow-x-auto rounded-[2rem] border border-gray-200 bg-white shadow-xl">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/90">
                  <th className="px-5 py-4 font-black text-gray-900 uppercase tracking-wider text-[10px] md:px-8">Feature</th>
                  <th className="px-4 py-4 font-black text-slate-700 uppercase tracking-wider text-center text-[10px] md:px-6">
                    Standard
                  </th>
                  <th className="px-4 py-4 font-black text-purple-700 uppercase tracking-wider text-center text-[10px] md:px-6">
                    Diamond
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRICING_MATRIX_ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-gray-100 last:border-0">
                    <td className="px-5 py-4 font-bold text-gray-900 md:px-8">{row.label}</td>
                    <td className="px-4 py-4 align-middle md:px-6">
                      <PlanMatrixCell cell={row.standard} />
                    </td>
                    <td className="px-4 py-4 align-middle md:px-6">
                      <PlanMatrixCell cell={row.diamond} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-8">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3">When Diamond tends to pay off</h3>
              <ul className="space-y-2 text-sm font-semibold text-gray-700 leading-relaxed list-disc pl-5">
                <li>You are ready to push more listings into discovery, not only your own followers.</li>
                <li>You want AI-assisted catalog polish to lift conversion without a design agency.</li>
                <li>You are competing in crowded categories where extra visibility moves the needle.</li>
              </ul>
              <p className="mt-4 text-xs font-bold text-amber-900/80">
                Diamond does not guarantee rank or sales—see our{" "}
                <Link href="/#faq" className="underline underline-offset-2 font-black">
                  FAQ
                </Link>{" "}
                for the honest version.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3">Not included (on any plan)</h3>
              <ul className="space-y-2 text-sm font-semibold text-gray-600 leading-relaxed list-disc pl-5">
                <li>Done-for-you ads, creative production, or guaranteed customers.</li>
                <li>Full accounting, payroll, or legal compliance—we are commerce rails, not your CPA.</li>
                <li>Custom domain mapping until we ship and announce it.</li>
                <li>A promise of specific marketplace rank or impression counts.</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
            <Link
              href="/signup?next=%2Fpost-login"
              className="inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-gray-900 px-6 py-3 text-[11px] font-black uppercase tracking-widest text-white shadow-lg transition hover:bg-emerald-600"
            >
              Start free — upgrade in app
            </Link>
            <Link
              href="/login?next=%2Fdashboard"
              className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border-2 border-gray-300 bg-white px-6 py-3 text-[11px] font-black uppercase tracking-widest text-gray-800 transition hover:border-gray-900"
            >
              Already selling? Log in
            </Link>
            <Link
              href="/faq"
              className="text-[11px] font-black uppercase tracking-widest text-emerald-700 underline-offset-4 hover:underline"
            >
              Help center
            </Link>
            <Link href="/terms" className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900">
              Terms
            </Link>
            <Link href="/privacy" className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900">
              Privacy
            </Link>
          </div>
        </div>
      </section>

      <section className={`border-y border-gray-100 bg-white py-24 ${STOREFRONT_GUTTER_X}`}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter mb-6">
              Built for <span className="text-emerald-500 italic">Speed.</span>
            </h2>
            <div className="h-2 w-24 bg-gray-900 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Unified checkout",
                desc: "Buyers pay through StoreLink with a structured order record, real-time status, and less back-and-forth for you.",
                icon: <Zap className="text-amber-500" fill="currentColor" />,
              },
              {
                title: "Store Coin loyalty",
                desc: "Reward repeat buyers with Store Coins they can spend as discounts—wallet-backed loyalty that keeps customers on your storefront.",
                icon: <Coins className="text-purple-500" />,
              },
              {
                title: "AI Background Removal",
                desc: "Diamond sellers get one-tap cleanup so catalog shots look studio-clean.",
                icon: <Wand2 className="text-blue-500" />,
              },
              {
                title: "Verified Identity",
                desc: "Earn the Blue Tick through our manual vetting process. Stop losing customers to the 'Pay and Disappear' fear.",
                icon: <ShieldCheck className="text-emerald-500" />,
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-10 rounded-[2.5rem] bg-[#F8FAFC] border border-transparent hover:border-gray-200 hover:bg-white hover:shadow-2xl transition-all duration-500"
              >
                <div className="w-16 h-16 bg-white rounded-[1.25rem] shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4">{feature.title}</h4>
                <p className="text-gray-500 font-bold leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-24 ${STOREFRONT_GUTTER_X}`}>
        <div className="max-w-6xl mx-auto bg-gray-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none">
              Start your storefront <br />
              for <span className="text-emerald-500 italic">free.</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-xl mx-auto font-medium">
              Open a Standard store in minutes. Add Diamond when you want the extra reach—no forced trials.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Link
                href="/signup?next=%2Fpost-login"
                className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-emerald-600 px-6 py-6 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:scale-105 hover:bg-emerald-500 md:w-auto"
              >
                Create My Store
              </Link>
              <a
                href="https://wa.me/2349125951202"
                className="text-white hover:text-emerald-500 font-black uppercase text-xs tracking-[0.2em] flex items-center gap-3 transition-colors"
              >
                <MessageCircle size={20} />
                Talk to Support
              </a>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Coins({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  );
}
