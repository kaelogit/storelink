"use client";

import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FullFaqPageJsonLd from "@/components/landing/FullFaqPageJsonLd";
import {
  Plus,
  Minus,
  Search,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  HelpCircle,
  X,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM } from "@/lib/mobileLayout";
import { FULL_FAQ_CATEGORIES } from "@/lib/fullFaqContent";
import type { FullFaqCategoryIconKey } from "@/lib/fullFaqContent";

const ICONS: Record<FullFaqCategoryIconKey, React.ReactNode> = {
  help: <HelpCircle className="w-5 h-5" />,
  bag: <ShoppingBag className="w-5 h-5" />,
  card: <CreditCard className="w-5 h-5" />,
  shield: <ShieldCheck className="w-5 h-5" />,
  sparkles: <Sparkles className="w-5 h-5" />,
};

const FAQ_NAV_CATEGORIES = FULL_FAQ_CATEGORIES.map((c) => ({
  ...c,
  icon: ICONS[c.iconKey],
}));

export default function FullFAQPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(FAQ_NAV_CATEGORIES[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_NAV_CATEGORIES;
    const lowerQuery = searchQuery.toLowerCase();

    return FAQ_NAV_CATEGORIES
      .map((cat) => ({
        ...cat,
        questions: cat.questions.filter(
          (q) =>
            q.q.toLowerCase().includes(lowerQuery) ||
            q.a.toLowerCase().includes(lowerQuery) ||
            cat.category.toLowerCase().includes(lowerQuery),
        ),
      }))
      .filter((cat) => cat.questions.length > 0);
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) return;

    const observerOptions = {
      root: null,
      rootMargin: "-150px 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    FAQ_NAV_CATEGORIES.forEach((cat) => {
      const element = document.getElementById(cat.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [searchQuery]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 140;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveTab(id);
    }
  };

  return (
    <main className={`min-h-dvh bg-[#F8FAFC] ${STOREFRONT_SAFE_BOTTOM}`}>
      <FullFaqPageJsonLd />
      <Navbar />

      <section className={`relative overflow-hidden bg-gray-900 pb-20 pt-32 ${STOREFRONT_GUTTER_X}`}>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-full mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Help Center</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">
            How can we <span className="text-emerald-500 italic">help?</span>
          </h1>

          <p className="text-gray-400 text-sm font-medium mb-6 max-w-lg mx-auto">
            Short answers also live on the{" "}
            <Link href="/#faq" className="text-emerald-400 font-bold underline-offset-2 hover:underline">
              homepage FAQ
            </Link>
            —search below for the full categorized library.
          </p>

          <div className="relative max-w-xl mx-auto group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full min-h-[52px] rounded-2xl border border-white/10 bg-white/5 py-5 pl-14 pr-12 text-base text-white shadow-2xl backdrop-blur-xl placeholder:text-gray-500 transition-all focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
      </section>

      {!searchQuery && (
        <div className="sticky top-[95px] z-30 border-b border-gray-200 bg-white/80 backdrop-blur-md md:hidden overflow-x-auto no-scrollbar">
          <div className={`flex min-w-max gap-2 py-3 ${STOREFRONT_GUTTER_X}`}>
            {FAQ_NAV_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => scrollToSection(cat.id)}
                className={`min-h-[40px] rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === cat.id ? "bg-gray-900 text-white shadow-lg" : "bg-gray-100 text-gray-500"
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </div>
      )}

      <section className={`py-12 md:py-24 ${STOREFRONT_GUTTER_X}`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
          {!searchQuery && (
            <div className="hidden md:block md:col-span-4 h-fit sticky top-32">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 px-4">Categories</p>
              <div className="space-y-1">
                {FAQ_NAV_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => scrollToSection(cat.id)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${
                      activeTab === cat.id
                        ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 translate-x-2"
                        : "text-gray-500 hover:bg-white hover:text-gray-900"
                    }`}
                  >
                    <span className={activeTab === cat.id ? "text-white" : "text-emerald-500"}>{cat.icon}</span>
                    <span className="font-black uppercase text-[11px] tracking-widest">{cat.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={`${searchQuery ? "col-span-12" : "md:col-span-8"} space-y-20`}>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <div key={cat.id} id={cat.id} className="scroll-mt-40">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
                      {cat.icon}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase">{cat.category}</h2>
                  </div>

                  <div className="space-y-4">
                    {cat.questions.map((item, qIdx) => {
                      const id = `${cat.id}-${qIdx}`;
                      const isOpen = openId === id || searchQuery.length > 2;
                      return (
                        <div
                          key={id}
                          className={`group border-2 rounded-[2rem] transition-all duration-300 ${
                            isOpen ? "border-emerald-500 bg-white shadow-2xl" : "border-transparent bg-white hover:border-gray-200"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setOpenId(isOpen ? null : id)}
                            className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                          >
                            <span
                              className={`font-black text-base md:text-xl tracking-tight leading-snug ${
                                isOpen ? "text-emerald-600" : "text-gray-900"
                              }`}
                            >
                              {item.q}
                            </span>
                            <div
                              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                                isOpen ? "bg-emerald-500 text-white rotate-180" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                              }`}
                            >
                              {isOpen ? <Minus className="w-5 h-5" strokeWidth={3} /> : <Plus className="w-5 h-5" strokeWidth={3} />}
                            </div>
                          </button>
                          <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                              isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="px-6 md:px-8 pb-8 text-gray-500 font-medium text-sm md:text-base leading-relaxed border-t border-gray-50 pt-6">
                              {item.a}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                <Search className="mx-auto mb-4 text-gray-300" size={48} />
                <h3 className="text-xl font-black text-gray-900 uppercase">No Results Found</h3>
                <p className="text-gray-500 font-bold mt-2">
                  We couldn&apos;t find anything matching &quot;{searchQuery}&quot;
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mt-6 text-emerald-600 font-black uppercase text-xs tracking-widest hover:underline"
                >
                  View All Questions
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className={`py-12 ${STOREFRONT_GUTTER_X}`}>
        <div className="max-w-6xl mx-auto bg-gray-900 rounded-[3rem] md:rounded-[4rem] p-10 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-tight">
              Still looking for <span className="text-emerald-500 italic">clarity?</span>
            </h2>
            <p className="text-gray-400 text-base md:text-lg mb-12 max-w-lg mx-auto font-medium leading-relaxed">
              If your question wasn&apos;t answered here, our support team is ready to help.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Link
                href="/contact"
                className="flex min-h-[52px] w-full items-center justify-center gap-3 rounded-2xl bg-white px-10 py-5 text-xs font-black uppercase tracking-[0.2em] text-emerald-600 shadow-xl transition-all hover:scale-105 hover:bg-gray-100 md:w-auto"
              >
                <MessageCircle size={18} />
                Contact Support
              </Link>
              <Link
                href="/signup?next=%2Fpost-login"
                className="group flex min-h-[48px] w-full items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:text-emerald-500 md:w-auto"
              >
                Start Selling Now <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25rem] font-black text-white/[0.03] select-none pointer-events-none">
            ?
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
