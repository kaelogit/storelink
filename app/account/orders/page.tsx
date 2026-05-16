"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Loader2, Package } from "lucide-react";
import { fetchBuyerProductOrders } from "@/lib/buyerOrders";
import BuyerProductOrdersTable from "@/components/orders/BuyerProductOrdersTable";
import { getClientUserSafe } from "@/lib/getClientUserSafe";

export default function AccountOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    (async () => {
      const user = await getClientUserSafe(supabase);
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        const rows = await fetchBuyerProductOrders(supabase, user.id, user.email || null);
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
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900 md:text-3xl">My orders</h1>
        <p className="mt-1 text-sm font-medium text-gray-500">
          Purchases you make while signed in on StoreLink Shop show here with live status, Store Coins, and cash paid.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-gray-200 bg-white p-12 text-center">
          <Package className="mx-auto mb-4 text-gray-300" size={40} />
          <p className="font-black uppercase tracking-tight text-gray-900">No purchases yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium text-gray-500">
            Product orders tied to this account appear here. Checkout on the Shop uses your StoreLink account, so new purchases show
            automatically after you pay.
          </p>
          <p className="mx-auto mt-3 max-w-md text-xs font-medium leading-relaxed text-gray-400">
            Other booking types aren&apos;t listed in the web shop yet; your sidebar still has everything else you need as a shopper or
            seller.
          </p>
          <Link href="/marketplace" className="mt-6 inline-block text-[10px] font-black uppercase tracking-widest text-emerald-600">
            Browse marketplace
          </Link>
        </div>
      ) : (
        <BuyerProductOrdersTable orders={orders} showSearch variant="card" />
      )}
    </div>
  );
}
