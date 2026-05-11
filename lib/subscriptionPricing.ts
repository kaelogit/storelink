/** Matches store-link-mobile `SUBSCRIPTION_PRICES.NGN.seller_diamond` and term discounts. */
export const SELLER_DIAMOND_PRICE_NGN = 7500;

/** Same canonical prices as mobile `SUBSCRIPTION_PRICES` (major units per currency). */
export const SUBSCRIPTION_PRICES: Record<string, { seller_diamond: number; buyer_diamond: number }> = {
  NGN: { seller_diamond: 7500, buyer_diamond: 2500 },
  GHS: { seller_diamond: 54, buyer_diamond: 14 },
  ZAR: { seller_diamond: 1000, buyer_diamond: 267 },
  KES: { seller_diamond: 625, buyer_diamond: 167 },
  XOF: { seller_diamond: 8338, buyer_diamond: 2220 },
  EGP: { seller_diamond: 150, buyer_diamond: 40 },
  RWF: { seller_diamond: 21438, buyer_diamond: 5715 },
  USD: { seller_diamond: 4.69, buyer_diamond: 1.25 },
};

export const BILLING_DURATIONS = [
  { months: 1, label: "Monthly", discount: 0 },
  { months: 3, label: "Quarterly", discount: 0.05 },
  { months: 6, label: "Biannual", discount: 0.08 },
  { months: 12, label: "Yearly", discount: 0.12 },
] as const;

/**
 * Diamond total in `currencyCode` (major units) for the term — same formula as the mobile app.
 */
/** Paystack expects smallest currency unit (e.g. kobo); zero-decimal currencies stay whole. */
export function majorToPaystackSmallestUnit(amountMajor: number, currencyCode: string): number {
  const c = currencyCode.toUpperCase();
  if (["XOF", "RWF", "BIF"].includes(c)) return Math.round(amountMajor);
  return Math.round(amountMajor * 100);
}

export function calculateDiamondPrice(
  role: "seller" | "buyer",
  selectedMonths: number,
  currencyCode = "NGN"
) {
  const code = currencyCode.toUpperCase();
  const row = SUBSCRIPTION_PRICES[code] ?? SUBSCRIPTION_PRICES.NGN;
  const basePrice = role === "seller" ? row.seller_diamond : row.buyer_diamond;
  const config = BILLING_DURATIONS.find((d) => d.months === selectedMonths);
  const discount = config?.discount ?? 0;
  const base = basePrice * selectedMonths;
  const finalPrice = Math.round(base * (1 - discount));
  const perMonth = Math.round(finalPrice / selectedMonths);
  return { finalPrice, perMonth, discount, currencyCode: code };
}
