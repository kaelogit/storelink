import Link from "next/link";
import { ShieldCheck, Flag, AlertTriangle, Store } from "lucide-react";

export default function TrustCenter() {
  return (
    <section className="py-16 px-6 bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center justify-center p-3 bg-gray-800 rounded-2xl mb-6">
          <ShieldCheck size={32} className="text-emerald-400" />
        </div>
        
        <h2 className="text-3xl font-black tracking-tight mb-4 text-white">Shop with Confidence</h2>
        <p className="text-gray-400 mb-4 max-w-2xl mx-auto font-medium">
          StoreLink uses verified profiles, secure payment tracking, and real-time reporting to keep shopping safe for everyone.
        </p>
        <p className="text-gray-500 text-sm mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
          Sellers get a clear paper trail; buyers get a single place to pay and track. Check our{" "}
          <Link href="/pricing" className="font-bold text-emerald-400 hover:text-emerald-300 underline-offset-2 hover:underline">
            pricing &amp; payments
          </Link>{" "}
          and the{" "}
          <Link href="/faq" className="font-bold text-emerald-400 hover:text-emerald-300 underline-offset-2 hover:underline">
            FAQ
          </Link>{" "}
          to see how we handle disputes.
        </p>

        <div className="grid md:grid-cols-3 gap-4 text-left bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <div>
             <h3 className="font-black text-white uppercase tracking-wider text-xs flex items-center gap-2 mb-4">
               <AlertTriangle size={18} className="text-yellow-400"/> Buyer Tips
             </h3>
             <ul className="text-sm text-gray-400 space-y-3 font-medium">
               <li>• Check the vendor&apos;s social media links before buying.</li>
               <li>• Only pay through the app to keep your records safe.</li>
               <li>• Ensure your status shows &ldquo;Paid&rdquo; before the item is sent.</li>
             </ul>
          </div>
          <div className="border-t md:border-t-0 md:border-l border-gray-700 pt-6 md:pt-0 md:pl-6">
             <h3 className="font-black text-white uppercase tracking-wider text-xs flex items-center gap-2 mb-4">
               <Store size={18} className="text-emerald-400"/> Seller Tips
             </h3>
             <ul className="text-sm text-gray-400 space-y-3 font-medium">
               <li>• Keep your stock and prices updated—accuracy builds trust.</li>
               <li>• Only ship orders when the dashboard confirms payment.</li>
               <li>• Use your shop link in your bio so repeat buyers can find you.</li>
             </ul>
          </div>
          <div className="border-t md:border-t-0 md:border-l border-gray-700 pt-6 md:pt-0 md:pl-6">
             <h3 className="font-black text-white uppercase tracking-wider text-xs flex items-center gap-2 mb-4">
               <Flag size={18} className="text-red-400"/> Spot an issue?
             </h3>
             <p className="text-sm text-gray-400 mb-5 font-medium leading-relaxed">
               If a vendor looks suspicious or you’ve had a bad experience, let us know immediately. We investigate every report and ban bad actors.
             </p>
             <Link
               href="/report"
               className="inline-flex items-center justify-center gap-2 bg-red-500/10 text-red-400 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500/20 transition w-full md:w-auto"
             >
               Report a Vendor
             </Link>
          </div>
        </div>
      </div>
    </section>
  );
}