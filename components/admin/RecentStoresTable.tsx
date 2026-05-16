"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ExternalLink } from "lucide-react";

export default function RecentStoresTable() {
  const [rows, setRows] = useState<{ id: string; name: string; slug: string | null; subscription_plan: string | null }[]>([]);

  useEffect(() => {
    const fetchRecent = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, full_name, slug, subscription_plan")
        .eq("is_seller", true)
        .order("updated_at", { ascending: false })
        .limit(5);
      if (data) {
        setRows(
          data.map((r: { id: string; display_name?: string | null; full_name?: string | null; slug?: string | null; subscription_plan?: string | null }) => ({
            id: r.id,
            name: r.display_name?.trim() || r.full_name?.trim() || r.slug || r.id,
            slug: r.slug ?? null,
            subscription_plan: r.subscription_plan ?? null,
          })),
        );
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
          <div>
            <p className="font-bold text-sm text-white">{row.name}</p>
            <p className="text-xs text-gray-500 capitalize">{row.subscription_plan || "standard"} Plan</p>
          </div>
          {row.slug ? (
            <a href={`/${row.slug}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-emerald-400">
              <ExternalLink size={16} />
            </a>
          ) : null}
        </div>
      ))}
      {rows.length === 0 && <p className="text-gray-500 text-sm">No sellers yet.</p>}
    </div>
  );
}
