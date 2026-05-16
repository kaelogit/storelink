/**
 * Buyer-facing / seller-facing copy for how money moves after a sale.
 * Matches automatic payouts: StoreLink 2.5% + Paystack share 1.5% = 4% of the
 * amount charged at checkout (see `payout-processor` / `TOTAL_SELLER_FEE_RATE`).
 * Split line items are illustrative; net uses the combined rate (no separate ₦100 flat in our model).
 */

export const STORELINK_PLATFORM_FEE_RATE = 0.025; // 2.5%
export const PAYSTACK_FEE_RATE_ILLUSTRATIVE = 0.015; // 1.5%
/** Combined seller-side fee on gross (same base as payout queue). */
export const COMBINED_SELLER_FEE_RATE = STORELINK_PLATFORM_FEE_RATE + PAYSTACK_FEE_RATE_ILLUSTRATIVE;

export type NgnFeeEstimate = {
  grossNgn: number;
  storelinkFeeNgn: number;
  paystackFeeNgn: number;
  totalFeesNgn: number;
  estimatedNetToSellerNgn: number;
};

function roundMoney2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** NGN breakdown for display; amounts may include kobo to match ~4% on gross. */
export function estimateNgnSellerSettlementFromGross(grossNgn: number): NgnFeeEstimate {
  const g = Math.max(0, Number(grossNgn) || 0);
  const totalFeesNgn = roundMoney2(g * COMBINED_SELLER_FEE_RATE);
  const storelinkFeeNgn = roundMoney2(g * STORELINK_PLATFORM_FEE_RATE);
  const paystackFeeNgn = roundMoney2(totalFeesNgn - storelinkFeeNgn);
  const estimatedNetToSellerNgn = Math.max(0, roundMoney2(g - totalFeesNgn));
  return {
    grossNgn: g,
    storelinkFeeNgn,
    paystackFeeNgn,
    totalFeesNgn,
    estimatedNetToSellerNgn,
  };
}
