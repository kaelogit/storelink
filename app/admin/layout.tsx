"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Store, 
  Mail, 
  ShieldAlert, 
  LogOut, 
  Settings, 
  Megaphone 
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Manage Stores", href: "/admin/stores", icon: Store },
    { name: "Inbox / Support", href: "/admin/messages", icon: Mail },
    { name: "Broadcast", href: "/admin/broadcast", icon: Megaphone }, // 👈 Updated Icon
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <aside className="w-64 border-r border-gray-800 bg-gray-900/50 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800">
           <div className="flex items-center gap-2 text-emerald-500">
             <ShieldAlert size={24} />
             <span className="font-black text-xl tracking-tight text-white">FOUNDER</span>
           </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <link.icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white transition-colors">
            <LogOut size={18} />
            Exit to Vendor Mode
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}