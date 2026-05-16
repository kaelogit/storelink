"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Minus, Search, HelpCircle, MessageSquare } from "lucide-react";
import {
  LANDING_PAGE_FAQS,
  LANDING_FAQ_CATEGORY_LABELS,
  type LandingFaqCategoryId,
} from "@/lib/landingFaqContent";
import SectionHeader from "./SectionHeader";

type FilterCat = "all" | LandingFaqCategoryId;

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FilterCat>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LANDING_PAGE_FAQS.map((faq, i) => ({ faq, originalIndex: i })).filter(({ faq }) => {
      if (category !== "all" && faq.category !== category) return false;
      if (!q) return true;
      return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
    });
  }, [query, category]);

  const toggleFAQ = (displayIndex: number) => {
    const originalIndex = filtered[displayIndex]?.originalIndex;
    if (originalIndex === undefined) return;
    setOpenIndex(openIndex === originalIndex ? null : originalIndex);
  };

  const categoryKeys = Object.keys(LANDING_FAQ_CATEGORY_LABELS) as LandingFaqCategoryId[];

  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32" id="faq">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }} />

      <div className="relative max-w-3xl mx-auto px-6">
        
        <SectionHeader
          eyebrow="Support"
          headline={
            <>
              Questions?{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Answered.
              </span>
            </>
          }
          description="Straight talk on checkout, plans, trust—and what we don't pretend to be."
          align="center"
          singleLine
        />

        {/* Search + filters */}
        <div className="mt-12 space-y-6">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpenIndex(null);
              }}
              placeholder="Search questions..."
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 shadow-sm focus:bg-white focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
              autoComplete="off"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCategory("all");
                setOpenIndex(null);
              }}
              className={`rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
                category === "all"
                  ? "bg-gray-900 text-white shadow-lg"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {categoryKeys.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setCategory(id);
                  setOpenIndex(null);
                }}
                className={`rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
                  category === id
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {LANDING_FAQ_CATEGORY_LABELS[id]}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion */}
        <div className="mt-10 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 rounded-3xl border border-dashed border-gray-200 bg-gray-50/50">
              <HelpCircle className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-2">No matches found</p>
              <Link href="/faq" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                Browse full help center →
              </Link>
            </div>
          ) : (
            filtered.map(({ faq, originalIndex }, displayIndex) => {
              const isOpen = openIndex === originalIndex;
              return (
                <div
                  key={originalIndex}
                  className={`group rounded-2xl border transition-all duration-300 ${
                    isOpen 
                      ? "border-emerald-200 bg-white shadow-lg shadow-emerald-500/5" 
                      : "border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 hover:shadow-sm"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(displayIndex)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left gap-4"
                  >
                    <span className={`text-base md:text-lg font-semibold pr-4 transition-colors ${isOpen ? "text-emerald-700" : "text-gray-900"}`}>
                      {faq.question}
                    </span>
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isOpen ? "bg-emerald-500 text-white rotate-180" : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"
                      }`}
                    >
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-[960px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                      <div className="pt-4 border-t border-gray-100 text-gray-600 leading-relaxed text-sm md:text-base">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom link */}
        <div className="mt-12 text-center">
          <Link 
            href="/faq" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-emerald-600 transition-colors group"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Need more help? Visit our help center</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}