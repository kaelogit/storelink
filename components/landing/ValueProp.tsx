import { X, Check } from "lucide-react";

/**
 * Problem / solution framing — Aligned with the high-end "StoreLink" identity.
 */
export default function ValueProp() {
  return (
    <section className="py-16 px-4 bg-gray-50 border-y border-gray-100" id="value-prop">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Not just another link. A real shop—with reach.
          </h2>
          <p className="text-gray-500 mt-3 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            StoreLink sits between the chaos of “DM for price” and the headache of a custom website. 
            One professional home for your <span className="text-gray-900 font-bold">storefront</span>, 
            <span className="text-gray-900 font-bold"> secure checkout</span>, and 
            <span className="text-gray-900 font-bold"> marketplace discovery</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-8 items-stretch">
          {/* The Old Way */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm opacity-70 grayscale hover:grayscale-0 transition duration-500">
            <h3 className="text-gray-900 font-black mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.15em]">
              <span className="p-1 bg-red-100 text-red-600 rounded-md">
                <X size={14} strokeWidth={3} />
              </span>{" "}
              The old way
            </h3>
            <ul className="space-y-5 text-sm text-gray-600 font-medium">
              <li className="flex gap-3 items-start">
                <span className="text-red-400 shrink-0 font-bold">✕</span>
                <span>
                  <strong className="text-gray-900">Link-in-bio sprawl</strong> — Too many links, but nowhere for a customer to actually check out.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-red-400 shrink-0 font-bold">✕</span>
                <span>
                  <strong className="text-gray-900">DM-only selling</strong> — Endless "send proof of payment" threads and zero stock visibility.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-red-400 shrink-0 font-bold">✕</span>
                <span>
                  <strong className="text-gray-900">Expensive site projects</strong> — Months of building and hosting fees just to get a basic shop live.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-red-400 shrink-0 font-bold">✕</span>
                <span>
                  <strong className="text-gray-900">Marketplace invisibility</strong> — Your brand gets lost in the grid; you’re just another row in someone else's app.
                </span>
              </li>
            </ul>
          </div>

          {/* The StoreLink Way */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-emerald-500 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-xl tracking-[0.1em] uppercase">
              The StoreLink Way
            </div>
            <h3 className="text-gray-900 font-black mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.15em]">
              <span className="p-1 bg-emerald-100 text-emerald-600 rounded-md">
                <Check size={14} strokeWidth={3} />
              </span>{" "}
              The modern merchant stack
            </h3>
            <ul className="space-y-5 text-sm text-gray-900 font-bold leading-relaxed">
              <li className="flex gap-3 items-start">
                <span className="text-emerald-500 shrink-0">✔</span>
                <span>
                  Complete storefront + checkout + orders. A professional destination for your brand.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-emerald-500 shrink-0">✔</span>
                <span>
                  Real-time catalog & stock tracking. Let your link handle the "Is this available?" questions for you.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-emerald-500 shrink-0">✔</span>
                <span>
                  Zero build time. We handle the tech and the updates so you can focus on making sales.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-emerald-500 shrink-0">✔</span>
                <span>
                  Your own branded URL + Marketplace reach. Discovery for new buyers, a direct link for regulars.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-emerald-500 shrink-0">✔</span>
                <span>
                  Growth-first commerce. Built-in tools like Store Coins to keep your customers coming back.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}