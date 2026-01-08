"use client";

import { UserPlus, PlusSquare, Share2, Zap, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    { 
      icon: UserPlus, 
      title: "1. Deploy Your Store", 
      desc: "Register in 60 seconds. No technical skills or laptop required.",
      accent: "bg-blue-500"
    },
    { 
      icon: PlusSquare, 
      title: "2. Stock Your Vault", 
      desc: "Upload photos and set prices. Make your brand look professional instantly.",
      accent: "bg-emerald-500"
    },
    { 
      icon: Share2, 
      title: "3. Broadcast & Close", 
      desc: "Post your link to Bio & Status. Close sales automatically via WhatsApp.",
      accent: "bg-amber-500"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full mb-4 border border-emerald-100">
            <Zap size={14} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-widest">Speed to Market</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter leading-none">
            Start Selling <br /><span className="text-emerald-600 italic">In Minutes.</span>
          </h2>
        </div>
        
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-gray-100 -translate-y-24 z-0"></div>

          {steps.map((step, i) => (
            <div 
              key={i} 
              className="group relative flex flex-col items-center text-center p-8 rounded-[2.5rem] bg-white border border-gray-100 hover:border-emerald-500/30 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 z-10"
            >
              {/* Step Number Badge */}
              <div className="absolute top-6 right-8 text-4xl font-black text-gray-50 opacity-0 group-hover:opacity-100 group-hover:text-emerald-500/10 transition-all duration-500">
                0{i + 1}
              </div>

              <div className={`w-20 h-20 ${step.accent} text-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                <step.icon size={32} strokeWidth={2.5} />
              </div>

              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4">
                {step.title}
              </h3>
              
              <p className="text-gray-500 font-bold leading-relaxed mb-6">
                {step.desc}
              </p>

              {/* Mobile Arrow indicator */}
              <div className="md:hidden text-emerald-500 mt-2">
                <ArrowRight className="rotate-90" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA for the Section */}
        <div className="mt-20 text-center">
          <button className="inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95 group">
            Create My Store <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}