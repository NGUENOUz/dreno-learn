"use client";

import Link from "next/link";
import { Search, ShoppingCart, Menu, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-7xl">
        
        
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            {/* On pourra mettre un vrai logo SVG ici plus tard */}
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl leading-none">D</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              Dreno<span className="text-blue-600">learn</span>
            </span>
          </Link>
        </div>

        {/* NAVIGATION DESKTOP (Cachée sur mobile) */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
          <Link href="/courses" className="hover:text-blue-600 transition-colors">Formations</Link>
          <Link href="/categories" className="hover:text-blue-600 transition-colors">Catégories</Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
        </nav>

        {/* ACTIONS RIGHT */}
        <div className="flex items-center gap-4 border-l pl-4 md:border-none md:pl-0">
          
          {/* Icônes Desktop */}
          <div className="hidden sm:flex items-center gap-3 mr-2 text-slate-600">
            <button className="p-2 hover:text-blue-600 transition-colors" aria-label="Recherche">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:text-blue-600 transition-colors relative" aria-label="Favoris">
              <Heart className="w-5 h-5" />
            </button>
            <Link href="/cart" className="p-2 hover:text-blue-600 transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              {/* Badge dynamique pour le panier */}
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                0
              </span>
            </Link>
          </div>

          {/* Boutons Auth */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild className="font-semibold text-slate-600 hover:text-blue-600">
              <Link href="/login">Se connecter</Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 font-semibold shadow-md shadow-blue-200">
              <Link href="/register">S&apos;inscrire</Link>
            </Button>
          </div>

          {/* MENU MOBILE (Hamburger) */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-600">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-75 sm:w-100 bg-white">
                <nav className="flex flex-col gap-6 mt-10 text-lg font-medium text-slate-900">
                  <Link href="/" className="hover:text-blue-600">Accueil</Link>
                  <Link href="/courses" className="hover:text-blue-600">Formations</Link>
                  <Link href="/categories" className="hover:text-blue-600">Catégories</Link>
                  <Link href="/cart" className="flex items-center justify-between hover:text-blue-600">
                    Panier <ShoppingCart className="w-5 h-5" />
                  </Link>
                  <hr className="my-2 border-slate-100" />
                  <Link href="/login" className="text-slate-600">Se connecter</Link>
                  <Button asChild className="bg-blue-600 text-white rounded-full mt-2">
                    <Link href="/register">S&apos;inscrire maintenant</Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
}