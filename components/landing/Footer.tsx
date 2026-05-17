"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/storelink.ng" },
  { label: "TikTok", href: "https://tiktok.com/@storelink.ng" },
  { label: "LinkedIn", href: "#" },
  { label: "Twitter", href: "#" },
];

const links = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="relative w-full flex-shrink-0 bg-gray-950 text-white border-t border-white/5">
      
      {/* Giant brand — clamped to prevent overflow */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-12 sm:pt-16 md:pt-24 pb-8 md:pb-16 overflow-hidden">
        <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[9rem] font-black tracking-tighter leading-[0.85] break-words">
          Store<span className="text-emerald-500">Link</span>
        </h2>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-12 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          
          {/* About */}
          <div className="md:col-span-5 lg:col-span-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 md:mb-6">
              About
            </p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Professional storefronts for African sellers. No code, no hassle — just a link that converts.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-3 md:col-start-7 lg:col-start-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 md:mb-6">
              Navigate
            </p>
            <ul className="space-y-3 md:space-y-4">
              {links.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-1 group w-fit"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 text-gray-600 group-hover:text-emerald-500 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="md:col-span-4 md:col-start-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 md:mb-6">
              Start selling
            </p>
            <Link
              href="/signup?next=%2Fpost-login"
              className="inline-flex items-center gap-2 border-b border-white pb-1 text-sm font-bold uppercase tracking-widest hover:text-emerald-400 hover:border-emerald-400 transition-all"
            >
              Open your storefront <ArrowUpRight size={16} />
            </Link>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-6">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest text-center sm:text-left">
            © 2026 StoreLink. Lagos, Nigeria.
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500 hover:text-white transition-colors flex items-center gap-1 group"
              >
                {social.label}
                <ArrowUpRight className="w-3 h-3 text-gray-700 group-hover:text-emerald-500 transition-all" />
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}