
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Trash2, ArrowRight, ChevronLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  const { items, removeItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Évite les erreurs d'hydratation (car Zustand lit le localStorage)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalPrice = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-screen bg-slate-50 py-10 md:py-16 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* EN-TÊTE */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Continuer mes achats
            </Link>
            <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-slate-900 flex items-center gap-3">
              Mon Panier <span className="text-blue-600 bg-blue-100 px-3 py-1 rounded-xl text-xl">{items.length}</span>
            </h1>
          </div>
        </div>

        {items.length === 0 ? (
          /* PANIER VIDE */
          <div className="bg-white rounded-[3rem] border border-slate-100 p-16 text-center shadow-xl shadow-blue-900/5 space-y-6">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-black italic uppercase text-slate-900">Votre panier est vide</h2>
              <p className="text-slate-500 font-medium mt-2">Découvrez nos formations et guides pour propulser votre business.</p>
            </div>
            <div className="flex justify-center gap-4 pt-4">
              <Button asChild className="bg-blue-600 text-white rounded-xl h-12 px-8 font-black uppercase text-xs">
                <Link href="/courses">Voir les formations</Link>
              </Button>
            </div>
          </div>
        ) : (
          /* LISTE DES ARTICLES */
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.chariow_id} className="bg-white p-4 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
                
                {/* Image */}
                <div className="relative w-full md:w-40 h-32 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-100">
                  <Image src={item.image_url || "/placeholder.jpg"} fill className="object-cover" alt={item.title} />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest">
                    {item.type === "guides" ? "Guide PDF" : "Formation"}
                  </div>
                </div>

                {/* Infos */}
                <div className="flex-1 space-y-2 w-full text-center md:text-left">
                  <h3 className="text-lg font-black uppercase italic tracking-tighter text-slate-900 line-clamp-2">{item.title}</h3>
                  <p className="text-xl font-black text-blue-600">{item.price.toLocaleString()} FCFA</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
                  <button 
                    onClick={() => removeItem(item.chariow_id)}
                    className="p-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <Button asChild className="flex-1 md:w-auto h-14 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-black uppercase text-xs px-8 transition-all">
                    {/* LE LIEN MAGIQUE VERS LE BON CHECKOUT */}
                    <Link href={`/${item.type}/${item.chariow_id}/checkout`}>
                      Payer cet accès <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}

            {/* TOTAL ESTIMÉ */}
            <div className="bg-blue-50/50 border border-blue-100 p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 mt-10">
               <div className="space-y-1 text-center md:text-left">
                 <p className="text-xs font-black uppercase text-slate-500 tracking-widest">Valeur totale du panier</p>
                 <p className="text-3xl font-black text-slate-900 italic">{totalPrice.toLocaleString()} FCFA</p>
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm">
                 <ShieldCheck className="w-4 h-4 text-green-500" /> Paiements individuels sécurisés
               </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}