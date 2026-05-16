import type { SupabaseClient } from "@supabase/supabase-js";

export type ProfileOnboardingRow = {
  id: string;
  onboarding_completed?: boolean | null;
  is_seller?: boolean | null;
  onboarding_step?: string | null;
  full_name?: string | null;
  display_name?: string | null;
  phone_number?: string | null;
  slug?: string | null;
  location_state?: string | null;
  location_city?: string | null;
  location?: string | null;
  discovery_latitude?: number | null;
  discovery_longitude?: number | null;
  shop_address?: string | null;
  service_latitude?: number | null;
  service_longitude?: number | null;
  logo_url?: string | null;
  cover_image_url?: string | null;
  buyer_interested_categories?: string[] | null;
  bio?: string | null;
  gender?: string | null;
};

export type ProfileGender = "male" | "female" | "other";

const PROFILE_GENDERS = new Set<ProfileGender>(["male", "female", "other"]);

export function isValidProfileGender(value: string | null | undefined): value is ProfileGender {
  return PROFILE_GENDERS.has(String(value || "").toLowerCase() as ProfileGender);
}

export type OnboardingRoutingInput = {
  profile: ProfileOnboardingRow | null;
};

export type ProfileOnboardingCompletionFields = {
  onboarding_completed?: boolean | null;
  onboarding_step?: string | null;
};

const BUYER_IDENTITY_PATH = "/onboarding/buyer/identity";
const BUYER_LOCATION_PATH = "/onboarding/buyer/location";
const BUYER_INTERESTS_PATH = "/onboarding/buyer/interests";
const BUYER_COMPLETE_PATH = "/onboarding/buyer/complete";
const SHARED_SETUP_PATH = "/onboarding/setup";
const SHARED_LOCATION_PATH = "/onboarding/location";
const SHARED_PICK_CATEGORIES_PATH = "/onboarding/pick-categories";

const SELLER_IDENTITY_PATH = "/onboarding/seller/identity";
const SELLER_BRAND_ASSETS_PATH = "/onboarding/seller/location";
const SELLER_FINAL_PATH = "/onboarding/seller/brand";

export function isProfileOnboardingComplete(
  profile: ProfileOnboardingRow | ProfileOnboardingCompletionFields | null
): boolean {
  if (!profile) return false;
  if (profile.onboarding_completed === true) return true;
  return (profile.onboarding_step || "").toLowerCase() === "done";
}

/** Shopper profile step: name, phone, slug, gender (+ bio saved with identity; optional on app). */
export function hasBuyerIdentity(profile: ProfileOnboardingRow | null): boolean {
  if (!profile) return false;
  const name = (profile.full_name || profile.display_name || "").trim();
  const phone = (profile.phone_number || "").replace(/\D/g, "");
  const slug = (profile.slug || "").trim();
  return Boolean(name && phone.length >= 10 && slug && isValidProfileGender(profile.gender));
}

export function hasBuyerLocation(profile: ProfileOnboardingRow | null): boolean {
  if (!profile) return false;
  return Boolean(
    profile.location_state?.trim() &&
      profile.location_city?.trim() &&
      profile.location?.trim() &&
      profile.discovery_latitude != null &&
      profile.discovery_longitude != null
  );
}

export function hasBuyerInterests(profile: ProfileOnboardingRow | null): boolean {
  if (!profile) return false;
  const interests = profile.buyer_interested_categories;
  const count = Array.isArray(interests) ? interests.filter(Boolean).length : 0;
  return count >= 3;
}

/** Buyer may access dashboard / hub only when profile flag and all shopper steps are done. */
export function isBuyerOnboardingFullyComplete(profile: ProfileOnboardingRow | null): boolean {
  if (!profile || profile.is_seller === true) return false;
  if (!isProfileOnboardingComplete(profile)) return false;
  return hasBuyerIdentity(profile) && hasBuyerLocation(profile) && hasBuyerInterests(profile);
}

