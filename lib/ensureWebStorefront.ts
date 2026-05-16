/**
 * Legacy bridge removed: storefront and checkout use `profiles.id` as seller id only.
 * Kept for any future import sites; does not touch the database.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { isProfileOnboardingComplete } from "@/lib/onboardingState";

export type EnsureWebStorefrontResult =
  | { ok: true; created: false; storeId: null }
  | { ok: false; reason: "not_eligible"; detail?: string };

export async function ensureWebStorefrontFromProfile(
  supabase: SupabaseClient,
  userId: string,
  _userEmail: string | null
): Promise<EnsureWebStorefrontResult> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_seller, onboarding_completed, onboarding_step")
    .eq("id", userId)
    .maybeSingle();

  const p = profile as { is_seller?: boolean | null; onboarding_completed?: boolean | null; onboarding_step?: string | null } | null;
  if (!p?.is_seller || !isProfileOnboardingComplete(p)) {
    return { ok: false, reason: "not_eligible" };
  }

  return { ok: true, created: false, storeId: null };
}
