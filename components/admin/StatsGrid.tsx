"use client";
import { Users, ShoppingBag, DollarSign, TrendingUp, Zap, CreditCard } from "lucide-react";

export default function StatsGrid({ stats }: { stats: any }) {
  const items = [
    { label: "Total Stores", value: stats?.total_stores, icon: Users, color: "text-blue-400" },
    { label: "Total Products", value: stats?.total_products, icon: ShoppingBag, color: "text-purple-400" },
    
    { 
      label: "Platform Earnings", 
      value: `₦${stats?.platform_earnings?.toLocaleString() || '0'}`, 
      icon: CreditCard, 
      color: "text-emerald-400" 
    },
    
    { 
      label: "Trial Accounts", 
      value: stats?.total_trials || 0, 
      icon: Zap, 
      color: "text-amber-400" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {items.map((item, idx) => (
        <div key={idx} className="bg-gray-900/40 border border-gray-800 p-6 rounded-3xl backdrop-blur-sm transition-all hover:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
            <div className={`p-2.5 rounded-xl bg-opacity-10 ${item.color.replace('text-', 'bg-')}`}>
               <item.icon className={item.color} size={18} />
            </div>
          </div>
          <p className="text-3xl font-black text-white tracking-tighter italic">{item.value || 0}</p>
        </div>
      ))}
    </div>
  );
}