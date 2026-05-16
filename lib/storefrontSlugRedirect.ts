import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizeSlug } from "@/lib/slugAvailability";

/** If `rawSlug` was renamed, returns the current slug; otherwise null. */
export async function resolveStorefrontSlugRedirect(
  supabase: SupabaseClient,
  rawSlug: string,
): Promise<string | null> {
  const old = normalizeSlug(rawSlug);
  if (!old) return null;
  const { data } = await supabase.from("storefront_slug_redirects").select("new_slug").eq("old_slug", old).maybeSingle();
  const n = (data as { new_slug?: string } | null)?.new_slug;
  return typeof n === "string" && n.length > 0 ? n : null;
}
