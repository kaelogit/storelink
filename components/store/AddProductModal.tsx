"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { buildR2Key, uploadFileToR2 } from "@/lib/mediaUpload";
import { useRouter } from "next/navigation";
import { X, Loader2, Trash2, Plus, Gem, Sparkles } from "lucide-react";
import { compressImage } from "@/utils/imageCompressor";
import { effectiveSellerTier, type EffectiveSellerTier } from "@/utils/marketplaceDiscovery";

interface AddProductModalProps {
  storeId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productToEdit?: any;
  onAddCategory?: () => void;
  categories?: any[];
}

// Helper function to prevent database crashes when cross-platform strings like "general" are passed into UUID columns
const isValidUUID = (id: string) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

export default function AddProductModal({ 
  storeId, 
  isOpen, 
  onClose, 
  onSuccess, 
  productToEdit,
  onAddCategory,
  categories = [] 
}: AddProductModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [userPlan, setUserPlan] = useState<EffectiveSellerTier>("standard");
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
    storefrontNewArrival: false,
    storefrontBestSeller: false,
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
        const incomingCategoryId = productToEdit.category_id || "";
        // Verify if the category exists in the current storefront category collection
        const categoryExists = categories.some(cat => cat.id === incomingCategoryId);

        setFormData({
          name: productToEdit.name,
          price: productToEdit.price.toString(),
          stock: productToEdit.stock_quantity.toString(),
          description: productToEdit.description || "",
          categoryId: categoryExists && isValidUUID(incomingCategoryId) ? incomingCategoryId : "",
          storefrontNewArrival: Boolean(productToEdit.storefront_new_arrival),
          storefrontBestSeller: Boolean(productToEdit.storefront_best_seller),
        });
        setExistingImages(productToEdit.image_urls || []);
        setPreviews([]);
        setImageFiles([]);
      } else {
        setFormData({ name: "", price: "", stock: "1", description: "", categoryId: "", storefrontNewArrival: false, storefrontBestSeller: false });
        setExistingImages([]);
        setPreviews([]);
        setImageFiles([]);
      }

      const loadData = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user?.id) return;

        const { data: prof } = await supabase
          .from("profiles")
          .select("subscription_plan, subscription_expiry, subscription_status")
          .eq("id", user.id)
          .maybeSingle();

        const tierPlan = prof?.subscription_plan as Parameters<typeof effectiveSellerTier>[0] | null | undefined;
        const tierExpiry = prof?.subscription_expiry ?? undefined;
        const tierStatus = prof?.subscription_status ?? undefined;

        if (tierPlan != null) {
          setUserPlan(effectiveSellerTier(tierPlan, tierExpiry, tierStatus));
        }
      };
      
      loadData();
    }
  }, [isOpen, productToEdit, categories]);

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
    if (!formData.name || !formData.price || !formData.stock || !formData.description) {
      setErrorMsg("All fields are compulsory for a professional listing");
      setTimeout(() => setErrorMsg(""), 4000);
      return;
    }

    if (existingImages.length === 0 && imageFiles.length === 0) {
      setErrorMsg("Please add at least one product image");
      setTimeout(() => setErrorMsg(""), 4000);
      return;
    }

    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be signed in to list products.");

      const uploadedUrls: string[] = [];
      for (const file of imageFiles) {
        const compressedFile = await compressImage(file);
        const ext = (compressedFile.name.split(".").pop() || "jpg").toLowerCase();
        const key = buildR2Key("product-images", `${storeId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`);
        const publicUrl = await uploadFileToR2({
          bucket: "product-images",
          key,
          file: compressedFile,
        });
        uploadedUrls.push(publicUrl);
      }

      const finalImageUrls = [...existingImages, ...uploadedUrls];
      const newStock = parseInt(formData.stock);

      const na = Boolean(formData.storefrontNewArrival);
      const bs = Boolean(formData.storefrontBestSeller);

      // Sanitize the category identifier to ensure cross-platform database entries don't trigger UUID parsing errors
      const dynamicCategoryId = isValidUUID(formData.categoryId) ? formData.categoryId : null;

      const payload: any = {
        seller_id: user.id,
        name: formData.name,
        price: parseFloat(formData.price),
        stock_quantity: newStock,
        description: formData.description,
        category_id: dynamicCategoryId,
        image_urls: finalImageUrls,
        is_active: true,
        storefront_new_arrival: na,
        storefront_best_seller: na ? false : bs,
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
        
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-black text-lg text-gray-900 uppercase tracking-tighter italic">
            {productToEdit ? "Update Product" : "Add Product"}
          </h2>
          <button onClick={onClose} className="p-2 bg-white rounded-full shadow-sm text-gray-500 hover:bg-gray-100 transition"><X size={20} /></button>
        </div>

        <div className="p-6 overflow-y-auto no-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-5 pb-4">
              
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

                {aiStatus === "diamond_gate" && (
                   <div className="bg-purple-50 border border-purple-100 p-4 rounded-3xl mb-4 animate-in zoom-in-95 duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <Gem size={14} style={{ color: "#8B5CF6", fill: "#8B5CF6" }} />
                        <span className="text-[10px] font-black uppercase text-purple-600 tracking-widest">Diamond Feature Only</span>
                      </div>
                      <p className="text-[11px] font-bold text-purple-950 mb-3 leading-tight">One-click AI cleaning is reserved for Diamond users due to API costs.</p>
                      
                      <button type="button" onClick={() => setAiStatus("idle")} className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Got it!</button>
                   </div>
                )}

                {aiStatus === "limit_gate" && (
                   <div className="bg-amber-50 border border-amber-100 p-4 rounded-3xl mb-4 animate-in zoom-in-95">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-amber-600" />
                        <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Community Limit Reached</span>
                      </div>
                      <p className="text-[11px] font-bold text-amber-950 mb-3 leading-tight">Our Diamond credits are exhausted for today. We are working on unlimited AI access!</p>
                      <p className="text-[10px] text-amber-800 font-medium mb-3">Please use <a href="https://remove.bg" target="_blank" rel="noopener noreferrer" className="underline font-black">remove.bg</a> manually to clean your photo, then upload the result here.</p>
                      <button type="button" onClick={() => setAiStatus("idle")} className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Understood</button>
                   </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Product Name</label>
                  <input required className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gray-900 outline-none shadow-sm text-gray-900" placeholder="Enter name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Price (₦)</label>
                    <input required type="number" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gray-900 outline-none shadow-sm text-gray-900" placeholder="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">In Stock</label>
                    <input required type="number" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gray-900 outline-none shadow-sm text-gray-900" placeholder="1" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5 ml-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</label>
                    <button type="button" onClick={onAddCategory} className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                        <Plus size={10} strokeWidth={3} /> Create New
                    </button>
                  </div>
                  <select className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gray-900 outline-none appearance-none shadow-sm text-gray-900" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                    <option value="">General / None</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Description (Compulsory)</label>
                  <textarea required maxLength={500} className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gray-900 outline-none h-24 resize-none shadow-sm text-gray-900" placeholder="Describe your item..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Web storefront only</p>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.storefrontNewArrival}
                      onChange={(e) => {
                        const on = e.target.checked;
                        setFormData((prev) => ({
                          ...prev,
                          storefrontNewArrival: on,
                          storefrontBestSeller: on ? false : prev.storefrontBestSeller,
                        }));
                      }}
                      className="size-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                    />
                    <span className="text-xs font-bold text-gray-800">Show in <span className="text-emerald-700">New arrivals</span> strip</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.storefrontBestSeller}
                      onChange={(e) => {
                        const on = e.target.checked;
                        setFormData((prev) => ({
                          ...prev,
                          storefrontBestSeller: on,
                          storefrontNewArrival: on ? false : prev.storefrontNewArrival,
                        }));
                      }}
                      className="size-4 rounded border-gray-300 text-violet-600 focus:ring-violet-600"
                    />
                    <span className="text-xs font-bold text-gray-800">Show in <span className="text-violet-700">Best sellers</span> strip</span>
                  </label>
                  <p className="text-[10px] font-medium text-gray-500">Only one strip can be on per product.</p>
                </div>
              </div>
              
              {errorMsg && !["LIMIT_REACHED", "DIAMOND_ONLY"].includes(errorMsg) && (
                <div className="text-red-600 text-[10px] font-black text-center bg-red-50 p-3 rounded-xl uppercase tracking-widest leading-relaxed">⚠️ {errorMsg}</div>
              )}
              
              <button type="submit" disabled={loading || processingImages} className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-gray-200 active:scale-95 transition-all disabled:opacity-50 mt-2">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : (productToEdit ? "Update Product" : "Upload to Store")}
              </button>
            </form>
        </div>
      </div>
    </div>
  );
}