export type OnboardingProfileLike = {
  full_name?: string | null;
  phone_number?: string | null;
  slug?: string | null;
  gender?: string | null;
  bio?: string | null;
  location_state?: string | null;
  location_city?: string | null;
  location?: string | null;
  discovery_latitude?: number | null;
  discovery_longitude?: number | null;
  /** Shop / service pin (sellers) — aligned with profile `service_latitude` / `service_longitude`. */
  service_latitude?: number | null;
  service_longitude?: number | null;
  /** Web storefront: saved shop line on `profiles.shop_address`. */
  shop_address?: string | null;
  buyer_interested_categories?: string[] | null;
  onboarding_completed?: boolean | null;
  onboarding_step?: string | null;
};

export type SellerStoreLike = {
  slug?: string | null;
  location?: string | null;
} | null;

export function getMissingOnboardingFields(
  profile: OnboardingProfileLike | null,
  isSeller: boolean,
  store: SellerStoreLike
): string[] {
  const missing: string[] = [];
  if (!profile?.full_name?.trim()) missing.push("Full name");
  if (!profile?.slug?.trim()) missing.push("Profile slug");
  if (!profile?.phone_number?.trim()) missing.push("Phone number");
  if (!isSeller) {
    const g = String(profile?.gender || "").toLowerCase();
    if (g !== "male" && g !== "female" && g !== "other") missing.push("Gender");
  }
  if (!profile?.location_state?.trim()) missing.push("State");
  if (!profile?.location_city?.trim()) missing.push("City");
  if (!profile?.location?.trim()) missing.push("Home address");
  if (!isSeller && (profile?.discovery_latitude == null || profile?.discovery_longitude == null)) {
    missing.push("Home location (map pin)");
  }

  if (isSeller) {
    const storeSlug = store?.slug?.trim() || profile?.slug?.trim() || "";
    const shopPinOk =
      profile?.service_latitude != null &&
      profile?.service_longitude != null &&
      !Number.isNaN(Number(profile.service_latitude)) &&
      !Number.isNaN(Number(profile.service_longitude));
    const storeAddressOk =
      Boolean(store?.location?.trim()) || Boolean(profile?.shop_address?.trim()) || shopPinOk;
    if (!storeSlug) missing.push("Store slug");
    if (!storeAddressOk) missing.push("Shop address");
  } else {
    const n = Array.isArray(profile?.buyer_interested_categories)
      ? profile.buyer_interested_categories.filter(Boolean).length
      : 0;
    if (n < 3) missing.push("Shopping interests (pick 3+ categories)");
  }
  return missing;
}
