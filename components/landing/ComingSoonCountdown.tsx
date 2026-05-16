import Link from "next/link";
import { Sparkles, Rocket, ShieldCheck, Compass } from "lucide-react";

/**
 * Public teaser for the StoreLink evolution.
 * Focuses on long-term value and merchant growth.
 */
export default function ComingSoonCountdown() {
  return (
    <section className="py-20 px-4 md:px-6" aria-labelledby="whats-next-heading">
      <div className="max-w-7xl mx-auto rounded-[2.5rem] md:rounded-[3rem] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-8 md:p-12 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 lg:items-start">
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-white border border-emerald-200 text-emerald-700 px-4 py-2 rounded-full mb-6 shadow-sm">
              <Sparkles size={14} className="shrink-0" aria-hidden />
              <span className="text-[10px] font-black uppercase tracking-[0.25em]">On the horizon</span>
            </div>
            <h2 id="whats-next-heading" className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter leading-[0.95]">
              Storefront today. <br />
              <span className="text-emerald-600">Richer discovery tomorrow.</span>
            </h2>
            <p className="mt-6 text-gray-700 text-sm md:text-base leading-relaxed max-w-2xl font-medium">
              We’re perfecting the foundation first: your shop link, your catalog, and a checkout trail that actually works. As StoreLink grows, we’re building new ways for serious buyers to find great sellers—without you having to change a thing.
            </p>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-2xl font-medium">
              If you ship on time and keep your shop looking sharp today, you’re building the reputation that will put you first when the next wave of buyers arrives. Same account. One home base.
            </p>
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-emerald-200 transition">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Rocket size={14} className="text-emerald-600 shrink-0" aria-hidden /> For Sellers
              </p>
              <p className="text-sm text-gray-700 mt-3 leading-relaxed font-medium">
                Make your StoreLink shop your home base. As we expand, your products will start appearing exactly where people are already scrolling—so make sure your shop is ready for the spotlight.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-sky-200 transition">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Compass size={14} className="text-sky-600 shrink-0" aria-hidden /> For Buyers
              </p>
              <p className="text-sm text-gray-700 mt-3 leading-relaxed font-medium">
                A secure checkout and clear order history will always be the heart of StoreLink. We’re just adding more ways for you to discover brands you can actually trust.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-200 bg-emerald-500 p-8 text-white shadow-xl shadow-emerald-200/50">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100 flex items-center gap-2 mb-2">
                <ShieldCheck size={14} className="shrink-0" aria-hidden /> Start building today
              </p>
              <p className="text-base md:text-lg font-bold leading-tight">
                The marketplace is live. Your storefront is ready. We’ll keep shipping the future while you build your brand.
              </p>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}