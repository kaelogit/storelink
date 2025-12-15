import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function PrivacyPage() {
  return (
    <>
    <Navbar />
    
    <div className="max-w-4xl mx-auto px-6 py-16 font-sans text-gray-800">
      <h1 className="text-4xl font-extrabold mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: December 15, 2025</p>

      <div className="space-y-8 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as your name, email address, phone number, and business details when you register for an account. We also collect transaction data when you make sales or purchases through the platform.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To provide, maintain, and improve our services.</li>
            <li>To process payments and transactions securely.</li>
            <li>To send you technical notices, updates, and support messages.</li>
            <li>To detect and prevent fraud or abuse.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">3. Data Sharing</h2>
          <p>We do not sell your personal data. We may share your information with third-party service providers (such as Paystack for payments and Supabase for database hosting) strictly for the purpose of providing our services.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">4. Data Security</h2>
          <p>We implement reasonable security measures to protect your information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">5. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information. You may update your account details directly via your Dashboard or contact support for assistance.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">6. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
        </section>
      </div>
    </div>
    <Footer />
    </>
  );
}