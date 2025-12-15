"use client";

import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { AlertTriangle, Send, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

    const { error } = await supabase.from("reports").insert({
        vendor_link: formData.link,
        reason: formData.reason,
        description: formData.description
    });

    if (error) {
        setErrorMsg("Could not submit report. Try again later.");
      } else {
         setSuccess(true);
      }
      setLoading(false);
   };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        
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
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" 
                        value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})}
                      />
                  </div>
                  
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Reason for Report</label>
                      <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
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
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-32 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                      ></textarea>
                  </div>

                  {errorMsg && <p className="text-red-500 text-sm font-bold text-center mb-4">{errorMsg}</p>}
                  <button disabled={loading} className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition flex items-center justify-center gap-2">
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