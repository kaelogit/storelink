import type { SupabaseClient } from "@supabase/supabase-js";

export type ProfileOnboardingRow = {
  id: string;
  onboarding_completed?: boolean | null;
  is_seller?: boolean | null;
  onboarding_step?: string | null;
  full_name?: string | null;
  phone_number?: string | null;
  slug?: string | null;
  location_state?: string | null;
  location_city?: string | null;
  location?: string | null;
  buyer_interested_categories?: string[] | null;
};

export type OnboardingRoutingInput = {
  profile: ProfileOnboardingRow | null;
  hasStore: boolean;
};

/**
 * Whether the account finished in-app / profile onboarding.
 * Prefer `profiles.onboarding_completed` (authoritative); `onboarding_step === 'done'` is a legacy fallback.
 * Do not infer from `is_seller` + missing `stores` row — the app can complete onboarding before a web `stores` row exists.
 */
/** Minimal fields read from `profiles` for completion checks */
export type ProfileOnboardingCompletionFields = {
  onboarding_completed?: boolean | null;
  onboarding_step?: string | null;
};

export function isProfileOnboardingComplete(
  profile: ProfileOnboardingRow | ProfileOnboardingCompletionFields | null
): boolean {
  if (!profile) return false;
  if (profile.onboarding_completed === true) return true;
  return (profile.onboarding_step || "").toLowerCase() === "done";
}

/** Single destination after auth (signup, login, verify). */
export function getPostLoginPath(input: OnboardingRoutingInput): string {
  const { profile, hasStore } = input;

  if (!profile) {
    return "/onboarding/role";
  }

  // Any account that already owns a store → seller dashboard (do not rely on `is_seller` alone; it can drift vs app).
  if (hasStore) {
    return "/dashboard";
  }

  if (isProfileOnboardingComplete(profile)) {
    return "/dashboard";
  }

  const step = (profile.onboarding_step || "").toLowerCase();

  /** App sellers mid-flow: step points at store creation but no row yet. */
  if (profile.is_seller && (step === "seller_store" || step === "setup" || step === "seller_identity")) {
    return "/onboarding/seller/identity";
  }

  if (profile.is_seller && step === "seller_location") {
    return "/onboarding/seller/location";
  }

  if (profile.is_seller && step === "seller_brand") {
    return "/onboarding/seller/brand";
  }

  if (profile.is_seller && !hasStore) {
    return "/onboarding/seller/identity";
  }

  if (step === "buyer_identity" || step === "collector-setup") {
    return "/onboarding/buyer/identity";
  }

  if (step === "buyer_location" || step === "location_setup" || step === "home_address") {
    return "/onboarding/buyer/location";
  }

  if (step === "buyer_interests" || step === "pick-categories") {
    return "/onboarding/buyer/interests";
  }

  return "/onboarding/role";
}

/** First step inside `/onboarding` hub — drives progressive onboarding. */
export function getOnboardingHubRedirect(input: OnboardingRoutingInput): string {
  return getAccountOnboardingContinuePath(input, input.profile);
}

/**
 * For buyers on web: jump to the first incomplete step (identity vs location).
 * Sellers and completed accounts use `getPostLoginPath` only.
 */
export function getAccountOnboardingContinuePath(
  input: OnboardingRoutingInput,
  profile: ProfileOnboardingRow | null
): string {
  const base = getPostLoginPath(input);
  if (!profile || input.hasStore || profile.is_seller) {
    return base;
  }
  if (isProfileOnboardingComplete(profile)) {
    return base;
  }
  const hasIdentity = !!(
    profile.full_name?.trim() &&
    profile.phone_number?.trim() &&
    profile.slug?.trim()
  );
  const hasLocation = !!(
    profile.location_state?.trim() &&
    profile.location_city?.trim() &&
    profile.location?.trim()
  );
  const interests = profile.buyer_interested_categories;
  const interestCount = Array.isArray(interests) ? interests.filter(Boolean).length : 0;
  const hasInterests = interestCount >= 3;

  if (!hasIdentity) {
    return "/onboarding/buyer/identity";
  }
  if (!hasLocation) {
    return "/onboarding/buyer/location";
  }
  if (!hasInterests) {
    const stepLower = (profile.onboarding_step || "").toLowerCase();
    const mustPickInterests =
      profile.onboarding_completed !== true || stepLower === "buyer_interests";
    if (mustPickInterests) {
      return "/onboarding/buyer/interests";
    }
  }
  return base;
}

export async function fetchOnboardingContext(
  supabase: SupabaseClient,
  userId: string
): Promise<OnboardingRoutingInput> {
  const [{ data: profile }, { data: store }] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, onboarding_completed, is_seller, onboarding_step, full_name, phone_number, slug, location_state, location_city, location, buyer_interested_categories"
      )
      .eq("id", userId)
      .maybeSingle(),
    supabase.from("stores").select("id").eq("owner_id", userId).maybeSingle(),
  ]);

  return {
    profile: profile as ProfileOnboardingRow | null,
    hasStore: !!store,
  };
}
