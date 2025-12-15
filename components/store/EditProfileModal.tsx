"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { X, Loader2, MapPin, Phone, Globe, Camera, Image as ImageIcon } from "lucide-react";
import { Store } from "@/types";
import Image from "next/image";

interface EditProfileModalProps {
  store: Store;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditProfileModal({ store, isOpen, onClose, onSuccess }: EditProfileModalProps) {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: store.name,
    description: store.description || "",
    location: store.location,
    whatsapp: store.whatsapp_number,
    instagram: store.instagram_url || "",
    tiktok: store.tiktok_url || "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(store.logo_url);
  
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(store.cover_image_url);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalLogoUrl = store.logo_url;
      let finalCoverUrl = store.cover_image_url;

      if (logoFile) {
        const fileName = `${store.id}/logo-${Date.now()}`;
        const { error } = await supabase.storage.from("stores").upload(fileName, logoFile);
        if (error) throw error;
        const { data } = supabase.storage.from("stores").getPublicUrl(fileName);
        finalLogoUrl = data.publicUrl;
      }

      if (coverFile) {
        const fileName = `${store.id}/cover-${Date.now()}`;
        const { error } = await supabase.storage.from("stores").upload(fileName, coverFile);
        if (error) throw error;
        const { data } = supabase.storage.from("stores").getPublicUrl(fileName);
        finalCoverUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from("stores")
        .update({
          name: formData.name,
          description: formData.description,
          location: formData.location,
          whatsapp_number: formData.whatsapp,
          instagram_url: formData.instagram,
          tiktok_url: formData.tiktok,
          logo_url: finalLogoUrl,
          cover_image_url: finalCoverUrl,
        })
        .eq("id", store.id);

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error: any) {
      setErrorMsg("Max 4 images allowed"); setTimeout(() => setErrorMsg(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 flex flex-col max-h-[90vh]">
        
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-lg text-gray-900">Edit Shop Profile</h2>
          <button onClick={onClose} className="p-2 bg-white rounded-full shadow-sm text-gray-500 hover:bg-gray-100"><X size={20} /></button>
        </div>

        <div className="p-0 overflow-y-auto bg-gray-50">
          <form onSubmit={handleSubmit}>
            
            <div className="relative mb-16">
              
              <div 
                className="h-32 bg-gray-300 w-full relative group cursor-pointer"
                onClick={() => coverInputRef.current?.click()}
              >
                {coverPreview ? (
                  <Image src={coverPreview} alt="Cover" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                    <ImageIcon size={24} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span className="text-white font-bold text-sm flex items-center gap-2"><Camera size={16}/> Edit Cover</span>
                </div>
                <input ref={coverInputRef} type="file" hidden accept="image/*" onChange={handleCoverChange} />
              </div>

              <div 
                className="absolute -bottom-10 left-6 w-24 h-24 rounded-full border-4 border-white bg-white shadow-md cursor-pointer group overflow-hidden"
                onClick={() => logoInputRef.current?.click()}
              >
                <div className="w-full h-full relative rounded-full overflow-hidden bg-gray-100">
                  {logoPreview ? (
                    <Image src={logoPreview} alt="Logo" fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full font-bold text-2xl text-gray-300">
                      {formData.name[0]}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <Camera size={20} className="text-white" />
                  </div>
                </div>
                <input ref={logoInputRef} type="file" hidden accept="image/*" onChange={handleLogoChange} />
              </div>

            </div>

            <div className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Store Name</label>
                <input required className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bio</label>
                <textarea className="w-full p-3 bg-white border border-gray-200 rounded-xl h-20 resize-none focus:ring-2 focus:ring-gray-900 outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                    <input required className="w-full p-3 pl-9 bg-white border border-gray-200 rounded-xl outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                    <input required className="w-full p-3 pl-9 bg-white border border-gray-200 rounded-xl outline-none" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Socials</label>
                <div className="space-y-2">
                  <div className="relative">
                    <Globe className="absolute left-3 top-3.5 text-pink-500 w-4 h-4" />
                    <input className="w-full p-3 pl-9 bg-white border border-gray-200 rounded-xl text-sm outline-none" placeholder="Instagram URL" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} />
                  </div>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3.5 text-black w-4 h-4" />
                    <input className="w-full p-3 pl-9 bg-white border border-gray-200 rounded-xl text-sm outline-none" placeholder="TikTok URL" value={formData.tiktok} onChange={e => setFormData({...formData, tiktok: e.target.value})} />
                  </div>
                </div>
              </div>
              
              {errorMsg && (
                  <div className="text-red-600 text-sm font-bold text-center mb-4 bg-red-50 p-2 rounded-lg">
                      ⚠️ {errorMsg}
                  </div>
              )}
              <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg mt-4">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}