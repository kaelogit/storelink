/**
 * Seller-facing payout / settlement copy for product orders.
 * Aligns with `orders` columns: status, payout_status, payout_eligible_at (see mobile `supabase` types).
 */

export type SellerOrderPayoutRow = {
  status?: string | null;
  payout_status?: string | null;
  payout_eligible_at?: string | null;
  payment_reference?: string | null;
  origin_channel?: string | null;
  payout_error_log?: string | null;
  payout_retry_count?: number | null;
};

export type SellerPayoutFlowDescription = {
  /** Short label for tables */
  headline: string;
  /** Extra detail (tooltip / modal) */
  detail?: string;
};

function isStorefrontOrder(row: SellerOrderPayoutRow) {
  return String(row.origin_channel || "").toLowerCase() === "storefront";
}

export function describeSellerOrderPayoutFlow(row: SellerOrderPayoutRow): SellerPayoutFlowDescription {
  const st = String(row.status || "").toUpperCase();
  const ps = String(row.payout_status || "").toLowerCase();
  const eligible = row.payout_eligible_at ? new Date(row.payout_eligible_at) : null;
  const now = Date.now();
  const storefront = isStorefrontOrder(row);

  if (["AWAITING_PAYMENT", "PENDING"].includes(st)) {
    return {
      headline: "Awaiting payment",
      detail: "Funds are not secured until checkout completes successfully.",
    };
  }

  if (st === "CANCELLED") {
    return {
      headline: "Cancelled",
      detail: row.payout_error_log || undefined,
    };
  }

  if (ps === "failed") {
    return {
      headline: "Payout failed",
      detail:
        row.payout_error_log ||
        "Check payout bank details under membership / payout settings, then contact support if this persists.",
    };
  }

  if (ps === "paid") {
    return {
      headline: "Payout sent",
      detail: "Paystack transfer was initiated; your bank’s posting time may add a short delay.",
    };
  }

  if (ps === "retry_queued") {
    return {
      headline: "Payout retry scheduled",
      detail:
        row.payout_error_log ||
        "Paystack returned a retriable error; the processor will retry automatically.",
    };
  }

  // Completed orders are what the payout processor dequeues (see payout-processor).
  if (st === "COMPLETED") {
    if (["pending", ""].includes(ps) || !ps) {
      if (eligible && eligible.getTime() > now) {
        return {
          headline: "Payout eligible soon",
          detail: `Transfer can run on or after ${eligible.toLocaleString()}.`,
        };
      }
      return {
        headline: storefront ? "Finalized · payout queued" : "Queued for Paystack transfer",
        detail: storefront
          ? "Storefront auto-finalized this order after the settlement window. Paystack transfer runs automatically when your payout queue is processed."
          : "Your net payout is in the automatic transfer queue.",
      };
    }
  }

  if (st === "PAID") {
    if (storefront) {
      if (eligible && eligible.getTime() > now) {
        const mins = Math.max(1, Math.ceil((eligible.getTime() - now) / 60000));
        return {
          headline: `Settlement · ~${mins} min`,
          detail:
            "Payment is secured. Inventory stays reserved until this window ends; then the order finalizes automatically and joins the Paystack payout queue.",
        };
      }
      return {
        headline: "Payment secured",
        detail:
          "Buyer checkout is complete. Confirmation emails go out automatically. After about 30 minutes (settlement window), the order completes automatically so your Paystack payout can run — no seller confirm step on the storefront.",
      };
    }
    return {
      headline: "Paid — held for fulfillment",
      detail:
        "Funds are secured. Seller payout follows your release rules (for example after shipment / completion).",
    };
  }

  if (st === "SHIPPED") {
    return {
      headline: "Shipped",
      detail: "Order is in transit. Payout timing depends on when the order is marked completed in your flows.",
    };
  }

  if (st === "DISPUTE_OPEN") {
    return {
      headline: "Under review",
      detail: "This order may be paused until the dispute is resolved.",
    };
  }

  return {
    headline: st || "Unknown",
    detail: ps ? `Payout status: ${ps}` : undefined,
  };
}

export function orderCountsTowardSellerRevenue(status: string | null | undefined) {
  const s = String(status || "").toUpperCase();
  return ["PAID", "SHIPPED", "COMPLETED"].includes(s);
}

export function isStorefrontProductOrder(row: SellerOrderPayoutRow & { status?: string | null }) {
  return String(row.origin_channel || "").toLowerCase() === "storefront";
}

/** Storefront order whose Paystack transfer failed (seller should verify bank details; admin may retry). */
export function storefrontOrderPayoutFailed(row: SellerOrderPayoutRow & { status?: string | null }) {
  return isStorefrontProductOrder(row) && String(row.payout_status || "").toLowerCase() === "failed";
}

/** Storefront order finalized and waiting on automatic payout / retry. */
export function storefrontOrderPayoutQueued(row: SellerOrderPayoutRow & { status?: string | null }) {
  const st = String(row.status || "").toUpperCase();
  const ps = String(row.payout_status || "").toLowerCase();
  return isStorefrontProductOrder(row) && st === "COMPLETED" && ["pending", "retry_queued"].includes(ps);
}

/** Localized timestamp for seller orders table / receipts (DB `payout_eligible_at`). */
export function formatOrderPayoutEligibleAt(row: SellerOrderPayoutRow): string {
  const raw = row.payout_eligible_at?.trim();
  if (!raw) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

/** Short label: relative countdown until eligibility, or localized time once passed / paid out path. */
export function payoutEligibleSummary(row: SellerOrderPayoutRow): string {
  const raw = row.payout_eligible_at?.trim();
  if (!raw) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "—";
  const now = Date.now();
  const st = String(row.status || "").toUpperCase();
  const storefront = isStorefrontOrder(row);
  if (storefront && st === "PAID" && d.getTime() > now) {
    const mins = Math.max(1, Math.ceil((d.getTime() - now) / 60000));
    return `In ~${mins} min`;
  }
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
