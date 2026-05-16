"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Loader2, Package, Store, Copy, Check, Coins, CreditCard, Calendar } from "lucide-react";
import { buyerOrdersOrFilter } from "@/lib/buyerOrderScope";
import { isServiceOnlyPlaceholderOrder } from "@/utils/orderPlaceholders";
import { normalizeOrderStatus, shouldShowManageInAppNotice } from "@/lib/orderStatusFlow";
import { enrichOrderItemsWithProductNames, orderLineLabel } from "@/lib/orderItemDisplay";
import OrderLineThumb from "@/components/orders/OrderLineThumb";
import { orderCoinRedeemed, orderStatusBadgeClass, orderStatusLabel } from "@/lib/orderTableDisplay";

export default function BuyerOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : params.id?.[0];
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [storeSlug, setStoreSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (
            id,
            quantity,
            unit_price,
            product_name,
            product_id,
            item_type
          ),
          merchant:profiles!orders_seller_id_fkey (
            display_name,
            full_name,
            email,
            logo_url,
            slug,
            is_verified
          )
        `,
        )
        .eq("id", id)
        .or(buyerOrdersOrFilter(user.id))
        .maybeSingle();

      if (error || !data) {
        setOrder(null);
        setLoading(false);
        return;
      }

      if (isServiceOnlyPlaceholderOrder(data)) {
        setOrder(null);
        setLoading(false);
        return;
      }

      let enriched = data as Record<string, unknown>;
      const items = (enriched.order_items as unknown[]) || [];
      if (items.length === 0) {
        const { data: lines } = await supabase.from("order_items").select("*").eq("order_id", id);
        if (lines?.length) enriched = { ...enriched, order_items: lines };
      }
      if (data.seller_id && !(enriched.merchant as { display_name?: string } | null)?.display_name) {
        const { data: sellerProf } = await supabase
          .from("profiles")
          .select("display_name, full_name, email, logo_url, slug, is_verified")
          .eq("id", data.seller_id)
          .maybeSingle();
        if (sellerProf) enriched = { ...enriched, merchant: sellerProf };
      }

      const rawItems = ((enriched.order_items as unknown[]) || []) as Record<string, unknown>[];
      const withNames = await enrichOrderItemsWithProductNames(supabase, rawItems);
      enriched = { ...enriched, order_items: withNames };

      setOrder(enriched);

      if (data.seller_id) {
        const profSlug = (enriched.merchant as { slug?: string } | null)?.slug;
        setStoreSlug(profSlug ?? null);
      }

      setLoading(false);
    })();
  }, [id, router]);

  const copyId = async () => {
    if (!order?.id) return;
    await navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="rounded-4xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <p className="font-black uppercase text-gray-900">Order not found</p>
          <p className="mt-2 text-sm text-gray-500">This purchase isn&apos;t on your account or the link is invalid.</p>
          <Link href="/account/orders" className="mt-6 inline-block text-[10px] font-black uppercase tracking-widest text-emerald-600">
            My orders
          </Link>
        </div>
      </div>
    );
  }

  const merchant = order.merchant as {
    display_name?: string | null;
    full_name?: string | null;
    email?: string | null;
    logo_url?: string | null;
    slug?: string | null;
    is_verified?: boolean | null;
  } | null;
  const sellerDisplay =
    merchant?.display_name?.trim() || merchant?.full_name?.trim() || "Seller";
  const items = (order.order_items || []) as Array<{
    id: string;
    quantity: number;
    unit_price: number;
    product_name?: string | null;
    name?: string | null;
    _resolved_product_name?: string | null;
    _resolved_product_image_url?: string | null;
  }>;

  const origin = String(order.origin_channel || "").toLowerCase();
  const originLabel =
    origin === "storefront"
      ? "Web store"
      : origin === "mobile_app"
        ? "Other channel"
        : origin === "web_app"
          ? "Web"
          : origin
            ? String(origin).replace(/_/g, " ")
            : "StoreLink";

  const statusUp = normalizeOrderStatus(order.status);
  const showAppManagedHint = shouldShowManageInAppNotice(order.origin_channel, order.status);
  const coinsUsed = orderCoinRedeemed(order);
  const cashPaid = Number(order.total_amount || 0);
  const orderValue = cashPaid + coinsUsed;
  const currency = String(order.currency_code || "NGN").toUpperCase();

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <Link
          href="/account/orders"
          className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:underline"
        >
          All orders
        </Link>
      </div>

      <div className="overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gray-50/80 px-6 py-5 md:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order ID</p>
              <button
                type="button"
                onClick={copyId}
                className="mt-2 flex items-center gap-2 break-all text-left font-mono text-xs font-bold text-gray-900 hover:text-emerald-700"
              >
                {order.id}
                {copied ? <Check size={14} className="shrink-0 text-emerald-600" /> : <Copy size={14} className="shrink-0 opacity-50" />}
              </button>
              <p className="mt-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <Calendar size={12} className="text-emerald-600" aria-hidden />
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
            <span
              className={`rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-tight ${orderStatusBadgeClass(order.status)}`}
            >
              {orderStatusLabel(order.status)}
            </span>
          </div>
        </div>

        <div className="space-y-6 px-6 py-6 md:px-8 md:py-8">
          {showAppManagedHint && (
            <p className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-[11px] font-medium leading-snug text-amber-900">
              This order was not checked out on the web storefront. Updates for status{" "}
              <span className="font-black">{statusUp}</span> are handled in the{" "}
              <span className="font-black">StoreLink app</span> — open the app for the live timeline and any actions.
            </p>
          )}

          <div className="rounded-3xl border border-gray-100 bg-gray-50/60 p-5 md:p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Seller</p>
            <div className="mt-3 flex items-start gap-4">
              {merchant?.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={merchant.logo_url}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-2xl border border-gray-100 object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                  <Package size={26} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-lg font-black uppercase tracking-tight text-gray-900">{sellerDisplay}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {originLabel}
                  {merchant?.is_verified ? " · Verified seller" : ""}
                </p>
                {merchant?.email ? <p className="mt-2 truncate text-xs font-medium text-gray-600">{merchant.email}</p> : null}
                {storeSlug ? (
                  <Link
                    href={`/${storeSlug}`}
                    className="mt-3 inline-flex items-center gap-2 text-xs font-black text-emerald-700 hover:underline"
                  >
                    <Store size={16} aria-hidden /> Visit storefront
                  </Link>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order value</p>
              <p className="mt-2 text-lg font-black text-gray-900">₦{orderValue.toLocaleString()}</p>
              <p className="mt-1 text-[10px] font-medium text-gray-500">Before Store Coins</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 shadow-sm">
              <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-700">
                <Coins size={12} className="text-amber-600" fill="currentColor" aria-hidden />
                Store Coins
              </p>
              <p className="mt-2 text-lg font-black text-amber-800">
                {coinsUsed > 0 ? `-₦${coinsUsed.toLocaleString()}` : "—"}
              </p>
              <p className="mt-1 text-[10px] font-medium text-amber-900/80">Applied at checkout</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-sm">
              <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-800">
                <CreditCard size={12} className="text-emerald-600" aria-hidden />
                Cash paid
              </p>
              <p className="mt-2 text-lg font-black text-emerald-800">₦{cashPaid.toLocaleString()}</p>
              <p className="mt-1 text-[10px] font-medium text-emerald-900/80">{currency}</p>
            </div>
          </div>

          {order.payment_reference ? (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Payment reference</p>
              <p className="mt-1 break-all font-mono text-xs font-bold text-gray-800">{String(order.payment_reference)}</p>
            </div>
          ) : null}

          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Items</p>
            <div className="overflow-hidden rounded-2xl border border-gray-100">
              <table className="w-full min-w-[280px] text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50/80 text-[10px] uppercase tracking-widest text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-black md:px-5">Product</th>
                    <th className="px-4 py-3 text-center font-black md:px-5">Qty</th>
                    <th className="px-4 py-3 text-right font-black md:px-5">Line total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((line) => {
                    const title = orderLineLabel(line);
                    const lineTotal = Number(line.unit_price) * Number(line.quantity);
                    return (
                      <tr key={line.id} className="bg-white">
                        <td className="px-4 py-3 md:px-5">
                          <div className="flex items-start gap-3">
                            <OrderLineThumb size="sm" src={line._resolved_product_image_url} alt={title} />
                            <span className="min-w-0 pt-0.5 font-bold leading-snug text-gray-900">{title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center font-black text-gray-700 md:px-5">{line.quantity}</td>
                        <td className="px-4 py-3 text-right font-black text-gray-900 md:px-5">₦{lineTotal.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {order.shipping_address ? (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Delivery</p>
              <p className="mt-2 whitespace-pre-wrap text-sm font-medium leading-relaxed text-gray-800">{order.shipping_address}</p>
            </div>
          ) : null}

          <p className="text-[10px] font-medium leading-relaxed text-gray-400">
            Payment and status for this order stay on your StoreLink account. Keep this ID if you need support from the seller.
          </p>
        </div>
      </div>
    </div>
  );
}
