"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Search, ShoppingCart, Menu, ChevronDown, 
  LogOut, User, Globe, LayoutGrid,
  ShieldCheck // <-- Il manquait celui-là !
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";

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

// Hook pour éviter les erreurs d'hydratation
const subscribe = () => () => {};
const useIsClient = () => useSyncExternalStore(subscribe, () => true, () => false);

export function Header() {
  const isClient = useIsClient();
  const router = useRouter();
  const pathname = usePathname();
  
  const { userData, clearUserData } = useUserStore();
  const cartItems = useCartStore((state: CartState) => state.items);

  const handleLogout = async () => {
    const supabase = createClient();
    toast.success("Déconnexion réussie");
    clearUserData();
    await supabase.auth.signOut();
    router.refresh();
  };

  // Liens de navigation pour réutilisation
  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Formations", href: "/courses" },
    { name: "Guides", href: "/guides", isNew: true },
    { name: "Support", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-100 w-full border-b border-slate-100 bg-white/80 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
        
        {/* --- LOGO ELITE --- */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-blue-600 transition-colors duration-500">
            <span className="text-white font-black text-xl italic">D</span>
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">
            Dreno<span className="text-blue-600">learn</span>
          </span>
        </Link>

        {/* --- NAVIGATION DESKTOP --- */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`relative text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 hover:text-blue-600 ${
                pathname === link.href ? "text-blue-600" : "text-slate-400"
              }`}
            >
              {link.name}
              {link.isNew && (
                <span className="absolute -top-4 -right-4 bg-blue-600 text-[7px] text-white px-1.5 py-0.5 rounded-full animate-pulse">
                  NEW
                </span>
              )}
              {pathname === link.href && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* --- ACTIONS & AUTH --- */}
        <div className="flex items-center gap-2 md:gap-5">
          
          {/* Recherche & Panier */}
          {isClient && (
            <div className="flex items-center gap-1 md:gap-2">
              <button className="p-2.5 text-slate-400 hover:text-blue-600 transition-all rounded-xl hover:bg-slate-50 hidden sm:flex">
                <Search className="w-5 h-5" />
              </button>
              
              <Link href="/cart" className="p-2.5 text-slate-400 hover:text-blue-600 transition-all rounded-xl hover:bg-slate-50 relative group">
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartItems.length > 0 && (
                  <span className="absolute top-1 right-1 min-w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </div>
          )}

          <div className="h-8 w-px bg-slate-100 mx-1 hidden sm:block" />

          {/* LOGIQUE DYNAMIQUE : Profil vs Inscription */}
          {isClient && userData ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 pl-1 pr-3 py-1 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all outline-none group">
                  <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg group-hover:bg-blue-600 transition-colors">
                    {userData.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-[11px] font-black text-slate-900 leading-none truncate max-w-25 uppercase italic">
                      {userData.name}
                    </p>
                    <p className="text-[9px] font-bold text-blue-600 mt-1 uppercase tracking-tighter flex items-center gap-1">
                      Membre Élite <ShieldCheck className="w-2.5 h-2.5" />
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 mt-4 rounded-3xl p-2 shadow-2xl border-slate-100 bg-white ring-1 ring-black/5">
                <div className="px-4 py-3 border-b border-slate-50 mb-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Espace Personnel</p>
                </div>
                <DropdownMenuItem asChild className="rounded-xl py-3 font-bold text-slate-700 cursor-pointer focus:bg-blue-50 focus:text-blue-600 group">
                  <Link href="/dashboard" className="flex items-center w-full">
                    <LayoutGrid className="w-4 h-4 mr-3 text-slate-400 group-focus:text-blue-600" /> Mon Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl py-3 font-bold text-slate-700 cursor-pointer focus:bg-blue-50 focus:text-blue-600 group">
                  <Link href="/dashboard/settings" className="flex items-center w-full">
                    <User className="w-4 h-4 mr-3 text-slate-400 group-focus:text-blue-600" /> Profil & Paramètres
                  </Link>
                </DropdownMenuItem>
                <div className="h-px bg-slate-50 my-1" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-xl py-3 font-bold text-red-500 cursor-pointer focus:bg-red-50 focus:text-red-600">
                  <LogOut className="w-4 h-4 mr-3" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" asChild className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">
                <Link href="/login">Connexion</Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-slate-950 text-white rounded-xl px-6 h-11 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 transition-all active:scale-95">
                <Link href="/register">S&apos;inscrire</Link>
              </Button>
            </div>
          )}

          {/* --- MENU MOBILE --- */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-900 bg-slate-50 rounded-xl w-11 h-11 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-95 bg-white border-l-0 p-0 overflow-hidden flex flex-col">
                <div className="p-8 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-white font-black italic">D</div>
                      <span className="font-black text-xl italic uppercase tracking-tighter">DrenoLearn</span>
                  </div>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href}
                      href={link.href} 
                      className={`flex items-center justify-between p-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                        pathname === link.href ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {link.name === "Guides" && <Globe className="w-4 h-4" />}
                        {link.name === "Formations" && <LayoutGrid className="w-4 h-4" />}
                        {link.name}
                      </span>
                      {link.isNew && <span className="bg-yellow-400 text-slate-950 text-[8px] px-2 py-0.5 rounded-full">NOUVEAU</span>}
                    </Link>
                  ))}
                  <div className="h-px bg-slate-50 my-4" />
                  <Link href="/cart" className="flex items-center justify-between p-4 rounded-2xl text-blue-600 bg-blue-50 font-black uppercase tracking-widest">
                    <span className="flex items-center gap-3"><ShoppingCart className="w-4 h-4" /> Mon Panier</span>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs">{cartItems.length}</span>
                  </Link>
                </nav>

                <div className="p-8 bg-slate-50 space-y-4">
                  {userData ? (
                     <Button asChild className="w-full h-16 bg-slate-950 hover:bg-blue-600 rounded-2xl font-black uppercase tracking-widest transition-all">
                        <Link href="/dashboard">Accéder au Dashboard</Link>
                     </Button>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" asChild className="h-14 border-slate-200 rounded-2xl font-bold text-slate-900 uppercase tracking-widest">
                         <Link href="/login">Connexion</Link>
                      </Button>
                      <Button asChild className="h-14 bg-blue-600 rounded-2xl font-bold text-white uppercase tracking-widest shadow-xl shadow-blue-100">
                         <Link href="/register">S&apos;inscrire</Link>
                      </Button>
                    </div>
                  )}
                  <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] pt-2">
                    L&apos;excellence pour votre avenir
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
}