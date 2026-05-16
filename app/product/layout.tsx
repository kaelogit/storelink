import StorefrontPublicFontsWrapper from "@/components/storefront/StorefrontPublicFontsWrapper";

export default function ProductSurfaceLayout({ children }: { children: React.ReactNode }) {
  return <StorefrontPublicFontsWrapper>{children}</StorefrontPublicFontsWrapper>;
}
