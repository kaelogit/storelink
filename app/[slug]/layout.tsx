import StorefrontPublicFontsWrapper from "@/components/storefront/StorefrontPublicFontsWrapper";

export default function StorefrontSlugLayout({ children }: { children: React.ReactNode }) {
  return <StorefrontPublicFontsWrapper>{children}</StorefrontPublicFontsWrapper>;
}
