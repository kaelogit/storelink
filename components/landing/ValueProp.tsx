import { X, Check } from "lucide-react";

export default function ValueProp() {
  return (
    <section className="py-16 px-4 bg-gray-50 border-y border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">From scattered selling to owned storefront growth</h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Launch a professional storefront without custom website costs, then grow with marketplace visibility.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-8 items-stretch">
          
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm opacity-60 grayscale hover:grayscale-0 transition duration-500">
            <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
              <span className="p-1 bg-red-100 text-red-600 rounded-md"><X size={16}/></span> The Old Way
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 font-medium">
              <li className="flex gap-3 items-start"><span className="text-red-400 mt-0.5">✕</span> No branded storefront, just scattered selling links.</li>
              <li className="flex gap-3 items-start"><span className="text-red-400 mt-0.5">✕</span> High cost and stress of building a custom website alone.</li>
              <li className="flex gap-3 items-start"><span className="text-red-400 mt-0.5">✕</span> Growth limited to only people already in your contacts.</li>
            </ul>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-emerald-500 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">PRO</div>
            <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
              <span className="p-1 bg-emerald-100 text-emerald-600 rounded-md"><Check size={16}/></span> The StoreLink Way
            </h3>
            <ul className="space-y-3 text-sm text-gray-900 font-bold">
              <li className="flex gap-3 items-start"><span className="text-emerald-500 mt-0.5">✔</span> Own a professional storefront with one branded link.</li>
              <li className="flex gap-3 items-start"><span className="text-emerald-500 mt-0.5">✔</span> Affordable digital infrastructure without custom-build headaches.</li>
              <li className="flex gap-3 items-start"><span className="text-emerald-500 mt-0.5">✔</span> Marketplace distribution to attract buyers beyond your existing network.</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}