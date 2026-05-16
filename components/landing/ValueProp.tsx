import { X, Check, ArrowRight, HelpCircle, AlertCircle, Sparkles } from "lucide-react";

const comparisons = [
  {
    id: "checkout",
    label: "Storefront & Orders",
    oldProblem: "Link-in-bio sprawl with nowhere for a buyer to actually purchase anything.",
    newSolution: "A beautifully centralized checkout. Turn intent into cash on a single, branded destination page.",
  },
  {
    id: "operations",
    label: "Stock Visibility",
    oldProblem: "Endless 'Is this available?' chats and manually hunting down screenshots of payment proofs.",
    newSolution: "Real-time automated catalog tracking. Your storefront answers the questions and logs the sales while you sleep.",
  },
  {
    id: "overhead",
    label: "Setup & Maintenance",
    oldProblem: "Months of expensive engineering custom setups or fighting clunky design plugins.",
    newSolution: "Zero configuration deployment. We maintain the backend infrastructure so you can focus entirely on your product.",
  },
  {
    id: "reach",
    label: "Discovery Edge",
    oldProblem: "Absolute marketplace invisibility. Getting completely buried in standard social media feeds.",
    newSolution: "Dual-layer positioning. A private standalone URL for your core community, plus native visibility on our unified marketplace.",
  },
];

/**
 * Premium problem/solution framing — Aligned with the high-end StoreLink identity.
 */
export default function ValueProp() {
  return (
    <section className="py-20 md:py-28 bg-white border-b border-gray-100" id="value-prop">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* Header Block */}
        <div className="max-w-3xl mb-16 md:mb-24">
          
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            DMs are for chatting.<br />
            StoreLink is for business
          </h2>
          <p className="text-gray-500 mt-6 text-sm md:text-base max-w-2xl leading-relaxed font-normal">
A link-in-bio shows your links; a StoreLink moves your product. Bridge the gap between social discovery and structural checkout with a gorgeous, zero-config storefront that automates your inventory and puts your brand on a macro-marketplace.          </p>
        </div>

        {/* Master Comparison Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: The Status Quo (Minimized, muted, structural bottleneck) */}
          <div className="lg:col-span-5 space-y-4 opacity-60 hover:opacity-100 transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1 bg-red-50 text-red-500 rounded-lg">
                <AlertCircle size={14} strokeWidth={2.5} />
              </span>
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                The Disorganized Status Quo
              </span>
            </div>
            
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 space-y-6">
              {comparisons.map((item) => (
                <div key={`old-${item.id}`} className="group/item border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    <X size={12} className="text-red-400 shrink-0" strokeWidth={3} />
                    {item.label}
                  </div>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed pl-5">
                    {item.oldProblem}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* INTERSECTION: Vector Arrow indicator for large viewports */}
          <div className="hidden lg:flex lg:col-span-1 items-center justify-center pt-32 text-gray-300">
            <ArrowRight size={24} strokeWidth={1.5} className="animate-pulse" />
          </div>

          {/* RIGHT COLUMN: The StoreLink Infrastructure (Hero state, elevated, premium shadows) */}
          <div className="lg:col-span-6 relative">
            <div className="absolute -top-3 -right-2 z-10 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-full tracking-widest uppercase shadow-md shadow-emerald-600/20 flex items-center gap-1">
              <Sparkles size={10} /> Optimal Stack
            </div>

            <div className="rounded-3xl border-2 border-gray-900 bg-gray-900 p-6 md:p-8 space-y-6 shadow-2xl shadow-emerald-900/10 ring-4 ring-emerald-500/10">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-4 mb-2">
                <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <Check size={16} strokeWidth={2.5} />
                </span>
                <div>
                  <span className="block text-[11px] font-black uppercase tracking-widest text-emerald-400">
                    The Unified Architecture
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">Engineered for seamless digital distribution</span>
                </div>
              </div>

              <div className="space-y-6">
                {comparisons.map((item) => (
                  <div key={`new-${item.id}`} className="group/solution transition-all duration-300">
                    <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover/solution:scale-125 transition-transform" />
                      {item.label}
                    </h4>
                    <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-normal pl-3 border-l border-zinc-800 group-hover/solution:border-emerald-500/50 transition-colors">
                      {item.newSolution}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Extra Retention/Growth Hook Value Row */}
              <div className="mt-4 pt-4 border-t border-zinc-800 flex items-start gap-3 bg-zinc-800/20 p-4 rounded-xl border border-zinc-800/50">
                <span className="text-emerald-400 text-xs mt-0.5">✦</span>
                <p className="text-[11px] md:text-xs text-zinc-400 leading-relaxed">
                  <strong className="text-white font-bold">Growth Incentive Protocol:</strong> Built-in multi-merchant tools, direct catalog exports, and automated consumer reward points framework come active natively.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}