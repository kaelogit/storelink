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
  X,
  BadgeCheck,
  Banknote,
  ShoppingCart,
  Users,
} from "lucide-react";

type NavItem = { name: string; href: string; icon: typeof LayoutDashboard };
type NavSection = { title: string; items: NavItem[] };

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Commerce",
    items: [
      { name: "Storefront orders", href: "/admin/orders", icon: ShoppingCart },
      { name: "Storefront payouts", href: "/admin/payouts", icon: Banknote },
    ],
  },
  {
    title: "People",
    items: [
      { name: "Buyers", href: "/admin/buyers", icon: Users },
      { name: "Sellers", href: "/admin/stores", icon: Store },
    ],
  },
  {
    title: "Operations",
    items: [
      { name: "Verifications", href: "/admin/verifications", icon: BadgeCheck },
      { name: "Inbox / support", href: "/admin/messages", icon: Mail },
      { name: "Broadcast", href: "/admin/broadcast", icon: Megaphone },
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

function NavLinks({
  onNavigate,
  pathname,
}: {
  onNavigate?: () => void;
  pathname: string;
}) {
  return (
    <>
      {navSections.map((section) => (
        <div key={section.title} className="space-y-1">
          <p className="px-4 pt-4 pb-1 text-[9px] font-black text-gray-600 uppercase tracking-widest">{section.title}</p>
          {section.items.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onNavigate}
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
        </div>
      ))}
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#0a0a0a] border-b border-gray-800 p-4 flex justify-between items-center z-30">
        <div className="flex items-center gap-2 text-emerald-500">
          <ShieldAlert size={24} />
          <span className="font-black text-xl tracking-tight text-white">ADMIN</span>
        </div>
        <button type="button" onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg">
          <Menu size={24} />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />

          <div className="absolute inset-y-0 left-0 w-72 bg-[#0a0a0a] border-r border-gray-800 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200 overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center shrink-0">
              <span className="font-black text-xl text-white">Menu</span>
              <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 p-2 pb-8">
              <NavLinks pathname={pathname} onNavigate={() => setIsMobileMenuOpen(false)} />
            </nav>

            <div className="p-4 border-t border-gray-800 shrink-0">
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white transition-colors"
              >
                <LogOut size={18} />
                Exit to dashboard
              </Link>
            </div>
          </div>
        </div>
      )}

      <aside className="w-64 border-r border-gray-800 bg-gray-900/50 hidden md:flex flex-col fixed h-full z-20 overflow-y-auto">
        <div className="p-6 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-2 text-emerald-500">
            <ShieldAlert size={24} />
            <span className="font-black text-xl tracking-tight text-white">ADMIN</span>
          </div>
          <p className="text-[10px] text-gray-500 font-medium mt-2 leading-snug">Storefront operations</p>
        </div>

        <nav className="flex-1 p-2 pb-8">
          <NavLinks pathname={pathname} />
        </nav>

        <div className="p-4 border-t border-gray-800 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white transition-colors">
            <LogOut size={18} />
            Exit to dashboard
          </Link>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-8 pt-20 md:pt-8 overflow-y-auto">{children}</main>
    </div>
  );
}
