"use client";
import { useState } from "react";
import { CourseCard } from "@/components/ui/CourseCard";
import { Search, SlidersHorizontal, X, Star, Clock, BarChart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["Tout", "Populaire", "Marketing", "Développement", "Design", "Business"];

export default function CatalogPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Tout");

  return (
    <div className="space-y-6 md:space-y-10 pb-20">
      {/* HEADER DE LA PAGE */}
      <div className="px-2">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Nos Formations</h1>
        <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">Apprenez avec les meilleurs experts du continent.</p>
      </div>

      {/* BARRE DE RECHERCHE & FILTRES RAPIDES */}
      <div className="sticky top-20 z-20 flex flex-col gap-4 bg-white/90 backdrop-blur-md p-3 rounded-3xl md:rounded-4xl border border-slate-100 shadow-sm transition-all">
        
        <div className="flex items-center gap-2 w-full">
          {/* RECHERCHE COMPACTE */}
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              placeholder="Rechercher..." 
              className="w-full h-11 md:h-12 pl-11 pr-4 bg-slate-50/50 rounded-xl md:rounded-2xl border-none outline-none text-sm font-medium focus:ring-2 focus:ring-blue-600/10 transition-all"
            />
          </div>

          {/* BOUTON FILTRE AVANCÉ - Toujours sur la même ligne */}
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="h-11 w-11 md:h-12 md:w-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl md:rounded-2xl hover:bg-blue-600 hover:text-white transition-all active:scale-90 shadow-sm border border-blue-100/50"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* CATÉGORIES (Visible sur Desktop, Scrollable sur Mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 md:px-5 py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all ${
                activeCategory === cat 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                : "bg-slate-50 text-slate-500 hover:bg-white hover:text-blue-600 border border-transparent hover:border-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* POPUP DE RECHERCHE AVANCÉE - CENTRÉ (MODAL) */}
      <AnimatePresence>
        {isFilterOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-100 px-4">
            {/* Overlay sombre */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsFilterOpen(false)} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            
            {/* Contenu du Popup centré */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-xl bg-white rounded-4xl md:rounded-[3rem] p-6 md:p-10 shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Filtres avancés</h3>
                    <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase mt-1 tracking-widest">Affinez votre recherche</p>
                </div>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 md:p-3 bg-slate-50 rounded-full text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all">
                    <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10">
                {/* PRIX */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider">
                    <Star className="w-4 h-4 text-blue-600" /> Prix
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-2.5 rounded-xl border border-slate-100 text-[10px] font-black uppercase hover:border-blue-600 transition-all">Gratuit</button>
                    <button className="py-2.5 rounded-xl border border-blue-600 bg-blue-50 text-blue-600 text-[10px] font-black uppercase">Payant</button>
                  </div>
                </div>

                {/* NIVEAU */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider">
                    <BarChart className="w-4 h-4 text-blue-600" /> Niveau
                  </div>
                  <select className="w-full h-11 px-4 rounded-xl border border-slate-100 bg-slate-50 font-bold text-xs outline-none focus:ring-2 focus:ring-blue-600/10">
                    <option>Tous les niveaux</option>
                    <option>Débutant</option>
                    <option>Intermédiaire</option>
                    <option>Expert</option>
                  </select>
                </div>

                {/* DURÉE */}
                <div className="space-y-3 md:col-span-2">
                  <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-blue-600" /> Durée
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["0-2h", "3-6h", "7-12h", "12h+"].map(d => (
                        <button key={d} className="px-4 py-2.5 rounded-xl border border-slate-100 text-[10px] font-black hover:bg-slate-50 transition-all">{d}</button>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => setIsFilterOpen(false)}
                className="w-full h-14 md:h-16 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 text-base md:text-lg transition-all active:scale-95"
              >
                Appliquer les filtres
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GRILLE DE COURS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 px-2">
        <CourseCard 
            id="kit-de-20-formations"
            title="Importation Chine : Le Guide Ultime 2026"
            category="Business"
            price="20 000 FCFA"
            oldPrice="35 000 FCFA"
            rating={4.8}
            reviews={150}
            duration="8h 30m"
            instructor="Max Alexix"
            image="https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=600"
            badge="Meilleure vente"
        />
        {/* Vos autres cartes ici */}
      </div>
    </div>
  );
}