import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM } from "@/lib/mobileLayout";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`flex min-h-dvh flex-col bg-gray-50 font-sans ${STOREFRONT_SAFE_BOTTOM}`}>
      <Navbar />
      <div className={`flex-1 w-full pt-20 sm:pt-24 ${STOREFRONT_GUTTER_X}`}>{children}</div>
      <Footer />
    </div>
  );
}