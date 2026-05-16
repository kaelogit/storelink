import type { SupabaseClient } from "@supabase/supabase-js";

export type SlugStatus = "idle" | "checking" | "available" | "taken";

export function normalizeSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function checkSlugAvailability(
  supabase: SupabaseClient,
  slugRaw: string,
  currentProfileId?: string | null
): Promise<Exclude<SlugStatus, "idle" | "checking">> {
  const slug = normalizeSlug(slugRaw);
  if (!slug) return "taken";

  const [{ data: profileHit }, { data: retiredSlug }] = await Promise.all([
    supabase.from("profiles").select("id").eq("slug", slug).maybeSingle(),
    supabase.from("storefront_slug_redirects").select("old_slug").eq("old_slug", slug).maybeSingle(),
  ]);

  if (profileHit && currentProfileId && (profileHit as { id?: string }).id === currentProfileId) {
    return "available";
  }

  if (retiredSlug) return "taken";

  return profileHit ? "taken" : "available";
}
