import type { SupabaseClient, User } from "@supabase/supabase-js";

type ProfileVerificationRow = {
  is_verified?: boolean | null;
};

/**
 * Email verification only — do not confuse with seller KYC (`profiles.verification_status`).
 * Access is allowed only when `profiles.is_verified === true`.
 */
export async function isEmailVerifiedForStorefront(supabase: SupabaseClient, user: User): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_verified")
      .eq("id", user.id)
      .maybeSingle();
    if (error) return false;
    const row = data as ProfileVerificationRow | null;
    return row?.is_verified === true;
  } catch {
    return false;
  }
}

export function buildVerifyRedirectPath(email: string | null | undefined, nextPath: string): string {
  const safeEmail = String(email || "").trim();
  const query = new URLSearchParams();
  if (safeEmail) query.set("email", safeEmail);
  query.set("type", "signup");
  query.set("next", nextPath);
  return `/verify?${query.toString()}`;
}
