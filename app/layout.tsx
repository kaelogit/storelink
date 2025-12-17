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
  openGraph: {
    title: "StoreLink | The Engine for Naija Hustle",
    description: "Turn your WhatsApp chats into a professional online store in minutes.",
    siteName: "StoreLink",
    locale: "en_NG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {children}
          <GlobalCartSidebar />
        </CartProvider>
      </body>
    </html>
  );
}