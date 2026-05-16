import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { storefrontAbsolutePath, sellerStorefrontPublicUrl, storefrontSiteBase } from "@/lib/storefrontPublicUrl";

export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const base = storefrontSiteBase();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: storefrontAbsolutePath("/marketplace"), lastModified: new Date(), changeFrequency: "always", priority: 0.9 },
    { url: storefrontAbsolutePath("/store-coins"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: storefrontAbsolutePath("/login"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: storefrontAbsolutePath("/signup"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const { data: rows, error } = await supabase
      .from("profiles")
      .select("slug, updated_at")
      .eq("is_seller", true)
      .not("slug", "is", null);

    if (error) {
      console.error("❌ SITEMAP DATABASE ERROR:", error.message);
      return staticRoutes;
    }

    const storefrontRoutes: MetadataRoute.Sitemap = (rows || [])
      .filter((r) => String(r.slug || "").trim())
      .map((r) => ({
        url: sellerStorefrontPublicUrl(String(r.slug)),
        lastModified: new Date((r as { updated_at?: string }).updated_at || new Date()),
        changeFrequency: "weekly",
        priority: 0.7,
      }));

    console.log(`✅ SITEMAP SUCCESS: Generated ${storefrontRoutes.length} storefront links.`);
    return [...staticRoutes, ...storefrontRoutes];
  } catch (err) {
    console.error("💥 SITEMAP CRITICAL CRASH:", err);
    return staticRoutes;
  }
}
