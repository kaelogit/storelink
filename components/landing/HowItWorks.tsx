import { UserPlus, PlusSquare, Share2 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    { icon: UserPlus, title: "1. Create Account", desc: "Sign up in 30 seconds." },
    { icon: PlusSquare, title: "2. Add Products", desc: "Snap photos & set prices." },
    { icon: Share2, title: "3. Share Link", desc: "Post to WhatsApp Status." }
  ];

  return (
    <section className="py-12 md:py-20 px-4 bg-white border-y border-gray-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-8">Start Selling in Minutes</h2>
        
        <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-4 pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide">
          
          {steps.map((step, i) => (
            <div key={i} className="min-w-[80%] md:min-w-0 snap-center flex flex-col items-center text-center p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center mb-3 shadow-md">
                <step.icon size={20} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">{step.title}</h3>
              <p className="text-sm text-gray-500">{step.desc}</p>
            </div>
          ))}
          
        </div>
      </div>
    </section>
  );
}