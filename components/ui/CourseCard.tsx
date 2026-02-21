"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, Clock, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  id: string; // On ajoute l'ID pour la navigation
  title: string;
  category: string;
  price: string;
  oldPrice?: string;
  rating: number;
  reviews: number;
  duration: string;
  instructor: string;
  image: string;
  badge?: string;
}

export function CourseCard({ 
  id, title, category, price, oldPrice, rating, reviews, duration, instructor, image, badge 
}: CourseCardProps) {
  const router = useRouter();

  // Navigation vers la page de détails
  const handleCardClick = () => {
    router.push(`/courses/${id}`);
  };

  // Action d'achat (sans déclencher le clic de la carte)
  const handlePurchase = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche d'ouvrir la page de détails
    // Logique d'ajout au panier ou redirection checkout ici
    console.log("Achat immédiat pour le cours :", id);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer active:scale-[0.98] relative"
    >
      
      {/* IMAGE & BADGE */}
      <div className="relative aspect-video overflow-hidden">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {badge && (
          <Badge className="absolute top-2 left-2 bg-blue-600 text-[10px] px-2 py-0.5 rounded-md font-bold border-none shadow-lg">
            {badge}
          </Badge>
        )}
      </div>

      {/* CONTENU */}
      <div className="p-4 flex flex-col grow">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{category}</span>
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[11px] font-bold text-slate-700">{rating}</span>
            <span className="text-[10px] text-slate-400 ml-0.5">({reviews})</span>
          </div>
        </div>

        <h3 className="text-sm font-bold text-slate-900 mb-1 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        <p className="text-[11px] text-slate-500 mb-2">Par <span className="font-semibold text-slate-700">{instructor}</span></p>

        <div className="flex items-center gap-3 mb-4 text-[10px] font-medium text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {duration}
          </div>
        </div>

        {/* PRIX ET CTA CLAIR */}
        <div className="mt-auto pt-3 border-t border-slate-50 flex flex-col gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-slate-900">{price}</span>
            {oldPrice && <span className="text-[11px] text-slate-400 line-through">{oldPrice}</span>}
          </div>
          
          <Button 
            onClick={handlePurchase}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold h-9 rounded-lg gap-2 shadow-md shadow-blue-100 transition-all active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Acheter maintenant
          </Button>
        </div>
      </div>
    </div>
  );
}