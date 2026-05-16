import { Sparkles, MessageCircle, Store, BadgeCheck } from "lucide-react";
import { STOREFRONT_GUTTER_X } from "@/lib/mobileLayout";

const segments = [
  {
    title: "From Influence to Ownership",
    body: "Transform your personal brand into an official storefront. Launch a complete catalog and checkout system without the cost of custom development.",
    Icon: Sparkles,
  },
  {
    title: "Standardized Operations",
    body: "Upgrade your sales process. Centralize your stock, pricing, and order history on one professional link that buyers can trust.",
    Icon: MessageCircle,
  },
  {
    title: "Creators & Retailers",
    body: "The definitive shop link for your profile. Provide a seamless shopping experience for your audience and gain visibility on our marketplace.",
    Icon: Store,
  },
  {
    title: "Established & Verified",
    body: "Premium features for high-volume brands, including verification paths and advanced management tools for serious merchants.",
    Icon: BadgeCheck,
  },
];

/**
 * Seller segment strips — aligned with docs/SELLER_POSITIONING_ONE_PAGER.md §Who it is for.
 */
export default function SellerSegments() {
  return (
    <section className={`border-b border-gray-100 bg-white py-10 md:py-12 ${STOREFRONT_GUTTER_X}`} aria-labelledby="seller-segments-heading">
      <div className="max-w-7xl mx-auto">
        <h2 id="seller-segments-heading" className="sr-only">
          Who StoreLink is built for
        </h2>
        <p className="text-center text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-6">
          Tailored for modern commerce
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {segments.map(({ title, body, Icon }) => (
            <div
              key={title}
              className="rounded-2xl border border-gray-100 bg-gray-50/80 p-5 md:p-6 shadow-sm transition hover:border-emerald-200 hover:bg-white"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Icon className="h-5 w-5" strokeWidth={2.2} aria-hidden />
              </div>
              <h3 className="text-sm font-black uppercase tracking-tight text-gray-900 mb-2">{title}</h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}