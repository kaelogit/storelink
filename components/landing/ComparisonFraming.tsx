import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";
import { STOREFRONT_GUTTER_X } from "@/lib/mobileLayout";

const rows: { label: string; ig: boolean | "partial"; wa: boolean | "partial"; diy: boolean | "partial"; storelink: boolean }[] = [
  { label: "Your brand on one official shop link", ig: false, wa: "partial", diy: true, storelink: true },
  { label: "Checkout & order records (No “DM proof” loops)", ig: false, wa: false, diy: "partial", storelink: true },
  { label: "Catalog & stock visibility at point of sale", ig: "partial", wa: "partial", diy: true, storelink: true },
  { label: "Zero tech setup—no themes or plugins needed", ig: true, wa: true, diy: false, storelink: true },
  { label: "Marketplace reach beyond your followers", ig: false, wa: false, diy: false, storelink: true },
  { label: "Store Coins loyalty across the network", ig: false, wa: false, diy: false, storelink: true },
];

function Cell({ v }: { v: boolean | "partial" }) {
  if (v === true)
    return (
      <span className="flex justify-center text-emerald-600">
        <Check className="h-5 w-5" strokeWidth={3} aria-label="Yes" />
      </span>
    );
  if (v === false)
    return (
      <span className="flex justify-center text-gray-300">
        <Minus className="h-5 w-5" strokeWidth={2} aria-label="No" />
      </span>
    );
  return (
    <span className="block text-center text-[9px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 py-0.5 rounded-full">Partial</span>
  );
}

/** Comparison table — Honest framing for serious sellers. */
export default function ComparisonFraming() {
  return (
    <section className={`border-y border-gray-100 bg-white py-16 md:py-20 ${STOREFRONT_GUTTER_X}`} aria-labelledby="compare-heading">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 mb-2">The Comparison</p>
          <h2 id="compare-heading" className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
            Same hustle—<span className="text-emerald-600">different scale.</span>
          </h2>
          <p className="mt-3 text-gray-600 text-sm md:text-base leading-relaxed font-medium">
            Social apps are for attention. Chat is for talking. StoreLink is for <strong className="text-gray-900">selling.</strong> We sit right in the middle: a professional shop that handles the boring stuff so you can focus on growth.
          </p>
        </div>

        <div className="overflow-x-auto rounded-[1.5rem] border border-gray-200 bg-gray-50/30 shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="px-4 py-5 font-black text-gray-900 uppercase text-[10px] tracking-widest md:px-6">Capability</th>
                <th className="px-3 py-5 font-black text-gray-400 uppercase text-[9px] tracking-widest text-center md:px-4">Social Only</th>
                <th className="px-3 py-5 font-black text-gray-400 uppercase text-[9px] tracking-widest text-center md:px-4">Chat Catalog</th>
                <th className="px-3 py-5 font-black text-gray-400 uppercase text-[9px] tracking-widest text-center md:px-4">DIY Site</th>
                <th className="px-3 py-5 font-black text-emerald-600 uppercase text-[9px] tracking-widest text-center md:px-4">StoreLink</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-gray-100 last:border-0 bg-white hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4 font-bold text-gray-900 md:px-6">{row.label}</td>
                  <td className="px-3 py-4 align-middle"><Cell v={row.ig} /></td>
                  <td className="px-3 py-4 align-middle"><Cell v={row.wa} /></td>
                  <td className="px-3 py-4 align-middle"><Cell v={row.diy} /></td>
                  <td className="px-3 py-4 align-middle bg-emerald-50/30"><Cell v={row.storelink} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 text-[11px] font-black uppercase tracking-widest text-white shadow-lg transition hover:bg-emerald-600 active:scale-[0.98]"
          >
            Upgrade your setup <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/#faq" className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-emerald-700 transition-colors">
            Got questions? Check the FAQ
          </Link>
        </div>
      </div>
    </section>
  );
}