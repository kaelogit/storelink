/**
 * Paystack sometimes returns "your balance" wording for the *platform* settlement
 * balance. Sellers read that as their own bank balance — rewrite for clarity.
 */
const PLATFORM_BALANCE_FRIENDLY =
  "We're updating our Paystack settlement balance; your payout will retry automatically. This is not an issue with your bank account or your payout settings.";

function isPaystackPlatformInsufficientBalanceMessage(message: string): boolean {
  const m = message.trim().toLowerCase();
  if (!m) return false;
  if (m.includes("your balance is not enough")) return true;
  if (m.includes("not enough to fulfil") || m.includes("not enough to fulfill")) return true;
  if (m.includes("insufficient") && m.includes("balance") && (m.includes("fulfil") || m.includes("fulfill"))) return true;
  return false;
}

/** Seller-safe copy for `orders.payout_error_log` / `service_order_payouts` error text. */
export function formatPayoutErrorForSellerDisplay(raw: string | null | undefined): string | undefined {
  const s = (raw ?? "").trim();
  if (!s) return undefined;

  const retriable = s.match(/^Retriable\s*\((\d+)\/(\d+)\):\s*(.*)$/is);
  const inner = (retriable?.[3] ?? s).trim();
  if (!isPaystackPlatformInsufficientBalanceMessage(inner)) return s;

  if (retriable) {
    return `Retriable (${retriable[1]}/${retriable[2]}): ${PLATFORM_BALANCE_FRIENDLY}`;
  }
  return PLATFORM_BALANCE_FRIENDLY;
}
