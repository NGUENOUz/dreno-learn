"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Star, Clock, PlayCircle, FileText,  ArrowRight, ShieldCheck, 
   Gift, MessageSquare, ChevronRight, ChevronLeft, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CourseCard } from "@/components/ui/CourseCard"; // Importation du composant
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CourseDetailsPage() {
  
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const params = useParams();
  const id = params.id; // Correction : l'ID est maintenant bien défini
  const scrollRef = useRef<HTMLDivElement>(null);

  // Données pour les cours recommandés
  const relatedCourses = [
    { id: "mkt-tiktok", title: "Vendre sur TikTok en Afrique", category: "Marketing", price: "15 000 FCFA", rating: 4.9, reviews: 850, duration: "10h", instructor: "Sarah K.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600" },
    { id: "fb-ads", title: "Facebook Ads : Spécial Afrique", category: "Marketing", price: "12 000 FCFA", rating: 4.8, reviews: 540, duration: "8h", instructor: "Moussa B.", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600" },
    { id: "canva-pro", title: "Design Pro avec Canva", category: "Design", price: "10 000 FCFA", rating: 4.7, reviews: 320, duration: "5h", instructor: "Alex D.", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600" },
    { id: "copy-writing", title: "Copywriting pour Entrepreneurs", category: "Business", price: "20 000 FCFA", rating: 5.0, reviews: 110, duration: "7h", instructor: "Dreno Boss", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600" },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative max-w-7xl mx-auto pb-20 lg:pb-10">
      
      {/* --- HERO BANNER --- */}
      <section className="relative w-full h-[50vh] md:h-[60vh] rounded-[2.5rem] overflow-hidden shadow-2xl mb-10 group">
        <Image src="https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1200" fill className="w-full h-full object-cover" alt="Banner" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/60 to-slate-900/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-1 bg-blue-600 text-white text-[10px] font-black uppercase rounded-full">Accès Immédiat</span>
            <span className="px-4 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase rounded-full border border-white/20">Business & Logistique</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight max-w-3xl tracking-tighter">Importation Chine : Le Guide Ultime pour 2026</h1>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-4">
               <div className="bg-white px-6 py-2 rounded-2xl shadow-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-1">Prix Promo</p>
                  <p className="text-2xl font-black text-blue-600 leading-none">20 000 FCFA</p>
               </div>
               <div className="text-white/60 line-through font-bold">45 000 FCFA</div>
            </div>
            <div className="flex items-center gap-4 text-white/90 text-sm font-bold">
              <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 4.9 (1,240 avis)</div>
              <div className="hidden sm:flex items-center gap-1"><Clock className="w-4 h-4 text-blue-400" /> 12h de coaching</div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2 md:px-0">
        <div className="lg:col-span-2 space-y-12">
          
          {/* CAPSULES VIDÉO */}
          <section className="space-y-4 relative">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2"><PlayCircle className="text-blue-600" /> Aperçus Vidéos</h3>
                <div className="flex gap-2">
                    <button onClick={() => scroll("left")} className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 shadow-sm"><ChevronLeft className="w-4 h-4" /></button>
                    <button onClick={() => scroll("right")} className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 shadow-sm"><ChevronRight className="w-4 h-4" /></button>
                </div>
            </div>
            <div ref={scrollRef} className="flex overflow-x-auto no-scrollbar gap-4 py-2 px-1">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="relative w-40 md:w-52 shrink-0 aspect-9/16 rounded-3xl overflow-hidden bg-slate-200 border-4 border-white shadow-lg group cursor-pointer transition-transform hover:-translate-y-1">
                        <Image src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&v=${i}`} fill className="w-full h-full object-cover" alt="Capsule" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                                <Play className="text-white fill-white w-6 h-6" />
                            </div>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4"><p className="text-[10px] font-black text-white leading-tight uppercase tracking-tighter">Épisode {i}</p></div>
                    </div>
                ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-black text-slate-900">Description de la formation</h3>
            <p className="text-slate-600 font-medium leading-relaxed">Apprenez les secrets les mieux gardés des importateurs à succès. Ce cours n&apos;est pas qu&apos;une simple théorie, c&apos;est un plan d&apos;action étape par étape pour sourcer vos produits en Chine, négocier comme un pro, et gérer la logistique vers l&apos;Afrique sans stress.</p>
          </section>

          {/* ACCORDION */}
          <section className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-2xl font-black text-slate-900">Programme de la formation</h3>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {[
                { title: "Module 1 : Introduction à l'importation", lessons: "4 leçons • 45min" },
                { title: "Module 2 : Trouver le bon fournisseur sur Alibaba", lessons: "6 leçons • 2h 15min" },
                { title: "Module 3 : Maîtriser les incoterms et la douane", lessons: "5 leçons • 1h 30min" },
                { title: "Module 4 : Stratégies de vente sur WhatsApp", lessons: "3 leçons • 1h 10min" }
              ].map((module, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border border-slate-100 rounded-2xl px-6 bg-slate-50/50">
                  <AccordionTrigger className="hover:no-underline py-5">
                    <div className="flex flex-col items-start text-left">
                        <span className="text-sm font-black text-slate-900">{module.title}</span>
                        <span className="text-[10px] text-blue-600 font-bold uppercase mt-1">{module.lessons}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-slate-500 font-medium text-sm">
                    Dans ce module, nous verrons en détail les étapes pour...
                    <ul className="mt-4 space-y-2">
                        <li className="flex items-center gap-2"><PlayCircle className="w-4 h-4 text-slate-300" /> Création de compte fournisseur</li>
                        <li className="flex items-center gap-2"><PlayCircle className="w-4 h-4 text-slate-300" /> Vérifier le TrustBadge</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* BONUS */}
          <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Inclus dans le prix</div>
                <h3 className="text-3xl font-black tracking-tight leading-none italic">Vos Bonus VIP <br/> <span className="text-blue-500">Totalement Gratuits</span></h3>
                <p className="text-slate-400 text-sm font-medium">Nous ne vous laissons pas seul. En plus des vidéos, vous repartez avec les outils pour démarrer dès demain.</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                 {[
                   { icon: FileText, title: "Carnet de 50 Fournisseurs", desc: "Vérifiés et testés par nos équipes." },
                   { icon: MessageSquare, title: "Groupe WhatsApp Privé", desc: "Posez vos questions en direct aux experts." },
                   { icon: ShieldCheck, title: "Modèles de Contrat", desc: "Pour sécuriser vos transactions Alibaba." }
                 ].map((bonus, i) => (
                   <motion.div whileHover={{ x: 5 }} key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/40"><bonus.icon className="w-5 h-5 text-white" /></div>
                      <div>
                        <p className="font-black text-sm">{bonus.title}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{bonus.desc}</p>
                      </div>
                   </motion.div>
                 ))}
              </div>
            </div>
          </section>

          {/* AVIS */}
          <section className="space-y-6">
             <h3 className="text-2xl font-black text-slate-900">Ce que nos étudiants disent</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Moussa Diop", city: "Dakar", text: "Grâce à Dreno, j'ai reçu ma première commande en 10 jours seulement." },
                  { name: "Fatou K.", city: "Abidjan", text: "La liste des fournisseurs est une mine d'or. Remboursé dès le premier achat." }
                ].map((avis, i) => (
                  <div key={i} className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-full" />
                        <div><p className="text-sm font-black text-slate-900">{avis.name}</p><p className="text-[10px] text-slate-400 font-bold uppercase">{avis.city}</p></div>
                     </div>
                     <p className="text-sm italic text-slate-600 font-medium">&quot;{avis.text}&quot;</p>
                     <div className="flex gap-0.5"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /></div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* --- SIDEBAR --- */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.08)] p-8 space-y-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16" />
              <div className="space-y-4">
                <p className="text-xs font-black text-red-500 uppercase tracking-tighter animate-pulse">🔥 Ne ratez pas cette offre !</p>
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter italic">20 000 FCFA</span>
                  <span className="text-sm text-slate-400 font-bold line-through">45 000 FCFA</span>
                </div>
              </div>

              {/* CORRECTION : Button asChild avec Link et span interne */}
              <Button asChild className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-lg shadow-xl shadow-blue-200 group relative overflow-hidden border-none cursor-pointer">
                <Link href={`/courses/${id}/checkout`}>
                  <span className="flex items-center justify-center w-full h-full">
                    <span className="relative z-10 flex items-center gap-2">Débloquer mon accès <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                    <motion.div className="absolute inset-0 bg-white/20" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                  </span>
                </Link>
              </Button>

              <div className="space-y-4 pt-6 border-t border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Inclus dans la formation</p>
                {[
                  { icon: ShieldCheck, text: "Garantie 100% Satisfait" },
                  { icon: MessageSquare, text: "Accès au groupe Privé VIP" },
                  { icon: Gift, text: "5 Bonus exclusifs inclus" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    <item.icon className="w-4 h-4 text-blue-600" /> {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* --- CARROUSEL : COURS COMPLÉMENTAIRES AVEC DONNÉES --- */}
      <section className="mt-20 space-y-8">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight ml-2">Complétez votre apprentissage :</h3>
        <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-6 p-4">
                {relatedCourses.map((course) => (
                    <div key={course.id} className="w-72 md:w-80 shrink-0">
                        <CourseCard 
                            id={course.id}
                            title={course.title}
                            category={course.category}
                            price={course.price}
                            rating={course.rating}
                            reviews={course.reviews}
                            duration={course.duration}
                            instructor={course.instructor}
                            image={course.image}
                        />
                    </div>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* --- MOBILE STICKY BOTTOM CTA --- */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div 
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 p-4 z-60 flex items-center justify-between gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] rounded-t-3xl"
          >
            <div className="pl-2">
              <p className="text-xl font-black text-slate-900 leading-none">20 000 FCFA</p>
              <p className="text-[10px] text-red-500 font-bold uppercase mt-1 tracking-tighter">-60% AUJOURD&apos;HUI</p>
            </div>
            <Button asChild className="flex-1 h-14 bg-blue-600 text-white font-black rounded-xl text-sm shadow-lg shadow-blue-100 border-none">
                <Link href={`/courses/${id}/checkout`}>
                    <span>Débloquer le guide</span>
                </Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}