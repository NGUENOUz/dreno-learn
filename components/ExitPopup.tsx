"use client";

import { useEffect, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export const ExitPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Si la souris sort par le HAUT de la page (vers la barre d'adresse)
      if (e.clientY <= 0 && !hasBeenShown) {
        setIsVisible(true);
        setHasBeenShown(true); // On ne le montre qu'une fois par session
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasBeenShown]);

  // Lien WhatsApp avec message pré-rempli
  const whatsappUrl = "https://wa.me/237620456618?text=Bonjour,%20j'ai%20une%20question%20sur%20le%20guide%20Canada...";

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative overflow-hidden"
          >
            {/* Bouton Fermer */}
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>

            <div className="text-center space-y-4 pt-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 uppercase italic">
                Attendez ! ✋
              </h3>
              
              <p className="text-slate-600 font-medium leading-relaxed">
                Vous avez un doute ? Une question sur votre éligibilité ?
                <br/>
                <span className="text-blue-600 font-bold">Ne restez pas bloqué.</span>
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-500">
                Notre équipe répond gratuitement à vos questions sur WhatsApp avant votre achat.
              </div>

              <Button 
                asChild 
                className="w-full h-14 bg-[#25D366] hover:bg-[#128C7E] text-white text-lg font-bold rounded-xl shadow-lg shadow-green-200 transition-all hover:scale-105"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Discuter sur WhatsApp
                </a>
              </Button>
              
              <button 
                onClick={() => setIsVisible(false)}
                className="text-xs text-slate-400 font-bold hover:text-slate-600 underline decoration-dotted"
              >
                Non merci, je continue ma visite
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};