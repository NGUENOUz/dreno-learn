"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingCart, Menu, X, 
  LayoutGrid, Globe, Phone, Home 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore"; // 🛒 Import du store

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // 🛒 1. Récupération des articles du panier
  const cartItems = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  // Fermer le menu au changement de route
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // 🛒 2. Gérer l'hydratation pour éviter les erreurs avec localStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  // Bloquer le scroll du body quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const navLinks = [
    { name: "Accueil", href: "/", icon: Home },
    { name: "Formations", href: "/courses", icon: LayoutGrid },
    { name: "Guides", href: "/guides", icon: Globe, isNew: true },
    { name: "Support", href: "#support", icon: Phone },
  ];

  // 🛒 3. Calcul du nombre d'articles
  const cartCount = mounted ? cartItems.length : 0;

  return (
    <>
      {/* 1. HEADER NORMAL (Celui de la page) */}
      <header className="sticky top-0 z-[990] w-full bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 z-50">
            <div className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl italic">D</span>
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-900 italic uppercase">Dreno<span className="text-blue-600">Learn</span></span>
          </Link>

          {/* NAV DESKTOP (Cachée sur mobile) */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-sm font-black uppercase tracking-widest transition-colors flex items-center gap-2 ${
                  pathname === link.href ? "text-blue-600" : "text-slate-500 hover:text-blue-600"
                }`}
              >
                {link.name}
                {link.isNew && (
                  <span className="bg-yellow-400 text-[#0F172A] text-[8px] px-2 py-0.5 rounded-full text-black">NOUVEAU</span>
                )}
              </Link>
            ))}
          </nav>

          {/* ACTIONS DROITE (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/cart" className="relative p-2 text-slate-500 hover:text-blue-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {/* 🛒 Badge dynamique Desktop */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <div className="h-6 w-[1px] bg-slate-200 mx-2" />
            <Button asChild variant="ghost" className="font-black uppercase text-xs tracking-widest text-slate-500 hover:text-blue-600">
              <Link href="/login">Connexion</Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs tracking-widest rounded-xl px-6">
              <Link href="/register">S'inscrire</Link>
            </Button>
          </div>

          {/* BOUTONS MOBILE (Panier + Hamburger) */}
          <div className="flex md:hidden items-center gap-4 z-50">
            <Link href="/cart" className="relative p-2 text-slate-500">
              <ShoppingCart className="w-6 h-6" />
              {/* 🛒 Badge dynamique Mobile */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsOpen(true)}
              className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 active:scale-95 transition-transform"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MENU MOBILE FULL SCREEN (MODAL) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 w-full h-[100dvh] bg-white z-[9999] flex flex-col overflow-hidden"
          >
            {/* Header interne au menu mobile (avec le bouton X) */}
            <div className="flex items-center justify-between px-4 h-20 border-b border-slate-100 bg-white shrink-0">
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-xl italic">D</span>
                </div>
                <span className="font-black text-xl tracking-tighter text-slate-900 italic uppercase">Dreno<span className="text-blue-600">Learn</span></span>
              </Link>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 active:scale-95 transition-transform"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenu scrollable du menu */}
            <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-2 bg-white">
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      onClick={() => setIsOpen(false)} 
                      className={`flex items-center justify-between p-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${
                        isActive 
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <link.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                        {link.name}
                      </div>
                      {link.isNew && (
                        <span className="bg-yellow-400 text-[#0F172A] text-[9px] px-3 py-1 rounded-full shadow-sm">
                          NOUVEAU
                        </span>
                      )}
                    </Link>
                  );
                })}

                <div className="my-4 h-[1px] bg-slate-100" />

                <Link 
                  href="/cart"
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl font-black uppercase tracking-widest text-sm text-blue-600"
                >
                  <div className="flex items-center gap-4">
                    <ShoppingCart className="w-5 h-5" /> Mon Panier
                  </div>
                  {/* 🛒 Compteur dynamique dans le menu */}
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${cartCount > 0 ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"}`}>
                    {cartCount}
                  </span>
                </Link>
              </nav>

              <div className="mt-auto pt-8 flex gap-4 shrink-0">
                <Button asChild variant="outline" className="flex-1 h-14 rounded-2xl border-slate-200 font-black uppercase text-xs tracking-widest text-slate-700">
                  <Link href="/login" onClick={() => setIsOpen(false)}>Connexion</Link>
                </Button>
                <Button asChild className="flex-1 h-14 rounded-2xl bg-blue-600 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-200">
                  <Link href="/register" onClick={() => setIsOpen(false)}>S'inscrire</Link>
                </Button>
              </div>
              
              <p className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] mt-8 mb-4 shrink-0">
                L'excellence pour votre avenir
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}