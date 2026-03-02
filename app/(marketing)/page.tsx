"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  CheckCircle2,
  Users,
  Briefcase,
  Lock,
  Plane,
  FileCheck,
  Timer,
  AlertCircle,
  Eye,
  ZoomIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// --- CONFIGURATION ---
const PRODUCT = {
  id: "guide-express",
  price: 2900,
  old_price: 15000,
};

// --- IMAGES DU GUIDE (Cloudinary) ---
const GUIDE_IMAGES = [
    { src: "https://res.cloudinary.com/dcsl6xhli/image/upload/v1772423462/guide_entr%C3%A9e_express_canada_odl7i3.png", title: "Sommaire Détaillé" },
    { src: "https://res.cloudinary.com/dcsl6xhli/image/upload/v1772423462/guide_entr%C3%A9e_express_canada_1_yegxvd.png", title: "Contenu Stratégique" },
    { src: "https://res.cloudinary.com/dcsl6xhli/image/upload/v1772423462/guide_entr%C3%A9e_express_canada_2_rsra2r.png", title: "Conclusion & Bonus" }
];
const COVER_IMAGE = "https://res.cloudinary.com/dcsl6xhli/image/upload/v1772423462/guide_entr%C3%A9e_express_canada_3_hqgkmm.png";


// --- COMPOSANT : COMPTE À REBOURS ---
const CountdownTimer = ({ small = false }: { small?: boolean }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 59, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`flex items-center gap-1 text-red-600 font-black font-mono ${small ? "text-xs bg-red-50/50 px-2 py-0.5" : "text-base bg-red-50 px-3 py-1.5"} rounded-lg border border-red-100 shadow-sm`}>
      <Timer className={small ? "w-3 h-3" : "w-4 h-4"} />
      <span>{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
    </div>
  );
};

// --- COMPOSANT : PAGE APERÇU (Image Réelle) ---
const PreviewPage = ({ src, title }: { src: string, title: string }) => (
  <div className="min-w-[260px] md:min-w-[300px] h-[380px] md:h-[420px] bg-white border border-slate-200 shadow-xl rounded-sm p-2 relative overflow-hidden flex flex-col shrink-0 select-none group cursor-zoom-in">
      {/* Filigrane de Protection */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 bg-white/5 backdrop-blur-[1px]">
          <p className="text-slate-900/10 text-3xl font-black uppercase -rotate-45 whitespace-nowrap select-none">
              DRENOLEARN • PREVIEW
          </p>
      </div>
      
      {/* Header Page */}
      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-white to-transparent z-30 flex justify-between items-center">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-white px-2 py-1 rounded-full shadow-sm">{title}</span>
          <ZoomIn className="w-4 h-4 text-slate-300" />
      </div>

      {/* Image Contenu */}
      <div className="relative w-full h-full overflow-hidden bg-slate-50">
          <Image 
            src={src} 
            alt={title} 
            fill 
            className="object-contain object-top group-hover:scale-105 transition-transform duration-700 ease-out" 
          />
      </div>
  </div>
);

// --- COMPOSANT : CARTE VISA ---
const VisaCard = () => (
  <motion.div 
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.5, duration: 0.8 }}
    className="relative bg-white p-3 rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-white max-w-[300px] md:max-w-sm mx-auto md:mx-0 group"
  >
    <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg z-20 border-4 border-slate-900">
        <CheckCircle2 className="w-8 h-8" />
    </div>
    <div className="relative h-48 md:h-60 w-full overflow-hidden rounded-xl bg-slate-100">
        <Image 
            src="https://noticias.imer.mx/wp-content/uploads/2024/02/visa-canada-mexicanos-290224.jpg" 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            alt="Visa Canada Approuvé"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-3">
             <p className="text-white text-xs font-bold uppercase tracking-widest">
                Approuvé sans intermédiaire
             </p>
        </div>
    </div>
  </motion.div>
);