/** Seller may access dashboard only when storefront setup is complete. */
export function isSellerOnboardingFullyComplete(profile: ProfileOnboardingRow | null): boolean {
  if (!profile || !profile.is_seller) return false;
  if (!isProfileOnboardingComplete(profile)) return false;
  return hasSellerStoreBasics(profile) && hasSellerStoreAddresses(profile) && hasSellerBrandAssets(profile);
}

/** Seller step 1: store name, slug, WhatsApp, home + shop addresses with coordinates. */
export function hasSellerStoreBasics(profile: ProfileOnboardingRow | null): boolean {
  if (!profile) return false;
  const name = (profile.display_name || profile.full_name || "").trim();
  const slug = (profile.slug || "").trim();
  const phone = (profile.phone_number || "").replace(/\D/g, "");
  return Boolean(name && slug && phone.length >= 10);
}

export function hasSellerStoreAddresses(profile: ProfileOnboardingRow | null): boolean {
  if (!profile) return false;
  const homeOk = Boolean(
    profile.location_state?.trim() &&
      profile.location_city?.trim() &&
      profile.location?.trim() &&
      profile.discovery_latitude != null &&
      profile.discovery_longitude != null
  );
  const shopLine = (profile.shop_address || "").trim();
  const shopCoords =
    profile.service_latitude != null &&
    profile.service_longitude != null &&
    Number.isFinite(Number(profile.service_latitude)) &&
    Number.isFinite(Number(profile.service_longitude));
  return homeOk && Boolean(shopLine && shopCoords);
}

export function hasSellerBrandAssets(profile: ProfileOnboardingRow | null): boolean {
  if (!profile) return false;
  return Boolean(profile.logo_url?.trim() && profile.cover_image_url?.trim());
}

function isCommittedBuyerPipelineStep(step: string): boolean {
  const s = step.trim().toLowerCase();
  return (
    s.startsWith("buyer_") ||
    s === "collector-setup" ||
    s === "location_setup" ||
    s === "home_address" ||
    s === "pick-categories" ||
    s === "follow-stores" ||
    s === "follow_stores"
  );
}

function isCommittedSellerPipelineStep(step: string): boolean {
  const s = step.trim().toLowerCase();
  return s.startsWith("seller_") || s === "setup";
}

export function hasCompletedAccountTypeChoice(profile: ProfileOnboardingRow | null): boolean {
  if (!profile) return false;
  if (isProfileOnboardingComplete(profile)) return true;
  if (profile.is_seller === true) return true;
  const s = (profile.onboarding_step || "").trim().toLowerCase();
  if (!s || s === "role") return false;
  if (isCommittedSellerPipelineStep(s)) return true;
  return isCommittedBuyerPipelineStep(s);
}

/**
 * Next shopper onboarding screen — field order always wins over `onboarding_step`
 * so checkout pre-fill cannot skip identity (name, phone, slug).
 */
export function getBuyerOnboardingContinuePath(profile: ProfileOnboardingRow | null): string {
  if (!profile) return "/onboarding/role";
  if (profile.is_seller === true) return "/dashboard";
  if (isBuyerOnboardingFullyComplete(profile)) return "/dashboard";

  if (!hasBuyerIdentity(profile)) {
    return SHARED_SETUP_PATH;
  }
  if (!hasBuyerLocation(profile)) {
    return SHARED_LOCATION_PATH;
  }
  if (!hasBuyerInterests(profile)) {
    return SHARED_PICK_CATEGORIES_PATH;
  }

  const step = (profile.onboarding_step || "").trim().toLowerCase();
  if (step === "follow-stores" || step === "follow_stores") {
    return BUYER_COMPLETE_PATH;
  }

  return SHARED_PICK_CATEGORIES_PATH;
}

/**
 * Next seller onboarding screen — basics (incl. slug) → brand assets → final submit.
 */
/** URL for seller wizard step (1 = store + addresses, 2 = logo/cover, 3 = final submit). */
export function getSellerOnboardingPathForStep(step: 1 | 2 | 3): string {
  if (step === 1) return SELLER_IDENTITY_PATH;
  if (step === 2) return SELLER_BRAND_ASSETS_PATH;
  return SELLER_FINAL_PATH;
}

