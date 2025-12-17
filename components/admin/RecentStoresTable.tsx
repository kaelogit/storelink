"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ExternalLink } from "lucide-react";

export default function RecentStoresTable() {
  const [stores, setStores] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecent = async () => {
       const { data } = await supabase
         .from('stores')
         .select('name, slug, subscription_plan')
         .order('created_at', { ascending: false })
         .limit(5);
       if (data) setStores(data);
    };
    fetchRecent();
  }, []);

  return (
    <div className="space-y-4">
      {stores.map((store, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
          <div>
            <p className="font-bold text-sm text-white">{store.name}</p>
            <p className="text-xs text-gray-500 capitalize">{store.subscription_plan} Plan</p>
          </div>
          <a href={`/${store.slug}`} target="_blank" className="text-gray-400 hover:text-emerald-400">
            <ExternalLink size={16} />
          </a>
        </div>
      ))}
      {stores.length === 0 && <p className="text-gray-500 text-sm">No stores yet.</p>}
    </div>
  );
}