// --- COMPOSANT : CARTE D'ACHAT (Elite Card) ---
const EliteCard = ({ isMobileFlow = false }: { isMobileFlow?: boolean }) => (
  <div
    className={`bg-white border-2 border-blue-600 shadow-[0_20px_60px_-15px_rgba(37,99,235,0.2)] p-6 space-y-6 relative w-full overflow-hidden ${
      isMobileFlow ? "lg:hidden mb-12 rounded-3xl mx-auto max-w-sm" : "rounded-3xl"
    }`}
  >
    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-1.5 rounded-b-xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap shadow-lg">
        Offre Spéciale DrenoLearn
    </div>

    <div className="space-y-4 text-center pt-8">
      <div className="flex flex-col items-center justify-center">
        <span className="text-6xl font-black text-slate-900 tracking-tighter italic leading-none">
          {PRODUCT.price.toLocaleString()} F
        </span>
        <span className="text-sm text-slate-400 font-bold line-through decoration-red-500 decoration-2 mt-1">
          Au lieu de {PRODUCT.old_price.toLocaleString()} F
        </span>
      </div>
      
      <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Cette offre se termine dans :</p>
          <CountdownTimer />
      </div>
    </div>

    <Button
      asChild
      className="w-full h-16 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl text-lg shadow-xl shadow-green-200 group relative overflow-hidden active:scale-95 uppercase italic animate-pulse-fast"
    >
      <Link href={`/guides/${PRODUCT.id}/checkout`}>
        TÉLÉCHARGER MAINTENANT <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
      </Link>
    </Button>

    <div className="space-y-3 pt-4 border-t border-slate-100">
      <div className="flex items-center gap-3 text-xs font-bold text-slate-700 bg-slate-50 p-2 rounded-lg">
        <Briefcase className="w-4 h-4 shrink-0 text-blue-600" /> Modèles CV Canadien (Word) Inclus
      </div>
      <div className="flex items-center gap-3 text-xs font-bold text-slate-700 bg-slate-50 p-2 rounded-lg">
        <MessageSquare className="w-4 h-4 shrink-0 text-green-600" /> Accès Groupe WhatsApp VIP Inclus
      </div>
    </div>
    
    <div className="text-center mt-2">
        <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
            <Lock className="w-3 h-3"/> Paiement sécurisé (OM / MTN / Carte)
        </p>
    </div>
  </div>
);

