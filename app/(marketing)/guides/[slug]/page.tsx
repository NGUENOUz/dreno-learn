"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Star, Clock, PlayCircle, FileText, ArrowRight, ShieldCheck, 
  Gift, MessageSquare, ChevronRight, ChevronLeft, Download, 
  CheckCircle2, Globe, Flame, Zap, MapPin, Users, Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useParams } from "next/navigation";
import MOCK_GUIDES from "@/app/mockData/mock";

export default function GuideDetailsPage() {
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [salesCount, setSalesCount] = useState(437);
  const params = useParams();
  const slug = params.slug;
  const scrollRef = useRef<HTMLDivElement>(null);

  const guide = MOCK_GUIDES.find((g) => g.slug === slug);
  const relatedGuides = MOCK_GUIDES.filter(g => g.slug !== slug);

  // Données fictives des témoignages pour le style
  const testimonials = [
    { name: "Moussa D.", city: "Dakar", text: "Le guide Dubaï est ultra précis. J'ai obtenu mon visa en 48h sans payer un seul franc à une agence. Une vraie pépite.", rating: 5 },
    { name: "Aïcha K.", city: "Abidjan", text: "Le groupe WhatsApp est la vraie force de Dreno. On pose une question et on a une réponse d'expert en 10 minutes.", rating: 5 },
    { name: "Jean-Pierre T.", city: "Douala", text: "Grâce aux modèles de lettres, mon dossier Canada a été accepté du premier coup. Ce guide est rentabilisé en 1 jour.", rating: 5 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSalesCount(prev => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowStickyCTA(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!guide) return null;

  const EliteCard = ({ isMobileFlow = false }) => (
    <div className={`bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.08)] p-8 space-y-6 overflow-hidden relative w-full ${isMobileFlow ? 'lg:hidden mb-12' : ''}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16" />
      <div className="space-y-4 relative z-10">
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter flex items-center gap-2">
          <Zap className="w-3 h-3 animate-pulse" /> ACCÈS INSTANTANÉ 24H/7
        </p>
        <div className="flex flex-col">
          <span className="text-4xl font-black text-[#0F172A] tracking-tighter italic">
            {guide.price.toLocaleString()} FCFA
          </span>
          <span className="text-sm text-slate-400 font-bold line-through">
            {guide.oldPrice?.toLocaleString()} FCFA
          </span>
        </div>
      </div>

      <Button asChild className="w-full h-16 bg-[#2563EB] hover:bg-blue-700 text-white font-black rounded-2xl text-lg shadow-xl shadow-blue-200 group relative overflow-hidden border-none cursor-pointer transition-all active:scale-95">
        <Link href={`/checkout/${guide.chariow_id}`}>
          <span className="flex items-center justify-center w-full h-full">
            <span className="relative z-10 flex items-center gap-2 uppercase italic tracking-tighter">
              Obtenir mon Guide <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div 
              className="absolute inset-0 bg-white/20" 
              animate={{ x: ["-100%", "100%"] }} 
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }} 
            />
          </span>
        </Link>
      </Button>

      <div className="space-y-4 pt-6 border-t border-slate-50 relative z-10">
        {[
          { icon: ShieldCheck, text: "Garantie Mise à jour 2026" },
          { icon: MessageSquare, text: "Accès au Groupe WhatsApp VIP" },
          { icon: Download, text: "PDF + Modèles de Lettres" }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-700">
            <item.icon className={`w-4 h-4 shrink-0 ${i === 1 ? 'text-green-500' : 'text-blue-600'}`} /> {item.text}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative w-full max-w-7xl mx-auto pb-24 lg:pb-10 px-4 md:px-6 pt-10 overflow-x-hidden">
      
      {/* --- 1. STICKY TOP BAR --- */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div 
            initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }}
            className="hidden lg:flex fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-slate-100 p-4 z-[100] shadow-xl"
          >
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6">
               <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-100">
                    <Image src={guide.image_url} fill className="object-cover" alt="mini" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase italic line-clamp-1">{guide.title}</h4>
                    <p className="text-blue-600 font-bold text-xs">{guide.price.toLocaleString()} FCFA</p>
                  </div>
               </div>
               <Button asChild className="h-12 bg-blue-600 px-8 rounded-xl font-black italic uppercase text-xs">
                 <Link href={`/checkout/${guide.chariow_id}`}>Débloquer l'accès</Link>
               </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 2. HERO BANNER --- */}
      <section className="relative w-full h-[55vh] md:h-[65vh] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl mb-8 group">
        <Image src={guide.image_url} fill className="w-full h-full object-cover" alt={guide.title} priority />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 space-y-6">
          <div className="flex flex-wrap gap-3">
            <span className="px-5 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase rounded-full shadow-lg tracking-widest">Guide Officiel 2026</span>
            <span className="px-5 py-1.5 bg-green-600 text-white text-[10px] font-black uppercase rounded-full shadow-lg flex items-center gap-2">
              <MessageSquare className="w-3 h-3" /> WhatsApp VIP
            </span>
          </div>
          <h1 className="text-3xl md:text-6xl font-black text-white leading-tight max-w-4xl tracking-tighter italic uppercase underline decoration-blue-500/50 decoration-4 underline-offset-8">
            {guide.title}
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-4 shrink-0">
               <div className="bg-white px-6 py-3 rounded-2xl shadow-2xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-1">Prix de lancement</p>
                  <p className="text-2xl md:text-3xl font-black text-blue-600 leading-none">{guide.price.toLocaleString()} FCFA</p>
               </div>
               <div className="text-white/60 line-through font-bold text-base">{guide.oldPrice?.toLocaleString()} FCFA</div>
            </div>
            <div className="flex items-center gap-5 text-white/90 text-sm font-bold shrink-0">
              <div className="flex items-center gap-1.5"><Star className="w-5 h-5 text-yellow-400 fill-yellow-400" /> 4.9 (450 avis)</div>
              <div className="flex items-center gap-1.5 bg-blue-500/20 px-4 py-2 rounded-xl border border-blue-500/30">
                <ShieldCheck className="w-4 h-4 text-blue-400" /> Sans Agence
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. PROGRESS BAR (URGENCE) --- */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-6 md:p-10 shadow-inner">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 overflow-hidden relative shadow-sm">
                    <Image src={`https://i.pravatar.cc/100?u=${i + 20}`} fill alt="user" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-black text-slate-900 uppercase italic tracking-tighter">
                Déjà <span className="text-blue-600 underline">{salesCount} voyageurs</span> utilisent ce guide
              </p>
            </div>
            <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-100">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
              <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Plus que {(500 - salesCount)} places à ce prix</p>
            </div>
          </div>

          <div className="relative w-full h-5 bg-slate-200 rounded-full overflow-hidden border border-slate-300/50">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${(salesCount / 500) * 100}%` }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 rounded-full"
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:30px_30px] animate-[shimmer_2s_linear_infinite]" />
            </motion.div>
          </div>
          <div className="flex justify-between mt-3 px-1">
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Objectif promotionnel</span>
             <span className="text-[9px] font-black text-blue-600 uppercase italic tracking-tighter">{salesCount} / 500 vendus</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16">
        <div className="lg:col-span-2 space-y-16">
          
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900 italic uppercase flex items-center gap-3">
               <Globe className="text-blue-600 w-7 h-7" /> Pourquoi ce guide ?
            </h3>
            <div className="space-y-4 text-slate-600 font-medium leading-relaxed text-lg italic border-l-4 border-blue-600 pl-6">
              <p>{guide.description}</p>
              <p className="text-blue-600 not-italic font-black text-sm uppercase flex items-center gap-2">
                <MessageSquare className="w-5 h-5" /> Inclus : Accès au groupe d'entraide WhatsApp 24h/7
              </p>
            </div>
          </section>

          <section className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm space-y-8 relative overflow-hidden">
  {/* Badge de certification en haut à droite */}
  <div className="absolute top-8 right-8 hidden md:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
    <ShieldCheck className="w-4 h-4 text-blue-600" />
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Contenu Vérifié 2026</span>
  </div>

  <div className="space-y-2">
    <h3 className="text-2xl md:text-3xl font-black text-slate-900 italic uppercase tracking-tighter">
      Sommaire du <span className="text-blue-600">Plan d'Action</span>
    </h3>
    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
      {guide.content?.length} étapes clés pour réussir votre procédure solo
    </p>
  </div>

  <Accordion type="single" collapsible className="w-full space-y-4">
    {guide.content?.map((item, idx) => (
      <AccordionItem 
        key={idx} 
        value={`item-${idx}`} 
        className="border border-slate-100 rounded-[2rem] px-6 bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 overflow-hidden"
      >
        <AccordionTrigger className="hover:no-underline py-7 group">
          <div className="flex items-center gap-5 text-left">
            {/* Numérotation stylisée */}
            <div className="relative flex items-center justify-center shrink-0">
               <div className="w-10 h-10 rounded-2xl bg-blue-600/10 group-data-[state=open]:bg-blue-600 rotate-45 transition-colors duration-300" />
               <span className="absolute font-black text-sm text-blue-600 group-data-[state=open]:text-white transition-colors duration-300">
                 {idx + 1}
               </span>
            </div>
            
            <div className="space-y-1">
               <span className="text-base font-black text-slate-900 uppercase tracking-tighter group-hover:text-blue-600 transition-colors">
                 {item}
               </span>
               <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase">
                    <Clock className="w-3 h-3" /> 15 min de lecture
                  </span>
                  <span className="flex items-center gap-1 text-[9px] font-bold text-blue-500 uppercase">
                    <Zap className="w-3 h-3" /> Ressources incluses
                  </span>
               </div>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="pb-8 pt-2">
          <div className="pl-14 space-y-6">
            <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xl">
              Dans cette section, nous décortiquons la procédure exacte pour <strong>{item}</strong>. 
              Vous y trouverez les pièges à éviter et les secrets pour valider cette étape du premier coup.
            </p>

            {/* Micro-liste de ressources pour l'effet "Arsenal" */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: FileText, text: "Modèle de document Word", type: "Template" },
                { icon: Globe, text: "Lien portail gouvernemental", type: "Officiel" },
                { icon: ShieldCheck, text: "Checklist de vérification", type: "Outil" }
              ].map((res, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                   <res.icon className="w-4 h-4 text-blue-600" />
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-900 uppercase leading-none">{res.text}</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{res.type}</span>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
</section>

          <EliteCard isMobileFlow={true} />

          {/* --- SECTION TÉMOIGNAGES (SOCIAL PROOF) --- */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">Ils ont déjà réussi</h3>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Retours d'expérience de nos clients en Afrique</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((t, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 relative overflow-hidden group"
                >
                  <Quote className="absolute -top-2 -right-2 w-16 h-16 text-slate-50 group-hover:text-blue-50 transition-colors" />
                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm italic text-slate-600 font-medium leading-relaxed relative z-10">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-blue-600 text-xs shadow-inner">
                      {t.name.split(' ')[0][0]}{t.name.split(' ')[1]?.[0] || ''}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{t.name}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{t.city}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="bg-slate-950 rounded-[3.5rem] p-10 md:p-16 text-white relative overflow-hidden shadow-3xl">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 bg-blue-600 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Le Pack Elite</div>
                <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-none italic uppercase">
                  L'Arsenal <br/> <span className="text-blue-500 underline decoration-blue-500/30">VIP WhatsApp</span>
                </h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Vous n'êtes pas seul. Notre communauté WhatsApp est là pour vous accompagner dans chaque document, chaque rendez-vous.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-5">
                  {[
                    { icon: MessageSquare, color: 'bg-green-600', title: "Groupe d'Entraide WhatsApp", desc: "Échangez avec les autres et nos experts en temps réel." },
                    { icon: FileText, color: 'bg-blue-600', title: "Modèles de Lettres", desc: "Lettres explicatives et de motivation prêtes à l'emploi." },
                    { icon: ShieldCheck, color: 'bg-blue-600', title: "Checklist Anti-Refus", desc: "La liste pour un dossier 100% conforme." }
                  ].map((bonus, i) => (
                    <motion.div whileHover={{ x: 10 }} key={i} className="flex items-center gap-5 p-5 bg-white/5 rounded-3xl border border-white/10">
                       <div className={`w-14 h-14 ${bonus.color} rounded-2xl flex items-center justify-center shrink-0 shadow-xl`}><bonus.icon className="w-7 h-7 text-white" /></div>
                       <div>
                         <p className="font-black text-sm uppercase tracking-tighter">{bonus.title}</p>
                         <p className="text-[11px] text-slate-400 font-medium mt-1">{bonus.desc}</p>
                       </div>
                    </motion.div>
                  ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
          </section>
        </div>

        <aside className="lg:col-span-1 hidden lg:block relative">
          <div className="sticky top-28 h-fit pb-10">
            <EliteCard isMobileFlow={false} />
          </div>
        </aside>
      </div>

      <section className="mt-32 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
            <div className="space-y-2">
                <h3 className="text-3xl md:text-5xl font-black text-slate-900 italic uppercase tracking-tighter">Explorer d'autres <span className="text-blue-600 underline">Destinations</span></h3>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Économisez des milliers de FCFA sur ces procédures</p>
            </div>
            <Link href="/guides" className="text-blue-600 font-black text-xs uppercase italic flex items-center gap-2 group transition-all">
                Voir toute la marketplace <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>

        <ScrollArea className="w-full">
            <div className="flex space-x-8 pb-10">
                {relatedGuides.map((g) => (
                    <motion.div 
                        whileHover={{ y: -10 }}
                        key={g.id} 
                        className="w-[340px] shrink-0 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group"
                    >
                        <Link href={`/guides/${g.slug}`}>
                            <div className="relative h-56 w-full overflow-hidden">
                                <Image src={g.image_url} fill className="object-cover group-hover:scale-110 transition-all duration-700" alt={g.title} />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2 block">{g.category}</span>
                                    <h4 className="text-white font-black italic uppercase text-lg line-clamp-1 tracking-tighter leading-none">{g.title}</h4>
                                </div>
                            </div>
                            <div className="p-8 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 font-bold line-through">{g.oldPrice?.toLocaleString()}</span>
                                    <span className="text-2xl font-black text-slate-900 tracking-tighter italic leading-none">{g.price.toLocaleString()} FCFA</span>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                    <ChevronRight className="w-6 h-6" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      <AnimatePresence>
        {showStickyCTA && (
          <motion.div 
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            className="lg:hidden fixed bottom-6 left-6 right-6 bg-white/95 backdrop-blur-2xl border border-slate-100 p-5 z-[80] flex items-center justify-between gap-6 shadow-[0_25px_60px_rgba(0,0,0,0.2)] rounded-[2.5rem]"
          >
            <div className="shrink-0">
              <p className="text-[10px] font-black text-green-600 uppercase italic mb-1 tracking-widest">WHATSAPP INCLUS</p>
              <p className="text-xl font-black text-slate-900 italic leading-none">{guide.price.toLocaleString()} FCFA</p>
            </div>
            <Button asChild className="flex-1 h-16 bg-blue-600 text-white font-black rounded-2xl text-xs shadow-lg uppercase italic tracking-tighter active:scale-95 transition-all">
                <Link href={`/checkout/${guide.chariow_id}`}>
                    OBTENIR LE GUIDE <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 0 0; }
          100% { background-position: 60px 0; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}