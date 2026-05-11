import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Mounted at https://storelink.ng/sell via storelink-web edge rewrite (STOREFRONT_ORIGIN). */
  basePath: "/sell",
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
        protocol: 'https',
        hostname: 'images.unsplash.com', 
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co', 
      },
    ],
  },
  // You can add other config options here if needed (e.g., experimental features)
};

export default nextConfig;