export function getSellerOnboardingContinuePath(profile: ProfileOnboardingRow | null): string {
  if (!profile || !profile.is_seller) return "/dashboard";
  if (isSellerOnboardingFullyComplete(profile)) return "/dashboard";

  if (!hasSellerStoreBasics(profile)) {
    return SHARED_SETUP_PATH;
  }
  if (!hasSellerStoreAddresses(profile)) {
    return SHARED_LOCATION_PATH;
  }
  if (!hasSellerBrandAssets(profile)) {
    return SHARED_SETUP_PATH;
  }
  if (!hasBuyerInterests(profile)) {
    return SHARED_PICK_CATEGORIES_PATH;
  }

  const step = (profile.onboarding_step || "").trim().toLowerCase();
  if (step === "seller_brand" || step === "seller_store") {
    return SELLER_FINAL_PATH;
  }

  return SELLER_FINAL_PATH;
}

export function getPostLoginPath(input: OnboardingRoutingInput): string {
  const { profile } = input;

  if (!profile) {
    return "/onboarding/role";
  }

  if (profile.is_seller === true) {
    if (isSellerOnboardingFullyComplete(profile)) return "/dashboard";
    return getSellerOnboardingContinuePath(profile);
  }

  if (isBuyerOnboardingFullyComplete(profile)) return "/dashboard";

  const step = (profile.onboarding_step || "").trim().toLowerCase();

  if (!step || step === "role") {
    return "/onboarding/role";
  }

  if (isCommittedBuyerPipelineStep(step)) {
    return getBuyerOnboardingContinuePath(profile);
  }

  return "/onboarding/role";
}

export function getOnboardingHubRedirect(input: OnboardingRoutingInput): string {
  const { profile } = input;
  if (!profile) return "/onboarding/role";
  if (!hasCompletedAccountTypeChoice(profile)) return "/onboarding/role";
  if (profile.is_seller === true) {
    if (isSellerOnboardingFullyComplete(profile)) return "/dashboard";
    return getSellerOnboardingContinuePath(profile);
  }
  if (isBuyerOnboardingFullyComplete(profile)) return "/dashboard";
  return getBuyerOnboardingContinuePath(profile);
}

export function getDashboardOnboardingGatePath(input: OnboardingRoutingInput): string | null {
  const { profile } = input;
  if (!profile) return "/onboarding/role";
  if (profile.is_seller === true) {
    if (isSellerOnboardingFullyComplete(profile)) return null;
    return getSellerOnboardingContinuePath(profile);
  }
  if (isBuyerOnboardingFullyComplete(profile)) return null;
  return getBuyerOnboardingContinuePath(profile);
}

/** Next onboarding screen when profile fields are incomplete (null = hub OK). */
export function getOnboardingResumePath(input: OnboardingRoutingInput): string | null {
  const gate = getDashboardOnboardingGatePath(input);
  return gate;
}

export function buyerHasIncompleteOnboarding(profile: ProfileOnboardingRow | null): boolean {
  if (!profile || profile.is_seller === true) return false;
  return getBuyerOnboardingContinuePath(profile) !== "/dashboard";
}

/** @deprecated Use getBuyerOnboardingContinuePath — kept for any legacy imports. */
export function getAccountOnboardingContinuePath(
  input: OnboardingRoutingInput,
  profile: ProfileOnboardingRow | null
): string {
  if (!profile || profile.is_seller || isProfileOnboardingComplete(profile)) {
    return getPostLoginPath(input);
  }
  if (!hasCompletedAccountTypeChoice(profile)) {
    return "/onboarding/role";
  }
  return getBuyerOnboardingContinuePath(profile);
}

export async function fetchOnboardingContext(
  supabase: SupabaseClient,
  userId: string
): Promise<OnboardingRoutingInput> {
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, onboarding_completed, is_seller, onboarding_step, full_name, display_name, phone_number, slug, bio, gender, location_state, location_city, location, discovery_latitude, discovery_longitude, shop_address, service_latitude, service_longitude, logo_url, cover_image_url, buyer_interested_categories"
    )
    .eq("id", userId)
    .maybeSingle();

  return {
    profile: profile as ProfileOnboardingRow | null,
  };
}
