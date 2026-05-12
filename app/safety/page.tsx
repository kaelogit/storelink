import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { ShieldCheck, MessageCircle, Lock } from "lucide-react";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM } from "@/lib/mobileLayout";

export default function SafetyPage() {
  return (
    <div className={`min-h-dvh bg-white font-sans ${STOREFRONT_SAFE_BOTTOM}`}>
      <Navbar />
      
      <div className={`bg-emerald-900 py-20 text-center text-white ${STOREFRONT_GUTTER_X}`}>
         <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Safety First.</h1>
         <p className="text-emerald-200 text-lg max-w-2xl mx-auto">StoreLink is built on trust, but it pays to be smart. Here is how to stay safe while hustling.</p>
      </div>

      <div className={`mx-auto grid max-w-5xl gap-8 py-16 md:grid-cols-2 ${STOREFRONT_GUTTER_X}`}>
         
         <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
            <ShieldCheck className="text-emerald-600 mb-4 w-10 h-10" />
            <h3 className="font-bold text-xl text-gray-900 mb-2">Verify Before You Pay</h3>
            <p className="text-gray-500 leading-relaxed">Use the vendor&apos;s listed contact or in-app messaging when you need clarity. Ask for more photos or a short video if you are unsure before you pay.</p>
         </div>

    

         <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
            <MessageCircle className="text-green-600 mb-4 w-10 h-10" />
            <h3 className="font-bold text-xl text-gray-900 mb-2">Keep a written record</h3>
            <p className="text-gray-500 leading-relaxed">Save agreements, delivery timelines, and payment confirmations in writing. Your StoreLink order page is the source of truth for what was purchased.</p>
         </div>

         <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
            <Lock className="text-purple-600 mb-4 w-10 h-10" />
            <h3 className="font-bold text-xl text-gray-900 mb-2">Protect Your Data</h3>
            <p className="text-gray-500 leading-relaxed">Never share your password or OTP with anyone, not even StoreLink support staff. We will never ask for it.</p>
         </div>

      </div>
      <Footer />
    </div>
  );
}