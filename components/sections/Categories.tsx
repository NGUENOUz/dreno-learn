"use client";

import { 
  Megaphone, 
  Globe, 
  Video, 
  Palette, 
  Layout, 
  FileSpreadsheet, 
  Scissors, 
  Briefcase,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// On définit toutes les catégories, mais on ne l'affichera pas toutes ici
const ALL_CATEGORIES = [
  { name: "Marketing Digital", icon: Megaphone, color: "bg-blue-100 text-blue-600", count: "12" },
  { name: "Achat en Chine", icon: Globe, color: "bg-red-100 text-red-600", count: "8" },
  { name: "Montage Vidéo", icon: Video, color: "bg-purple-100 text-purple-600", count: "15" },
  { name: "Infographie", icon: Palette, color: "bg-orange-100 text-orange-600", count: "10" },
  { name: "Canva Pro", icon: Layout, color: "bg-pink-100 text-pink-600", count: "7" },
  { name: "Bureautique", icon: FileSpreadsheet, color: "bg-green-100 text-green-600", count: "20" },
  { name: "Métiers Pratiques", icon: Scissors, color: "bg-yellow-100 text-yellow-600", count: "14" },
  { name: "Business en Ligne", icon: Briefcase, color: "bg-indigo-100 text-indigo-600", count: "18" },
  // ... Imagine ici 22 autres catégories
];

export function Categories() {
  // On ne prend que les 8 premières pour la page d'accueil
  const featuredCategories = ALL_CATEGORIES.slice(0, 8);

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Explorez nos meilleures <span className="text-blue-600">Catégories</span>
            </h2>
            <p className="text-slate-500 font-medium">
              Découvrez des formations conçues pour vous aider à réussir dans les métiers les plus porteurs en Afrique.
            </p>
          </div>
          
          <Button asChild variant="outline" className="hidden md:flex rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all font-bold group">
            <Link href="/categories">
              Voir toutes les catégories
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredCategories.map((cat, index) => (
            <Link 
              href={`/categories/${cat.name.toLowerCase().replace(/ /g, '-')}`} 
              key={index}
              className="group bg-white p-6 md:p-8 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 md:w-14 md:h-14 ${cat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}>
                <cat.icon className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm md:text-base mb-1 group-hover:text-blue-600 transition-colors">{cat.name}</h3>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">{cat.count} Formations</p>
            </Link>
          ))}
        </div>

        {/* Bouton pour mobile uniquement */}
        <div className="mt-10 md:hidden flex justify-center">
          <Button asChild className="w-full rounded-full bg-blue-600 h-12 font-bold shadow-lg">
            <Link href="/categories">Voir les 30+ catégories</Link>
          </Button>
        </div>

      </div>
    </section>
  );
}