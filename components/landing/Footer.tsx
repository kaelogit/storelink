"use client";

import Link from "next/link";
import { Twitter, Instagram, Linkedin, LayoutDashboard } from "lucide-react";

const TiktokIcon = ({ size = 18 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-8 px-6 font-sans border-t border-gray-800">
      
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8 mb-12 text-left">
        
        <div className="col-span-2 md:col-span-1 flex flex-col items-start">
           <h3 className="font-extrabold text-2xl tracking-tight mb-4 flex items-center gap-2">
             <LayoutDashboard size={20} className="text-emerald-500"/> StoreLink.
           </h3>
           <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
             The engine for the Naija Hustle. We help you turn WhatsApp chats into a professional empire.
           </p>
        </div>

        <div className="flex flex-col items-start">
           <h4 className="font-bold text-gray-200 mb-4 text-xs uppercase tracking-wider text-emerald-500">Platform</h4>
           <ul className="space-y-3 text-sm text-gray-400 font-medium">
             <li><Link href="/login" className="hover:text-white transition">Vendor Login</Link></li>
             <li><Link href="/signup" className="hover:text-white transition">Start Selling</Link></li>
             <li><Link href="/marketplace" className="hover:text-white transition">Marketplace</Link></li>
           </ul>
        </div>

        <div className="flex flex-col items-start">
           <h4 className="font-bold text-gray-200 mb-4 text-xs uppercase tracking-wider text-emerald-500">Support</h4>
           <ul className="space-y-3 text-sm text-gray-400 font-medium">
             <li><Link href="/report" className="hover:text-white transition">Report Vendor</Link></li>
             <li><Link href="/safety" className="hover:text-white transition">Safety Tips</Link></li>
             <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
           </ul>
        </div>

        <div className="col-span-2 md:col-span-1 flex flex-col items-start">
          <h4 className="font-bold text-gray-200 mb-4 text-xs uppercase tracking-wider text-emerald-500">Follow Us</h4>
          <div className="flex gap-3">
             <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-emerald-600 hover:text-white text-gray-400 transition transform hover:-translate-y-1"><Twitter size={18}/></a>
             <a href="https://www.instagram.com/storelink.ng" className="p-2 bg-gray-800 rounded-lg hover:bg-pink-600 hover:text-white text-gray-400 transition transform hover:-translate-y-1"><Instagram size={18}/></a>
             <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 hover:text-white text-gray-400 transition transform hover:-translate-y-1"><Linkedin size={18}/></a>
             
             <a href="https://tiktok.com/@storelink.ng" target="_blank" className="p-2 bg-gray-800 rounded-lg hover:bg-black hover:text-white text-gray-400 transition transform hover:-translate-y-1">
                <TiktokIcon size={18}/>
             </a>
          </div>
        </div>

      </div>

      <div className="max-w-6xl mx-auto border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
         <p>© 2025 StoreLink Inc. Lagos, Nigeria.</p>
         <div className="flex gap-6">
            <Link href="/about" className="hover:text-white transition">About Us</Link>
            <Link href="/privacy" className="hover:text-gray-300 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition">Terms of Service</Link>
         </div>
      </div>
    </footer>
  );
}