"use client";
import { Zap, Crown, Target, Gift } from "lucide-react";

export default function SubscriptionBreakdown({ stats }: { stats: any }) {
  const PRICE_PREMIUM = 2500;
  const PRICE_DIAMOND = 4000;

  const plans = [
    { 
      name: "Free Tier", 
      count: stats?.free_count || 0, 
      price: 0,
      color: "from-gray-500 to-gray-700",
      icon: <Target className="text-gray-400" size={20}/> 
    },
    { 
      name: "Premium (Paid)", 
      count: stats?.paid_premium_count || 0, 
      price: PRICE_PREMIUM,
      color: "from-blue-500 to-indigo-600",
      icon: <Zap className="text-blue-400" size={20}/> 
    },
    { 
      name: "Diamond (Paid)", 
      count: stats?.paid_diamond_count || 0, 
      price: PRICE_DIAMOND,
      color: "from-purple-500 to-pink-600",
      icon: <Crown className="text-yellow-400" size={20}/> 
    },
    { 
      name: "Gifted/Trial", 
      count: stats?.trial_count || 0, 
      price: 0,
      color: "from-amber-400 to-orange-500",
      icon: <Gift className="text-amber-400" size={20}/> 
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      {plans.map((plan) => {
        const earnings = plan.count * plan.price;
        
        return (
          <div key={plan.name} className="relative overflow-hidden bg-gray-900/40 border border-gray-800 p-5 rounded-3xl flex items-center justify-between group hover:border-emerald-500/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${plan.color} bg-opacity-10`}>
                {plan.icon}
              </div>
              <div>
                <h4 className="text-white font-black text-sm uppercase tracking-tight italic">{plan.name}</h4>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                    {plan.count} Vendors • 
                    <span className="ml-1">₦{plan.price.toLocaleString()}/mo</span>
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Real Income</p>
              <p className={`text-lg font-black ${earnings > 0 ? 'text-emerald-400' : 'text-white'} italic tracking-tighter`}>
                {earnings > 0 ? `₦${earnings.toLocaleString()}` : "₦0"}
              </p>
            </div>

            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity w-full" />
          </div>
        );
      })}
    </div>
  );
}