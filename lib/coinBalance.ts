import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Store Coins balance for the signed-in user.
 * Prefer `profiles.coin_balance` (same source as the mobile app). If that reads as 0 but the
 * coin ledger has non-zero activity for this user (RLS / sync edge cases), fall back to the sum
 * of all `coin_transactions.amount` rows for `user_id` so the header matches visible history.
 */
export async function fetchStoreCoinBalanceDisplay(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ balance: number; currencyCode: string; usedLedgerFallback: boolean }> {
  const [{ data: profile }, { data: amounts }] = await Promise.all([
    supabase.from("profiles").select("coin_balance, currency_code").eq("id", userId).maybeSingle(),
    supabase.from("coin_transactions").select("amount").eq("user_id", userId),
  ]);

  const currencyCode = String((profile as { currency_code?: string } | null)?.currency_code || "NGN");
  const raw = (profile as { coin_balance?: number | null } | null)?.coin_balance;
  const fromProfile = raw === null || raw === undefined ? NaN : Number(raw);
  const ledgerSum = (amounts || []).reduce((s, row) => s + Number((row as { amount?: unknown }).amount ?? 0), 0);

  const profileOk = Number.isFinite(fromProfile);
  let balance = profileOk ? fromProfile : ledgerSum;
  let usedLedgerFallback = false;

  if (profileOk && fromProfile === 0 && ledgerSum !== 0) {
    balance = ledgerSum;
    usedLedgerFallback = true;
  }
  if (!profileOk && ledgerSum !== 0) {
    balance = ledgerSum;
    usedLedgerFallback = true;
  }

  return { balance, currencyCode, usedLedgerFallback };
}
