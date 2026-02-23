"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/SiteBar"; 
import { ShoppingCart, Bell, ChevronDown, LogOut, User, Search } from "lucide-react";
import Link from "next/link"; // Correction de l'import Link (Next.js)
import { useUserStore } from "@/store/useUserStore";
import { useCartStore } from "@/store/useCartStore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const PAGE_META = {
  "/dashboard": { title: "Tableau de bord", sub: "Gérez votre progression et vos succès" },
  "/courses": { title: "Nos Formations", sub: "Apprenez avec les meilleurs experts du continent" },
  "/my-courses": { title: "Mes Cours", sub: "Reprenez votre apprentissage là où vous l'avez laissé" },
  "/favorites": { title: "Mes Favoris", sub: "Retrouvez vos formations préférées" },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userData, clearUserData } = useUserStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cartItems = useCartStore((state: any) => state.items);

  const meta = PAGE_META[pathname] || { title: "Dreno Learn", sub: "La référence d'élite" };

  return (
    <div className="flex min-h-screen bg-slate-50/50 font-sans">
      <div className="hidden lg:flex"><Sidebar /></div>
      
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <header className="h-24 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 md:px-10 flex items-center justify-between">
            
           {/* TITRE DYNAMIQUE ÉPURÉ */}
           <div className="flex flex-col">
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none italic">
                {meta.title}
              </h1>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">
                {meta.sub}
              </p>
           </div>

           <div className="flex items-center gap-5">
              {/* PANIER (0 par défaut) */}
              <Link href="/cart" className="relative p-2.5 text-slate-400 hover:text-blue-600 transition-all">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center">
                  {cartItems.length}
                </span>
              </Link>

              <button className="p-2.5 text-slate-400 hover:text-blue-600 hidden sm:block">
                <Bell className="w-5 h-5" />
              </button>

              <div className="h-8 w-px bg-slate-100 mx-1 md:mx-2" />

              {/* LOGIQUE AUTH : Affiche Profil OU S'inscrire */}
              {userData ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <div className="flex items-center gap-3 p-1.5 pr-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all group">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-100 group-active:scale-95 transition-transform">
                        {userData.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-bold text-slate-900 leading-none">{userData.name}</p>
                        <p className="text-[9px] font-bold text-blue-600 uppercase mt-1 tracking-tighter">Membre Elite</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60 mt-4 rounded-2xl p-2 shadow-2xl border-slate-50 bg-white">
                     <DropdownMenuItem onClick={() => { clearUserData(); router.push("/login"); }} className="rounded-xl py-3 font-bold text-red-500 cursor-pointer focus:bg-red-50">
                        <LogOut className="w-4 h-4 mr-3" /> Déconnexion
                     </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-12 px-8 font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 transition-all active:scale-95">
                  <Link href="/register">S&apos;inscrire</Link>
                </Button>
              )}
           </div>
        </header>

        <main className="p-6 md:p-10 grow">{children}</main>
      </div>
    </div>
  );
}