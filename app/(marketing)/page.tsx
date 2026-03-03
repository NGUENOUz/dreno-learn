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
  FileCheck,
  Timer,
  AlertCircle,
  Eye,
  ZoomIn,
  AlertTriangle,
  FileText,
  Download,
  BookOpen,
  GraduationCap,
  Lightbulb,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import * as fbq from "@/lib/fpixel";

// --- CONFIGURATION ---
const PRODUCT = {
  id: "guide-express-2026",
  price: 2900,
  old_price: 15000,
  name: "Masterclass: Dossier Technique Canada", // Nom orienté éducation
};

// --- IMAGES DU GUIDE (Cloudinary) ---
const GUIDE_IMAGES = [
    { src: "https://res.cloudinary.com/dcsl6xhli/image/upload/v1772423462/guide_entr%C3%A9e_express_canada_odl7i3.png", title: "Module 1 : Le Sommaire" },
    { src: "https://res.cloudinary.com/dcsl6xhli/image/upload/v1772423462/guide_entr%C3%A9e_express_canada_1_yegxvd.png", title: "Module 2 : Stratégie" },
    { src: "https://res.cloudinary.com/dcsl6xhli/image/upload/v1772423462/guide_entr%C3%A9e_express_canada_2_rsra2r.png", title: "Module 3 : Synthèse" }
];
const COVER_IMAGE = "https://res.cloudinary.com/dcsl6xhli/image/upload/v1772423462/guide_entr%C3%A9e_express_canada_3_hqgkmm.png";
const guideCoverUrl = "https://res.cloudinary.com/dcsl6xhli/image/upload/v1772423462/guide_entr%C3%A9e_express_canada_3_hqgkmm.png";

// --- COMPOSANT : COMPTE À REBOURS (Urgence Douce) ---
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
    <div className={`flex items-center gap-1 text-blue-900 font-bold font-mono ${small ? "text-xs bg-blue-50 px-2 py-0.5" : "text-sm bg-blue-50 px-3 py-1.5"} rounded-lg border border-blue-100`}>
      <Timer className={small ? "w-3 h-3" : "w-4 h-4"} />
      <span>Fermeture de l'offre : {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
    </div>
  );
};

