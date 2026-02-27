"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, AlertCircle, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Si le panier est vide ou que le composant n'est pas monté, on ne fait rien
    if (!mounted || cartItems.length === 0) return;

    // Fonction qui détecte la sortie de la souris
    const handleMouseLeave = (e: MouseEvent) => {
      // e.clientY <= 0 signifie que la souris part vers le haut (la barre d'onglets)
      if (e.clientY <= 0) {
        // On vérifie dans le sessionStorage si on l'a déjà affiché pour ne pas spammer
        const hasBeenShown = sessionStorage.getItem("exitIntentShown");
        if (!hasBeenShown) {
          setIsOpen(true);
          sessionStorage.setItem("exitIntentShown", "true"); // Marque comme affiché
        }
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [mounted, cartItems.length]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
          {/* Overlay sombre en fond */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* La boîte de notification */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 text-center overflow-hidden border border-slate-100 z-10"
          >
            {/* Bouton Fermer */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icône d'alerte */}
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <ShoppingCart className="w-10 h-10 text-red-500" />
              <div className="absolute top-0 right-0 w-6 h-6 bg-red-500 text-white font-black text-xs flex items-center justify-center rounded-full border-2 border-white">
                {cartItems.length}
              </div>
            </div>

            {/* Texte persuasif */}
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 mb-3">
              Attendez ! 🛑
            </h2>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              Vous avez laissé <strong className="text-slate-900">{cartItems.length} accès stratégique{cartItems.length > 1 ? 's' : ''}</strong> dans votre panier. Le succès n'attend pas !
            </p>

            {/* Boutons d'action */}
            <div className="flex flex-col gap-3">
              <Button
                asChild
                onClick={() => setIsOpen(false)}
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 transition-all active:scale-95 group"
              >
                <Link href="/cart">
                  Finaliser ma commande <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="w-full h-12 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-slate-600"
              >
                Continuer sans sécuriser
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}