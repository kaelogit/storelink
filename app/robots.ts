import { MetadataRoute } from "next";
import { storefrontAbsolutePath } from "@/lib/storefrontPublicUrl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/admin", "/api", "/onboarding", "/update-password"],
      },
      {
        userAgent: ["Twitterbot", "facebookexternalhit", "WhatsApp"],
        allow: "/",
      },
    ],
    sitemap: storefrontAbsolutePath("/sitemap.xml"),
  };
}