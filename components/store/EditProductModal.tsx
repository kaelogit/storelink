"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X, Loader2, Save, Trash2, Plus } from "lucide-react";
import { Product } from "@/types";
import Image from "next/image";

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditProductModal({ product, isOpen, onClose, onSuccess }: EditProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    categoryId: "",
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock_quantity.toString(),
        description: product.description || "",
        categoryId: (product as any).category_id || "", // Load Category
      });
      setExistingImages(product.image_urls || []);
      setNewFiles([]);
      setNewPreviews([]);
      
      const loadCats = async () => {
        const { data } = await supabase.from("categories").select("*").eq("store_id", product.store_id);
        setCategories(data || []);
      };
      loadCats();
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      if (existingImages.length + newFiles.length + selected.length > 4) {
        setErrorMsg("Max 4 images allowed"); setTimeout(() => setErrorMsg(""), 3000);
        return;
      }
      setNewFiles([...newFiles, ...selected]);
      setNewPreviews([...newPreviews, ...selected.map(file => URL.createObjectURL(file))]);
    }
  };

  const removeExistingImage = (index: number) => setExistingImages(prev => prev.filter((_, i) => i !== index));
  const removeNewFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalImageUrls = [...existingImages];
      for (const file of newFiles) {
        const fileName = `${product.store_id}/${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const { error } = await supabase.storage.from("products").upload(fileName, file);
        if (error) throw error;
        const { data } = supabase.storage.from("products").getPublicUrl(fileName);
        finalImageUrls.push(data.publicUrl);
      }

      const { error } = await supabase
        .from("products")
        .update({
          name: formData.name,
          price: parseFloat(formData.price),
          stock_quantity: parseInt(formData.stock),
          description: formData.description,
          category_id: formData.categoryId || null,
          image_urls: finalImageUrls,
        })
        .eq("id", product.id);

      if (error) throw error;

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
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-lg text-gray-900">Edit Product</h2>
          <button onClick={onClose} className="p-2 bg-white rounded-full shadow-sm text-gray-500"><X size={20} /></button>
        </div>
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Images ({existingImages.length + newFiles.length}/4)</label>
              <div className="grid grid-cols-4 gap-2">
                {existingImages.map((url, idx) => (
                  <div key={`old-${idx}`} className="aspect-square relative rounded-xl overflow-hidden border border-gray-200 group">
                    <Image src={url} alt="" fill className="object-cover" />
                    <button type="button" onClick={() => removeExistingImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"><Trash2 size={12}/></button>
                  </div>
                ))}
                {newPreviews.map((url, idx) => (
                  <div key={`new-${idx}`} className="aspect-square relative rounded-xl overflow-hidden border-2 border-green-500">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeNewFile(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><X size={12}/></button>
                  </div>
                ))}
                {(existingImages.length + newFiles.length) < 4 && (
                   <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 bg-gray-50 cursor-pointer hover:border-gray-900 hover:text-gray-900">
                     <Plus size={24}/>
                     <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                   </label>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Name" />
              <div className="grid grid-cols-2 gap-4">
                 <input required type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Price" />
                 <input required type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="Stock" />
              </div>
              <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                <option value="">No Category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
              <textarea maxLength={500} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-24 resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            {errorMsg && (
                <div className="text-red-600 text-sm font-bold text-center mb-4 bg-red-50 p-2 rounded-lg">
                    ⚠️ {errorMsg}
                </div>
            )}
            <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg">
              {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Update</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}