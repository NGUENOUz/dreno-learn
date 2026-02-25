"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  Clock,
  FileText,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  ChevronRight,
  Download,
  Globe,
  Zap,
  Quote,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

/**
 * COMPOSANT : EliteCard
 * La carte d'achat principale, utilisée en haut sur mobile et en sticky sur desktop
 */
const EliteCard = ({ guide, isMobileFlow = false }: { guide: any; isMobileFlow?: boolean }) => (
  <div
    className={`bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.08)] p-8 space-y-6 overflow-hidden relative w-full ${
      isMobileFlow ? "lg:hidden mb-12" : ""
    }`}
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16" />
    <div className="space-y-4 relative z-10">
      <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter flex items-center gap-2">
        <Zap className="w-3 h-3 animate-pulse" /> ACCÈS INSTANTANÉ 24H/7
      </p>
      <div className="flex flex-col">
        <span className="text-4xl font-black text-[#0F172A] tracking-tighter italic leading-none">
          {guide.price?.toLocaleString()} FCFA
        </span>
        {guide.old_price && (
          <span className="text-sm text-red-500 font-bold line-through opacity-60 mt-1">
            {guide.old_price?.toLocaleString()} FCFA
          </span>
        )}
      </div>
    </div>

    <Button
      asChild
      className="w-full h-16 bg-[#2563EB] hover:bg-blue-700 text-white font-black rounded-2xl text-lg shadow-xl shadow-blue-200 group relative overflow-hidden border-none cursor-pointer transition-all active:scale-95"
    >
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
        { icon: ShieldCheck, text: "Garantie Mise à jour 2026", color: "text-blue-600" },
        { icon: MessageSquare, text: "Accès au Groupe WhatsApp VIP", color: "text-green-500" },
        { icon: Download, text: "PDF + Modèles de Lettres", color: "text-blue-600" },
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-700">
          <item.icon className={`w-4 h-4 shrink-0 ${item.color}`} /> {item.text}
        </div>
      ))}
    </div>
  </div>
);

