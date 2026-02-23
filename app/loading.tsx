// app/loading.tsx
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      <div className="relative flex items-center justify-center">
        {/* Anneau extérieur */}
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-100 border-t-blue-600" />
        {/* Logo central pulsant */}
        <div className="absolute text-blue-600 font-black text-xl italic animate-pulse">D</div>
      </div>
      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
        Chargement...
      </p>
    </div>
  );
}