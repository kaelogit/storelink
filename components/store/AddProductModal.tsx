"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { X, Loader2, Trash2, Plus, Lock, Crown, Sparkles } from "lucide-react"; // 👈 Added Sparkles
import { compressImage } from "@/utils/imageCompressor";
import { removeBackground } from "@/utils/removeBackground"; // 👈 Added AI Import

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
  const [errorMsg, setErrorMsg] = useState("");
  
  // 👇 NEW: AI States
  const [removeBg, setRemoveBg] = useState(false);
  const [processingImages, setProcessingImages] = useState(false);
  
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
      // Reset AI Toggle on open
      setRemoveBg(false);
      
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
        
        const plan = store?.subscription_plan || 'free';
        const expiry = store?.subscription_expiry;

        if (plan !== 'free' && expiry && new Date(expiry) < new Date()) {
           setIsExpired(true);
        } else {
           setIsExpired(false);
        }

        if (!productToEdit) {
            const { count } = await supabase
              .from("products")
              .select("*", { count: 'exact', head: true }) 
              .eq("store_id", storeId);
            
            if (plan === 'free' && (count || 0) >= 5) {
              setIsLimitReached(true);
            } else {
              setIsLimitReached(false);
            }
        } else {
            setIsLimitReached(false); 
        }
      };
      
      loadData();
    }
  }, [isOpen, storeId, productToEdit]);

  if (!isOpen) return null;

  // 👇 UPDATED: Handle Image Selection with AI Logic
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newRawFiles = Array.from(e.target.files);
      const totalImages = existingImages.length + imageFiles.length + newRawFiles.length;
      
      if (totalImages > 4) {
          setErrorMsg("Max 4 images allowed"); setTimeout(() => setErrorMsg(""), 3000);
          return;
      }

      // If AI Toggle is ON, process images
      if (removeBg) {
        setProcessingImages(true);
        const processedFiles: File[] = [];

        try {
            for (const file of newRawFiles) {
                // 1. Send to remove.bg
                const blob = await removeBackground(file);
                // 2. Convert Blob back to File (ensure it's PNG to keep transparency)
                const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".png", { type: "image/png" });
                processedFiles.push(newFile);
            }
            
            // 3. Update State with processed images
            const combinedFiles = [...imageFiles, ...processedFiles];
            setImageFiles(combinedFiles);
            setPreviews(combinedFiles.map(file => URL.createObjectURL(file)));

        } catch (err: any) {
            console.error(err);
            setErrorMsg("Background removal failed. Try another picture");
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
        // We compress all files to ensure optimization
        const compressedFile = await compressImage(file);

        const fileName = `${storeId}/${Date.now()}-${Math.random().toString(36).substring(7)}`;
        
        const { error } = await supabase.storage.from("products").upload(fileName, compressedFile);
        
        if (error) throw error;
        
        const { data } = supabase.storage.from("products").getPublicUrl(fileName);
        uploadedUrls.push(data.publicUrl);
      }

      const finalImageUrls = [...existingImages, ...uploadedUrls];

      if (productToEdit) {
          const { error } = await supabase.from("products").update({
            name: formData.name,
            price: parseFloat(formData.price),
            stock_quantity: parseInt(formData.stock),
            description: formData.description,
            category_id: formData.categoryId || null,
            image_urls: finalImageUrls,
          }).eq("id", productToEdit.id);
          if (error) throw error;

      } else {
          const { error } = await supabase.from("products").insert({
            store_id: storeId,
            name: formData.name,
            price: parseFloat(formData.price),
            stock_quantity: parseInt(formData.stock),
            description: formData.description,
            category_id: formData.categoryId || null,
            image_urls: finalImageUrls,
            is_active: true
          });
          if (error) throw error;
      }

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
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 flex flex-col max-h-[90vh]">
        
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-lg text-gray-900">{productToEdit ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} className="p-2 bg-white rounded-full shadow-sm text-gray-500 hover:bg-gray-100 transition"><X size={20} /></button>
        </div>

        {isExpired ? (
           <div className="p-8 text-center flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                 <Lock size={32} className="text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Subscription Expired</h3>
              <button onClick={() => router.push("/dashboard/subscription")} className="w-full bg-red-600 text-white py-4 rounded-xl font-bold shadow-lg">
                Renew Subscription
              </button>
           </div>

        ) : (isLimitReached && !productToEdit) ? (
          <div className="p-8 text-center flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                 <Crown size={32} className="text-yellow-500 fill-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free Limit Reached</h3>
              <button onClick={() => router.push("/dashboard/subscription")} className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                <Crown size={20} className="text-yellow-400" /> Upgrade to Premium
              </button>
          </div>

        ) : (
          <div className="p-6 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-gray-700">Images (Max 4)</label>
                    
                    {/* 👇 AI TOGGLE SWITCH */}
                    <button 
                        type="button" 
                        onClick={() => setRemoveBg(!removeBg)}
                        disabled={processingImages || existingImages.length + previews.length >= 4}
                        className={`
                            flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full transition border
                            ${removeBg 
                                ? 'bg-purple-100 text-purple-700 border-purple-200 shadow-sm' 
                                : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}
                        `}
                    >
                        <Sparkles size={14} className={removeBg ? "animate-pulse" : ""} />
                        {removeBg ? "AI Removal ON" : "Remove Background?"}
                    </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {existingImages.map((src, index) => (
                    <div key={`existing-${index}`} className="aspect-square relative rounded-xl overflow-hidden border border-gray-200">
                      <img src={src} alt="Existing" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeExistingImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"><Trash2 size={12} /></button>
                    </div>
                  ))}
                  
                  {previews.map((src, index) => (
                    <div key={`new-${index}`} className="aspect-square relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                      <img src={src} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"><Trash2 size={12} /></button>
                    </div>
                  ))}

                  {/* 👇 Show Spinner if AI is processing */}
                  {processingImages && (
                    <div className="aspect-square rounded-xl border border-gray-200 flex flex-col items-center justify-center bg-purple-50">
                        <Loader2 className="animate-spin text-purple-600 mb-1" size={20} />
                        <span className="text-[10px] font-bold text-purple-600">AI working...</span>
                    </div>
                  )}

                  {(existingImages.length + previews.length) < 4 && !processingImages && (
                    <label className={`
                        aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition
                        ${removeBg ? 'border-purple-300 bg-purple-50 text-purple-400 hover:bg-purple-100' : 'border-gray-300 bg-gray-50 text-gray-400 hover:border-gray-900 hover:text-gray-900'}
                    `}>
                      {removeBg ? <Sparkles size={24} className="mb-1"/> : <Plus size={24} className="mb-1"/>}
                      <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="e.g. Nike Air Force" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Price (₦)</label>
                    <input required type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="50000" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Stock Qty</label>
                    <input required type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="10" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                 </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                <select 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-gray-900"
                  value={formData.categoryId}
                  onChange={e => setFormData({...formData, categoryId: e.target.value})}
                >
                  <option value="">No Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                   <label className="block text-sm font-bold text-gray-700">Description</label>
                   <span className={`text-xs ${formData.description.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>{formData.description.length}/500</span>
                </div>
                <textarea maxLength={500} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-24 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="Describe the item..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              
              {errorMsg && (
                  <div className="text-red-600 text-sm font-bold text-center mb-4 bg-red-50 p-2 rounded-lg">
                      ⚠️ {errorMsg}
                  </div>
              )}
              <button type="submit" disabled={loading || processingImages} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-gray-800 active:scale-95 transition disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? <Loader2 className="animate-spin" /> : (productToEdit ? "Update Product" : "Save Product")}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}