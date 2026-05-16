import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /** When a parent directory has another lockfile, Turbopack may pick the wrong root; pin to this package. */
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  /**
   * Served at origin root. Public entrypoints:
   * - https://shop.storelink.ng (marketplace index)
   * - https://{slug}.storelink.ng (seller storefront; middleware rewrites / → /{slug})
   * Legacy https://storelink.ng/sell/... is rewritten by storelink-web to upstream paths without /sell.
   */
  async redirects() {
    return [
      { source: "/empire-coins", destination: "/store-coins", permanent: true },
      { source: "/onboarding/buyer/interests", destination: "/dashboard", permanent: false },
    ];
  },
  images: {
    // 🔥 EMERGENCY LOCKDOWN: This stops the Vercel Transformation counter immediately.
    // It tells Next.js to serve images directly from the source without resizing them.
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
