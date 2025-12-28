import type { Metadata, Viewport } from "next"; 
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import GlobalCartSidebar from "@/components/shared/GlobalCartSidebar";
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#10b981", 
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://storelink.ng'), 
  title: {
    default: "StoreLink | The Engine for Naija Hustle",
    template: "%s | StoreLink", 
  },
  description: "Turn your WhatsApp chats into a professional online store in minutes. Accept orders, manage products, and sell faster.",
  keywords: ["StoreLink", "Naija Hustle", "WhatsApp Store", "Ecommerce Nigeria", "Online Shop", "WhatsApp Marketing", "Empire Coin"],
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
    description: "Empowering Nigerian vendors to sell faster on WhatsApp. Join the ecosystem and grow your business.",
    url: 'https://storelink.ng',
    siteName: "StoreLink",
    locale: "en_NG",
    type: "website",
    // 🔥 Empire Audit: Added OG Image for WhatsApp/Facebook
    images: [
      {
        url: '/og-image.jpg', // Put this file in your /public folder
        width: 1200,
        height: 630,
        alt: "StoreLink - The WhatsApp Commerce Engine",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "StoreLink | The Engine for Naija Hustle",
    description: "The professional way to manage your WhatsApp orders.",
    creator: '@kaelodev', 
    // 🔥 Empire Audit: Added Twitter Image
    images: ['/og-image.jpg'],
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
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased selection:bg-emerald-100 selection:text-emerald-900`}>
        <CartProvider>
          <main className="min-h-screen">
            {children}
          </main>
          <GlobalCartSidebar />
        </CartProvider>
        
        <GoogleAnalytics gaId="G-LC8PN9CT62" />
      </body>
    </html>
  );
}