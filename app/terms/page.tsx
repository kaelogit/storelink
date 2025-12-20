import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function TermsPage() {
  return (
    <>
    <Navbar />
    
    <div className="max-w-4xl mx-auto px-6 py-16 font-sans text-gray-800">
      
      <h1 className="text-4xl font-extrabold mb-8">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: December 20, 2025</p>

      <div className="space-y-8 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">1. Acceptance of Terms</h2>
          <p>By accessing or using StoreLink ("the Platform"), you agree to comply with and be bound by these Terms of Service. If you do not agree, you may not use our services.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">2. Account Registration</h2>
          <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">3. Vendor Obligations</h2>
          <p>Vendors on StoreLink must not sell prohibited items, including but not limited to: illegal drugs, weapons, counterfeit goods, or fraudulent services. StoreLink reserves the right to suspend any store found in violation of these rules.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">4. Payments & Subscriptions</h2>
          <p>Subscription fees for Premium and Diamond plans are billed monthly. Payments are processed securely via Paystack. StoreLink does not store your credit card information directly.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">5. Limitation of Liability</h2>
          <p>StoreLink provides the platform "as is". We are not a party to the transactions between buyers and vendors. We are not liable for any disputes, refunds, or damages arising from purchases made on vendor stores.</p>
        </section>

        {/* --- ✨ NEW SECTION: EMPIRE LOYALTY ENGINE --- */}
        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">6. Empire Loyalty Engine & Coins</h2>
          <p>The Empire Loyalty Engine is a reward feature exclusive to eligible subscription tiers. StoreLink reserves the absolute right to modify reward percentages, cap coin distributions, or reset loyalty data without prior notice if fraudulent activity, "coin farming," or system abuse is detected. Decisions made via the Founder Godmode regarding store status (Active/Banned) and loyalty eligibility are final.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">7. Governing Law</h2>
          <p>These terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">8. Contact Us</h2>
          <p>For any questions regarding these terms, please contact us at support@storelink.ng.</p>
        </section>
      </div>
      
    </div>
    <Footer />
    </>
  );
}