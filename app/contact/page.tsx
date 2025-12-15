"use client";

import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

      const { error } = await supabase.from("contact_messages").insert({        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        message: formData.message
    });

    if (error) {
         setErrorMsg("Failed to send. Please check your internet.");    } else {
        setSuccess(true);
        setFormData({ firstName: "", lastName: "", email: "", message: "" }); // Reset form
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-start">
        
        <div>
           <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Get in touch</h1>
           <p className="text-gray-500 text-lg mb-8">Have questions about setting up your store? Need help with an order? We are here.</p>
           
           <div className="space-y-6">
              <a href="mailto:support@storelink.ng" className="flex items-center gap-4 hover:opacity-80 transition">
                 <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center text-emerald-600"><Mail size={20}/></div>
                 <div>
                    <p className="font-bold text-gray-900">Email Us</p>
                    <p className="text-gray-500">ksqkareem@gmail.com</p>
                 </div>
              </a>
           </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
           {success ? (
               <div className="text-center py-12">
                   <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                       <CheckCircle size={32} />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900">Message Sent!</h3>
                   <p className="text-gray-500 mt-2">We will get back to you shortly.</p>
                   <button onClick={() => setSuccess(false)} className="mt-6 text-emerald-600 font-bold text-sm">Send another</button>
               </div>
           ) : (
               <form onSubmit={handleSubmit} className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                         <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-gray-900" 
                           value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})}
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                         <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-gray-900" 
                           value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}
                         />
                      </div>
                   </div>
                   
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                      <input required type="email" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-gray-900" 
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                   </div>

                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                      <textarea required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-32 resize-none outline-none focus:ring-2 focus:ring-gray-900"
                        value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                      ></textarea>
                   </div>
                  {errorMsg && <p className="text-red-500 text-sm font-bold text-center mb-4">{errorMsg}</p>}
                   <button disabled={loading} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2">
                      {loading ? <Loader2 className="animate-spin"/> : <><Send size={18} /> Send Message</>}
                   </button>
               </form>
           )}
        </div>

      </div>
      <Footer />
    </div>
  );
}