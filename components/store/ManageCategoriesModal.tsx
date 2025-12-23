"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X, Loader2, Plus, Trash2, FolderOpen } from "lucide-react";
import { Store } from "@/types";

interface ManageCategoriesModalProps {
  storeId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ManageCategoriesModal({ storeId, isOpen, onClose }: ManageCategoriesModalProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("store_id", storeId)
      .order("created_at", { ascending: true });
    setCategories(data || []);
  };

  useEffect(() => {
    if (isOpen) fetchCategories();
  }, [isOpen, storeId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setLoading(true);

    const { error } = await supabase.from("categories").insert({
      store_id: storeId,
      name: newCategoryName.trim(),
    });

    if (error) {
      setErrorMsg(error.message)
    } else {
      setNewCategoryName("");
      fetchCategories(); 
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Products in this category will become uncategorized.")) return;
    
    await supabase.from("products").update({ category_id: null }).eq("category_id", id);
    
    const { error } = await supabase.from("categories").delete().eq("id", id);
    
    if (error) setErrorMsg(error.message)
    else fetchCategories();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95">
        
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <FolderOpen size={20} className="text-gray-400"/> Categories
          </h2>
          <button onClick={onClose} className="p-2 bg-white rounded-full shadow-sm text-gray-500 hover:bg-gray-100"><X size={20} /></button>
        </div>

        <div className="p-6">
          
          <form onSubmit={handleAdd} className="flex gap-2 mb-6">
            <input 
              className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-gray-900 text-sm"
              placeholder="New Category (e.g. Shoes)"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              autoFocus
            />
            <button 
              type="submit" 
              disabled={loading || !newCategoryName}
              className="bg-gray-900 text-white p-3 rounded-xl disabled:opacity-50 hover:bg-gray-800 transition"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
            </button>
          </form>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {categories.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-4">No categories yet.</p>
            ) : (
              categories.map((cat) => (
                <div key={cat.id} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm group">
                  <span className="font-medium text-gray-700">{cat.name}</span>
                  {errorMsg && <p className="text-red-500 text-xs mb-2">{errorMsg}</p>}
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="text-gray-300 hover:text-red-500 transition p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}