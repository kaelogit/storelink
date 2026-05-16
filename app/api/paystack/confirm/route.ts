import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getPaystackSecretKeyForCurrency, paystackSecretMissingMessage } from "@/lib/paystackSecretServer";

type PaystackVerifyResponse = {
  status: boolean;
  data?: {
    status?: string;
    amount?: number;
    currency?: string;
    reference?: string;
    metadata?: Record<string, unknown>;
  };
  message?: string;
};

function expectedSmallestUnit(amountMajor: number, currencyCode: string) {
  const code = String(currencyCode || "NGN").toUpperCase();
  const zeroDecimal = new Set(["XOF"]);
  if (zeroDecimal.has(code)) return Math.round(amountMajor);
  return Math.round(amountMajor * 100);
}

function serviceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/** PAID storefront product orders → COMPLETED (stock, loyalty); safe to call repeatedly. */
async function promoteStorefrontOrdersForPayout(supabase: NonNullable<ReturnType<typeof serviceSupabase>>) {
  const { error } = await supabase.rpc("promote_storefront_orders_to_completed_for_payout");
  if (error) {
    console.error("paystack/confirm: promote_storefront_orders_to_completed_for_payout", error.message);
  }
}

export async function POST(request: Request) {
  try {
    const { orderId, reference } = await request.json();
    if (!orderId || !reference) {
      return NextResponse.json({ error: "orderId and reference are required" }, { status: 400 });
    }

    const supabase = serviceSupabase();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase service role is not configured" }, { status: 500 });
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id,status,user_id,total_amount,currency_code,payment_reference")
      .eq("id", orderId)
      .single();
    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const paystackSecret = getPaystackSecretKeyForCurrency(
      String((order as { currency_code?: string }).currency_code || "NGN"),
    );
    if (!paystackSecret) {
      return NextResponse.json({ error: paystackSecretMissingMessage() }, { status: 500 });
    }

    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(String(reference))}`, {
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
      },
      cache: "no-store",
    });
    const verifyJson = (await verifyRes.json()) as PaystackVerifyResponse;
    if (!verifyRes.ok || !verifyJson?.status || verifyJson?.data?.status !== "success") {
      return NextResponse.json({ error: "Unable to verify payment with Paystack" }, { status: 400 });
    }

    const metadata = verifyJson.data?.metadata || {};
    if (String(metadata?.order_id || "") !== String(orderId)) {
      return NextResponse.json({ error: "Payment does not match this order" }, { status: 400 });
    }

    const currentStatus = String(order.status || "").toUpperCase();
    if (["SHIPPED", "COMPLETED", "DISPUTE_OPEN"].includes(currentStatus)) {
      return NextResponse.json({ ok: true, idempotent: true, status: currentStatus });
    }
    if (currentStatus === "PAID") {
      await promoteStorefrontOrdersForPayout(supabase);
      const { data: refreshed } = await supabase.from("orders").select("status").eq("id", orderId).maybeSingle();
      const st = String((refreshed as { status?: string } | null)?.status || "PAID").toUpperCase();
      return NextResponse.json({ ok: true, idempotent: true, status: st });
    }
    if (!["AWAITING_PAYMENT", "PENDING"].includes(currentStatus)) {
      return NextResponse.json({ error: `Order is not payable (${currentStatus || "UNKNOWN"})` }, { status: 400 });
    }

    if (!order.user_id) {
      return NextResponse.json(
        { error: "Order has no linked buyer account; payment cannot be settled." },
        { status: 400 },
      );
    }

    const amountSmallest = Number(verifyJson.data?.amount || 0);
    const currency = String(verifyJson.data?.currency || order.currency_code || "NGN").toUpperCase();
    const expectedSmallest = expectedSmallestUnit(Number(order.total_amount || 0), currency);
    if (Math.abs(amountSmallest - expectedSmallest) > 1) {
      return NextResponse.json(
        {
          error: `Payment amount mismatch (expected ${expectedSmallest}, got ${amountSmallest})`,
        },
        { status: 400 },
      );
    }

    const { data: result, error: rpcError } = await supabase.rpc("process_paystack_charge_success", {
      p_reference: String(reference),
      p_amount_smallest: amountSmallest,
      p_metadata: {
        order_id: orderId,
        is_escrow: true,
      },
      p_currency_code: currency,
    });
    if (rpcError) {
      return NextResponse.json({ error: rpcError.message || "Payment settlement failed" }, { status: 500 });
    }

    await promoteStorefrontOrdersForPayout(supabase);
    const { data: refreshed } = await supabase.from("orders").select("status").eq("id", orderId).maybeSingle();
    const finalStatus = String((refreshed as { status?: string } | null)?.status || "PAID").toUpperCase();

    return NextResponse.json({ ok: true, result, status: finalStatus });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Unexpected error" }, { status: 500 });
  }
}
