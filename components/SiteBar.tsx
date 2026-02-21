"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Settings, 
  BarChart3,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
  { name: "Tableau de bord", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Catalogue", icon: BookOpen, href: "/courses" },
  { name: "Mes Cours", icon: GraduationCap, href: "/my-courses" },
  { name: "Favoris", icon: Heart, href: "/favorites" },
  { name: "Statistiques", icon: BarChart3, href: "/analytics" },
  { name: "Paramètres", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col fixed left-0 top-0 h-screen bg-white border-r border-slate-100 z-40">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">D</span>
          </div>
          <span className="text-xl font-black text-slate-900">Dreno<span className="text-blue-600">learn</span></span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all",
              pathname === item.href 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-blue-50 p-4 rounded-2xl">
          <p className="text-[11px] font-bold text-blue-600 uppercase mb-2">Offre Premium</p>
          <p className="text-xs text-slate-600 mb-3 font-medium">Accédez à toutes les formations en illimité.</p>
          <button className="w-full py-2 bg-blue-600 text-white text-[10px] font-black rounded-lg uppercase">Passer Pro</button>
        </div>
      </div>
    </aside>
  );
}