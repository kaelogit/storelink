"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, Store, MapPin, Phone, LayoutDashboard, ShieldCheck, Zap } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "fashion", // Default
    location: "Lagos",
    whatsapp: "",
    description: ""
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/login");
      setUser(user);
    };
    checkUser();
  }, [router]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    setFormData({ ...formData, name, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(""); 

    if (!user) return;

    const fourteenDaysFromNow = new Date();
    fourteenDaysFromNow.setDate(fourteenDaysFromNow.getDate() + 14);

    const { error } = await supabase.from("stores").insert({
      owner_id: user.id,
      name: formData.name,
      slug: formData.slug,
      category: formData.category,
      location: formData.location,
      whatsapp_number: formData.whatsapp,
      description: formData.description,
      subscription_plan: 'premium', 
      subscription_expiry: fourteenDaysFromNow.toISOString() 
    });

    if (error) {
      setErrorMsg(error.message); 
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      <nav className="p-6 flex justify-center md:justify-start max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
           <LayoutDashboard className="text-emerald-600" size={28}/>
           <span className="font-extrabold text-2xl tracking-tight text-gray-900 uppercase">StoreLink</span>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
          
          <div className="bg-gray-900 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
              <Store className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-black tracking-tight">Setup Your Store</h1>
            <p className="text-gray-400 text-sm mt-1">One last step to start selling.</p>
            
            <div className="mt-4 inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
              <Zap size={12} fill="currentColor"/> 2 Weeks Premium Gift Active
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Store Name</label>
              <input 
                required
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all font-medium"
                placeholder="e.g. Mira's Perfume"
                value={formData.name}
                onChange={handleNameChange}
              />
              <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                Your professional link: <span className="text-emerald-600 font-bold">storelink.ng/{formData.slug || "your-store"}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                 <select 
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-medium appearance-none"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="" disabled>Select a Category</option>
                    <optgroup label="Main Categories">
                      <option value="fashion">Fashion & Apparel</option>
                      <option value="beauty">Beauty & Personal Care</option>
                      <option value="electronics">Electronics & Gadgets</option>
                      <option value="home-kitchen">Home & Kitchen</option>
                      <option value="groceries">Groceries & Food</option>
                    </optgroup>
                    <optgroup label="Specialty">
                      <option value="real-estate">Real Estate</option>
                      <option value="automotive">Automotive</option>
                      <option value="services">Services</option>
                    </optgroup>
                  </select>
               </div>
               
               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                 <div className="relative">
                   <MapPin className="absolute left-4 top-4.5 text-gray-400 w-4 h-4" />
                   <input 
                     required
                     className="w-full p-4 pl-10 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-medium"
                     placeholder="Lagos"
                     value={formData.location}
                     onChange={e => setFormData({...formData, location: e.target.value})}
                   />
                 </div>
               </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-4.5 text-gray-400 w-4 h-4" />
                <input 
                  required
                  type="tel"
                  className="w-full p-4 pl-10 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-medium"
                  placeholder="08012345678"
                  value={formData.whatsapp}
                  onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-2 font-medium italic">Orders will be automatically sent to this number.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Short Bio</label>
              <textarea 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 h-24 resize-none font-medium"
                placeholder="Tell customers about your store..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            {errorMsg && (
              <div className="p-4 bg-red-50 text-red-600 text-xs font-black rounded-xl text-center border border-red-100">
                ⚠️ ERROR: {errorMsg}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-gray-200 hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Launch Empire 🚀"}
            </button>

          </form>
        </div>
      </main>

      <footer className="p-8 text-center space-y-4">
        <div className="flex items-center justify-center gap-6 text-gray-400">
           <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter">
             <ShieldCheck size={14} className="text-emerald-500" /> Secure Encryption
           </div>
           <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter">
             <Zap size={14} className="text-amber-500" /> Instant Setup
           </div>
        </div>
        <p className="text-[10px] text-gray-300 font-medium">© 2025 StoreLink Social Commerce Engine. All rights reserved.</p>
      </footer>
    </div>
  );
}