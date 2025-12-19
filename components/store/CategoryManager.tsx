"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X, Trash2, Plus, Loader2 } from "lucide-react";

interface CategoryManagerProps {
  storeId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; 
}

export default function CategoryManager({ storeId, isOpen, onClose, onSuccess }: CategoryManagerProps) {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [newCat, setNewCat] = useState("");
  const [loading, setLoading] = useState(false);

  const loadCats = async () => {
    const { data } = await supabase.from("categories").select("*").eq("store_id", storeId);
    setCategories(data || []);
  };

  useEffect(() => {
    if (isOpen) loadCats();
  }, [isOpen]);

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    setLoading(true);

    const { error } = await supabase.from("categories").insert({
      store_id: storeId,
      name: newCat.trim()
    });

    if (!error && onSuccess) onSuccess(); 

    setNewCat("");
    loadCats(); 
    setLoading(false);
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    
    if (!error && onSuccess) onSuccess(); 
    
    loadCats();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-lg text-gray-900">Manage Categories</h2>
          <button onClick={onClose}><X size={20} className="text-gray-500" /></button>
        </div>

        <form onSubmit={addCategory} className="flex gap-2 mb-6">
          <input 
            className="flex-1 p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-900 text-sm"
            placeholder="New Category (e.g. Shoes)"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
          />
          <button disabled={loading} className="bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-800">
            {loading ? <Loader2 size={18} className="animate-spin"/> : <Plus size={18} />}
          </button>
        </form>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {categories.length === 0 && <p className="text-gray-400 text-sm text-center">No categories yet.</p>}
          {categories.map((cat) => (
            <div key={cat.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="font-medium text-gray-700 text-sm">{cat.name}</span>
              <button onClick={() => deleteCategory(cat.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}