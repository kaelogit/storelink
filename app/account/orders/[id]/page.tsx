"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Loader2, Package, Store, Copy, Check } from "lucide-react";
import { buyerOrdersOrFilter } from "@/lib/buyerOrderScope";
import { isServiceOnlyPlaceholderOrder } from "@/utils/orderPlaceholders";
import { normalizeOrderStatus, shouldShowManageInAppNotice } from "@/lib/orderStatusFlow";
import { enrichOrderItemsWithProductNames, orderLineLabel } from "@/lib/orderItemDisplay";
import OrderLineThumb from "@/components/orders/OrderLineThumb";

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
            logo_url,
            slug,
            is_verified
          )
        `
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
          .select("display_name, full_name, logo_url, slug, is_verified")
          .eq("id", data.seller_id)
          .maybeSingle();
        if (sellerProf) enriched = { ...enriched, merchant: sellerProf };
      }

      const rawItems = ((enriched.order_items as unknown[]) || []) as Record<string, unknown>[];
      const withNames = await enrichOrderItemsWithProductNames(supabase, rawItems);
      enriched = { ...enriched, order_items: withNames };

      setOrder(enriched);

      if (data.seller_id) {
        const { data: storeRow } = await supabase.from("stores").select("slug").eq("owner_id", data.seller_id).maybeSingle();
        const profSlug = (enriched.merchant as { slug?: string } | null)?.slug;
        setStoreSlug(storeRow?.slug ?? profSlug ?? null);
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
        <button type="button" onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="rounded-[2rem] border border-dashed border-gray-200 bg-white p-12 text-center">
          <p className="font-black text-gray-900 uppercase">Order not found</p>
          <p className="text-sm text-gray-500 mt-2">This purchase isn’t on your account or the link is invalid.</p>
          <Link href="/account/orders" className="inline-block mt-6 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
            My orders
          </Link>
        </div>
      </div>
    );
  }

  const merchant = order.merchant as {
    display_name?: string | null;
    full_name?: string | null;
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

  return (
    <div className="space-y-8 max-w-2xl">
      <button type="button" onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm space-y-6">
        {showAppManagedHint && (
          <p className="text-[11px] text-amber-900 font-medium leading-snug bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            This order was not checked out on the web storefront. Updates for status{" "}
            <span className="font-black">{statusUp}</span> are handled in the{" "}
            <span className="font-black">StoreLink app</span> — open the app for the live timeline and any actions.
          </p>
        )}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">Order ID</p>
            <button
              type="button"
              onClick={copyId}
              className="mt-2 flex items-center gap-2 font-mono text-xs text-gray-900 break-all text-left hover:text-emerald-700"
            >
              {order.id}
              {copied ? <Check size={14} className="text-emerald-600 shrink-0" /> : <Copy size={14} className="shrink-0 opacity-50" />}
            </button>
          </div>
          <span className="px-4 py-2 rounded-xl bg-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-700">
            {String(order.status || "").replace(/_/g, " ")}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {merchant?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={merchant.logo_url} alt="" className="w-12 h-12 rounded-2xl object-cover border border-gray-100 shrink-0" />
          ) : (
            <Package className="text-emerald-600 shrink-0" size={22} />
          )}
          <div>
            <p className="font-black text-gray-900 uppercase tracking-tight">{sellerDisplay}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              {originLabel}
              {merchant?.is_verified ? " · Verified seller" : ""}
            </p>
          </div>
        </div>

        {storeSlug && (
          <Link
            href={`/${storeSlug}`}
            className="inline-flex items-center gap-2 text-sm font-black text-emerald-700 hover:underline"
          >
            <Store size={16} /> Visit storefront
          </Link>
        )}

        <div className="border-t border-gray-100 pt-6 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Items</p>
          <ul className="space-y-3">
            {items.map((line) => {
              const title = orderLineLabel(line);
              return (
                <li key={line.id} className="flex justify-between gap-4 text-sm items-start">
                  <div className="flex gap-3 min-w-0 flex-1">
                    <OrderLineThumb src={line._resolved_product_image_url} alt={title} />
                    <span className="font-bold text-gray-900 min-w-0 pt-0.5">
                      {line.quantity}× {title}
                    </span>
                  </div>
                  <span className="font-black text-gray-700 shrink-0 pt-0.5">
                    ₦{(Number(line.unit_price) * Number(line.quantity)).toLocaleString()}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex justify-between items-center border-t border-gray-100 pt-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total</span>
          <span className="text-xl font-black text-emerald-700">
            ₦{Number(order.total_amount || 0).toLocaleString()} {order.currency_code || "NGN"}
          </span>
        </div>

        {order.shipping_address && (
          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Delivery</p>
            <p className="text-sm font-medium text-gray-800 whitespace-pre-wrap">{order.shipping_address}</p>
          </div>
        )}

        <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
          Payment and status for this order stay on your StoreLink account. Keep this ID if you need support from the seller.
        </p>
      </div>
    </div>
  );
}
