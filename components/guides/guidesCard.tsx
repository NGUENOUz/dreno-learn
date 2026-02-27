"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  MapPin, 
  TrendingDown, 
  ShieldCheck, 
  ArrowRight, 
  Star,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";

interface GuideCardProps {
  guide: {
    id?: string;           // Ajouté pour le panier
    chariow_id?: string;   // Ajouté pour le panier
    title: string;
    slug: string;
    description: string;
    price: number;
    oldPrice?: number;
    image_url: string;
    savings_text: string;
    category: string;
  };
}

export default function GuideCard({ guide }: GuideCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  // Calcul du pourcentage de réduction si l'ancien prix existe
  const discount = guide.oldPrice 
    ? Math.round(((guide.oldPrice - guide.price) / guide.oldPrice) * 100) 
    : null;

  // 🪄 LA FONCTION MAGIQUE : Ajoute au panier ET redirige vers les détails
  const handleCardClick = () => {
    // 1. Ajout au panier (Silencieux et rapide)
    if (guide.id && guide.chariow_id) {
      addItem({
        id: guide.id,
        chariow_id: guide.chariow_id,
        title: guide.title,
        price: guide.price,
        image_url: guide.image_url,
        type: "guides"
      });
      toast.success("Guide ajouté à votre panier !");
    }

    // 2. Navigation fluide vers la page de détails
    router.push(`/guides/${guide.slug}`);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      /* Ajout de cursor-pointer pour indiquer que toute la carte est cliquable */
      className="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full cursor-pointer"
    >
      {/* SECTION IMAGE & BADGES */}
      <div className="relative h-64 w-full overflow-hidden p-3">
        <div className="relative h-full w-full rounded-4xl overflow-hidden shadow-inner">
          <Image
            src={guide.image_url || "/images/placeholder-travel.jpg"}
            alt={guide.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            unoptimized
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
          
          {/* Badge Catégorie */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-blue-600" /> {guide.category}
            </span>
          </div>

          {/* Badge Économie Flash */}
          {discount && (
            <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full shadow-lg">
              -{discount}%
            </div>
          )}

          {/* Localisation / Titre sur Image */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <MapPin className="w-3 h-3 fill-current" />
              <span className="text-[10px] font-black uppercase tracking-widest">Procédure Directe</span>
            </div>
            <h3 className="text-white font-black text-xl italic uppercase tracking-tighter leading-none line-clamp-2">
              {guide.title}
            </h3>
          </div>
        </div>
      </div>

      {/* CONTENU TEXTUEL */}
      <div className="p-6 pt-2 space-y-4 grow">
        {/* L'argument massue : L'économie réalisée */}
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-100 w-full">
          <TrendingDown className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-tight">
            {guide.savings_text}
          </span>
        </div>

        <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2">
          {guide.description}
        </p>

        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-3 h-3 fill-current" /> 4.9/5
            </div>
            <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-600" /> Guide vérifié 2026
            </div>
        </div>
      </div>

      {/* FOOTER : PRIX & ACTION */}
      <div className="p-6 pt-0 mt-auto">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex flex-col">
            {guide.oldPrice && (
              <span className="text-xs font-bold text-red-500 line-through opacity-80">
                {guide.oldPrice.toLocaleString()} FCFA
              </span>
            )}
            <span className="text-2xl font-black text-slate-900 italic tracking-tighter">
              {guide.price.toLocaleString()} <span className="text-sm">FCFA</span>
            </span>
          </div>
          <div className="text-right">
             <span className="text-[9px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded-md">Accès Instantané</span>
          </div>
        </div>

        {/* Bouton visuel (Le clic est géré par la carte mère) */}
        <Button
          className="w-full h-14 bg-slate-950 hover:bg-blue-600 text-white rounded-2xl font-black italic uppercase tracking-tighter gap-3 transition-all active:scale-95 shadow-xl shadow-slate-200 pointer-events-none"
        >
          Obtenir mon guide <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}