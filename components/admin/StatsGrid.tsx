"use client";
import { Users, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";

export default function StatsGrid({ stats }: { stats: any }) {
  const items = [
    { label: "Total Stores", value: stats?.total_stores, icon: Users, color: "text-blue-400" },
    { label: "Total Products", value: stats?.total_products, icon: ShoppingBag, color: "text-purple-400" },
    { label: "Orders", value: stats?.total_orders, icon: TrendingUp, color: "text-yellow-400" },
    
    { 
      label: "Revenue (GMV)", 
      value: `₦${stats?.platform_gmv?.toLocaleString() || '0'}`, 
      icon: DollarSign, 
      color: "text-emerald-400" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {items.map((item, idx) => (
        <div key={idx} className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">{item.label}</span>
            <div className={`p-2 rounded-lg bg-opacity-10 ${item.color.replace('text-', 'bg-')}`}>
               <item.icon className={item.color} size={20} />
            </div>
          </div>
          <p className="text-3xl font-black text-white tracking-tight">{item.value || 0}</p>
        </div>
      ))}
    </div>
  );
}