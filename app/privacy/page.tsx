import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM } from "@/lib/mobileLayout";

const CANONICAL_PRIVACY = "https://storelink.ng/privacy/ng";
const CANONICAL_TERMS = "https://storelink.ng/terms/ng";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />

      <div className={`mx-auto max-w-4xl py-16 font-sans text-gray-800 ${STOREFRONT_GUTTER_X} ${STOREFRONT_SAFE_BOTTOM}`}>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900">Privacy Policy — StoreLink Shop</h1>
        <p className="mb-6 text-sm text-gray-500">Last updated: May 10, 2026</p>

        <aside className="mb-10 rounded-2xl border border-sky-200 bg-sky-50/80 p-5 text-sm leading-relaxed text-sky-950">
          <p className="font-bold text-sky-900">Scope</p>
          <p className="mt-2">
            This policy describes how we handle personal data when you use the <strong>StoreLink web storefront</strong> only
            (shopping, checkout, seller shop management on our shop domains). The StoreLink <strong>mobile app</strong> may
            collect additional categories (for example seller verification flows). Its privacy disclosures are in the
            country-specific policy at{" "}
            <a href={CANONICAL_PRIVACY} className="font-semibold text-emerald-800 underline underline-offset-2">
              {CANONICAL_PRIVACY}
            </a>
            . If anything in this Shop notice conflicts with that document for data collected <em>outside</em> the Shop, the
            main policy controls for those activities.
          </p>
        </aside>

        <div className="space-y-10 leading-relaxed">
          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900">1. Data we collect on the Shop</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Account &amp; profile:</strong> email, password hash (held by our auth provider), name, phone, and
                profile fields you edit in the seller dashboard or account settings on the Shop.
              </li>
              <li>
                <strong>Commerce:</strong> cart contents, delivery address you enter or select, order line items, amounts,
                currency, Store Coin redemptions where applicable, and Paystack references (we do not store full card numbers).
              </li>
              <li>
                <strong>Technical:</strong> IP address, device/browser type, pages viewed, and diagnostic logs needed for
                security and reliability.
              </li>
              <li>
                <strong>Local storage on your device:</strong> we may store cart or billing-form helpers (for example
                delivery details you chose to save) in the browser; see section 4.
              </li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              The Shop checkout experience does <strong>not</strong> use the mobile app&apos;s government-ID or biometric
              verification flows. Those exist only where you use the native app and are covered under{" "}
              <a href={CANONICAL_PRIVACY} className="font-semibold text-emerald-800 underline underline-offset-2">
                {CANONICAL_PRIVACY}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900">2. How we use it</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>To authenticate you, run checkout, create orders, and show order history.</li>
              <li>To pay sellers, detect fraud, reconcile payments, and meet accounting and legal obligations.</li>
              <li>
                To send <strong>transactional</strong> messages: verification, password reset, order and payment
                confirmations, seller checkout alerts, and important service notices.
              </li>
              <li>To improve the Shop using aggregated or de-identified analytics.</li>
              <li>Where you have opted in to marketing, to send promotional content you can withdraw from in settings.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900">3. Sharing &amp; processors</h2>
            <p>
              We do not sell your personal data. We share it with processors required to run the Shop, including{" "}
              <strong>Supabase</strong> (database and authentication), <strong>Paystack</strong> (payments), email delivery
              providers such as <strong>Resend</strong>, and hosting/analytics infrastructure (for example{" "}
              <strong>Vercel</strong>, <strong>Google</strong> where measurement tags are enabled). They process data under
              contract and only to provide their service.
            </p>
            <p className="mt-3">
              Sellers receive the order and contact details needed to fulfil your purchase. Do not misuse another
              user&apos;s information.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900">4. Cookies &amp; browser storage</h2>
            <p>
              We use cookies and similar technologies for login sessions, security (for example CSRF protection), and
              preferences. We may use <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">localStorage</code> for
              cart state and optional saved billing fields. You can clear site data in your browser; some features will not
              work without cookies or storage where technically required.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900">5. Retention &amp; security</h2>
            <p>
              We keep order and account records for as long as needed for legal, tax, fraud-prevention, and dispute-resolution
              purposes, then delete or anonymise where appropriate. We apply reasonable technical and organisational
              safeguards; no online service is perfectly secure.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900">6. Your rights (Nigeria &amp; general)</h2>
            <p className="mb-3">
              Under the Nigeria Data Protection Act (NDPA) and related rules, you may have rights to access, rectify, erase,
              restrict processing, or object in defined circumstances, and to lodge a concern with the Nigeria Data Protection
              Commission where applicable.
            </p>
            <p>
              For Shop data, start with your account settings on the Shop. For broader requests that span the app and main
              site, contact{" "}
              <a href="mailto:support@storelink.ng" className="font-semibold text-emerald-800 underline underline-offset-2">
                support@storelink.ng
              </a>{" "}
              and we will route your request appropriately.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900">7. International transfers</h2>
            <p>
              Our processors may process data in Nigeria, the European Economic Area, the United States, or other regions
              where they operate. We rely on appropriate safeguards (such as standard contractual clauses or equivalent
              measures) where transfers require them.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900">8. Children</h2>
            <p>
              The Shop is not directed at children under 16. If you believe we have collected a child&apos;s data in error,
              contact us and we will delete it where the law requires.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900">9. Changes</h2>
            <p>
              We may update this Shop privacy notice. We will revise the date above and, for material changes, provide notice
              on the Shop or by email where practical.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900">10. Contact</h2>
            <p>
              Privacy questions for the Shop:{" "}
              <a href="mailto:support@storelink.ng" className="font-semibold text-emerald-800 underline underline-offset-2">
                support@storelink.ng
              </a>
              . Shop-specific terms on this site:{" "}
              <a href="/terms" className="font-semibold text-emerald-800 underline underline-offset-2">
                /terms
              </a>
              . Full-platform privacy (mobile app, main site, country variants):{" "}
              <a href={CANONICAL_PRIVACY} className="font-semibold text-emerald-800 underline underline-offset-2">
                {CANONICAL_PRIVACY}
              </a>
              . Main legal hub for terms:{" "}
              <a href={CANONICAL_TERMS} className="font-semibold text-emerald-800 underline underline-offset-2">
                {CANONICAL_TERMS}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
