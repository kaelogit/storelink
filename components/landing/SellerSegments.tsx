import { Sparkles, MessageCircle, Store, BadgeCheck } from "lucide-react";
import { STOREFRONT_GUTTER_X } from "@/lib/mobileLayout";

const segments = [
  {
    title: "From Influence to Ownership",
    body: "Turn your audience into an active customer base. Launch a gorgeous digital storefront and automate checkout instantly—no tech skills required.",
    Icon: Sparkles,
  },
  {
    title: "Standardized Operations",
    body: "Stop selling out of disorganized chat logs. Centralize your inventory, manage flat rates, and accept secure orders with a professional storefront link.",
    Icon: MessageCircle,
  },
  {
    title: "Creators & Retailers",
    body: "The definitive link-in-bio shop. Provide an elegant mobile-first shopping experience for your followers while gaining exposure on our marketplace.",
    Icon: Store,
  },
  {
    title: "Established & Verified",
    body: "Enterprise-grade performance for high-volume merchants. Unlock verified badges, elite brand positioning, and advanced multi-store logistics.",
    Icon: BadgeCheck,
  },
];

/**
 * Seller segment strips — aligned with docs/SELLER_POSITIONING_ONE_PAGER.md §Who it is for.
 */
export default function SellerSegments() {
  return (
    <section 
      className={`border-b border-gray-100 bg-white py-14 md:py-20 ${STOREFRONT_GUTTER_X}`} 
      aria-labelledby="seller-segments-heading"
    >
      <div className="max-w-7xl mx-auto">
        <h2 id="seller-segments-heading" className="sr-only">
          Who StoreLink is built for
        </h2>
        
        <p className="text-center text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 mb-8 md:mb-12">
          Tailored for modern commerce
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {segments.map(({ title, body, Icon }) => (
            <div
              key={title}
              className="group relative rounded-2xl border border-gray-100 bg-gray-50/50 p-6 md:p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-emerald-200/80 hover:bg-white hover:shadow-xl hover:shadow-emerald-50/40"
            >
              {/* Icon Container with elegant micro-gradient background */}
              <div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 text-emerald-600 transition-colors duration-300 group-hover:from-emerald-600 group-hover:to-emerald-500 group-hover:text-white">
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
              </div>
              
              {/* Title using modern tracking and semantic gray */}
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors duration-200">
                {title}
              </h3>
              
              {/* Body with balanced weight for high readability */}
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-normal">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}