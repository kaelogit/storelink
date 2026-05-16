"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Coins, Search } from "lucide-react";
import { orderCoinRedeemed, orderStatusBadgeClass, orderStatusLabel } from "@/lib/orderTableDisplay";

type Merchant = {
  display_name?: string | null;
  full_name?: string | null;
  email?: string | null;
  logo_url?: string | null;
} | null;

function sellerLabel(order: { merchant?: Merchant }): string {
  const m = order.merchant;
  return (
    String(m?.display_name?.trim() || m?.full_name?.trim() || "").trim() || "Seller"
  );
}

export type BuyerProductOrdersTableProps = {
  orders: any[];
  /** Dashboard preview: show only first N rows. */
  previewLimit?: number;
  showSearch?: boolean;
  /** When true, table sits in a card matching store orders (`/dashboard/orders`). */
  variant?: "card" | "plain";
};

export default function BuyerProductOrdersTable({
  orders,
  previewLimit,
  showSearch = true,
  variant = "card",
}: BuyerProductOrdersTableProps) {
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    const base = typeof previewLimit === "number" ? orders.slice(0, previewLimit) : orders;
    if (!showSearch || !search.trim()) return base;
    const q = search.toLowerCase().trim();
    return base.filter((o) => {
      const m = o.merchant as Merchant;
      const blob = [sellerLabel(o), m?.email, o.id]
        .map((x) => String(x || "").toLowerCase())
        .join(" ");
      return blob.includes(q);
    });
  }, [orders, previewLimit, search, showSearch]);

  const showSearchRow = showSearch && orders.length > 0 && typeof previewLimit !== "number";

  const inner = (
    <>
      {showSearchRow ? (
        <div className="border-b border-gray-100 p-4 md:px-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
            <input
              type="search"
              placeholder="Search by seller, email, or order ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-h-[44px] w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm font-bold outline-none transition focus:border-emerald-500"
            />
          </div>
        </div>
      ) : null}

      {visible.length === 0 && search.trim() ? (
        <div className="p-12 text-center text-gray-400">
          <Search className="mx-auto mb-3 h-10 w-10 opacity-30" aria-hidden />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">No matches</p>
          <p className="mt-2 text-xs font-medium text-gray-500">Try another search or clear the box.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="border-b border-gray-100 bg-gray-50/50 text-[10px] uppercase tracking-widest text-gray-400">
              <tr>
                <th className="px-6 py-5 font-black">Order ID</th>
                <th className="px-6 py-5 font-black">Seller</th>
                <th className="px-6 py-5 font-black">Store Coins</th>
                <th className="px-6 py-5 font-black">Cash total</th>
                <th className="px-6 py-5 font-black">Status</th>
                <th className="px-6 py-5 font-black">Date</th>
                <th className="px-6 py-5 text-right font-black">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visible.map((order) => {
                const coinUsed = orderCoinRedeemed(order);
                const m = order.merchant as Merchant;
                const name = sellerLabel(order);
                return (
                  <tr key={order.id} className="group transition hover:bg-gray-50/80">
                    <td className="px-6 py-4 font-mono text-[10px] text-gray-400">#{String(order.id).slice(0, 8)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {m?.logo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={m.logo_url}
                            alt=""
                            className="h-9 w-9 shrink-0 rounded-xl border border-gray-100 object-cover"
                          />
                        ) : (
                          <div className="h-9 w-9 shrink-0 rounded-xl bg-gray-100" />
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-gray-900">{name}</p>
                          {m?.email ? <p className="truncate text-[10px] text-gray-500">{m.email}</p> : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {coinUsed > 0 ? (
                        <div className="flex items-center gap-1.5 text-sm font-black text-amber-600">
                          <Coins size={14} className="shrink-0" fill="currentColor" aria-hidden />
                          <span>-₦{coinUsed.toLocaleString()}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-emerald-700">
                      ₦{Number(order.total_amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-tight ${orderStatusBadgeClass(order.status)}`}
                      >
                        {orderStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="inline-block rounded-xl border border-gray-100 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 transition group-hover:border-gray-900 group-hover:bg-gray-900 group-hover:text-white"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );

  if (variant === "plain") {
    return <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">{inner}</div>;
  }

  return <div className="overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-sm">{inner}</div>;
}
