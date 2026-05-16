/**
 * Estimated seller payout after platform + payment processing fees (NGN).
 * Shown in dashboard order detail; not a substitute for Paystack settlement statements.
 *
 * Aligns with `payout-processor`: fees apply to **`orders.total_amount`** (cash through Paystack):
 * 2.5% + 1.5% = 4% combined. Coins reduce cash charged; fees are not taken from unredeemed coin value.
 */

const STORELINK_RATE = 0.025;
const PAYSTACK_RATE = 0.015;

function roundMoney2(n: number): number {
  return Math.round(n * 100) / 100;
}

export type SellerNetPayableBreakdown = {
  /** Full order value: cash + coins (`total_amount + coin_redeemed`). */
  orderSubtotalNaira: number;
  /** Cash settled via Paystack after coins (`orders.total_amount`). */
  cashPaidNaira: number;
  /** StoreLink platform share: 2.5% of cash paid (matches payout split). */
  storelinkFeeNaira: number;
  /** Paystack share: 1.5% of cash paid (combined with above = 4%). */
  paystackFeeNaira: number;
  /** Cash paid minus both fees, ≥ 0. */
  netPayableNaira: number;
};

export type SellerNetPayableInput = {
  /** `total_amount + coins` — merchandise total before coin discount. */
  orderSubtotalNaira: number;
  /** `orders.total_amount` — amount charged through Paystack. */
  cashPaidNaira: number;
};

export function computeSellerNetPayableBreakdown(input: SellerNetPayableInput): SellerNetPayableBreakdown {
  const orderSubtotalNaira = Math.max(0, Math.round(Number(input.orderSubtotalNaira) || 0));
  const cashPaidNaira = Math.max(0, Number(input.cashPaidNaira) || 0);
  const storelinkFeeNaira = roundMoney2(cashPaidNaira * STORELINK_RATE);
  const paystackFeeNaira = roundMoney2(cashPaidNaira * PAYSTACK_RATE);
  const netPayableNaira = Math.max(0, roundMoney2(cashPaidNaira - storelinkFeeNaira - paystackFeeNaira));
  return {
    orderSubtotalNaira,
    cashPaidNaira: Math.round(cashPaidNaira),
    storelinkFeeNaira,
    paystackFeeNaira,
    netPayableNaira,
  };
}