export default function Home() {
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowStickyCTA(window.scrollY > 900); 
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full bg-white font-sans">
      
      {/* --- 1. BARRE FIXE DESKTOP --- */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="hidden lg:flex fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 p-3 z-50 shadow-lg justify-between items-center px-8"
          >
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black italic shadow-md">D</div>
                <div>
                    <h3 className="font-black text-slate-900 text-sm uppercase italic">Guide Entrée Express 2026</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-green-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Vérifié</span>
                        <CountdownTimer small={true} />
                    </div>
                </div>
             </div>

             <div className="flex items-center gap-6">
                 <div className="text-right">
                     <p className="text-xs text-slate-400 font-bold line-through decoration-red-500">{PRODUCT.old_price} F</p>
                     <p className="text-2xl font-black text-slate-900 leading-none italic">{PRODUCT.price} F</p>
                 </div>
                 <Button asChild className="h-12 bg-green-600 hover:bg-green-700 text-white font-black px-8 rounded-xl uppercase italic shadow-lg shadow-green-200 transition-transform hover:scale-105 animate-pulse-fast">
                    <Link href={`/guides/${PRODUCT.id}/checkout`}>
                        Télécharger
                    </Link>
                 </Button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 2. HERO SECTION --- */}
      <section className="relative w-full min-h-[92vh] bg-slate-900 overflow-hidden flex flex-col justify-center py-20">
        <Image
          src="https://images.unsplash.com/photo-1433838552652-f9a46b332c40?q=80&w=2670&auto=format&fit=crop"
          fill
          className="object-cover opacity-20"
          alt="Voyage Canada"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-900/30" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8 text-center lg:text-left pt-10 md:pt-0">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-blue-200 text-xs font-black uppercase tracking-widest backdrop-blur-md"
            >
               <Plane className="w-4 h-4 animate-pulse text-blue-400" /> Immigration Canada 2026
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tighter uppercase italic">
              "Les gens comme toi obtiennent leur Visa <br/>
              <span className="text-blue-500">Sans Agence</span>."
            </h1>

            <div className="space-y-4 max-w-xl mx-auto lg:mx-0">
                <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed">
                  Arrête de croire qu'il faut forcément être riche ou avoir un gros diplôme pour lancer ta procédure.
                </p>
                <p className="text-white text-lg md:text-xl font-bold border-l-4 border-blue-500 pl-4">
                  Si tu sais lire et suivre des instructions, tu peux monter ton dossier toi-même pour le programme <span className="text-blue-400">Entrée Express</span> et être sélectionné.
                </p>
            </div>
            
            <div className="pt-6 flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                 <Button asChild className="h-16 px-10 bg-white hover:bg-slate-100 text-slate-900 text-lg font-black uppercase italic rounded-full shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-transform hover:scale-105">
                    <Link href="#comment-ca-marche">Comment est-ce possible ?</Link>
                 </Button>
                 
                 <div className="flex items-center gap-3">
                    <div className="flex -space-x-4">
                       {[1,2,3,4].map(i => (
                           <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 relative overflow-hidden">
                                <Image src={`https://i.pravatar.cc/100?u=${i+20}`} fill alt="membre"/>
                           </div>
                       ))}
                    </div>
                    <div className="text-left">
                        <p className="text-white font-black text-lg leading-none">+850</p>
                        <p className="text-slate-400 text-[10px] font-bold uppercase">Membres Autonomes</p>
                    </div>
                 </div>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end justify-center relative mt-8 lg:mt-0">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
             
             
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-slate-800/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl hidden md:block max-w-[220px]"
             >
                 <div className="flex items-center gap-3 mb-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                     <p className="text-[10px] text-slate-400 font-bold uppercase">En direct du groupe</p>
                 </div>
                 <p className="text-white text-xs italic">
                    "J'ai reçu mon invitation à résider ce matin ! Merci pour le guide."
                 </p>
                 <p className="text-slate-400 text-xs font-bold mt-2 text-right">- Marc, Douala</p>
             </motion.div>
          </div>

        </div>

        <div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-lg border-t border-white/5 py-4 z-20">
             <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-6 md:gap-16 px-4">
                 <div className="flex items-center gap-3 text-white/90 text-xs font-bold uppercase tracking-wide">
                     <CheckCircle2 className="w-5 h-5 text-green-400" /> 
                     <span>Procédure Officielle</span>
                 </div>
                 <div className="flex items-center gap-3 text-white/90 text-xs font-bold uppercase tracking-wide">
                     <Lock className="w-5 h-5 text-blue-400" /> 
                     <span>Zéro Agence</span>
                 </div>
                 <div className="flex items-center gap-3 text-white/90 text-xs font-bold uppercase tracking-wide">
                     <ShieldCheck className="w-5 h-5 text-yellow-400" /> 
                     <span>100% Légal</span>
                 </div>
             </div>
        </div>
      </section>

      {/* --- 3. LA MÉTHODE (Éducation) --- */}
      <section id="comment-ca-marche" className="py-24 px-4 max-w-5xl mx-auto">
         <div className="text-center mb-16 space-y-6">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic leading-none">
                Le Secret : C'est <span className="text-blue-600">Des Points</span>.
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full" />
            <p className="text-slate-600 text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
                Le programme <strong>Entrée Express</strong> ne choisit pas les gens "au hasard". 
                C'est un système logique. Tu valides des étapes, tu gagnes des points.
                Si tu as le bon score, le Canada t'invite. C'est mathématique.
            </p>
         </div>

         <div className="relative mb-20">
             <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-slate-200 -z-10" />

             <div className="grid md:grid-cols-3 gap-10">
                 {[
                     { 
                         step: "1", 
                         title: "Prouve qui tu es", 
                         desc: "Fais évaluer tes diplômes (WES) et passe ton test de langue. C'est la base obligatoire pour marquer tes premiers points." 
                     },
                     { 
                         step: "2", 
                         title: "Entre dans le Jeu", 
                         desc: "Tu crées ton profil en ligne gratuitement. Tu deviens visible pour le Canada dans le bassin des candidats." 
                     },
                     { 
                         step: "3", 
                         title: "L'Invitation (RP)", 
                         desc: "Les meilleurs profils sont sélectionnés. Tu reçois le mail qui change ta vie et tu prépares tes valises." 
                     }
                 ].map((item, i) => (
                     <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl text-center hover:-translate-y-2 transition-transform duration-300 group">
                         <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-lg shadow-blue-200 group-hover:bg-slate-900 transition-colors">
                             {item.step}
                         </div>
                         <h3 className="text-xl font-black text-slate-900 uppercase italic mb-3">{item.title}</h3>
                         <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                     </div>
                 ))}
             </div>
         </div>
         
         <div className="bg-slate-900 text-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            
            <div className="grid md:grid-cols-3 gap-8 items-center relative z-10">
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h3 className="text-2xl md:text-3xl font-black uppercase italic leading-tight mb-2">
                            "Si c'est si simple, pourquoi les gens échouent ?"
                        </h3>
                        <div className="h-1 w-20 bg-red-500 rounded-full"/>
                    </div>
                    <p className="text-slate-300 text-lg leading-relaxed">
                        Parce que <strong>90% des candidats</strong> font des erreurs bêtes : mauvais code CNP pour le travail, mauvaise attestation de fonds, ou oubli d'un document. Même certaines agences font ces erreurs !
                    </p>
                    <p className="text-white font-bold text-lg border-l-4 border-green-500 pl-4">
                        C'est exactement pour ça qu'on a créé ce guide : <br/>
                        <span className="text-green-400">Pour te donner la feuille de route exacte et sécuriser ton dossier.</span>
                    </p>
                </div>
                
                <div className="bg-white/10 p-6 rounded-2xl border border-white/5 text-center backdrop-blur-sm">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Ce que tu vas maîtriser</p>
                    <ul className="text-left space-y-4">
                        <li className="flex items-center gap-3 text-sm font-bold text-white"><div className="p-1 bg-green-500 rounded-full"><CheckCircle2 className="w-3 h-3 text-white"/></div> Monter ton dossier A à Z</li>
                        <li className="flex items-center gap-3 text-sm font-bold text-white"><div className="p-1 bg-blue-500 rounded-full"><Briefcase className="w-3 h-3 text-white"/></div> Trouver un emploi (Afrique)</li>
                        <li className="flex items-center gap-3 text-sm font-bold text-white"><div className="p-1 bg-red-500 rounded-full"><ShieldCheck className="w-3 h-3 text-white"/></div> Éviter le refus de Visa</li>
                    </ul>
                </div>
            </div>
         </div>
      </section>

      {/* --- 4. APERÇU DU GUIDE (CARROUSEL RÉEL) --- */}
      <section className="py-24 bg-slate-50 overflow-hidden">
          <div className="text-center mb-12 space-y-4">
              <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                  <Eye className="w-4 h-4" /> Coup d'œil exclusif
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic leading-none">
                  Feuilletez le <span className="text-blue-600">Dossier</span>
              </h2>
              <p className="text-slate-500 text-sm md:text-base max-w-lg mx-auto">
                  Voici concrètement ce que tu vas recevoir. Pas de théorie inutile, juste des étapes claires à suivre.
              </p>
          </div>

          {/* Carousel Container (Scroll Horizontal) */}
          <div className="flex overflow-x-auto pb-10 px-6 gap-6 md:justify-center no-scrollbar items-center">
              {GUIDE_IMAGES.map((img, index) => (
                  <PreviewPage key={index} src={img.src} title={img.title} />
              ))}
          </div>
      </section>

      {/* --- 5. LA SOLUTION (Mockup) --- */}
      <section className="bg-slate-900 py-24 px-4 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-600/10 rounded-full blur-3xl pointer-events-none" />

         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
             
             <div className="space-y-10 order-2 lg:order-1">
                 <div>
                     <span className="inline-block px-3 py-1 rounded bg-blue-500/20 text-blue-300 font-black uppercase tracking-widest text-[10px] mb-4">
                         Solution Clé en Main
                     </span>
                     <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic leading-none">
                         Nous avons conçu ce guide <br/>
                         <span className="text-blue-500 underline decoration-4 decoration-blue-500/30">Uniquement pour Toi</span>.
                     </h2>
                 </div>

                 <p className="text-slate-300 text-lg leading-relaxed">
                     Pour te permettre d'éviter les erreurs fatales que 90% des candidats font (même des agences !). 
                     Tu vas apprendre concrètement comment :
                 </p>

                 <div className="space-y-4">
                    {[
                        { 
                            t: "Monter ton dossier de A à Z", 
                            d: "On te montre quels papiers chercher, comment les scanner, et où les envoyer. Fini le stress de l'inconnu." 
                        },
                        { 
                            t: "Trouver un emploi depuis l'Afrique", 
                            d: "Quel que soit ton secteur (Mécanique, Santé, Info...) ou ton niveau d'étude. On te donne la liste des sites qui recrutent des étrangers." 
                        },
                        { 
                            t: "Justifier tes fonds (L'argent)", 
                            d: "L'astuce légale pour prouver que tu as les fonds requis, même si ton compte n'est pas rempli aujourd'hui." 
                        }
                    ].map((m, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                            <h4 className="font-black text-white uppercase text-base mb-2 flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" /> {m.t}
                            </h4>
                            <p className="text-slate-400 text-sm pl-8">
                                {m.d}
                            </p>
                        </div>
                    ))}
                 </div>
             </div>

             <div className="relative order-1 lg:order-2 flex justify-center">
                 {/* Visuel Guide avec Couverture Réelle */}
                 <div className="relative w-full max-w-md aspect-[4/5] bg-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-slate-700 transform rotate-3 hover:rotate-0 transition-transform duration-500 group">
                     {/* IMAGE DE COUVERTURE RÉELLE EN BACKGROUND */}
                     <Image 
                        src={COVER_IMAGE}
                        alt="Couverture Guide"
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent pointer-events-none" />
                     
                     <div className="absolute inset-0 flex flex-col items-center justify-end z-10 p-8 pb-16">
                         <div className="border-2 border-white/20 p-6 rounded-2xl bg-black/40 backdrop-blur-md w-full">
                             <h3 className="text-3xl font-black text-white uppercase italic leading-none mb-2">GUIDE COMPLET</h3>
                             <p className="text-yellow-400 font-bold tracking-widest uppercase text-xs">Entrée Express 2026</p>
                         </div>
                     </div>
                 </div>

                 <div className="absolute -bottom-10 -left-4 md:-left-10 bg-white text-slate-900 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-100 max-w-[240px] z-20 animate-bounce-slow">
                     <p className="text-xs font-black uppercase text-green-600 mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 fill-green-600"/> Bonus Gratuit
                     </p>
                     <p className="text-sm font-bold leading-tight">
                        Accès inclus au Groupe WhatsApp de réseautage
                     </p>
                 </div>
             </div>

         </div>
      </section>

      {/* --- 6. LES BONUS --- */}
      <section className="py-24 px-4 bg-slate-50">
          <div className="max-w-5xl mx-auto text-center space-y-12">
              <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 italic uppercase leading-none">
                      Et pour être sûr que tu réussisses...<br/>
                      <span className="text-blue-600">On t'offre tout ça :</span>
                  </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-left">
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                      <Briefcase className="w-10 h-10 text-blue-600 mb-6 relative z-10" />
                      <h4 className="font-black text-xl text-slate-900 mb-3 uppercase italic">CV Canadien</h4>
                      <p className="text-sm text-slate-600 font-medium">
                          Le format au Canada est unique. On te donne le fichier Word exact à remplir pour ne pas être rejeté par les robots.
                      </p>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-100 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                      <FileCheck className="w-10 h-10 text-yellow-500 mb-6 relative z-10" />
                      <h4 className="font-black text-xl text-slate-900 mb-3 uppercase italic">Templates Lettres</h4>
                      <p className="text-sm text-slate-600 font-medium">
                          Lettres de motivation et lettres d'explication prêtes à l'emploi. Tu n'as qu'à changer ton nom.
                      </p>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                      <Users className="w-10 h-10 text-green-600 mb-6 relative z-10" />
                      <h4 className="font-black text-xl text-slate-900 mb-3 uppercase italic">Réseau VIP</h4>
                      <p className="text-sm text-slate-600 font-medium">
                          Accès direct à notre groupe d'entraide. Trouve des colocataires, pose tes questions, ne reste jamais seul.
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* --- 7. OFFRE FINALE --- */}
      <section className="py-24 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10 space-y-4">
                  <div className="inline-flex items-center gap-2 text-red-600 font-black uppercase text-xs bg-red-50 px-4 py-2 rounded-full animate-pulse">
                      <AlertCircle className="w-4 h-4" />
                      Attention : Cette offre se termine bientôt
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic leading-none">
                      Ton avenir coûte moins cher<br/> qu'un restaurant.
                  </h2>
                  <p className="text-slate-500 text-lg">
                      Pour 2900 F, tu gagnes des mois de recherche et tu évites des erreurs qui coûtent des millions.
                  </p>
              </div>

              <EliteCard isMobileFlow={false} />

              <div className="mt-12 text-center space-y-4">
                  <div className="flex justify-center -space-x-3">
                      {[1,2,3,4,5].map(i => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 relative overflow-hidden">
                               <Image src={`https://i.pravatar.cc/100?u=${i+50}`} fill alt="client"/>
                          </div>
                      ))}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                       <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                       <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                       <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                       <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                       <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">
                      "Le meilleur investissement de ma vie. Merci pour le groupe WhatsApp !" <br/>
                      <span className="font-bold text-slate-900">- Sarah, Abidjan</span>
                  </p>
              </div>
          </div>
      </section>

      {/* --- 8. STICKY MOBILE CTA --- */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-50 flex items-center justify-between gap-3 shadow-[0_-5px_30px_rgba(0,0,0,0.15)] md:hidden safe-area-bottom"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                 <p className="text-sm text-slate-400 font-bold uppercase line-through">
                    {PRODUCT.old_price} F
                 </p>
                 <span className="bg-red-100 text-red-600 text-[9px] font-black px-1.5 rounded-sm">
                    -80%
                 </span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-black text-slate-900 italic leading-none">
                    {PRODUCT.price} F
                </p>
              </div>
            </div>
            
            <Button
              asChild
              className="h-12 px-6 bg-green-600 text-white font-black rounded-xl uppercase italic shadow-lg active:scale-95 transition-all animate-pulse-fast"
            >
              <Link href={`/guides/${PRODUCT.id}/checkout`}>
                Télécharger <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .safe-area-bottom {
            padding-bottom: env(safe-area-inset-bottom, 12px);
        }
        @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
            animation: bounce-slow 3s infinite ease-in-out;
        }
        @keyframes pulse-fast {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7); }
            50% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(22, 163, 74, 0); }
        }
        .animate-pulse-fast {
            animation: pulse-fast 2s infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}