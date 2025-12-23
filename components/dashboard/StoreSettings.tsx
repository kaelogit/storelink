"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Save, Upload, Camera, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function StoreSettings({ store, onUpdate }: { store: any, onUpdate?: () => void }) {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: store.name,
    description: store.description || "",
    whatsapp: store.whatsapp_number,
    location: store.location,
    instagram: store.instagram_handle || "",
    tiktok: store.tiktok_url || "", 
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  
  const [logoPreview, setLogoPreview] = useState<string>(store.logo_url || "");
  const [coverPreview, setCoverPreview] = useState<string>(store.cover_image_url || "");
  const [status, setStatus] = useState("");

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(""); 

    try {
      let newLogoUrl = store.logo_url;
      let newCoverUrl = store.cover_image_url;

      if (logoFile) {
        const fileName = `logos/${store.id}-${Date.now()}`;
        const { error: uploadError } = await supabase.storage.from("products").upload(fileName, logoFile);
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from("products").getPublicUrl(fileName);
        newLogoUrl = data.publicUrl;
      }

      if (coverFile) {
        const fileName = `covers/${store.id}-${Date.now()}`;
        const { error: uploadError } = await supabase.storage.from("products").upload(fileName, coverFile);
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from("products").getPublicUrl(fileName);
        newCoverUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from("stores")
        .update({
          name: formData.name,
          description: formData.description,
          whatsapp_number: formData.whatsapp,
          location: formData.location,
          instagram_handle: formData.instagram,
          tiktok_url: formData.tiktok, 
          logo_url: newLogoUrl,
          cover_image_url: newCoverUrl
        })
        .eq("id", store.id);

      if (error) {
          setStatus("❌ " + error.message);
      } else {
          setStatus("✅ Settings saved!");
          if (onUpdate) onUpdate(); 
          
          setTimeout(() => setStatus(""), 3000); 
      }
    } catch (error) {
      setStatus("❌ An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl relative">
      <h3 className="font-bold text-lg text-gray-900 mb-6">Store Settings</h3>
      
      {status.includes("✅") && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500">
            <CheckCircle2 size={20} />
            <span className="font-black text-xs uppercase tracking-widest">Settings Saved Successfully</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
           <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wide">Brand Visuals</h4>
           
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Cover Image</label>
             <div className="relative w-full h-40 md:h-52 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 group">
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <ImageIcon size={32} />
                    <span className="text-xs font-bold mt-2">Upload Cover</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
                   <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                     <Camera size={18} /> Change Cover
                   </div>
                   <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleCoverChange} />
                </div>
             </div>
             <p className="text-xs text-gray-500 mt-1">Recommended: 1200 x 400px</p>
           </div>

           <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Store Logo</label>
             <div className="flex items-center gap-4">
               <div className="relative w-24 h-24 bg-gray-100 rounded-full overflow-hidden border-2 border-dashed border-gray-300 group shrink-0">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Upload size={24} />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
                     <Camera size={20} className="text-white" />
                     <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoChange} />
                  </div>
               </div>
               <div className="text-sm text-gray-500">
                 <p>This will be displayed on your profile and receipts.</p>
                 <p className="text-xs text-gray-400 mt-1">Recommended: Square (400 x 400px)</p>
               </div>
             </div>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wide">Store Details</h4>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Store Name</label>
              <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp Number</label>
                <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Instagram Handle (Optional)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-gray-400 font-bold">@</span>
                    <input className="w-full pl-8 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="yourstore" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">TikTok Link (Optional)</label>
                  <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="https://tiktok.com/@..." value={formData.tiktok} onChange={e => setFormData({...formData, tiktok: e.target.value})} />
               </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Bio / Description</label>
              <textarea className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-24 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
        </div>

        {status.includes("❌") && <p className="text-red-600 text-xs font-bold text-center">{status}</p>}

        <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
        </button>

      </form>
    </div>
  );
}