// --- COMPOSANT : PAGE APERÇU (Style "Livre de cours") ---
const PreviewPage = ({ src, title }: { src: string, title: string }) => (
  <div className="min-w-65 md:min-w-[300px] h-[380px] md:h-[420px] bg-white border border-slate-200 shadow-lg rounded-sm p-3 relative overflow-hidden flex flex-col shrink-0 select-none group cursor-zoom-in hover:shadow-2xl transition-all duration-300">
      {/* Filigrane Éducatif */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 bg-white/5 backdrop-blur-[0.5px]">
          <p className="text-slate-900/5 text-2xl font-black uppercase -rotate-45 whitespace-nowrap select-none">
              DRENO ACADEMY • COPY
          </p>
      </div>
      
      {/* Header Page */}
      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-white via-white to-transparent z-30 flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{title}</span>
      </div>

      {/* Image Contenu */}
      <div className="relative w-full h-full overflow-hidden bg-slate-50 mt-4 rounded-sm border border-slate-100">
          <Image 
            src={src} 
            alt={title} 
            fill 
            className="object-contain object-top group-hover:scale-105 transition-transform duration-700 ease-out" 
          />
      </div>
  </div>
);

// --- FONCTION DE TRACKING (Optimisée) ---
const handleDownloadClick = () => {
  // Tracking orienté "StartTrial" ou "Subscribe" pour l'algo éducation
  fbq.event("InitiateCheckout", {
    content_name: PRODUCT.name,
    content_category: "Education > Study Materials",
    currency: "XAF",
    value: PRODUCT.price,
  });
};

// --- COMPOSANT : CARTE D'ACHAT (Style "Frais de Scolarité") ---
const EliteCard = ({ isMobileFlow = false }: { isMobileFlow?: boolean }) => (
  <div
    className={`bg-white border border-slate-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-6 space-y-6 relative w-full overflow-hidden ${
      isMobileFlow ? "lg:hidden mb-12 rounded-3xl mx-auto max-w-sm" : "rounded-3xl"
    }`}
  >
    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-1.5 rounded-b-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-lg">
        Offre Pédagogique Limitée
    </div>

    <div className="space-y-4 text-center pt-8">
      <div className="flex flex-col items-center justify-center">
        <span className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
          {PRODUCT.price.toLocaleString()} F
        </span>
        <span className="text-sm text-slate-400 font-medium line-through mt-1">
          Valeur réelle : {PRODUCT.old_price.toLocaleString()} F
        </span>
      </div>
      
      <div className="flex flex-col items-center gap-2">
          <CountdownTimer />
      </div>
    </div>

    <Button
      asChild
      onClick={handleDownloadClick}
      className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-lg shadow-xl shadow-blue-100 group relative overflow-hidden active:scale-95 uppercase tracking-wide animate-pulse-slow"
    >
      <Link href={`/guides/${PRODUCT.id}/checkout`}>
        Télécharger maintenant <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </Link>
    </Button>

    <div className="space-y-3 pt-4 border-t border-slate-100">
      <div className="flex items-center gap-3 text-xs font-bold text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
        <BookOpen className="w-4 h-4 shrink-0 text-blue-600" /> Guide PDF complet
      </div>
      <div className="flex items-center gap-3 text-xs font-bold text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
        <FileText className="w-4 h-4 shrink-0 text-blue-600" /> Modèles CV Académique (Word)
      </div>
      <div className="flex items-center gap-3 text-xs font-bold text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
        <Users className="w-4 h-4 shrink-0 text-green-600" /> Groupe WhatsApp d&apos;entraide
      </div>
    </div>
    
    <div className="text-center mt-2">
        <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
            <Lock className="w-3 h-3"/> Paiement sécurisé • Accès Immédiat
        </p>
    </div>
  </div>
);

export default function Home() {
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowStickyCTA(window.scrollY > 800); 
    window.addEventListener("scroll", handleScroll);
    
    // Pixel : Vue de contenu "Éducatif"
    fbq.event("ViewContent", {
      content_name: PRODUCT.name,
      content_ids: [PRODUCT.id],
      content_category: "Education",
      content_type: "product",
      value: PRODUCT.price,
      currency: "XAF",
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full bg-slate-50 font-sans selection:bg-blue-100">
      
      {/* --- 1. BARRE FIXE DESKTOP (Navigation Académique) --- */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="hidden lg:flex fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200 p-3 z-50 shadow-sm justify-between items-center px-8"
          >
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black shadow-md">D</div>
                <div>
                    <h3 className="font-bold text-slate-900 text-sm uppercase">Programme Entrée Express</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500"/> Session 2026 Ouverte</span>
                    </div>
                </div>
             </div>

             <div className="flex items-center gap-6">
                 <div className="text-right">
                     <p className="text-xs text-slate-400 font-bold line-through">{PRODUCT.old_price} F</p>
                     <p className="text-xl font-black text-slate-900 leading-none">{PRODUCT.price} F</p>
                 </div>
                 <Button onClick={handleDownloadClick} asChild className="h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 rounded-lg uppercase text-xs tracking-wider shadow-lg shadow-blue-200 transition-transform hover:scale-105">
                    <Link href={`/guides/${PRODUCT.id}/checkout`}>
                        Télécharger le guide
                    </Link>
                 </Button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 2. HERO SECTION : L'Approche "Formation" --- */}
      <section className="relative pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden bg-white">
        
        {/* Grille de fond subtile "Cahier d'école" */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-50 rounded-full blur-[100px] opacity-60 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* COLONNE GAUCHE : Copywriting Éducatif */}
            <div className="space-y-8 text-center md:text-left">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-200 shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-600">Méthodologie Certifiée DrenoLearn™</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase leading-[0.95] tracking-tight">
                Ne sous-traitez pas <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">votre avenir.</span><br/>
                Apprenez à le faire.
              </h1>
              
              <p className="text-slate-600 text-lg font-medium max-w-xl mx-auto md:mx-0 leading-relaxed">
                Le guide étape par étape pour constituer votre <strong>Dossier Technique Canada</strong> vous-même. 
                Devenez autonome, maîtrisez les procédures et économisez des frais  inutiles.
              </p>
              
              {/* BLOC PRIX & CTA */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
                <Button 
                  asChild 
                  className="h-16 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold uppercase px-8 rounded-xl shadow-xl shadow-blue-200 hover:-translate-y-1 transition-all"
                >
                  <Link href="/guides/guide-express-2026/checkout">
                    <Download className="w-5 h-5 mr-3" />
                    Télécharger la formation
                  </Link>
                </Button>
                
                <div className="flex flex-col justify-center items-center sm:items-start pl-2">
                    <div className="text-2xl font-black text-slate-900">{PRODUCT.price} CFA</div>
                    <div className="text-xs text-slate-400 line-through font-medium">Au lieu de {PRODUCT.old_price} CFA</div>
                </div>
              </div>

              {/* Trust Signals "Académique" */}
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm font-bold text-slate-500">
                 <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-blue-600"/> Programme à jour 2026</span>
                 <span className="w-1 h-1 bg-slate-300 rounded-full"/>
                 <span className="flex items-center gap-1"><Users className="w-4 h-4 text-blue-600"/> +850 Apprenants</span>
              </div>

            </div>
            
            {/* COLONNE DROITE : VISUEL PRODUIT (Book/iPad) */}
            <div className="relative flex items-center justify-center perspective-1000">
              
              {/* Mockup Principal */}
              <div className="relative w-[300px] md:w-[380px] aspect-[3/4] bg-white rounded-r-2xl rounded-l-md shadow-2xl border-l-8 border-slate-800 rotate-y-12 rotate-z-3 hover:rotate-0 transition-transform duration-500 cursor-pointer group">
                  {/* Effet Livre */}
                  <div className="absolute inset-0 bg-slate-100 rounded-r-2xl border border-slate-200">
                      <Image 
                        src={guideCoverUrl} 
                        alt="Manuel de Formation" 
                        fill 
                        className="object-cover rounded-r-xl opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                  </div>
                  
                  {/* Badge "Manuel Officiel" */}
                  <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg border border-slate-100">
                      <p className="text-[10px] font-black uppercase text-blue-600 tracking-wider mb-0.5">Édition 2026</p>
                      <p className="text-xs font-bold text-slate-900">Manuel de Procédure</p>
                  </div>
              </div>

              {/* Elements Flottants "Outils" */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -left-4 bg-white p-3 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3"
              >
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><FileCheck className="w-5 h-5"/></div>
                  <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Inclus</p>
                      <p className="text-xs font-black text-slate-800">Checklist PDF</p>
                  </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 -right-8 bg-white p-3 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 z-20"
              >
                  <div className="bg-green-100 p-2 rounded-lg text-green-600"><MessageSquare className="w-5 h-5"/></div>
                  <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Bonus</p>
                      <p className="text-xs font-black text-slate-800">Support Groupe</p>
                  </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

    {/* --- 3. LE CURSUS (Refonte "Comment ça marche") --- */}
      <section id="programme" className="py-24 px-4 max-w-7xl mx-auto bg-slate-50/50">
  
  <div className="text-center mb-16 space-y-6">
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full text-blue-700 text-xs font-black uppercase tracking-widest border border-blue-200">
      syllabus complet 2026
    </div>
    <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-none">
       Ce que vous allez <span className="text-blue-600 border-b-4 border-blue-200">Maîtriser</span>.
    </h2>
    <p className="text-slate-600 font-medium text-lg max-w-3xl mx-auto">
       Ce n'est pas juste un PDF, c'est une formation complète. 
       Nous vous donnons les liens cachés, les formulaires exacts et la méthode pour ne pas être rejeté.
    </p>
  </div>

  <div className="grid md:grid-cols-3 gap-8">
      
      {/* MODULE 1 : PRÉPARATION & STRATÉGIE */}
      <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[4rem] -mr-8 -mt-8 z-0 transition-all group-hover:bg-blue-600 group-hover:scale-110"/>
          
          <div className="relative z-10">
              <span className="text-5xl mb-6 block drop-shadow-sm">📊</span>
              <h3 className="text-xl font-black text-slate-900 uppercase italic mb-2">1. L'Audit & Les Points</h3>
              <p className="text-sm text-slate-500 font-medium mb-6">Comment devenir éligible et calculer son score réel.</p>
              
              <ul className="space-y-4">
                  {[
                      "Le lien officiel pour simuler votre score (SCG)",
                      "Comment faire l'équivalence de diplôme (WES/IQAS)",
                      "La liste des tests de langue agréés (TEF/TCF)",
                      "L'astuce pour gagner des points sans offre d'emploi"
                  ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5"/>
                          <span className="text-sm font-bold text-slate-700 leading-snug">{item}</span>
                      </li>
                  ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-black text-blue-600 uppercase">
                  <Globe className="w-4 h-4"/> Inclus : Les liens directs
              </div>
          </div>
      </div>

      {/* MODULE 2 : CONSTITUTION DU DOSSIER (La Valeur Technique) */}
      <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border-2 border-blue-600 relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 transform scale-105 md:scale-110 z-10">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"/>
          <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">
              Le Cœur du Guide
          </div>

          <div className="relative z-10">
              <span className="text-5xl mb-6 block drop-shadow-sm">📝</span>
              <h3 className="text-xl font-black text-slate-900 uppercase italic mb-2">2. Le Dossier Technique</h3>
              <p className="text-sm text-slate-500 font-medium mb-6">Remplir les formulaires sans faire d'erreur fatale.</p>
              
              <ul className="space-y-4">
                  {[
                      "Trouver votre bon code CNP (Classification Nationale)",
                      "Combien faut-il sur le compte ? (Preuve de fonds)",
                      "Éviter les motifs de rejet fréquents (Checklist)",
                      "Comment déclarer l'expérience professionnelle"
                  ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5"/>
                          <span className="text-sm font-bold text-slate-900 leading-snug">{item}</span>
                      </li>
                  ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-black text-green-600 uppercase">
                  <FileText className="w-4 h-4"/> Inclus : Modèles Word
              </div>
          </div>
      </div>

      {/* MODULE 3 : EMPLOI & INVITATION */}
      <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-[4rem] -mr-8 -mt-8 z-0 transition-all group-hover:bg-purple-600 group-hover:scale-110"/>

          <div className="relative z-10">
              <span className="text-5xl mb-6 block drop-shadow-sm">🚀</span>
              <h3 className="text-xl font-black text-slate-900 uppercase italic mb-2">3. Emploi & Départ</h3>
              <p className="text-sm text-slate-500 font-medium mb-6">Optimiser ses chances depuis l'Afrique.</p>
              
              <ul className="space-y-4">
                  {[
                      "Refaire son CV au format Canadien (Template)",
                      "Les sites d'emploi qui recrutent à l'étranger",
                      "Comprendre le Guichet Emploi (Job Bank)",
                      "Les étapes après l'Invitation (Visite médicale...)"
                  ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5"/>
                          <span className="text-sm font-bold text-slate-700 leading-snug">{item}</span>
                      </li>
                  ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-black text-purple-600 uppercase">
                  <ShieldCheck className="w-4 h-4"/> Inclus : Anti-Arnaque
              </div>
          </div>
      </div>

  </div>


  <div className="mt-20 relative">
          
          {/* Connecteur visuel */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-slate-200 border-l border-dashed border-slate-300"/>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-blue-900/20 group">
              
              {/* Effets de fond animés */}
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"/>
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/30 rounded-full blur-[80px] group-hover:bg-blue-600/50 transition-all duration-700"/>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] group-hover:bg-purple-600/40 transition-all duration-700"/>

              <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                  
                  <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic leading-none">
                      Prêt à lancer votre <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Procédure 2026</span> ?
                  </h3>
                  
                  <p className="text-slate-300 text-lg font-medium leading-relaxed">
                      Ne perdez pas 6 mois à chercher des infos contradictoires sur Google. 
                      Téléchargez le plan exact qui a déjà aidé 850+ candidats.
                  </p>

                  <div className="flex flex-col items-center gap-6 pt-4">
                      {/* BOUTON PRINCIPAL */}
                      <Button 
                        asChild 
                        className="w-full md:w-auto h-20 bg-blue-600 hover:bg-white hover:text-blue-600 text-white text-xl md:text-2xl font-black italic uppercase px-12 rounded-2xl shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-600"
                      >
                          <Link href="/guides/guide-express-2026/checkout" className="flex items-center gap-4">
                              <span>Télécharger le Guide</span>
                              <ArrowRight className="w-8 h-8 animate-pulse"/>
                          </Link>
                      </Button>

                      {/* ÉLÉMENTS DE CONFIANCE */}
                      <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
                          <span className="flex items-center gap-2">
                              <Lock className="w-3 h-3 text-green-500"/> Paiement Sécurisé
                          </span>
                          <span className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"/> Livraison Immédiate
                          </span>
                          <span className="line-through decoration-red-500 decoration-2 text-slate-600">
                              Prix Normal : 15.000 F
                          </span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
</section>

      {/* --- 4. PROBLEM AWARENESS (L'Échec Académique) --- */}
      <section className="py-16 bg-slate-900 text-white overflow-hidden relative">
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
              <div className="inline-block p-3 bg-white/10 rounded-full mb-6">
                 <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black uppercase mb-6">
                  Pourquoi 90% des candidats sont <span className="text-red-500">Recalés</span> ?
              </h2>
              <p className="text-slate-300 text-lg md:text-xl font-light mb-10 leading-relaxed">
                  Ce n'est pas une question de chance. C'est un manque de méthode. <br/>
                  Une erreur de code métier, un document mal scanné ou une date incorrecte entraîne un <strong className="text-white">rejet automatique</strong> par le logiciel.
              </p>
              
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl max-w-2xl mx-auto backdrop-blur-sm">
                  <p className="font-bold text-lg flex items-center justify-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-400"/>
                      La Solution : La Connaissance.
                  </p>
                  <p className="text-sm text-slate-400 mt-2">
                      Notre guide fonctionne comme un corrigé d'examen. Il vous montre exactement quoi écrire et où cliquer pour satisfaire l'algorithme canadien.
                  </p>
              </div>
          </div>
          
          {/* Cercles décoratifs */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"/>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] translate-x-1/2 translate-y-1/2"/>
      </section>

      {/* --- 5. APERÇU DU CONTENU (Preview) --- */}
    <section className="py-20 bg-slate-50 border-y border-slate-200">
    <div className="text-center mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm mb-2">
            <Eye className="w-3 h-3 text-slate-400"/>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Extrait Gratuit</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic">Feuilletez le manuel</h2>
        <p className="text-slate-500 text-sm font-medium">Aperçu direct du contenu PDF (27+ pages)</p>
    </div>

    {/* Carousel Scroll */}
    <div className="flex overflow-x-auto pb-8 px-6 gap-6 md:justify-center no-scrollbar items-center snap-x snap-mandatory">
        {GUIDE_IMAGES.map((img, index) => (
            <div key={index} className="snap-center shrink-0 first:pl-4 last:pr-4">
                <PreviewPage src={img.src} title={img.title} />
            </div>
        ))}
    </div>

    {/* CTA AJOUTÉ 👇 */}
    <div className="text-center mt-8">
        <Button 
            asChild 
            className="bg-slate-900 hover:bg-blue-600 text-white font-black italic uppercase px-10 py-6 rounded-xl shadow-xl shadow-slate-200 hover:shadow-blue-200 hover:-translate-y-1 transition-all duration-300"
        >
            <Link href="/guides/guide-express-2026/checkout" className="flex items-center gap-3">
                <span>Télécharger la version complète</span>
                <ArrowRight className="w-4 h-4"/>
            </Link>
        </Button>
        <p className="text-[10px] text-slate-400 font-bold mt-3 uppercase tracking-wide">
            Lecture immédiate sur Téléphone & PC
        </p>
    </div>
</section>

      {/* --- 6. BONUS SECTION (La "Boîte à Outils") --- */}
      <section className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                  
                  <div className="md:w-1/2 space-y-6">
                      <h2 className="text-3xl font-black text-slate-900 uppercase leading-tight">
                          Plus qu'un PDF... <br/>
                          <span className="text-blue-600">Un Kit de Réussite.</span>
                      </h2>
                      <p className="text-slate-600">
                          Pour garantir votre succès, nous avons ajouté des outils pratiques que les consultants facturent habituellement très cher.
                      </p>
                      
                      <ul className="space-y-4">
                          {[
                              { t: "Modèles CV Canadien (Format Word)", d: "Respecte les normes ATS du marché du travail." },
                              { t: "Lettres de Motivation Prérédigées", d: "Copiez, collez, adaptez. Gagnez 10h de travail." },
                              { t: "Accès Communauté Privée", d: "Ne restez jamais bloqué face à une question." }
                          ].map((item, i) => (
                              <li key={i} className="flex gap-4 items-start">
                                  <div className="mt-1 bg-green-100 p-1 rounded text-green-600"><CheckCircle2 className="w-4 h-4"/></div>
                                  <div>
                                      <h4 className="font-bold text-slate-900">{item.t}</h4>
                                      <p className="text-xs text-slate-500">{item.d}</p>
                                  </div>
                              </li>
                          ))}
                      </ul>
                  </div>

                  <div className="md:w-1/2 relative">
                      {/* Abstract Visual Representation of Bonuses */}
                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                              <FileText className="w-8 h-8 mx-auto text-blue-500 mb-2"/>
                              <p className="font-bold text-sm">Templates</p>
                          </div>
                          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center mt-8">
                              <Users className="w-8 h-8 mx-auto text-green-500 mb-2"/>
                              <p className="font-bold text-sm">Réseau</p>
                          </div>
                          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center -mt-8">
                              <GraduationCap className="w-8 h-8 mx-auto text-purple-500 mb-2"/>
                              <p className="font-bold text-sm">Coaching</p>
                          </div>
                          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                              <ShieldCheck className="w-8 h-8 mx-auto text-slate-500 mb-2"/>
                              <p className="font-bold text-sm">Sécurité</p>
                          </div>
                      </div>
                  </div>

              </div>
          </div>
      </section>

      {/* --- 7. OFFRE FINALE --- */}
      <section className="py-20 px-4 bg-slate-50">
          <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10 space-y-3">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase">
                      Investissez en <span className="text-blue-600">Vous-même</span>
                  </h2>
                  <p className="text-slate-500 text-lg">
                      Le savoir est la seule chose que personne ne peut vous enlever.
                  </p>
              </div>

              <EliteCard isMobileFlow={false} />

              {/* AVIS ÉTUDIANTS */}
              <div className="mt-12 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                  <div className="flex justify-center gap-1 mb-3">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className="text-slate-800 font-medium italic">
                      "Je pensais devoir payer 2 millions à une agence. Ce guide m'a beaucoup appris. Actuellement, je suis en train de monter mon dossier."
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-3">
                      <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden">
                          <Image src="https://i.pravatar.cc/100?u=40" width={32} height={32} alt="Student"/>
                      </div>
                      <div className="text-left">
                          <p className="text-xs font-black text-slate-900 uppercase">Stéphane K.</p>
                          <p className="text-[10px] text-slate-400">Douala, Cameroun</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* --- 8. STICKY MOBILE CTA (Safe Area) --- */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-50 flex items-center justify-between gap-3 shadow-[0_-5px_30px_rgba(0,0,0,0.1)] md:hidden safe-area-bottom"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Prix Formation</span>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-black text-slate-900 leading-none">
                    {PRODUCT.price} F
                </p>
                <span className="text-xs line-through text-slate-400 decoration-red-400 decoration-2">
                  {PRODUCT.old_price}
                </span>
              </div>
            </div>
            
            <Button
              asChild
              onClick={handleDownloadClick}
              className="h-11 px-6 bg-blue-600 text-white font-bold rounded-lg uppercase tracking-wide text-xs shadow-lg active:scale-95 transition-all"
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
            padding-bottom: env(safe-area-inset-bottom, 16px);
        }
        .perspective-1000 {
            perspective: 1000px;
        }
        @keyframes pulse-slow {
            0%, 100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
            50% { box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); }
        }
        .animate-pulse-slow {
            animation: pulse-slow 3s infinite;
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