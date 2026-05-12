import { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import GlobalCartSidebar from "@/components/shared/GlobalCartSidebar";
import { GoogleAnalytics } from "@next/third-parties/google";
import { storefrontAbsolutePath, storefrontSiteBase } from "@/lib/storefrontPublicUrl";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  /** Allow pinch-zoom for accessibility; layout uses responsive tokens + safe-area. */
  maximumScale: 5,
  viewportFit: "cover",
};

const siteBase = storefrontSiteBase();

/** Same key is fine on both; client bundle only inlines `NEXT_PUBLIC_*`. We also inject from server so `GOOGLE_MAPS_API_KEY` works after redeploy without rebuilding for a new public name. */
const googleMapsBrowserKey =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() || process.env.GOOGLE_MAPS_API_KEY?.trim() || "";

export const metadata: Metadata = {
  metadataBase: new URL(siteBase),
  title: {
    default: "StoreLink | The Engine for Naija Hustle",
    template: "%s | StoreLink", 
  },
  description: "Own a professional storefront without building an expensive custom website. Sell via your branded link and scale through the StoreLink marketplace.",
  keywords: ["StoreLink", "Storefront", "Ecommerce Nigeria", "Online Shop", "Marketplace", "Small Business Website", "Store Coin"],
  
  // 🔥 AUDIT FIX: Explicitly declaring icons for Google Search Crawler
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" }
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "StoreLink | The Engine for Naija Hustle",
    description: "Empowering Nigerian vendors to own storefronts, sell with confidence, and grow beyond their personal contacts.",
    url: siteBase,
    siteName: "StoreLink",
    locale: "en_NG",
    type: "website",
    images: [
      {
        // Absolute URL so social crawlers resolve OG images on all routes
        url: storefrontAbsolutePath("/og-image.jpg"),
        width: 1200,
        height: 630,
        alt: "StoreLink - Storefront Growth Infrastructure",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "StoreLink | The Engine for Naija Hustle",
    description: "The professional way to own your storefront and scale digitally.",
    creator: '@kaelodev', 
    images: [storefrontAbsolutePath("/og-image.jpg")],
  },
  verification: {
    google: 'R8d8mi7fxJ-XZ0yvJ0brHnx6cZZqo78BI1iGl-sDVcY'
  },
  category: 'business',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization JSON-LD for search
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "StoreLink",
    "url": siteBase,
    "logo": storefrontAbsolutePath("/icon.png"),
    "description": "Storefront growth infrastructure for Nigerian vendors.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "hello@storelink.ng"
    }
  };

  return (
    <html lang="en">
      <head>
        {/* 🔥 Injecting the Schema into the head */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {googleMapsBrowserKey ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__STORELINK_GOOGLE_MAPS_KEY__=${JSON.stringify(googleMapsBrowserKey)};`,
            }}
          />
        ) : null}
      </head>
      <body
        className={`${inter.className} antialiased selection:bg-emerald-100 selection:text-emerald-900 text-gray-900 bg-background`}
      >
        <CartProvider>
          <main className="min-h-dvh">
            {children}
          </main>
          <GlobalCartSidebar />
        </CartProvider>
        
        <GoogleAnalytics gaId="G-LC8PN9CT62" />
      </body>
    </html>
  );
}