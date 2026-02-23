"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Menu, Heart, ChevronDown, LogOut, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Imports des stores et utilitaires
import { useUserStore } from "@/store/useUserStore";
import { useCartStore, CartState } from "@/store/useCartStore";
import { createClient } from "@/lib/supabase";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Hook pour éviter les erreurs d'hydratation entre serveur et localStorage
const subscribe = () => () => {};
const useIsClient = () => useSyncExternalStore(subscribe, () => true, () => false);

export function Header() {
  const isClient = useIsClient();
  const router = useRouter();
  
  // Accès aux états globaux
  const { userData, clearUserData } = useUserStore();
  const cartItems = useCartStore((state: CartState) => state.items);

  // Logique de déconnexion experte avec toast
  const handleLogout = async () => {
    const supabase = createClient();
    toast.success("Déconnexion réussie");
    clearUserData();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
        
        {/* LOGO ÉPURÉ */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-xl italic">D</span>
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">
            Dreno<span className="text-blue-600">learn</span>
          </span>
        </Link>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">
          <Link href="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
          <Link href="/courses" className="hover:text-blue-600 transition-colors">Formations</Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors">Support</Link>
        </nav>

        {/* ACTIONS & AUTH */}
        <div className="flex items-center gap-2 md:gap-5">
          
          {/* Icônes de confort (Visibles si monté) */}
          {isClient && (
            <div className="flex items-center gap-1 md:gap-3">
              <button className="p-2.5 text-slate-400 hover:text-blue-600 transition-all rounded-xl hover:bg-slate-50">
                <Search className="w-5 h-5" />
              </button>
              
              <Link href="/cart" className="p-2.5 text-slate-400 hover:text-blue-600 transition-all rounded-xl hover:bg-slate-50 relative group">
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white">
                  {cartItems.length}
                </span>
              </Link>
            </div>
          )}

          <div className="h-8 w-px bg-slate-100 mx-1 hidden sm:block" />

          {/* LOGIQUE DYNAMIQUE : Profil vs Inscription */}
          {isClient && userData ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 pl-1 pr-3 py-1 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all outline-none group">
                  <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg">
                    {userData.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-[11px] font-black text-slate-900 leading-none truncate max-w-[100px] uppercase">{userData.name}</p>
                    <p className="text-[9px] font-bold text-blue-600 mt-1 uppercase tracking-tighter italic">Élite</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-300" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 mt-4 rounded-2xl p-2 shadow-2xl border-slate-50 bg-white">
                <DropdownMenuItem asChild className="rounded-xl py-3 font-bold text-slate-700 cursor-pointer focus:bg-blue-50 focus:text-blue-600">
                  <Link href="/dashboard" className="flex items-center w-full">
                    <User className="w-4 h-4 mr-3" /> Mon Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="rounded-xl py-3 font-bold text-red-500 cursor-pointer focus:bg-red-50">
                  <LogOut className="w-4 h-4 mr-3" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" asChild className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600">
                <Link href="/login">Connexion</Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-11 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 transition-all active:scale-95">
                <Link href="/register">S&apos;inscrire</Link>
              </Button>
            </div>
          )}

          {/* MENU MOBILE */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-900 bg-slate-50 rounded-xl w-11 h-11">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[350px] bg-white border-l-0 p-8">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-12">
                     <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic">D</div>
                     <span className="font-black text-xl italic uppercase tracking-tighter">DrenoLearn</span>
                  </div>

                  <nav className="flex flex-col gap-6 text-sm font-black uppercase tracking-[0.2em] text-slate-900">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
                    <Link href="/courses" className="hover:text-blue-600 transition-colors">Toutes les formations</Link>
                    <Link href="/cart" className="flex items-center justify-between text-blue-600 bg-blue-50 p-4 rounded-2xl">
                      Mon Panier <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs">{cartItems.length}</span>
                    </Link>
                  </nav>

                  <div className="mt-auto space-y-4">
                    {userData ? (
                       <Button asChild className="w-full h-14 bg-slate-900 rounded-2xl font-bold uppercase tracking-widest">
                          <Link href="/dashboard">Accéder au Dashboard</Link>
                       </Button>
                    ) : (
                      <>
                        <Button variant="outline" asChild className="w-full h-14 border-slate-200 rounded-2xl font-bold text-slate-900 uppercase tracking-widest">
                           <Link href="/login">Connexion</Link>
                        </Button>
                        <Button asChild className="w-full h-14 bg-blue-600 rounded-2xl font-bold text-white uppercase tracking-widest shadow-xl shadow-blue-100">
                           <Link href="/register">S&apos;inscrire gratuitement</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
}