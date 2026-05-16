import Link from "next/link";
import { UserPlus, LayoutGrid, Share2, Radar } from "lucide-react";
import { STOREFRONT_GUTTER_X } from "@/lib/mobileLayout";

const steps = [
  { 
    step: "01", 
    title: "Create Account", 
    body: "Launch your seller profile in minutes. Designed for speed, ease, and a professional first impression.", 
    Icon: UserPlus 
  },
  { 
    step: "02", 
    title: "Build Your Catalog", 
    body: "Upload your products with high-quality photos and pricing. Your storefront goes live as you build.", 
    Icon: LayoutGrid 
  },
  { 
    step: "03", 
    title: "Launch Your Link", 
    body: "One official URL for your brand that handles everything from product display to secure payment.", 
    Icon: Share2 
  },
  { 
    step: "04", 
    title: "Manage & Grow", 
    body: "Fulfil orders from your dashboard while our marketplace connects your brand with a wider audience.", 
    Icon: Radar 
  },
];

/** Compact seller journey for landing (section A). */
export default function SellerJourney() {
  return (
    <section className={`border-y border-gray-100 bg-gray-50 py-16 md:py-20 ${STOREFRONT_GUTTER_X}`} id="seller-journey">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 mb-2">The Process</p>
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">From setup to successful sales</h2>
            <p className="mt-3 text-gray-600 text-sm md:text-base max-w-xl font-medium leading-relaxed">
              Skip the expensive agencies and complex setups. Get a direct path to a professional storefront that your customers can use immediately.
            </p>
          </div>
          <Link
            href="/signup?next=%2Fpost-login"
            className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-xl bg-gray-900 px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg transition hover:bg-emerald-600 active:scale-[0.98]"
          >
            Start your journey
          </Link>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {steps.map(({ step, title, body, Icon }) => (
            <li
              key={step}
              className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <span className="absolute right-4 top-4 text-[10px] font-black text-gray-200 tabular-nums">{step}</span>
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon className="h-5 w-5" strokeWidth={2.2} aria-hidden />
              </div>
              <h3 className="text-sm font-black uppercase tracking-tight text-gray-900 mb-2">{title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">{body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-8 md:mt-10 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-5 py-4 text-sm text-emerald-950/90 leading-relaxed font-medium text-center md:text-left max-w-4xl mx-auto">
          <span className="font-bold text-emerald-800">Your Brand Legacy:</span> Every quality listing and fulfilled order builds the reputation you carry forward on StoreLink—increasing your visibility as our marketplace grows.
        </p>
      </div>
    </section>
  );
}