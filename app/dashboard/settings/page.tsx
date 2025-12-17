"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import StoreSettings from "@/components/dashboard/StoreSettings"; // 👈 Importing your existing component

export default function SettingsPage() {
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStore() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('stores')
        .select('*')
        .eq('owner_id', user.id)
        .single();
        
      if (data) setStore(data);
      setLoading(false);
    }
    fetchStore();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-gray-300" size={32}/>
      </div>
    );
  }

  if (!store) return <div className="p-8 text-center text-red-500">Store not found.</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
       <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your store details and preferences.</p>
       </div>
       
       <StoreSettings store={store} />
    </div>
  );
}