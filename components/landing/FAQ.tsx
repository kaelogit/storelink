"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Minus, Search } from "lucide-react";
import {
  LANDING_PAGE_FAQS,
  LANDING_FAQ_CATEGORY_LABELS,
  type LandingFaqCategoryId,
} from "@/lib/landingFaqContent";

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
    <section className="py-24 bg-gray-50" id="faq">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Got Questions? <span className="text-emerald-600 italic">We&apos;ve got answers</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-6">
            Straight answers on checkout, plans, trust—and what StoreLink does not pretend to be.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-6 max-w-2xl mx-auto">
            <button
              type="button"
              onClick={() => {
                setCategory("all");
                setOpenIndex(null);
              }}
              className={`rounded-full px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider transition ${
                category === "all"
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300"
              }`}
            >
              All topics
            </button>
            {categoryKeys.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setCategory(id);
                  setOpenIndex(null);
                }}
                className={`rounded-full px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider transition ${
                  category === id
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300"
                }`}
              >
                {LANDING_FAQ_CATEGORY_LABELS[id]}
              </button>
            ))}
          </div>

          <label className="block text-left max-w-xl mx-auto">
            <span className="sr-only">Search FAQs</span>
            <span className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpenIndex(null);
                }}
                placeholder="Search these questions…"
                className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                autoComplete="off"
              />
            </span>
          </label>
          <p className="mt-4 text-sm text-gray-500">
            Want more topics?{" "}
            <Link href="/faq" className="font-semibold text-emerald-700 hover:text-emerald-800 underline-offset-2 hover:underline">
              Browse the full help center
            </Link>
            .
          </p>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-600 py-8 rounded-2xl border border-dashed border-gray-200 bg-white">
              No matches for that search. Try different words—or open the{" "}
              <Link href="/faq" className="font-semibold text-emerald-700 hover:underline">
                help center
              </Link>
              .
            </p>
          ) : (
            filtered.map(({ faq, originalIndex }, displayIndex) => {
              const isOpen = openIndex === originalIndex;
              return (
                <div
                  key={originalIndex}
                  className={`group border rounded-2xl transition-all duration-300 ${
                    isOpen ? "border-emerald-500 bg-white shadow-md" : "border-gray-200 bg-white hover:border-emerald-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(displayIndex)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                  >
                    <span className={`text-lg font-bold pr-4 transition-colors ${isOpen ? "text-emerald-700" : "text-gray-900"}`}>
                      {faq.question}
                    </span>
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isOpen ? "bg-emerald-100 text-emerald-600 rotate-180" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-[960px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-5 md:p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-50">{faq.answer}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
