import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";

export function HeaderDemo() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        
        {/* LOGO - Redirige vers l'accueil (ou reste sur la page) */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-xl italic">D</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter text-slate-900 italic uppercase leading-none">
              Dreno<span className="text-blue-600">Learn</span>
            </span>
            {/* Sous-titre spécifique pour la Landing Page */}
            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">
              Édition Canada
            </span>
          </div>
        </Link>

        {/* TRUST BADGE (À la place du menu) */}
        {/* Visible sur mobile et desktop pour rassurer tout le temps */}
        <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-green-100 shadow-sm">
          <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-green-600 fill-green-100" />
          <div className="flex flex-col md:flex-row md:gap-2 items-start md:items-center">
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-green-700 leading-none">
              Programme Vérifié
            </span>
            <span className="text-[8px] md:text-[10px] font-bold text-green-600/70 hidden md:inline-block">
              | Mise à jour 2026
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}