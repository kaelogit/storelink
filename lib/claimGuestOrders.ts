import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Attach guest storefront orders (matched by email or phone) to this account.
 * Safe to call on every account session — already-claimed rows are skipped server-side.
 */
export async function claimGuestOrdersForSession(
  supabase: SupabaseClient,
  params: { userId: string; email: string | null; phoneDigits: string | null },
): Promise<{ claimedCount: number }> {
  const email = params.email?.trim() || null;
  const digits = params.phoneDigits?.replace(/\D/g, "") || "";
  const phone = digits.length >= 10 ? digits : null;

  if (!email && !phone) return { claimedCount: 0 };

  const { data, error } = await supabase.rpc("claim_guest_orders", {
    p_user_id: params.userId,
    p_email: email,
    p_phone: phone,
  });

  if (error) {
    return { claimedCount: 0 };
  }

  const row = Array.isArray(data) ? data[0] : data;
  const n = typeof row?.claimed_count === "number" ? row.claimed_count : 0;
  return { claimedCount: n };
}
