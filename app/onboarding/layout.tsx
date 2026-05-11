import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />
      <div className="flex-1 w-full pt-20 sm:pt-24">{children}</div>
      <Footer />
    </div>
  );
}
