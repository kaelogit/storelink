"use client";

import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { AlertTriangle, Send, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM } from "@/lib/mobileLayout";

export default function ReportPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [formData, setFormData] = useState({
    link: "",
    reason: "Scam / Fraud",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("contact_messages").insert({
        name: "Anonymous Reporter",
        email: "report@storelink.system",
        subject: `🚨 REPORT: ${formData.reason}`,
        message: `VENDOR LINK: ${formData.link}\n\nDETAILS:\n${formData.description}`
    });

    if (error) {
        console.log("FULL ERROR:", error); 
        alert(`Error: ${error.message}`); 
        setErrorMsg("Could not submit report. Try again later.");
    } else {
        setSuccess(true);
        setFormData({
            link: "",
            reason: "Scam / Fraud",
            description: ""
        });
    }
    setLoading(false);
   };

   

  return (
    <div className={`min-h-dvh bg-gray-50 font-sans ${STOREFRONT_SAFE_BOTTOM}`}>
      <Navbar />
      <div className={`mx-auto max-w-2xl py-12 md:py-20 ${STOREFRONT_GUTTER_X}`}>
        
        <div className="text-center mb-10">
           <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
           </div>
           <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Report a Vendor</h1>
           <p className="text-gray-500">Help us keep StoreLink safe. All reports are anonymous.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
           {success ? (
               <div className="text-center py-8">
                   <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4"/>
                   <h3 className="text-xl font-bold text-gray-900">Report Submitted</h3>
                   <p className="text-gray-500 mt-2">Thank you for helping us keep StoreLink safe.</p>
                   <button onClick={() => setSuccess(false)} className="mt-6 text-red-600 font-bold text-sm">Submit another</button>
               </div>
           ) : (
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Vendor Name / Store Link</label>
                      <input required type="text" placeholder="e.g., storelink.ng/scammer-store" 
                        className="min-h-[48px] w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-base focus:outline-none focus:ring-2 focus:ring-red-500" 
                        value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})}
                      />
                  </div>
                  
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Reason for Report</label>
                      <select className="min-h-[48px] w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}
                      >
                        <option>Scam / Fraud</option>
                        <option>Fake Products</option>
                        <option>Harassment</option>
                        <option>Inappropriate Content</option>
                        <option>Other</option>
                      </select>
                  </div>

                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                      <textarea required placeholder="Please describe what happened..." 
                        className="h-32 min-h-[120px] w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                      ></textarea>
                  </div>

                  {errorMsg && <p className="text-red-500 text-sm font-bold text-center mb-4">{errorMsg}</p>}
                  <button disabled={loading} className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-4 font-bold text-white transition hover:bg-red-700 disabled:opacity-60">
                      {loading ? <Loader2 className="animate-spin"/> : <><Send size={18} /> Submit Report</>}
                  </button>
               </form>
           )}
        </div>

      </div>
      <Footer />
    </div>
  );
}