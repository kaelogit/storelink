"use client";

import Link from "next/link";
import { ArrowRight, Check, Minus, X, Sparkles } from "lucide-react";
import { STOREFRONT_GUTTER_X } from "@/lib/mobileLayout";
import SectionHeader from "./SectionHeader";

const rows: { label: string; ig: boolean | "partial"; wa: boolean | "partial"; diy: boolean | "partial"; storelink: boolean }[] = [
  { label: "Your brand on one official shop link", ig: false, wa: "partial", diy: true, storelink: true },
  { label: "Checkout & order records (No 'DM proof' loops)", ig: false, wa: false, diy: "partial", storelink: true },
  { label: "Catalog & stock visibility at point of sale", ig: "partial", wa: "partial", diy: true, storelink: true },
  { label: "Zero tech setup—no themes or plugins needed", ig: true, wa: true, diy: false, storelink: true },
  { label: "Marketplace reach beyond your followers", ig: false, wa: false, diy: false, storelink: true },
  { label: "Store Coins loyalty across the network", ig: false, wa: false, diy: false, storelink: true },
];

function Cell({ v, highlight = false }: { v: boolean | "partial"; highlight?: boolean }) {
  if (v === true)
    return (
      <span className={`flex justify-center ${highlight ? 'text-emerald-600' : 'text-emerald-500'}`}>
        <Check className="h-5 w-5" strokeWidth={3} aria-label="Yes" />
      </span>
    );
  if (v === false)
    return (
      <span className="flex justify-center text-gray-200">
        <X className="h-4 w-4" strokeWidth={2.5} aria-label="No" />
      </span>
    );
  return (
    <span className="block text-center text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 py-0.5 rounded-full border border-amber-100">
      Partial
    </span>
  );
}

export default function ComparisonFraming() {
  return (
    <section className={`relative overflow-hidden bg-gray-50 py-24 md:py-32 ${STOREFRONT_GUTTER_X}`} aria-labelledby="compare-heading">
      
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-100/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        
        <SectionHeader
          eyebrow="The Comparison"
          headline={
            <>
              Same hustle.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Different scale.
              </span>
            </>
          }
          description="Social apps are for attention. Chat is for talking. StoreLink is for selling."
          align="center"
          
        />

        {/* Table */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl shadow-gray-900/5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
                    Capability
                  </th>
                  <th className="px-4 py-5 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                    Social Only
                  </th>
                  <th className="px-4 py-5 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                    Chat Catalog
                  </th>
                  <th className="px-4 py-5 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                    DIY Site
                  </th>
                  <th className="px-4 py-5 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-600 bg-emerald-50/50">
                    <span className="inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> StoreLink
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr 
                    key={row.label} 
                    className={`border-b border-gray-50 last:border-0 transition-colors hover:bg-gray-50/50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'}`}
                  >
                    <td className="px-6 py-5 text-sm font-semibold text-gray-900">
                      {row.label}
                    </td>
                    <td className="px-4 py-5 align-middle"><Cell v={row.ig} /></td>
                    <td className="px-4 py-5 align-middle"><Cell v={row.wa} /></td>
                    <td className="px-4 py-5 align-middle"><Cell v={row.diy} /></td>
                    <td className="px-4 py-5 align-middle bg-emerald-50/20 border-l border-emerald-100">
                      <Cell v={row.storelink} highlight />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}