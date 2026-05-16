import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM } from "@/lib/mobileLayout";
import Link from "next/link";

const CANONICAL_TERMS = "https://storelink.ng/terms/ng";
const CANONICAL_PRIVACY = "https://storelink.ng/privacy/ng";

export default function TermsPage() {
  return (
    <>
      <Navbar />

      <div className={`mx-auto max-w-4xl py-16 font-sans text-gray-800 ${STOREFRONT_GUTTER_X} ${STOREFRONT_SAFE_BOTTOM}`}>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900">Terms of Service — StoreLink Shop</h1>
        <p className="mb-6 text-sm text-gray-500">Last updated: May 10, 2026</p>

        <aside className="mb-10 rounded-2xl border border-amber-200 bg-amber-50/80 p-5 text-sm leading-relaxed text-amber-950">
          <p className="font-bold text-amber-900">Scope</p>
          <p className="mt-2">
            These terms apply only when you use the <strong>StoreLink web storefront</strong> (the shopping experience and
            related seller dashboard pages served from our shop domains, for example{" "}
            <span className="whitespace-nowrap">shop.storelink.ng</span> and seller shop URLs). They do{" "}
            <strong>not</strong> replace the legal documents that govern the StoreLink mobile app and the main StoreLink
            marketing site. For those, read the country-specific terms at{" "}
            <a href={CANONICAL_TERMS} className="font-semibold text-emerald-800 underline underline-offset-2">
              {CANONICAL_TERMS}
            </a>{" "}
            (and linked country variants from that page).
          </p>
        </aside>

        <div className="space-y-10 leading-relaxed">
          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900">1. Who we are</h2>
            <p>
              In these terms, &quot;StoreLink&quot;, &quot;we&quot;, and &quot;us&quot; mean the operator of the StoreLink Shop
              web experience. You are &quot;you&quot;, whether you browse, buy, or use seller tools on the storefront.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900">2. Accepting these terms</h2>
            <p>
              By using the storefront (including creating an account, listing products, or completing checkout), you agree to
              these terms and to our Shop privacy notice at{" "}
              <Link href="/privacy" className="font-semibold text-emerald-800 underline underline-offset-2">
                /privacy
              </Link>
              . If you disagree, do not use the Shop.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900">3. Accounts &amp; checkout</h2>
            <p className="mb-3">
              Checkout on the Shop requires a StoreLink account. You must provide accurate name, contact, delivery, and payment
              details. You are responsible for safeguarding your password and for activity on your account.
            </p>
            <p>
              We may suspend or restrict accounts that appear fraudulent, abusive, or in breach of these terms or applicable
              law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900">4. Buyers, sellers &amp; your contract</h2>
            <p>
              The Shop connects independent sellers with buyers. When you purchase from a seller&apos;s store, the contract
              for the goods or services is between you and that seller. StoreLink provides infrastructure: listings, cart,
              checkout, order records, notifications, and (where enabled) loyalty tools such as Store Coins. We are not the
              merchant of every item unless we expressly say so on a given listing.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900">5. Payments, fees &amp; Paystack</h2>
            <p className="mb-3">
              Card and bank payments are processed by <strong>Paystack</strong> (or another processor we enable). We do not
              store your full card number on StoreLink servers.
            </p>
            <p className="mb-3">
              <strong>Buyer:</strong> You pay the total shown at checkout after any eligible discounts (for example Store
              Coins).
            </p>
            <p className="mb-3">
              <strong>Seller settlement:</strong> From the eligible cash amount charged at checkout, StoreLink may retain a{" "}
              <strong>platform fee of 2.5%</strong> and illustrate payment processing as about{" "}
              <strong>1.5%</strong> (together about <strong>4%</strong> of that cash amount for typical NGN storefront
              checkouts), in line with automatic payout logic. Paystack&apos;s own invoices can vary slightly by method; see
              their published rates. In-product estimates explain why settlement can be less than the order total.
            </p>
            <p>
              <strong>Subscriptions:</strong> Paid seller plans or visibility products are billed as described at purchase.
              Failed or disputed charges may affect access to paid features.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900">6. Prohibited listings &amp; conduct</h2>
            <p>
              Sellers must not offer illegal items, counterfeits, or fraudulent services. Buyers must not abuse chargebacks,
              the loyalty system, or other users. We may remove listings, withhold payouts where justified, or suspend stores
              or accounts for serious or repeated breaches.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900">7. Store Coins</h2>
            <p>
              Store Coin loyalty is optional and tier-dependent. We may adjust percentages, caps, or eligibility to prevent
              fraud or misuse. Product-specific rules shown in the Shop prevail where they conflict with general marketing
              copy.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900">8. Disclaimers &amp; liability</h2>
            <p>
              The Shop is provided &quot;as is&quot; to the fullest extent permitted by law. We are not responsible for
              disputes between buyers and sellers, courier delays, or faults of third-party payment or hosting providers.
              Nothing here limits liability that cannot legally be limited (including death or personal injury caused by our
              negligence where applicable).
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900">9. Changes</h2>
            <p>
              We may update these Shop terms. The &quot;Last updated&quot; date at the top will change, and we may notify you
              by email or in-product notice for material changes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900">10. Governing law</h2>
            <p>
              These terms are governed by the laws of the <strong>Federal Republic of Nigeria</strong>, without prejudice to
              mandatory consumer protections in your country of residence.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900">11. Contact</h2>
            <p>
              Shop-specific questions:{" "}
              <a href="mailto:support@storelink.ng" className="font-semibold text-emerald-800 underline underline-offset-2">
                support@storelink.ng
              </a>
              . For app-wide legal questions, use the contacts or processes described on{" "}
              <a href={CANONICAL_TERMS} className="font-semibold text-emerald-800 underline underline-offset-2">
                {CANONICAL_TERMS}
              </a>{" "}
              and{" "}
              <a href={CANONICAL_PRIVACY} className="font-semibold text-emerald-800 underline underline-offset-2">
                {CANONICAL_PRIVACY}
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
