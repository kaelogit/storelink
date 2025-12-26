"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  Loader2, Store, MapPin, Phone, LayoutDashboard, 
  ShieldCheck, Zap, Camera, Image as ImageIcon, 
  Instagram, Music2, ArrowRight, CheckCircle2 
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState(1); 
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "fashion",
    location: "Lagos",
    whatsapp: "",
    description: "",
    instagram: "",
    tiktok: ""
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (type === 'logo') {
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
      } else {
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(""); 

    if (!user) return;

    try {
      let logoUrl = "";
      let coverUrl = "";

      let cleanWhatsApp = formData.whatsapp.replace(/\D/g, ''); 
      if (cleanWhatsApp.startsWith('0')) {
        cleanWhatsApp = '234' + cleanWhatsApp.substring(1);
      } else if (!cleanWhatsApp.startsWith('234')) {
        cleanWhatsApp = '234' + cleanWhatsApp;
      }

      if (logoFile) {
        const logoName = `logos/${user.id}-${Date.now()}`;
        const { error: logoErr } = await supabase.storage.from("products").upload(logoName, logoFile);
        if (logoErr) throw logoErr;
        const { data: logoData } = supabase.storage.from("products").getPublicUrl(logoName);
        logoUrl = logoData.publicUrl;
      }

      if (coverFile) {
        const coverName = `covers/${user.id}-${Date.now()}`;
        const { error: coverErr } = await supabase.storage.from("products").upload(coverName, coverFile);
        if (coverErr) throw coverErr;
        const { data: coverData } = supabase.storage.from("products").getPublicUrl(coverName);
        coverUrl = coverData.publicUrl;
      }

      const fourteenDaysFromNow = new Date();
      fourteenDaysFromNow.setDate(fourteenDaysFromNow.getDate() + 14);

      const { error } = await supabase.from("stores").insert({
        owner_id: user.id,
        owner_email: user.email,
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        location: formData.location,
        whatsapp_number: cleanWhatsApp, 
        description: formData.description,
        instagram_handle: formData.instagram,
        tiktok_url: formData.tiktok,
        logo_url: logoUrl,
        cover_image_url: coverUrl,
        subscription_plan: 'premium',
        is_trial: true, 
        subscription_expiry: fourteenDaysFromNow.toISOString(), 
        status: 'active'
      });

      if (error) throw error;

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
      setLoading(false);
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
        <div className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100 relative">
          
          {loading && (
             <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-8">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Building Your Empire...</h3>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Uploading Brand Assets</p>
             </div>
          )}

          <div className="bg-gray-900 p-8 text-white text-center relative">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
              <Store className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-black tracking-tight uppercase italic">Store Setup</h1>
            <div className="mt-4 flex items-center justify-center gap-2">
                {[1, 2, 3].map((s) => (
                    <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'w-8 bg-emerald-500' : 'w-2 bg-gray-700'}`} />
                ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            
            {step === 1 && (
              <div className="space-y-5 animate-in slide-in-from-right-5 duration-300">
                <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-2">
                    <CheckCircle2 size={14}/> Step 1: Core Details
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-1 ml-1">Store Name</label>
                  <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none font-bold" placeholder="e.g. Mira's Perfume" value={formData.name} onChange={handleNameChange} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-black uppercase text-gray-400 mb-1 ml-1">Category</label>
                        <select required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none font-bold appearance-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
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
                        <label className="block text-xs font-black uppercase text-gray-400 mb-1 ml-1">City/State</label>
                        <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none font-bold" placeholder="Lagos" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                    </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-1 ml-1">WhatsApp Number</label>
                  <input required type="tel" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none font-bold" placeholder="08012345678" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
                </div>
                <button type="button" onClick={() => setStep(2)} className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition">
                    Next: Brand Identity <ArrowRight size={18}/>
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-in slide-in-from-right-5 duration-300">
                <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-2">
                    <CheckCircle2 size={14}/> Step 2: Identity
                </div>
                
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Store Cover Image</label>
                  <div className="relative h-32 bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 group">
                    {coverPreview ? <img src={coverPreview} className="w-full h-full object-cover" alt="Cover Preview" /> : 
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <ImageIcon size={24} />
                        <span className="text-[10px] font-black uppercase mt-2">Tap to Upload Cover</span>
                      </div>
                    }
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, 'cover')} />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                    <div>
                        <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Logo</label>
                        <div className="relative w-20 h-20 bg-gray-100 rounded-full overflow-hidden border-2 border-dashed border-gray-200">
                            {logoPreview ? <img src={logoPreview} className="w-full h-full object-cover" alt="Logo Preview" /> : 
                                <div className="flex items-center justify-center h-full text-gray-400"><Camera size={20}/></div>
                            }
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, 'logo')} />
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="text-[11px] font-bold text-gray-900 leading-tight uppercase tracking-tight">Identity is everything.</p>
                        <p className="text-[10px] font-medium text-gray-400 leading-relaxed mt-1">
                            Vendors with a Logo & Cover sell <span className="text-emerald-600 font-black">4x faster</span> on StoreLink.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-gray-100 text-gray-500 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition">Back</button>
                    <button type="button" onClick={() => setStep(3)} className="w-2/3 bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition">
                        Next: Final Step <ArrowRight size={18}/>
                    </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5 animate-in slide-in-from-right-5 duration-300">
                <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-2">
                    <CheckCircle2 size={14}/> Step 3: Connection
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-1 ml-1">Store Description</label>
                  <textarea required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none h-24 resize-none font-bold text-sm" placeholder="Tell customers what makes your brand special..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <Instagram className="absolute left-4 top-4 text-gray-400" size={18}/>
                        <input className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none font-bold text-sm" placeholder="Instagram" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} />
                    </div>
                    <div className="relative">
                        <Music2 className="absolute left-4 top-4 text-gray-400" size={18}/>
                        <input className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none font-bold text-sm" placeholder="TikTok Link" value={formData.tiktok} onChange={e => setFormData({...formData, tiktok: e.target.value})} />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)} className="w-1/3 bg-gray-100 text-gray-500 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition">Back</button>
                    <button type="submit" disabled={loading} className="w-2/3 bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 active:scale-95 transition-all flex items-center justify-center gap-2">
                        Launch Empire 🚀
                    </button>
                </div>
              </div>
            )}

            {errorMsg && <div className="p-4 bg-red-50 text-red-600 text-[10px] font-black rounded-xl text-center border border-red-100 uppercase tracking-widest animate-pulse">⚠️ ERROR: {errorMsg}</div>}

          </form>
        </div>
      </main>

      <footer className="p-8 text-center space-y-4">
        <div className="flex items-center justify-center gap-6 text-gray-400">
           <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter">
             <ShieldCheck size={14} className="text-emerald-500" /> Secure Encryption
           </div>
           <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter">
             <Zap size={14} className="text-amber-500" /> Instant Access
           </div>
        </div>
        <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest">© 2025 StoreLink Engine</p>
      </footer>
    </div>
  );
}