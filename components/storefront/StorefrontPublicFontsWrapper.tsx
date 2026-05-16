import { Playfair_Display, Oswald } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-sf-serif",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-sf-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

/** Wraps public seller surfaces (`/[slug]`, `/product/[id]`) so theme font presets resolve. */
export default function StorefrontPublicFontsWrapper({ children }: { children: React.ReactNode }) {
  return <div className={`${playfair.variable} ${oswald.variable}`}>{children}</div>;
}
