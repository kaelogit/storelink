export type OnboardingProfileLike = {
  full_name?: string | null;
  phone_number?: string | null;
  slug?: string | null;
  location_state?: string | null;
  location_city?: string | null;
  location?: string | null;
  /** Shop / service pin (sellers) — aligned with profile `service_latitude` / `service_longitude`. */
  service_latitude?: number | null;
  service_longitude?: number | null;
  /** Web storefront: saved shop line when no legacy `stores.location` yet. */
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
  if (!profile?.location_state?.trim()) missing.push("State");
  if (!profile?.location_city?.trim()) missing.push("City");
  if (!profile?.location?.trim()) missing.push("Home address");

  if (isSeller) {
    // Store slug mirrors profile slug until `stores` row exists; shop address is separate from home.
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
    const oc = profile?.onboarding_completed === true;
    const step = (profile?.onboarding_step || "").toLowerCase();
    if (!oc || step === "buyer_interests") {
      const n = Array.isArray(profile?.buyer_interested_categories)
        ? profile!.buyer_interested_categories!.filter(Boolean).length
        : 0;
      if (n < 3) missing.push("Shopping interests (pick 3+ categories)");
    }
  }
  return missing;
}
