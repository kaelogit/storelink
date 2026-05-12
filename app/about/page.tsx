import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Store, ShieldCheck, Users, MapPin, Mail, Phone } from "lucide-react";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM } from "@/lib/mobileLayout";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      
      <div className={`bg-white pt-20 font-sans text-gray-900 ${STOREFRONT_SAFE_BOTTOM} min-h-dvh`}>
        
        <div className={`bg-gray-900 py-20 text-center text-white ${STOREFRONT_GUTTER_X}`}>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">We are StoreLink.</h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            The engine for the Naija Hustle. We are on a mission to help 1 million Nigerian vendors move from scattered chats to a professional online storefront—without the cost of a custom website.
          </p>
        </div>

        <div className={`mx-auto max-w-4xl py-16 ${STOREFRONT_GUTTER_X}`}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                StoreLink started with a simple observation: many sellers still run commerce from scattered chats and status posts—it is manual, stressful, and hard to scale.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We built StoreLink to bridge the gap: a branded storefront, inventory, receipts, and secure checkout—plus marketplace discovery so you can sell beyond your personal contacts.
              </p>
            </div>
            <div className="bg-gray-100 h-64 rounded-2xl flex items-center justify-center">
               <Store size={64} className="text-gray-300" />
            </div>
          </div>
        </div>

        <div className={`bg-gray-50 py-16 ${STOREFRONT_GUTTER_X}`}>
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <ShieldCheck className="text-emerald-600 mb-4 h-10 w-10" />
              <h3 className="font-bold text-xl mb-2">Trust & Safety</h3>
              <p className="text-gray-500 text-sm">We verify vendors to ensure every transaction on StoreLink is safe and secure for buyers.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <Users className="text-purple-600 mb-4 h-10 w-10" />
              <h3 className="font-bold text-xl mb-2">Community First</h3>
              <p className="text-gray-500 text-sm">We don't just build software; we build a community of entrepreneurs supporting each other.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <Store className="text-blue-600 mb-4 h-10 w-10" />
              <h3 className="font-bold text-xl mb-2">Vendor Success</h3>
              <p className="text-gray-500 text-sm">Our only goal is to help you sell more. If you don't grow, we don't grow.</p>
            </div>
          </div>
        </div>

        <div className={`mx-auto max-w-4xl py-20 text-center ${STOREFRONT_GUTTER_X}`}>
          <h2 className="text-3xl font-bold mb-10">Get in Touch</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="flex items-start gap-4">
               <div className="bg-gray-100 p-3 rounded-full"><MapPin size={20}/></div>
               <div>
                 <h4 className="font-bold">Headquarters</h4>
                 <p className="text-gray-500 text-sm">Yetunde Longe Street<br/>Off Tawakalit Ajah, Lagos,<br/>Nigeria.</p>
               </div>
            </div>
            <div className="flex items-start gap-4">
               <div className="bg-gray-100 p-3 rounded-full"><Mail size={20}/></div>
               <div>
                 <h4 className="font-bold">Email Us</h4>
                 <p className="text-gray-500 text-sm">hello@storelink.ng</p>
               </div>
            </div>
            <div className="flex items-start gap-4">
               <div className="bg-gray-100 p-3 rounded-full"><Phone size={20}/></div>
               <div>
                 <h4 className="font-bold">Call Us</h4>
                 <p className="text-gray-500 text-sm">+234 9125951202</p>
                 <p className="text-gray-500 text-sm">Mon-Fri, 9am - 4pm</p>
               </div>
            </div>
          </div>
          <div className="mt-12 flex justify-center">
            <Link
              href="/signup?next=%2Fpost-login&seller_intent=1"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-gray-900 px-6 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-emerald-600"
            >
              Start Selling on StoreLink
            </Link>
          </div>
        </div>

      </div>

      <Footer />
    </>
  );
}