"use client";

import { Button } from "@/components/ui/button";
import { Play, Users, Star, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-white pt-6 pb-12 md:pt-10 md:pb-20 lg:pt-12 lg:pb-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* TEXTE & CTA (Gauché) */}
          <div className="relative z-10 flex flex-col gap-4 md:gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 w-fit animate-in fade-in slide-in-from-left-4 duration-700">
              <Star className="w-4 h-4 fill-blue-600" />
              <span className="text-[10px] md:text-sm font-bold uppercase tracking-wider">L&apos;excellence de l&apos;apprentissage</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight animate-in fade-in slide-in-from-left-6 duration-1000">
              L&apos;Éducation<br />
              <span className="text-blue-600">réinventée</span> pour vous.
            </h1>

            <p className="text-base md:text-lg text-slate-600 max-w-lg leading-relaxed animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
              Maîtrisez les compétences les plus demandées. Des formations pratiques, 
              un accès à vie et un support WhatsApp dédié pour votre réussite.
            </p>

            <div className="flex flex-wrap gap-3 md:gap-4 pt-2 md:pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 md:px-8 h-12 md:h-14 text-base md:text-lg font-bold shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95 cursor-pointer">
                <Link href="/register">Commencer maintenant</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full px-6 md:px-8 h-12 md:h-14 text-base md:text-lg font-bold border-2 gap-2 hover:bg-slate-50 cursor-pointer">
                <Link href="#catalog">
                  <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" /> Nos formations
                </Link>
              </Button>
            </div>

            {/* Petites stats sociales - Plus compactes */}
            <div className="flex items-center gap-3 pt-4 md:pt-6 border-t border-slate-100 mt-2">
              <div className="flex -space-x-2 md:-space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white overflow-hidden relative">
                    <Image 
                      src={`https://picsum.photos/seed/${i + 20}/100/100`} 
                      alt="Utilisateur" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs md:text-sm text-slate-500 font-medium">
                Rejoignez <span className="text-slate-900 font-bold">15 000+</span> étudiants ambitieux.
              </p>
            </div>
          </div>

          {/* VISUEL & BADGES FLOTTANTS (Droite) */}
          <div className="relative hidden lg:flex justify-end animate-in fade-in zoom-in duration-1000">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-blue-50 rounded-full blur-3xl -z-10 opacity-60" />
            
            <div className="relative w-full max-w-110">
              {/* Image principale utilisant Picsum/Unsplash pour un look pro */}
              <div className="aspect-4/5 rounded-[2.5rem] bg-slate-100 border-8 border-white shadow-2xl overflow-hidden relative group">
                <Image 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop" 
                  alt="Apprendre sur Dreno Learn"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
              </div>

              {/* BADGE FLOTTANT 1 : ÉTUDIANTS ACTIFS */}
              <div className="absolute -left-10 top-16 bg-white p-3 md:p-4 rounded-2xl shadow-2xl flex items-center gap-3 md:gap-4 animate-bounce-slow border border-slate-50">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <Users className="text-white w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <div className="text-lg md:text-xl font-extrabold text-slate-900">16,500+</div>
                  <div className="text-[10px] md:text-xs text-slate-500 font-medium tracking-tight">Étudiants actifs</div>
                </div>
              </div>

              {/* BADGE FLOTTANT 2 : CERTIFICATION */}
              <div className="absolute -right-6 bottom-12 bg-white p-3 md:p-4 rounded-2xl shadow-2xl flex items-center gap-2 md:gap-3 animate-float border border-slate-50">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-100">
                  <CheckCircle className="text-white w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <div className="text-xs md:text-sm font-bold text-slate-900">Accès à vie</div>
                  <div className="text-[9px] md:text-[10px] text-slate-500 font-medium italic">Apprenez à votre rythme</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-8px, -8px); }
        }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
        .animate-float { animation: float 5s ease-in-out infinite; }
      `}</style>
    </section>
  );
}