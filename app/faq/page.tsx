"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Plus, Minus, Search, MessageCircle, ArrowRight, ShieldCheck, ShoppingBag, CreditCard, HelpCircle, X } from 'lucide-react';
import Link from 'next/link';
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM } from '@/lib/mobileLayout';

const faqCategories = [
  {
    category: "Getting Started & Costs",
    id: "getting-started",
    icon: <HelpCircle className="w-5 h-5" />,
    questions: [
      {
        q: "What exactly is Storelink?",
        a: "Storelink is professional storefront infrastructure for African entrepreneurs: a branded store link, inventory and orders, secure in-app checkout, and marketplace discovery so you can reach buyers outside your immediate network."
      },
      {
        q: "Are there any hidden transaction fees or commissions?",
        a: "Absolutely not. We believe you should keep 100% of what you earn. We don't take a percentage of your sales. You only pay your monthly subscription fee (Premium or Diamond), and that's it."
      },
      {
        q: "How does Storelink differ from selling only on social feeds?",
        a: "Social feeds are great for attention; Storelink is where the sale becomes real. Your storefront holds prices, stock, and checkout in one place—so customers move from browsing to paying with a clear order trail."
      }
    ]
  },
  {
    category: "Managing Your Storefront",
    id: "managing-store",
    icon: <ShoppingBag className="w-5 h-5" />,
    questions: [
      {
        q: "How do I upload and post my products?",
        a: "Our dashboard is built for speed. Just tap 'Add Product,' upload a photo (we even have a background remover!), set your price, and you're live. It takes less than 30 seconds."
      },
      {
        q: "Can I use my own brand name in the link?",
        a: "Yes! Every vendor gets a professional URL like 'storelink.ng/YourBrandName.' This builds instant authority and makes your brand easy to remember."
      },
      {
        q: "Can I manage my store from my phone?",
        a: "Yes. Storelink is mobile-first. You don't need a laptop. You can manage inventory, track orders, and update your prices entirely from your smartphone."
      }
    ]
  },
  {
    category: "Orders & Payments",
    id: "orders-payments",
    icon: <CreditCard className="w-5 h-5" />,
    questions: [
      {
        q: "How do I receive money from my customers?",
        a: "Money goes directly from the buyer to you. Storelink structures the order, but you choose how you want to get paid—via bank transfer or your preferred payment link. We don't hold your funds."
      },
      {
        q: "What should I do if a customer claims they haven't received their order?",
        a: "Always keep your 'Digital Ledger' updated with delivery proof. If a dispute arises, our support team can review the transaction logs to help mediate, but the primary contract is between you and your customer."
      },
      {
        q: "What if a buyer receives the wrong product?",
        a: "We encourage vendors to have a clear 'Return Policy' on their store. Shoppers can use the 'Report' feature if a vendor refuses to rectify a clear mistake, which may lead to the vendor losing their Blue Tick status."
      }
    ]
  },
  {
    category: "Trust & Safety",
    id: "trust-safety",
    icon: <ShieldCheck className="w-5 h-5" />,
    questions: [
      {
        q: "How can I get the Blue Tick verification badge?",
        a: "The Blue Tick is earned through credibility. You must submit a valid ID and proof of business through your dashboard. Our team manually vets every application to ensure our marketplace remains a fraud-free zone."
      },
      {
        q: "Is my customer data safe with Storelink?",
        a: "We use bank-grade encryption to protect your data. Your customer lists and sales history are your private assets; we never sell or share your business data with third parties."
      }
    ]
  }
];

