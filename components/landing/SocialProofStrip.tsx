import Link from "next/link";
import { TrendingUp, Quote } from "lucide-react";
import { STOREFRONT_GUTTER_X } from "@/lib/mobileLayout";

/**
 * Honest momentum strip — section A. Replace placeholder quote when you have real seller testimonials.
 */
export default function SocialProofStrip() {
  return (
    <section className={`border-b border-gray-100 bg-gray-900 py-10 md:py-12 text-white ${STOREFRONT_GUTTER_X}`} aria-label="Seller momentum">
      <div className="max-w-6xl mx-auto flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-6 md:gap-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
              <TrendingUp className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Momentum</p>
              <p className="text-base md:text-lg font-black tracking-tight">Built for independent sellers</p>
              <p className="text-xs text-gray-400 font-medium mt-1 max-w-sm">
                Storefront + checkout + marketplace discovery—without forcing a custom website project first.
              </p>
            </div>
          </div>
        </div>

        <div className="relative max-w-md rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
          <Quote className="absolute right-4 top-4 h-8 w-8 text-white/10" aria-hidden />
          <p className="text-sm font-bold text-gray-200 leading-relaxed italic pr-8">
            “We’re collecting seller stories for this spot—if StoreLink changed how you sell, tell us via{" "}
            <Link href="/contact" className="text-emerald-400 underline-offset-2 hover:underline not-italic">
              Contact
            </Link>
            .”
          </p>
          <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Placeholder quote — swap when ready</p>
        </div>
      </div>
    </section>
  );
}
