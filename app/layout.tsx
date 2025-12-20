import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import GlobalCartSidebar from "@/components/shared/GlobalCartSidebar";

// 1. ✨ FONT SETUP: Correctly initializing Inter subsets
const inter = Inter({ subsets: ["latin"] });

// 2. ✨ METADATA: Audited - SEO and OpenGraph configurations are correct
export const metadata: Metadata = {
  metadataBase: new URL('https://storelink.ng'), 
  title: {
    default: "StoreLink | The Engine for Naija Hustle",
    template: "%s | StoreLink", 
  },
  description: "Turn your WhatsApp chats into a professional online store in minutes. Accept orders, manage products, and sell faster.",
  openGraph: {
    title: "StoreLink | The Engine for Naija Hustle",
    description: "Turn your WhatsApp chats into a professional online store in minutes.",
    siteName: "StoreLink",
    locale: "en_NG",
    type: "website",
  },
};

// 3. ✨ ROOT LAYOUT: Audited - Type definitions are correct
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 4. ✨ BODY: Added 'antialiased' for smoother font rendering */}
      <body className={`${inter.className} antialiased`}>
        
        {/* 5. ✨ PROVIDER: CartProvider wraps the app to share state/Empire logic */}
        <CartProvider>
          
          {/* 6. ✨ MAIN CONTENT: Renders the current page */}
          <main>
            {children}
          </main>
          
          {/* 7. ✨ GLOBAL SIDEBAR: Placed here to be accessible from any page */}
          <GlobalCartSidebar />
          
        </CartProvider>
      </body>
    </html>
  );
}