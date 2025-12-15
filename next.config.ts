import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Allows testing images
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Allows your real uploaded images later
      },
    ],
  },
};

export default nextConfig;