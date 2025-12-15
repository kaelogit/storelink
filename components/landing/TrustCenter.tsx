import { ShieldCheck, Flag, AlertTriangle } from "lucide-react";

export default function TrustCenter() {
  return (
    <section className="py-16 px-6 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center p-3 bg-gray-800 rounded-2xl mb-6">
          <ShieldCheck size={32} className="text-emerald-400" />
        </div>
        
        <h2 className="text-3xl font-bold mb-4">Shop with Confidence</h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          We are building a safe community. While vendors manage their own payments and deliveries, we do not tolerate scams, fake products, or bad behavior.
        </p>

        <div className="grid md:grid-cols-2 gap-4 text-left bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <div>
             <h3 className="font-bold text-white flex items-center gap-2 mb-2">
               <AlertTriangle size={18} className="text-yellow-400"/> Buyer Tips
             </h3>
             <ul className="text-sm text-gray-400 space-y-2">
               <li>• Check the vendor's social media links.</li>
               <li>• Don't pay large sums before delivery if unsure.</li>
               <li>• Chat with the vendor on WhatsApp first.</li>
             </ul>
          </div>
          <div className="border-t md:border-t-0 md:border-l border-gray-700 pt-4 md:pt-0 md:pl-6">
             <h3 className="font-bold text-white flex items-center gap-2 mb-2">
               <Flag size={18} className="text-red-400"/> Spot an issue?
             </h3>
             <p className="text-sm text-gray-400 mb-4">
               If a vendor is suspicious or scammed you, let us know immediately. We will investigate and ban them.
             </p>
             <a 
               href="/report" 
               className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-500/20 transition"
             >
               Report a Vendor
             </a>
          </div>
        </div>
      </div>
    </section>
  );
}