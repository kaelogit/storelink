import { NextResponse } from "next/server";
import { requireStorefrontAdmin } from "@/lib/adminRouteAuth";
import { sumStorefrontPaidGmvAndFees } from "@/lib/adminStorefrontAggregate";
import { STOREFRONT_ORDER_ORIGIN } from "@/lib/storefrontAdminScope";

export async function GET() {
  const gate = await requireStorefrontAdmin();
  if (!gate.ok) return gate.response;

  const svc = gate.svc;
  const since7 = new Date(Date.now() - 7 * 864e5).toISOString();
  const sf = STOREFRONT_ORDER_ORIGIN;

  try {
    const [
      profilesTotal,
      sellers,
      buyerProfiles,
      listingsTotalRes,
      listingsActiveRes,
      payoutFailed,
      payoutQueued,
      storefrontPaidSettlement,
      ordersSf7d,
      ordersSfLifetime,
      recentSellersRes,
      recentSfOrdersRes,
    ] = await Promise.all([
      svc.from("profiles").select("*", { count: "exact", head: true }),
      svc.from("profiles").select("*", { count: "exact", head: true }).eq("is_seller", true),
      svc.from("profiles").select("*", { count: "exact", head: true }).or("is_seller.eq.false,is_seller.is.null"),
      svc.from("storefront_products").select("*", { count: "exact", head: true }),
      svc.from("storefront_products").select("*", { count: "exact", head: true }).eq("is_active", true),
      svc.from("orders").select("*", { count: "exact", head: true }).eq("origin_channel", sf).eq("payout_status", "failed"),
      svc
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("origin_channel", sf)
        .eq("status", "COMPLETED")
        .in("payout_status", ["pending", "retry_queued"]),
      svc
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("origin_channel", sf)
        .eq("status", "PAID")
        .not("payment_reference", "is", null),
      svc.from("orders").select("*", { count: "exact", head: true }).eq("origin_channel", sf).gte("created_at", since7),
      svc.from("orders").select("*", { count: "exact", head: true }).eq("origin_channel", sf),
      svc
        .from("profiles")
        .select("id, email, full_name, display_name, is_seller, acquisition_channel, created_at")
        .eq("is_seller", true)
        .order("created_at", { ascending: false })
        .limit(10),
      svc
        .from("orders")
        .select(
          "id, status, total_amount, currency_code, origin_channel, checkout_mode, created_at, user_id, seller_id, buyer:profiles!orders_user_id_fkey ( display_name, full_name, email )",
        )
        .eq("origin_channel", sf)
        .order("created_at", { ascending: false })
        .limit(12),
    ]);

    const listingsTotal = listingsTotalRes.error ? 0 : listingsTotalRes.count ?? 0;
    const listingsActive = listingsActiveRes.error ? listingsTotal : listingsActiveRes.count ?? 0;

    let gmvNgn = 0;
    let platformFeesNgn = 0;
    let feesCapped = false;
    let platformFeesNote: string | null = null;
    try {
      const agg = await sumStorefrontPaidGmvAndFees(svc);
      gmvNgn = agg.gmvNgn;
      platformFeesNgn = agg.platformFeesNgn;
      feesCapped = agg.capped;
      if (agg.capped) {
        platformFeesNote =
          "Totals may be partial after scanning a large batch of paid orders. Use SQL for an exact sum if needed.";
      }
    } catch (e: unknown) {
      platformFeesNote = e instanceof Error ? e.message : "Could not aggregate fees.";
    }

    return NextResponse.json({
      payoutSummary: {
        failed: payoutFailed.count ?? 0,
        payoutQueued: payoutQueued.count ?? 0,
        storefrontPaidSettlement: storefrontPaidSettlement.count ?? 0,
      },
      people: {
        totalProfiles: profilesTotal.count ?? 0,
        sellers: sellers.count ?? 0,
        buyerProfiles: buyerProfiles.count ?? 0,
      },
      catalog: {
        listingsTotal,
        listingsActive,
        listingsActiveQueryFailed: Boolean(listingsActiveRes.error),
      },
      storefront: {
        ordersLifetime: ordersSfLifetime.count ?? 0,
        ordersLast7Days: ordersSf7d.count ?? 0,
        gmvNgn,
        platformFeesNgn,
        platformFeesNote,
      },
      recentSellers: recentSellersRes.data ?? [],
      recentStorefrontOrders: recentSfOrdersRes.data ?? [],
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Snapshot failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
