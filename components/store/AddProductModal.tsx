"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { X, Loader2, Trash2, Plus, Lock, Crown, Sparkles, ExternalLink } from "lucide-react";
import { compressImage } from "@/utils/imageCompressor";

interface AddProductModalProps {
  storeId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productToEdit?: any;
}

export default function AddProductModal({ storeId, isOpen, onClose, onSuccess, productToEdit }: AddProductModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [userPlan, setUserPlan] = useState('free');
  const [errorMsg, setErrorMsg] = useState("");
  
  const [removeBg, setRemoveBg] = useState(false);
  const [processingImages, setProcessingImages] = useState(false);
  const [aiStatus, setAiStatus] = useState<"idle" | "diamond_gate" | "limit_gate">("idle");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "1",
    description: "",
    categoryId: "",
  });
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]); 

  useEffect(() => {
    if (isOpen) {
      setRemoveBg(false);
      setAiStatus("idle");
      setErrorMsg("");
      
      if (productToEdit) {
        setFormData({
          name: productToEdit.name,
          price: productToEdit.price.toString(),
          stock: productToEdit.stock_quantity.toString(),
          description: productToEdit.description || "",
          categoryId: productToEdit.category_id || "",
        });
        setExistingImages(productToEdit.image_urls || []);
        setPreviews([]);
        setImageFiles([]);
      } else {
        setFormData({ name: "", price: "", stock: "1", description: "", categoryId: "" });
        setExistingImages([]);
        setPreviews([]);
        setImageFiles([]);
      }

      const loadData = async () => {
        const { data: cats } = await supabase.from("categories").select("*").eq("store_id", storeId);
        setCategories(cats || []);

        const { data: store } = await supabase
          .from("stores")
          .select("subscription_plan, subscription_expiry")
          .eq("id", storeId)
          .single();
        
        if (store) {
          const plan = store.subscription_plan || 'free';
          setUserPlan(plan);
          
          if (plan !== 'free' && store.subscription_expiry && new Date(store.subscription_expiry) < new Date()) {
            setIsExpired(true);
          } else {
            setIsExpired(false);
          }

          if (!productToEdit && plan === 'free') {
            const { count } = await supabase
              .from("products")
              .select("*", { count: 'exact', head: true }) 
              .eq("store_id", storeId);
            
            setIsLimitReached((count || 0) >= 5);
          } else {
            setIsLimitReached(false);
          }
        }
      };
      
      loadData();
    }
  }, [isOpen, storeId, productToEdit]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newRawFiles = Array.from(e.target.files);
      const totalImages = existingImages.length + imageFiles.length + newRawFiles.length;
      
      if (totalImages > 4) {
          setErrorMsg("Max 4 images allowed"); 
          setTimeout(() => setErrorMsg(""), 3000);
          return;
      }

      // 🔒 DIAMOND GATEKEEPER
      if (removeBg && userPlan !== 'diamond') {
        setAiStatus("diamond_gate");
        return;
      }

      if (removeBg && userPlan === 'diamond') {
        setProcessingImages(true);
        setAiStatus("idle");
        const processedFiles: File[] = [];
        
        try {
            for (const file of newRawFiles) {
                const liteFile = await compressImage(file); 
                const fd = new FormData();
                fd.append('image_file', liteFile);

                const res = await fetch('/api/remove-bg', { 
                  method: 'POST', 
                  body: fd 
                });

                if (res.status === 402) {
                   setAiStatus("limit_gate");
                   throw new Error("Daily API Limit Reached");
                }

                if (!res.ok) throw new Error("AI Busy. Using original.");

                const blob = await res.blob();
                const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".png", { type: "image/png" });
                processedFiles.push(newFile);
            }
            setImageFiles(prev => [...prev, ...processedFiles]);
            setPreviews(prev => [...prev, ...processedFiles.map(f => URL.createObjectURL(f))]);
        } catch (err: any) {
            console.error("AI Error:", err);
            if (err.message !== "Daily API Limit Reached") {
                setErrorMsg("AI currently unavailable. Using original photo.");
                setTimeout(() => setErrorMsg(""), 4000);
            }
            setImageFiles(prev => [...prev, ...newRawFiles]);
            setPreviews(prev => [...prev, ...newRawFiles.map(f => URL.createObjectURL(f))]);
        } finally {
            setProcessingImages(false);
        }
      } else {
        const combinedFiles = [...imageFiles, ...newRawFiles];
        setImageFiles(combinedFiles);
        setPreviews(combinedFiles.map(file => URL.createObjectURL(file)));
      }
    }
  };

  const removeNewImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setPreviews(newFiles.map(file => URL.createObjectURL(file)));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((isLimitReached && !productToEdit) || isExpired) return; 

    setLoading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of imageFiles) {
        const compressedFile = await compressImage(file);
        const fileName = `${storeId}/${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const { error: uploadErr } = await supabase.storage.from("products").upload(fileName, compressedFile);
        if (uploadErr) throw uploadErr;
        const { data } = supabase.storage.from("products").getPublicUrl(fileName);
        uploadedUrls.push(data.publicUrl);
      }

      const finalImageUrls = [...existingImages, ...uploadedUrls];
      const newStock = parseInt(formData.stock);

      const payload: any = {
        store_id: storeId,
        name: formData.name,
        price: parseFloat(formData.price),
        stock_quantity: newStock,
        description: formData.description,
        category_id: formData.categoryId || null,
        image_urls: finalImageUrls,
        is_active: true,
      };

      if (newStock === 0) payload.sold_out_at = new Date().toISOString();
      else payload.sold_out_at = null;

      if (productToEdit) {
        const { error } = await supabase.from("products").update(payload).eq("id", productToEdit.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }

      router.refresh(); 
      onSuccess();
      onClose();
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 flex flex-col max-h-[90vh]">
        
        {/* WAREHOUSE HEADER */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-black text-lg text-gray-900 uppercase tracking-tighter italic">
            {productToEdit ? "Update Product" : "Save to Warehouse"}
          </h2>
          <button onClick={onClose} className="p-2 bg-white rounded-full shadow-sm text-gray-500 hover:bg-gray-100 transition"><X size={20} /></button>
        </div>

        <div className="p-6 overflow-y-auto no-scrollbar">
          {isExpired ? (
             <div className="py-8 text-center flex flex-col items-center justify-center h-full">
                <Lock size={32} className="text-red-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-tighter">Subscription Expired</h3>
                <button onClick={() => router.push("/dashboard/subscription")} className="w-full bg-red-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-lg">Renew Subscription</button>
             </div>
          ) : (isLimitReached && !productToEdit) ? (
            <div className="py-8 text-center flex flex-col items-center justify-center h-full">
                <Crown size={32} className="text-amber-500 mb-4" />
                <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Starter Limit Reached</h3>
                <button onClick={() => router.push("/dashboard/subscription")} className="w-full bg-gray-900 text-white py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-lg flex items-center justify-center gap-2">
                  <Crown size={18} className="text-amber-400" /> Upgrade Plan
                </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 pb-4">
              
              {/* IMAGE MANAGER */}
              <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Images (Max 4)</label>
                    <button type="button" onClick={() => setRemoveBg(!removeBg)} 
                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all border ${removeBg ? 'bg-purple-600 text-white border-purple-400 shadow-lg' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                        <Sparkles size={14} className={removeBg ? "animate-pulse" : ""} /> {removeBg ? "AI Cleaning Active" : "Clean Background"}
                    </button>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  {existingImages.map((src, index) => (
                    <div key={`existing-${index}`} className="aspect-square relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
                      <img src={src} alt="Existing" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeExistingImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-md"><Trash2 size={10} /></button>
                    </div>
                  ))}
                  {previews.map((src, index) => (
                    <div key={`new-${index}`} className="aspect-square relative rounded-2xl overflow-hidden border border-purple-100 bg-white shadow-sm group">
                      <img src={src} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-md"><Trash2 size={10} /></button>
                    </div>
                  ))}
                  {processingImages && (
                    <div className="aspect-square rounded-2xl border border-purple-100 flex flex-col items-center justify-center bg-purple-50 animate-pulse">
                        <Loader2 className="animate-spin text-purple-600 mb-1" size={20} />
                        <span className="text-[8px] font-black text-purple-600 uppercase tracking-tighter text-center px-1">AI Cleaning...</span>
                    </div>
                  )}
                  {(existingImages.length + previews.length) < 4 && !processingImages && (
                    <label className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${removeBg ? 'border-purple-300 bg-purple-50 text-purple-400' : 'border-gray-200 bg-gray-50 text-gray-300 hover:border-gray-900'}`}>
                      {removeBg ? <Sparkles size={24}/> : <Plus size={24}/>}
                      <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                </div>

                {/* HELP CARDS FOR VENDORS */}
                {aiStatus === "diamond_gate" && (
                   <div className="bg-purple-50 border border-purple-100 p-4 rounded-3xl mb-4 animate-in zoom-in-95 duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <Crown size={14} className="text-purple-600" />
                        <span className="text-[10px] font-black uppercase text-purple-600 tracking-widest">Diamond Feature Only</span>
                      </div>
                      <p className="text-[11px] font-bold text-purple-950 mb-3 leading-tight">One-click AI cleaning is reserved for Diamond users due to API costs. But you can do it manually for free!</p>
                      <div className="bg-white p-3 rounded-2xl border border-purple-100 mb-3 text-[10px] text-gray-600 font-bold leading-relaxed shadow-sm">
                         1. Visit <a href="https://remove.bg" target="_blank" className="text-purple-600 underline inline-flex items-center gap-1 font-black">remove.bg <ExternalLink size={10}/></a><br/>
                         2. Upload your photo & set background to white<br/>
                         3. Download it, then upload the result here!
                      </div>
                      <button type="button" onClick={() => setAiStatus("idle")} className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Got it, thanks!</button>
                   </div>
                )}

                {aiStatus === "limit_gate" && (
                   <div className="bg-amber-50 border border-amber-100 p-4 rounded-3xl mb-4 animate-in zoom-in-95">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-amber-600" />
                        <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Community Limit Reached</span>
                      </div>
                      <p className="text-[11px] font-bold text-amber-950 mb-3 leading-tight">Our Diamond credits are exhausted for today. We are working on unlimited AI access!</p>
                      <p className="text-[10px] text-amber-800 font-medium mb-3">Please use <a href="https://remove.bg" target="_blank" className="underline font-black">remove.bg</a> manually to clean your photo, then upload the result here.</p>
                      <button type="button" onClick={() => setAiStatus("idle")} className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Understood</button>
                   </div>
                )}
              </div>

              {/* INPUT FIELDS */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Product Name</label>
                  <input required className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gray-900 outline-none shadow-sm" placeholder="Enter name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Price (₦)</label>
                    <input required type="number" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gray-900 outline-none shadow-sm" placeholder="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">In Stock</label>
                    <input required type="number" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gray-900 outline-none shadow-sm" placeholder="1" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Category</label>
                  <select className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gray-900 outline-none appearance-none font-bold shadow-sm" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                    <option value="">Uncategorized</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Description (Optional)</label>
                  <textarea maxLength={500} className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gray-900 outline-none h-24 resize-none shadow-sm" placeholder="Describe your item..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
              </div>
              
              {errorMsg && !["LIMIT_REACHED", "DIAMOND_ONLY"].includes(errorMsg) && (
                <div className="text-red-600 text-[10px] font-black text-center bg-red-50 p-3 rounded-xl uppercase tracking-widest leading-relaxed">⚠️ {errorMsg}</div>
              )}
              
              <button type="submit" disabled={loading || processingImages} className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-gray-200 active:scale-95 transition-all disabled:opacity-50 mt-2">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : (productToEdit ? "Update Product" : "Save to Warehouse")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}