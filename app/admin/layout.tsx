"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Store, 
  Mail, 
  ShieldAlert, 
  LogOut, 
  Settings, 
  Megaphone,
  Menu,
  X   
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 👈 State for mobile toggle

  const links = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Manage Stores", href: "/admin/stores", icon: Store },
    { name: "Inbox / Support", href: "/admin/messages", icon: Mail },
    { name: "Broadcast", href: "/admin/broadcast", icon: Megaphone },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      
      {/* 📱 MOBILE HEADER (New - Only visible on phone) */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#0a0a0a] border-b border-gray-800 p-4 flex justify-between items-center z-30">
         <div className="flex items-center gap-2 text-emerald-500">
            <ShieldAlert size={24} />
            <span className="font-black text-xl tracking-tight text-white">FOUNDER</span>
         </div>
         <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg">
            <Menu size={24} />
         </button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
           <div 
             className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
             onClick={() => setIsMobileMenuOpen(false)}
           />
           
           <div className="absolute inset-y-0 left-0 w-64 bg-[#0a0a0a] border-r border-gray-800 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                 <span className="font-black text-xl text-white">Menu</span>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg">
                    <X size={24} />
                 </button>
              </div>

              <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
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
                <Link 
                   href="/dashboard" 
                   onClick={() => setIsMobileMenuOpen(false)}
                   className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white transition-colors"
                >
                  <LogOut size={18} />
                  Exit to Vendor Mode
                </Link>
              </div>
           </div>
        </div>
      )}

      {/* 💻 DESKTOP SIDEBAR (Your Exact Original Code) */}
      <aside className="w-64 border-r border-gray-800 bg-gray-900/50 hidden md:flex flex-col fixed h-full z-20">
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

      <main className="flex-1 md:ml-64 p-8 pt-20 md:pt-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}