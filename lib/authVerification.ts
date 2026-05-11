import type { SupabaseClient, User } from "@supabase/supabase-js";

/**
 * Storefront historically required `user_metadata.verified_via_otp` after the custom `/verify` flow.
 * Users who sign up or verify through other clients already have `email_confirmed_at` and/or `profiles.is_verified`.
 */
export function hasSupabaseEmailConfirmed(user: User): boolean {
  return Boolean(user.email_confirmed_at);
}

export function hasLegacyStorefrontOtpMetadata(user: User): boolean {
  return user.user_metadata?.verified_via_otp === true;
}

/** Returns true if the account should be treated as email-verified on the storefront. */
export async function isEmailVerifiedForStorefront(supabase: SupabaseClient, user: User): Promise<boolean> {
  if (hasSupabaseEmailConfirmed(user)) return true;
  if (hasLegacyStorefrontOtpMetadata(user)) return true;

  const { data } = await supabase
    .from("profiles")
    .select("is_verified, verification_status")
    .eq("id", user.id)
    .maybeSingle();

  const row = data as { is_verified?: boolean; verification_status?: string | null } | null;
  if (row?.is_verified) return true;
  if (String(row?.verification_status ?? "").toLowerCase() === "verified") return true;

  return false;
}
