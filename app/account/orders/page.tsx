"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Loader2, Package, ChevronRight } from "lucide-react";
import { fetchBuyerProductOrders } from "@/lib/buyerOrders";
import { normalizeOrderStatus, shouldShowManageInAppNotice } from "@/lib/orderStatusFlow";

export default function AccountOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      try {
        const rows = await fetchBuyerProductOrders(supabase, user.id);
        setOrders(rows);
      } catch {
        setOrders([]);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">My orders</h1>
        <p className="text-gray-500 text-sm font-medium mt-1">
          Purchases you make while signed in — including on this site — show here with live status.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-gray-200 bg-white p-12 text-center">
          <Package className="mx-auto text-gray-300 mb-4" size={40} />
          <p className="font-black text-gray-900 uppercase tracking-tight">No purchases yet</p>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            Product orders placed with this account appear here — including guest checkouts matched to your email or phone after you sign in.
          </p>
          <p className="text-xs text-gray-400 mt-3 font-medium max-w-md mx-auto leading-relaxed">
            Other booking types aren&apos;t listed in the web shop yet; your sidebar still has everything else you need as a shopper or seller.
          </p>
          <Link href="/marketplace" className="inline-block mt-6 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
            Browse marketplace
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => {
            const merchant = o.merchant as { display_name?: string; full_name?: string } | null;
            const sellerName =
              merchant?.display_name?.trim() || merchant?.full_name?.trim() || "Seller";
            const origin = String(o.origin_channel || "").toLowerCase();
            const originShort =
              origin === "storefront" ? "Web" : origin === "mobile_app" ? "Other" : origin === "web_app" ? "Web" : "—";
            const statusUp = normalizeOrderStatus(o.status);
            const showAppManagedHint = shouldShowManageInAppNotice(o.origin_channel, o.status);

            return (
              <li key={o.id}>
                <Link
                  href={`/account/orders/${o.id}`}
                  className="rounded-[1.5rem] border border-gray-100 bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all group"
                >
                  <div className="min-w-0">
                    <p className="font-black text-gray-900 text-sm uppercase tracking-tight truncate">
                      {sellerName}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                      {new Date(o.created_at).toLocaleString()} ·{" "}
                      <span className="font-mono text-gray-500">{String(o.id).slice(0, 8)}…</span> · {originShort}
                    </p>
                    {showAppManagedHint && (
                      <p className="text-[11px] text-amber-900 font-medium mt-2 leading-snug bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                        This order was not checked out on the web storefront. Tracking and actions for statuses like{" "}
                        <span className="font-black">{statusUp}</span> are handled in the{" "}
                        <span className="font-black">StoreLink app</span> — open the app to see the latest updates.
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="font-black text-emerald-700">₦{Number(o.total_amount || 0).toLocaleString()}</p>
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{o.status}</p>
                    </div>
                    <ChevronRight className="text-gray-300 group-hover:text-emerald-600 transition-colors" size={20} />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
