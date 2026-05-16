import { withSentryConfig } from "@sentry/nextjs";
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

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "storelink-0f",

  project: "javascript-react",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
