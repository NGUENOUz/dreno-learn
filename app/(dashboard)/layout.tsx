"use client";

import React, { useSyncExternalStore, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/SiteBar"; 
import { 
  ShoppingCart, Bell, ChevronDown, LogOut, 
  LayoutDashboard, BookOpen, GraduationCap, Heart 
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { useUserStore } from "@/store/useUserStore";
import { useCartStore, CartState } from "@/store/useCartStore";
import { createClient } from "@/lib/supabase";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const subscribe = () => () => {};
const useIsClient = () => useSyncExternalStore(subscribe, () => true, () => false);

// Items pour la BottomNav Mobile
const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/courses", icon: BookOpen, label: "Catalogue" },
  { href: "/my-courses", icon: GraduationCap, label: "Cours" },
  { href: "/favorites", icon: Heart, label: "Favoris" },
];

interface MetaInfo { title: string; sub: string; }
const PAGE_META: Record<string, MetaInfo> = {
  "/dashboard": { title: "Tableau de bord", sub: "Gérez votre progression et vos succès" },
  "/courses": { title: "Nos Formations", sub: "Apprenez avec les meilleurs experts" },
  "/my-courses": { title: "Mes Cours", sub: "Continuez votre apprentissage" },
  "/favorites": { title: "Mes Favoris", sub: "Vos formations coups de cœur" },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isClient = useIsClient();
  const pathname = usePathname();
  const router = useRouter();
  const { userData, clearUserData } = useUserStore();
  const cartItems = useCartStore((state: CartState) => state.items);

  useEffect(() => {
    if (isClient && !userData) router.replace("/login");
  }, [userData, isClient, router]);

  const handleLogout = async () => {
    const supabase = createClient();
    toast.success("Déconnexion réussie");
    clearUserData();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const meta = PAGE_META[pathname] || { title: "Espace Elite", sub: "Dreno Learn Platform" };

  if (!isClient || !userData) return null;

  return (
    <div className="flex min-h-screen bg-slate-50/50 font-sans">
      {/* SIDEBAR DESKTOP */}
      <div className="hidden lg:flex"><Sidebar /></div>
      
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 pb-20 lg:pb-0">
        <header className="h-20 md:h-24 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 md:px-10 flex items-center justify-between">
            
           {/* LOGIQUE HEADER RÉPONSIVE */}
           <div className="flex items-center gap-4">
              {/* MOBILE : Affichage du Logo uniquement */}
              <Link href="/" className="flex lg:hidden items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                  <span className="text-white font-black text-xl italic">D</span>
                </div>
                <span className="font-black text-lg tracking-tighter text-slate-900 italic uppercase">Dreno</span>
              </Link>

              {/* DESKTOP : Affichage Titre et Sous-titre */}
              <div className="hidden lg:flex flex-col">
                <h1 className="text-2xl font-black text-slate-900 tracking-tighter italic leading-none uppercase">{meta.title}</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 italic">{meta.sub}</p>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <Link href="/cart" className="relative p-2.5 text-slate-500 hover:text-blue-600 bg-white rounded-2xl border border-slate-100 shadow-sm group">
                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                  {cartItems?.length || 0}
                </span>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 pl-1 pr-1 md:pr-3 py-1 bg-white rounded-2xl border border-slate-100 outline-none">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg">
                      {userData.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-xs font-black text-slate-900 leading-none">{userData.name}</p>
                      <p className="text-[9px] font-bold text-blue-600 uppercase mt-1 tracking-tighter italic">Elite</p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 mt-4 rounded-2xl p-2 shadow-2xl border-slate-50 bg-white">
                  <DropdownMenuItem onClick={handleLogout} className="rounded-xl py-3 font-bold text-red-500 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-3" /> Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
           </div>
        </header>

        <main className="p-6 md:p-12 grow">{children}</main>

        {/* BOTTOM NAV MOBILE : RÉTABLIE */}
        <nav className="lg:hidden fixed bottom-4 left-4 right-4 h-16 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-[2rem] flex items-center justify-around px-6 z-40 shadow-2xl shadow-blue-900/10">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center relative">
                <item.icon className={`w-5 h-5 transition-all ${isActive ? "text-blue-600 scale-110" : "text-slate-400"}`} />
                {isActive && <span className="absolute -bottom-1.5 w-1 h-1 bg-blue-600 rounded-full" />}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}