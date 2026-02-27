"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { 
  Loader2, CheckCircle2, Download, 
  MessageSquare, Sparkles, UserPlus 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti"; // 🎉 L'outil magique



 const triggerConfetti = () => {
    const duration = 3 * 1000; // Dure 3 secondes
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Couleurs : Bleu Dreno, Vert Succès, Jaune Étoile
      const colors = ['#2563EB', '#22C55E', '#EAB308']; 

      // Tir depuis la gauche
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        colors,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
      }));
      // Tir depuis la droite
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        colors,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
      }));
    }, 250);
  };
export default function SuccessClient() {
  const searchParams = useSearchParams();
  const chariowId = searchParams.get("chariow_id"); 
  const name = searchParams.get("name") || "Champion";
  const email = searchParams.get("email") || "";

  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchGuide = async () => {
      if (!chariowId) return setLoading(false);
      const { data } = await supabase
        .from("guides")
        .select("*")
        .eq("chariow_id", chariowId)
        .maybeSingle(); // Sécurité anti-crash

      if (data) {
        setGuide(data);
        // 🎉 DÉCLENCHEMENT DES CONFETTIS AU CHARGEMENT RÉUSSI
        triggerConfetti();
      }
      setLoading(false);
    };
    fetchGuide();
  }, [chariowId, supabase]);

  // 🎇 FONCTION D'ANIMATION : Effet "Feu d'artifice" aux couleurs de DrenoLearn
 

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Génération de vos accès...</p>
    </div>
  );

  if (!guide) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <h1 className="text-2xl font-black text-red-500 uppercase">Accès introuvable</h1>
      <p className="text-slate-500">Un problème est survenu avec l&apos;identifiant de la commande.</p>
      <Button asChild variant="outline"><Link href="/guides">Retour à la boutique</Link></Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-20 px-4 md:px-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* EN-TÊTE */}
        <div className="text-center space-y-6 relative z-10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-200">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">Paiement <span className="text-blue-600">Validé !</span></h1>
            <p className="text-slate-500 font-medium text-lg">Félicitations {name}, votre arsenal stratégique est prêt.</p>
          </div>
        </div>

        {/* CARTES D'ACTION */}
        <div className="bg-white rounded-[3rem] border border-slate-100 p-8 md:p-12 shadow-2xl shadow-blue-900/5 space-y-10 relative overflow-hidden z-10">
          <div className="space-y-2 relative z-10">
             <h2 className="text-2xl font-black italic uppercase tracking-tight text-slate-900 line-clamp-2">{guide.title}</h2>
             <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Sparkles className="w-3 h-3"/> Accès Débloqué</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {/* BOUTON PDF */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col space-y-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg"><Download className="w-6 h-6 text-white" /></div>
              <div className="grow">
                <h3 className="font-black text-sm uppercase tracking-tighter">Guide PDF & Modèles</h3>
                <p className="text-slate-400 text-xs mt-1">Téléchargez vos documents sur Google Drive.</p>
              </div>
              <Button asChild className="w-full h-14 bg-slate-900 hover:bg-blue-600 rounded-2xl font-black uppercase italic text-xs transition-all">
                <a href={guide.drive_pdf_link} target="_blank" rel="noopener noreferrer">Télécharger le Pack</a>
              </Button>
            </div>

            {/* BOUTON WHATSAPP */}
            <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100 flex flex-col space-y-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg"><MessageSquare className="w-6 h-6 text-white" /></div>
              <div className="grow">
                <h3 className="font-black text-sm uppercase tracking-tighter text-green-900">Groupe WhatsApp VIP</h3>
                <p className="text-green-700/70 text-xs mt-1">Rejoignez la communauté pour vos questions.</p>
              </div>
              <Button asChild className="w-full h-14 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black uppercase italic text-xs transition-all shadow-xl shadow-green-200">
                <a href="https://chat.whatsapp.com/TON_LIEN_ICI" target="_blank" rel="noopener noreferrer">Rejoindre le groupe</a>
              </Button>
            </div>
          </div>
        </div>

        {/* UPSALE / CRÉATION DE COMPTE */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl z-10 relative">
           <div className="space-y-2 text-center md:text-left">
              <h3 className="text-white font-black italic uppercase text-xl flex items-center justify-center md:justify-start gap-2"><UserPlus className="w-5 h-5 text-blue-500"/> Sécurisez votre achat</h3>
              <p className="text-slate-400 text-xs font-medium max-w-sm">Créez un compte DrenoLearn gratuitement pour retrouver ce guide à vie dans votre espace membre.</p>
           </div>
           {/* On passe l'email et le nom en paramètre pour pré-remplir la page register */}
           <Button asChild className="w-full md:w-auto h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shrink-0">
              <Link href={`/register?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`}>Créer mon compte</Link>
           </Button>
        </motion.div>

      </div>
    </div>
  );
}

