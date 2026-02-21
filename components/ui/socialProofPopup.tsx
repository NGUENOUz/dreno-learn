"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, X, CheckCircle2 } from "lucide-react"; // Importation de CheckCircle2


const MOCK_SALES = [
  { name: "Moussa T.", country: "Sénégal", flag: "🇸🇳", course: "Achat en Chine", time: "il y a 2 min" },
  { name: "Awa D.", country: "Côte d'Ivoire", flag: "🇨🇮", course: "Marketing Digital", time: "il y a 5 min" },
  { name: "Jean-Paul K.", country: "Cameroun", flag: "🇨🇲", course: "Canva Pro", time: "il y a 12 min" },
  { name: "Fatou S.", country: "Mali", flag: "🇲🇱", course: "Montage Vidéo Mobile", time: "il y a 8 min" },
];

export function SocialProofPopup() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const initialTimeout = setTimeout(() => setIsVisible(true), 5000);

    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % MOCK_SALES.length);
        setIsVisible(true);
      }, 1000);

    }, 15000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (currentIndex >= MOCK_SALES.length) return null;

  const sale = MOCK_SALES[currentIndex];

  return (
    <div 
      className={`
        fixed bottom-6 left-6 z-100 max-w-85 w-full
        bg-white rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100
        transition-all duration-700 ease-in-out flex items-center gap-4
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}
      `}
    >
      {/* ICÔNE OU AVATAR */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
          <ShoppingBag className="w-6 h-6 text-blue-600" />
        </div>
        <div className="absolute -bottom-1 -right-1 text-lg leading-none filter drop-shadow-sm">
          {sale.flag}
        </div>
      </div>

      {/* TEXTE */}
      <div className="grow">
        <p className="text-[13px] text-slate-900 leading-snug">
          <span className="font-bold">{sale.name}</span> vient d&apos;acheter <br />
          <span className="font-bold text-blue-600">{sale.course}</span>.
        </p>
        
        {/* NOUVEAU BADGE VÉRIFIÉ */}
        <div className="flex items-center gap-2 mt-2">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {sale.time}
          </p>
          <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100">
            <CheckCircle2 className="w-3 h-3" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Vérifié</span>
          </div>
        </div>
      </div>

      {/* BOUTON FERMER */}
      <button 
        onClick={() => setIsVisible(false)}
        className="self-start text-slate-300 hover:text-slate-500 transition-colors mt-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}