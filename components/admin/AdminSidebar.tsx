"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ShoppingBag, Settings, LogOut, ShieldCheck } from "lucide-react";

const menuItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Manage Stores", href: "/admin/stores", icon: Users },
  { name: "Platform Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-950 border-r border-gray-800 fixed h-full flex flex-col">
      <div className="p-6 border-b border-gray-800 flex items-center gap-3">
        <ShieldCheck className="text-emerald-500" size={28} />
        <div>
          <h1 className="font-bold text-lg tracking-tight">StoreLink</h1>
          <span className="text-xs text-emerald-500 font-mono">GOD MODE</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? "bg-emerald-600/10 text-emerald-400 border border-emerald-600/20" 
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <a href="/" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white transition text-sm">
           <LogOut size={18} /> Exit Admin
        </a>
      </div>
    </div>
  );
}