export default function GuideDetailsPage() {
  const params = useParams();
  const slug = params.slug;
  const [guide, setGuide] = useState<any>(null);
  const [relatedGuides, setRelatedGuides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [salesCount, setSalesCount] = useState(0);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const testimonials = [
    {
      name: "Moussa D.",
      city: "Dakar",
      text: "Le guide Dubaï est ultra précis. J'ai obtenu mon visa en 48h sans payer un seul franc à une agence. Une vraie pépite.",
      rating: 5,
      initial: "MD",
    },
    {
      name: "Aïcha K.",
      city: "Abidjan",
      text: "Le groupe WhatsApp est la vraie force de Dreno. On pose une question et on a une réponse d'expert en 10 minutes.",
      rating: 5,
      initial: "AK",
    },
    {
      name: "Jean-Pierre T.",
      city: "Douala",
      text: "Grâce aux modèles de lettres, mon dossier Canada a été accepté du premier coup. Ce guide est rentabilisé en 1 jour.",
      rating: 5,
      initial: "JT",
    },
    {
      name: "Fatou B.",
      city: "Conakry",
      text: "Je n'y croyais plus après deux refus. Le Guide Complet m'a aidé à comprendre mes erreurs. Visa obtenu !",
      rating: 5,
      initial: "FB",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: current, error } = await supabase
          .from("guides")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) throw error;
        setGuide(current);
        setSalesCount(current.actual_sales || 0);

        const { data: others } = await supabase
          .from("guides")
          .select("*")
          .neq("slug", slug)
          .limit(6);
        if (others) setRelatedGuides(others);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchData();
  }, [slug, supabase]);

  useEffect(() => {
    const handleScroll = () => setShowStickyCTA(window.scrollY > 700);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest">
          Chargement de l&apos;arsenal...
        </p>
      </div>
    );

  if (!guide)
    return (
      <div className="min-h-screen flex items-center justify-center font-black uppercase text-slate-300">
        Guide introuvable
      </div>
    );

  return (
    <div className="relative w-full max-w-7xl mx-auto pb-24 lg:pb-10 px-4 md:px-6 pt-10">
      
      {/* 1. STICKY HEADER CTA (DESKTOP) */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="hidden lg:flex fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-slate-100 p-4 z-[100] shadow-xl"
          >
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-100">
                  <Image src={guide.image_url} fill className="object-cover" alt="mini" />
                </div>
                <h4 className="text-sm font-black text-slate-900 uppercase italic line-clamp-1">
                  {guide.title}
                </h4>
              </div>
              <Button
                asChild
                className="h-12 bg-blue-600 px-8 rounded-xl font-black italic uppercase text-xs shadow-lg shadow-blue-200"
              >
                <Link href={`/checkout/${guide.chariow_id}`}>Accéder au guide</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HERO BANNER */}
      <section className="relative w-full h-[55vh] md:h-[65vh] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl mb-8 group">
        <Image src={guide.image_url} fill className="w-full h-full object-cover" alt={guide.title} priority />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 space-y-6">
          <div className="flex flex-wrap gap-3">
            <span className="px-5 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase rounded-full shadow-lg tracking-widest">
              Guide Officiel 2026
            </span>
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
                <p className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-1">
                  Offre Spéciale
                </p>
                <p className="text-2xl md:text-3xl font-black text-blue-600 leading-none">
                  {guide.price?.toLocaleString()} FCFA
                </p>
              </div>
              <div className="text-white/60 line-through font-bold text-base">
                {guide.old_price?.toLocaleString()} FCFA
              </div>
            </div>
            <div className="flex items-center gap-5 text-white/90 text-sm font-bold shrink-0">
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" /> 4.9 (450 avis)
              </div>
              <div className="flex items-center gap-1.5 bg-blue-500/20 px-4 py-2 rounded-xl border border-blue-500/30">
                <ShieldCheck className="w-4 h-4 text-blue-400" /> Sans Agence
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROGRESS BAR AVEC AVATARS */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-6 shadow-inner">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3 shrink-0">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative shadow-sm">
                    <Image src={`https://i.pravatar.cc/100?u=${i + 40}`} fill alt="user" />
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                Déjà <span className="text-blue-600 underline">{salesCount} voyageurs</span> ont payé le guide
              </p>
            </div>
            <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <p className="text-[9px] font-black text-red-600 uppercase tracking-widest">
                Promotion limitée : Objectif {guide.sales_target}
              </p>
            </div>
          </div>
          <div className="relative w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(salesCount / (guide.sales_target || 500)) * 100}%` }}
              transition={{ duration: 2 }}
              className="absolute h-full bg-blue-600 rounded-full"
            />
          </div>
        </div>
      </section>

      {/* 4. MAIN CONTENT GRID (STICKY LOGIC HERE) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16 items-start">
        <div className="lg:col-span-2 space-y-16">
          
          {/* SECTION : POURQUOI ? */}
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900 italic uppercase flex items-center gap-3">
              <Globe className="text-blue-600 w-7 h-7" /> Pourquoi ce guide ?
            </h3>
            <div className="text-slate-600 font-medium leading-relaxed text-lg italic border-l-4 border-blue-600 pl-6">
              <p>{guide.marketing_description}</p>
            </div>
          </section>

          {/* SECTION : SOMMAIRE */}
          <section className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm space-y-8 relative overflow-hidden">
            <div className="absolute top-8 right-8 hidden md:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Vérifié 2026
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 italic uppercase tracking-tighter">
                Sommaire du <span className="text-blue-600">Plan d&apos;Action</span>
              </h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                {guide.content_list?.length || 0} étapes clés pour réussir votre procédure solo
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {guide.content_list?.map((item: any, idx: number) => (
                <AccordionItem
                  key={idx}
                  value={`item-${idx}`}
                  className="border border-slate-100 rounded-4xl px-6 bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 overflow-hidden"
                >
                  <AccordionTrigger className="hover:no-underline py-7 group">
                    <div className="flex items-center gap-5 text-left">
                      <div className="relative flex items-center justify-center shrink-0">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600/10 group-data-[state=open]:bg-blue-600 rotate-45 transition-colors duration-300" />
                        <span className="absolute font-black text-sm text-blue-600 group-data-[state=open]:text-white transition-colors duration-300">
                          {idx + 1}
                        </span>
                      </div>
                      <span className="text-base font-black text-slate-900 uppercase tracking-tighter group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 pt-2 pl-14 space-y-6">
                    <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xl">
                      {item.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { icon: FileText, text: "Modèle de document Word", type: "Template" },
                        { icon: Globe, text: "Lien portail gouvernemental", type: "Officiel" },
                      ].map((res, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                          <res.icon className="w-4 h-4 text-blue-600" />
                          <div className="flex flex-col leading-tight">
                            <span className="text-[10px] font-black text-slate-900 uppercase leading-none">{res.text}</span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{res.type}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* CARTE MOBILE FLOW (Se cache sur desktop) */}
          <EliteCard guide={guide} isMobileFlow={true} />

          {/* SECTION : TÉMOIGNAGES */}
          <section className="space-y-8">
            <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">
              Impact <span className="text-blue-600">DrenoLearn</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 relative overflow-hidden group">
                  <Quote className="absolute -top-2 -right-2 w-16 h-16 text-slate-50 group-hover:text-blue-50 transition-colors" />
                  <div className="flex gap-1 relative z-10">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm italic text-slate-600 font-medium leading-relaxed relative z-10">
                    &quot;{t.text}&quot;
                  </p>
                  <div className="flex items-center gap-3 pt-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-white text-xs shadow-inner">
                      {t.initial}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{t.name}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{t.city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION : BONUS ARSENAL */}
          <section className="bg-slate-950 rounded-[3.5rem] p-10 md:p-16 text-white relative overflow-hidden shadow-3xl">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 bg-blue-600 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Inclus dans l&apos;achat
                </div>
                <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-none italic uppercase">
                  L&apos;Arsenal <br />{" "}
                  <span className="text-blue-500 underline decoration-blue-500/30">VIP WhatsApp</span>
                </h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Notre communauté WhatsApp vous accompagne dans chaque document, chaque rendez-vous. Ne restez plus jamais seul face à l&apos;administration.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-5">
                {[
                  { icon: MessageSquare, color: "bg-green-600", title: "Groupe WhatsApp", desc: "Échangez avec les autres et nos experts." },
                  { icon: FileText, color: "bg-blue-600", title: "Modèles de Lettres", desc: "Format Word prêt à l'emploi." },
                  { icon: ShieldCheck, color: "bg-blue-600", title: "Checklist Anti-Refus", desc: "100% conforme aux exigences 2026." },
                ].map((bonus, i) => (
                  <motion.div whileHover={{ x: 10 }} key={i} className="flex items-center gap-5 p-5 bg-white/5 rounded-3xl border border-white/10">
                    <div className={`w-14 h-14 ${bonus.color} rounded-2xl flex items-center justify-center shrink-0 shadow-xl`}>
                      <bonus.icon className="w-7 h-7 text-white" />
                    </div>
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

        {/* ✅ COLONNE DROITE : STICKY ELITE CARD (DESKTOP) */}
        <aside className="lg:col-span-1 hidden lg:block sticky top-28 h-fit pb-20">
          <EliteCard guide={guide} isMobileFlow={false} />
        </aside>
      </div>

      {/* RELATED GUIDES CAROUSEL */}
      <section className="mt-32 space-y-12 pb-20">
        <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">
          Autres <span className="text-blue-600">Stratégies</span>
        </h3>
        <ScrollArea className="w-full">
          <div className="flex space-x-8 pb-10">
            {relatedGuides.map((g) => (
              <Link href={`/guides/${g.slug}`} key={g.id} className="w-80 shrink-0 group">
                <div className="relative h-48 w-full rounded-[2.5rem] overflow-hidden mb-4 shadow-md bg-slate-100">
                  <Image src={g.image_url} fill className="object-cover group-hover:scale-110 transition-transform duration-700" alt={g.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-black italic uppercase text-sm line-clamp-1 tracking-tighter leading-none">
                      {g.title}
                    </p>
                  </div>
                </div>
                <p className="text-blue-600 font-black italic text-lg">{g.price?.toLocaleString()} FCFA</p>
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* 5. BOUTON FLOTTANT MOBILE (APPARAÎT AU SCROLL) */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="lg:hidden fixed bottom-6 left-4 right-4 bg-white/95 backdrop-blur-xl border border-slate-100 p-4 z-[110] flex items-center justify-between gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2rem]"
          >
            <div className="shrink-0 pl-2">
              <p className="text-[8px] font-black text-green-600 uppercase italic tracking-widest leading-none mb-1">
                WHATSAPP INCLUS
              </p>
              <p className="text-xl font-black text-slate-900 italic leading-none">
                {guide.price?.toLocaleString()} FCFA
              </p>
            </div>
            <Button
              asChild
              className="flex-1 h-14 bg-blue-600 text-white font-black rounded-xl text-xs uppercase italic tracking-tighter shadow-lg shadow-blue-200 active:scale-95 transition-all"
            >
              <Link href={`/checkout/${guide.chariow_id}`}>
                OBTENIR <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes shimmer { 0% { background-position: 0 0; } 100% { background-position: 60px 0; } }
      `}</style>
    </div>
  );
}