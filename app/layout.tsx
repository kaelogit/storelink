import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import GlobalCartSidebar from "@/components/shared/GlobalCartSidebar";

const inter = Inter({ subsets: ["latin"] });

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
  openGraph: {
    title: "StoreLink | The Engine for Naija Hustle",
    description: "Turn your WhatsApp chats into a professional online store in minutes.",
    url: 'https://storelink.ng',
    siteName: "StoreLink",
    images: [
      {
        url: '/og-image.png', // Make sure this file exists in your public folder
        width: 1200,
        height: 630,
        alt: 'StoreLink Empire',
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "StoreLink | The Engine for Naija Hustle",
    description: "Turn your WhatsApp chats into a professional online store in minutes.",
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        
        <CartProvider>
          
          <main>
            {children}
          </main>
          
          <GlobalCartSidebar />
          
        </CartProvider>
      </body>
    </html>
  );
}