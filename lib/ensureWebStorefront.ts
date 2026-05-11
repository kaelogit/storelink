/**
 * Optional bridge: inserts a legacy `stores` row for admin/legacy tools that still read `stores`.
 * Storefront checkout uses `create_new_order(p_seller_id => profiles.id)`; a `stores` row is not required to sell.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizeSlug } from "@/lib/slugAvailability";
import { isProfileOnboardingComplete } from "@/lib/onboardingState";
import { joinProfileDisplayLocation, type ProfileStorefrontRow } from "@/lib/profileAsStorefront";

export type EnsureWebStorefrontResult =
  | { ok: true; created: boolean; storeId: string | null }
  | { ok: false; reason: "already_has_store" | "not_eligible" | "insert_failed"; detail?: string };

type ProfileRow = {
  slug?: string | null;
  display_name?: string | null;
  full_name?: string | null;
  bio?: string | null;
  logo_url?: string | null;
  category?: string | null;
  location?: string | null;
  phone_number?: string | null;
  location_state?: string | null;
  location_city?: string | null;
  is_seller?: boolean | null;
  onboarding_completed?: boolean | null;
  onboarding_step?: string | null;
};

/** Normalize phone for stores.whatsapp_number (same rules as merchant setup). */
function normalizeWhatsApp(raw: string | null | undefined): string {
  let wa = String(raw || "").replace(/\D/g, "");
  if (!wa) return "";
  if (wa.startsWith("0")) wa = "234" + wa.substring(1);
  else if (!wa.startsWith("234")) wa = "234" + wa;
  return wa;
}

async function pickAvailableStoreSlug(
  supabase: SupabaseClient,
  userId: string,
  baseRaw: string
): Promise<string> {
  const base = normalizeSlug(baseRaw) || `seller-${userId.slice(0, 8)}`;
  const candidates = [
    base,
    `${base}-shop`,
    `${base}-store`,
    `shop-${userId.replace(/-/g, "").slice(0, 12)}`,
    `store-${userId.replace(/-/g, "").slice(0, 12)}`,
    `sl-${userId.replace(/-/g, "").slice(0, 16)}`,
  ];

  for (const c of candidates) {
    const slug = normalizeSlug(c);
    if (!slug) continue;
    const { data } = await supabase.from("stores").select("owner_id").eq("slug", slug).maybeSingle();
    const row = data as { owner_id?: string } | null;
    if (!row?.owner_id) return slug;
    if (row.owner_id === userId) return slug;
  }

  return normalizeSlug(`seller-${userId}`) || `seller-${userId.replace(/-/g, "")}`;
}

/**
 * Creates a web `stores` row from `profiles` when the seller finished onboarding in the app
 * but never ran web merchant setup — products and KPIs join through `stores.owner_id`.
 */
export async function ensureWebStorefrontFromProfile(
  supabase: SupabaseClient,
  userId: string,
  userEmail: string | null
): Promise<EnsureWebStorefrontResult> {
  const { data: existing } = await supabase.from("stores").select("id").eq("owner_id", userId).maybeSingle();
  if (existing?.id) {
    return { ok: true, created: false, storeId: existing.id };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "slug, display_name, full_name, bio, logo_url, category, location, phone_number, location_state, location_city, location_country, location_country_code, is_seller, onboarding_completed, onboarding_step"
    )
    .eq("id", userId)
    .maybeSingle();

  const p = profile as ProfileRow | null;
  if (!p?.is_seller || !isProfileOnboardingComplete(p)) {
    return { ok: false, reason: "not_eligible" };
  }

  const displayName = p.display_name?.trim() || p.full_name?.trim() || "My storefront";
  const slugSource = p.slug?.trim() || displayName;
  const slug = await pickAvailableStoreSlug(supabase, userId, slugSource);

  const locationStr = joinProfileDisplayLocation({
    ...(p as unknown as ProfileStorefrontRow),
    id: userId,
  });

  let whatsapp = normalizeWhatsApp(p.phone_number);
  if (!whatsapp) whatsapp = "2340000000001";

  const logoUrl = p.logo_url?.trim() || null;

  const row = {
    owner_id: userId,
    owner_email: userEmail,
    name: displayName,
    slug,
    category: (p.category?.trim() || "general").toLowerCase(),
    location: locationStr,
    whatsapp_number: whatsapp,
    description: p.bio?.trim() || "",
    instagram_handle: "",
    tiktok_url: "",
    logo_url: logoUrl,
    cover_image_url: logoUrl,
    subscription_plan: "standard",
    subscription_expiry: null,
    status: "active",
  };

  const { data: inserted, error } = await supabase.from("stores").insert(row).select("id").single();

  if (error) {
    console.warn("[ensureWebStorefrontFromProfile]", error.message);
    return { ok: false, reason: "insert_failed", detail: error.message };
  }

  const ins = inserted as { id?: string } | null;
  return { ok: true, created: true, storeId: ins?.id ?? null };
}
