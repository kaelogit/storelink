import { orderCountsTowardSellerRevenue } from "@/lib/sellerOrderPayoutFlow";

type OrderLike = {
  created_at?: string | null;
  status?: string | null;
  total_amount?: unknown;
};

function orderRevenueAmount(o: OrderLike): number {
  return Number(o.total_amount ?? 0) || 0;
}

/** Sum cash totals for orders whose status counts toward seller revenue, in `[startMs, endMs)`. */
export function sellerRevenueInRange(orders: OrderLike[], startMs: number, endMs: number): number {
  return orders.reduce((acc, o) => {
    if (!orderCountsTowardSellerRevenue(o.status)) return acc;
    const t = new Date(String(o.created_at || "")).getTime();
    if (Number.isNaN(t) || t < startMs || t >= endMs) return acc;
    return acc + orderRevenueAmount(o);
  }, 0);
}

/** Rolling 7-day window vs the previous 7 days (aligned to `Date.now()`). */
export function sellerWeekOverWeekRevenue(orders: OrderLike[]): {
  revenueThisWeek: number;
  revenueLastWeek: number;
} {
  const now = Date.now();
  const week = 7 * 24 * 60 * 60 * 1000;
  return {
    revenueThisWeek: sellerRevenueInRange(orders, now - week, now),
    revenueLastWeek: sellerRevenueInRange(orders, now - 2 * week, now - week),
  };
}
