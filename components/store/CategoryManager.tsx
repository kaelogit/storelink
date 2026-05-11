"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X, Trash2, Plus, Loader2 } from "lucide-react";

interface CategoryManagerProps {
  sellerId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CategoryManager({ sellerId, isOpen, onClose, onSuccess }: CategoryManagerProps) {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [newCat, setNewCat] = useState("");
  const [loading, setLoading] = useState(false);

  const loadCats = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("seller_id", sellerId)
      .eq("category_scope", "seller")
      .order("created_at", { ascending: true });
    setCategories(data || []);
  };

  useEffect(() => {
    if (isOpen) loadCats();
  }, [isOpen, sellerId]);

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    setLoading(true);

    const { error } = await supabase.from("categories").insert({
      seller_id: sellerId,
      category_scope: "seller",
      name: newCat.trim(),
      slug: newCat
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-black text-gray-900 uppercase tracking-tight text-sm">Manage subcategories</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <form onSubmit={addCategory} className="flex gap-2">
            <input
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="e.g. Oud, Floral, Citrus…"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-3 rounded-xl bg-gray-900 text-white font-bold text-sm disabled:opacity-50 inline-flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            </button>
          </form>
          <ul className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center justify-between px-4 py-3 bg-white">
                <span className="font-medium text-gray-900 text-sm">{c.name}</span>
                <button
                  type="button"
                  onClick={() => deleteCategory(c.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  aria-label="Delete subcategory"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
            {categories.length === 0 && (
              <li className="px-4 py-8 text-center text-xs text-gray-400 font-medium">No subcategories yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
