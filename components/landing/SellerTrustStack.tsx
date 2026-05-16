import { Receipt, CreditCard, ClipboardList, Shield } from "lucide-react";
import { STOREFRONT_GUTTER_X } from "@/lib/mobileLayout";

const pillars = [
  {
    title: "Structured checkout",
    body: "Buyers pay through StoreLink checkout—fewer “send proof” loops and a clearer record for both sides.",
    Icon: CreditCard,
  },
  {
    title: "Orders you can defend",
    body: "Statuses and history in one place so fulfilment, refunds, and disputes are not buried in chat screenshots.",
    Icon: ClipboardList,
  },
  {
    title: "Receipts, not vibes",
    body: "Commerce infrastructure for selling—not accounting software, but a paper trail your customers can trust.",
    Icon: Receipt,
  },
  {
    title: "Trust you can earn",
    body: "Verification and safety tooling sit alongside your shop so serious buyers know how you operate.",
    Icon: Shield,
  },
];

/**
 * Seller-facing trust & safety narrative (complements buyer-focused `TrustCenter`).
 * Aligned with docs/SELLER_POSITIONING_ONE_PAGER.md §What we should never imply (honest scope).
 */
export default function SellerTrustStack() {
  return (
    <section className={`bg-white py-16 md:py-20 ${STOREFRONT_GUTTER_X}`} aria-labelledby="seller-trust-heading">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-10 md:mb-14">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 mb-3">Trust &amp; operations</p>
          <h2 id="seller-trust-heading" className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
            Built for sellers who need receipts,{" "}
            <span className="text-emerald-600">not excuses.</span>
          </h2>
          <p className="mt-4 text-gray-600 text-sm md:text-base leading-relaxed font-medium">
            StoreLink does not replace your accountant or lawyer—but it does give you a serious checkout and order layer
            so you look as professional as you already are.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {pillars.map(({ title, body, Icon }) => (
            <div
              key={title}
              className="flex gap-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-6 md:p-8 transition hover:border-gray-200 hover:bg-white"
            >
              <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 text-white">
                <Icon className="h-6 w-6" strokeWidth={2} aria-hidden />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 tracking-tight mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
