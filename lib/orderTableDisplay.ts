/** Shared order row display for seller store orders and buyer “my orders” tables. */

export function orderCoinRedeemed(order: { coin_redeemed?: unknown; coins_redeemed?: unknown } | null | undefined): number {
  return Number(order?.coin_redeemed ?? order?.coins_redeemed ?? 0);
}

export function orderStatusBadgeClass(status: string | null | undefined): string {
  const s = String(status || "").toUpperCase();
  if (["COMPLETED", "PAID"].includes(s)) return "bg-emerald-100 text-emerald-700";
  if (["AWAITING_PAYMENT", "PENDING"].includes(s)) return "bg-amber-100 text-amber-700";
  if (s === "CANCELLED") return "bg-red-100 text-red-700";
  if (s === "SHIPPED") return "bg-blue-100 text-blue-800";
  return "bg-gray-100 text-gray-600";
}

export function orderStatusLabel(status: string | null | undefined): string {
  const s = String(status || "").toUpperCase();
  if (s === "AWAITING_PAYMENT") return "Awaiting payment";
  return s || "—";
}
