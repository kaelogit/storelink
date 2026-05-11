import { NextResponse } from "next/server";
import { requireStorefrontAdmin } from "@/lib/adminRouteAuth";
import { ADMIN_ORDERS_CORE_COLUMNS, enrichOrdersWithStoreBySeller } from "@/lib/adminOrders";
import { STOREFRONT_ORDER_ORIGIN } from "@/lib/storefrontAdminScope";

export async function GET(request: Request) {
  const gate = await requireStorefrontAdmin();
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(request.url);
  if (searchParams.get("summary") === "1") {
    const [failed, queued, settlement] = await Promise.all([
      gate.svc
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("origin_channel", STOREFRONT_ORDER_ORIGIN)
        .eq("payout_status", "failed"),
      gate.svc
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("origin_channel", STOREFRONT_ORDER_ORIGIN)
        .eq("status", "COMPLETED")
        .in("payout_status", ["pending", "retry_queued"]),
      gate.svc
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("origin_channel", STOREFRONT_ORDER_ORIGIN)
        .eq("status", "PAID")
        .not("payment_reference", "is", null),
    ]);
    return NextResponse.json({
      failed: failed.count ?? 0,
      payoutQueued: queued.count ?? 0,
      storefrontPaidSettlement: settlement.count ?? 0,
    });
  }

  const filter = (searchParams.get("filter") || "pipeline").toLowerCase();
  let q = gate.svc
    .from("orders")
    .select(ADMIN_ORDERS_CORE_COLUMNS)
    .eq("origin_channel", STOREFRONT_ORDER_ORIGIN)
    .order("updated_at", { ascending: false })
    .limit(350);

  switch (filter) {
    case "failed":
      q = q.eq("payout_status", "failed");
      break;
    case "queued":
      q = q.eq("status", "COMPLETED").in("payout_status", ["pending", "retry_queued"]);
      break;
    case "settlement":
      q = q.eq("status", "PAID").not("payment_reference", "is", null);
      break;
    case "pipeline":
    default:
      q = q.or(
        [
          "payout_status.eq.failed",
          "payout_status.eq.retry_queued",
          "and(status.eq.COMPLETED,payout_status.eq.pending)",
          "and(status.eq.COMPLETED,payout_status.eq.retry_queued)",
          "status.eq.PAID",
        ].join(","),
      );
      break;
  }

  const { data, error } = await q;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const rows = data ?? [];
  const orders = await enrichOrdersWithStoreBySeller(gate.svc, rows as { seller_id?: string | null }[]);
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const gate = await requireStorefrontAdmin();
  if (!gate.ok) return gate.response;

  let body: { orderId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const orderId = body.orderId?.trim();
  if (!orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  const { data: row, error: fetchErr } = await gate.svc
    .from("orders")
    .select("id, payout_status, payout_error_log")
    .eq("id", orderId)
    .maybeSingle();

  if (fetchErr || !row) {
    return NextResponse.json({ error: fetchErr?.message || "Order not found" }, { status: 404 });
  }

  const ps = String(row.payout_status || "").toLowerCase();
  if (!["failed", "retry_queued"].includes(ps)) {
    return NextResponse.json(
      { error: `Re-queue allowed only when payout_status is failed or retry_queued (got: ${row.payout_status || "empty"})` },
      { status: 400 },
    );
  }

  const stamp = new Date().toISOString();
  const prev = row.payout_error_log?.trim() || "";
  const nextLog = prev ? `${prev}\n[admin ${stamp}] Re-queued for Paystack payout retry` : `[admin ${stamp}] Re-queued for Paystack payout retry`;

  const { error: updErr } = await gate.svc
    .from("orders")
    .update({
      payout_status: "pending",
      payout_eligible_at: stamp,
      payout_retry_count: 0,
      payout_error_log: nextLog,
      updated_at: stamp,
    })
    .eq("id", orderId)
    .in("payout_status", ["failed", "retry_queued"]);

  if (updErr) {
    return NextResponse.json({ error: updErr.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message:
      "Order marked pending with immediate eligibility. Ensure payout-processor runs and Paystack balance covers the transfer.",
  });
}
