/**
 * Coin ledger rows: SPEND / REDEMPTION store a positive `amount` in DB (see mobile wallet getTxConfig).
 * Display uses a leading minus and debit styling. REFUND and earns stay credits.
 */
export type CoinTxVisualKind = "spend" | "refund" | "earn";

export function classifyCoinTransaction(row: {
  amount?: unknown;
  type?: string | null;
  description?: string | null;
}): { kind: CoinTxVisualKind; displayAmount: number } {
  const raw = Number(row.amount ?? 0);
  const type = String(row.type ?? "").toUpperCase();
  const desc = String(row.description ?? "").toLowerCase();

  if (type === "REFUND" || desc.includes("refund")) {
    return { kind: "refund", displayAmount: Math.abs(raw) };
  }

  if (type === "SPEND" || type === "REDEMPTION") {
    return { kind: "spend", displayAmount: -Math.abs(raw) };
  }

  if (raw < 0) {
    return { kind: "spend", displayAmount: raw };
  }

  return { kind: "earn", displayAmount: raw };
}