export default function FullFAQPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(faqCategories[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔥 SEARCH LOGIC: Filters categories and questions based on input
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return faqCategories;
    const lowerQuery = searchQuery.toLowerCase();
    
    return faqCategories.map(cat => ({
      ...cat,
      questions: cat.questions.filter(q => 
        q.q.toLowerCase().includes(lowerQuery) || 
        q.a.toLowerCase().includes(lowerQuery) ||
        cat.category.toLowerCase().includes(lowerQuery)
      )
    })).filter(cat => cat.questions.length > 0);
  }, [searchQuery]);

  // 🔥 SCROLL SPY LOGIC: Fixes the category switching as you scroll
  useEffect(() => {
    // Disable observer if user is searching to prevent jumping
    if (searchQuery.trim().length > 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-150px 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    faqCategories.forEach((cat) => {
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
        behavior: 'smooth'
      });
      setActiveTab(id);
    }
  };

  return (
    <main className={`min-h-dvh bg-[#F8FAFC] ${STOREFRONT_SAFE_BOTTOM}`}>
      <Navbar />

      {/* Header Section */}
      <section className={`relative overflow-hidden bg-gray-900 pb-20 pt-32 ${STOREFRONT_GUTTER_X}`}>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-full mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Help Center</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">
            How can we <span className="text-emerald-500 italic">help?</span>
          </h1>
          
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

      {/* Mobile Sticky Category Bar */}
      {!searchQuery && (
        <div className="sticky top-[95px] z-30 border-b border-gray-200 bg-white/80 backdrop-blur-md md:hidden overflow-x-auto no-scrollbar">
          <div className={`flex min-w-max gap-2 py-3 ${STOREFRONT_GUTTER_X}`}>
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToSection(cat.id)}
                className={`min-h-[40px] rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === cat.id ? 'bg-gray-900 text-white shadow-lg' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main FAQ Content */}
      <section className={`py-12 md:py-24 ${STOREFRONT_GUTTER_X}`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
          
          {/* Desktop Sidebar Navigation */}
          {!searchQuery && (
            <div className="hidden md:block md:col-span-4 h-fit sticky top-32">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 px-4">Categories</p>
              <div className="space-y-1">
                {faqCategories.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => scrollToSection(cat.id)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${
                      activeTab === cat.id 
                      ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 translate-x-2' 
                      : 'text-gray-500 hover:bg-white hover:text-gray-900'
                    }`}
                  >
                    <span className={activeTab === cat.id ? 'text-white' : 'text-emerald-500'}>{cat.icon}</span>
                    <span className="font-black uppercase text-[11px] tracking-widest">{cat.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Questions Accordion */}
          <div className={`${searchQuery ? 'col-span-12' : 'md:col-span-8'} space-y-20`}>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <div key={cat.id} id={cat.id} className="scroll-mt-40">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
                      {cat.icon}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase">
                      {cat.category}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {cat.questions.map((item, qIdx) => {
                      const id = `${cat.id}-${qIdx}`;
                      const isOpen = openId === id || (searchQuery.length > 2); 
                      return (
                        <div 
                          key={id} 
                          className={`group border-2 rounded-[2rem] transition-all duration-300 ${
                            isOpen 
                            ? 'border-emerald-500 bg-white shadow-2xl' 
                            : 'border-transparent bg-white hover:border-gray-200'
                          }`}
                        >
                          <button 
                            onClick={() => setOpenId(isOpen ? null : id)}
                            className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                          >
                            <span className={`font-black text-base md:text-xl tracking-tight leading-snug ${isOpen ? 'text-emerald-600' : 'text-gray-900'}`}>
                              {item.q}
                            </span>
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                              isOpen ? 'bg-emerald-500 text-white rotate-180' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                            }`}>
                              {isOpen ? <Minus className="w-5 h-5" strokeWidth={3} /> : <Plus className="w-5 h-5" strokeWidth={3} />}
                            </div>
                          </button>
                          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
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
                <p className="text-gray-500 font-bold mt-2">We couldn't find anything matching "{searchQuery}"</p>
                <button onClick={() => setSearchQuery("")} className="mt-6 text-emerald-600 font-black uppercase text-xs tracking-widest hover:underline">
                  View All Questions
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Support CTA Section */}
      <section className={`py-12 ${STOREFRONT_GUTTER_X}`}>
        <div className="max-w-6xl mx-auto bg-gray-900 rounded-[3rem] md:rounded-[4rem] p-10 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-tight">
              Still looking for <span className="text-emerald-500 italic">clarity?</span>
            </h2>
            <p className="text-gray-400 text-base md:text-lg mb-12 max-w-lg mx-auto font-medium leading-relaxed">
              If your question wasn't answered here, our support team is ready to help.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Link 
                href="/contact" 
                className="flex min-h-[52px] w-full items-center justify-center gap-3 rounded-2xl bg-white px-10 py-5 text-xs font-black uppercase tracking-[0.2em] text-emerald-600 shadow-xl transition-all hover:scale-105 hover:bg-gray-100 md:w-auto"
                >
                <MessageCircle size={18} />
                Contact Support
              </Link>
              <Link href="/signup?next=%2Fpost-login&seller_intent=1" className="group flex min-h-[48px] w-full items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:text-emerald-500 md:w-auto">
                Start Selling Now <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25rem] font-black text-white/[0.03] select-none pointer-events-none">?</div>
        </div>
      </section>

      <Footer />
    </main>
  );
}