"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  CheckCircle2, Download, MessageSquare, 
  ArrowRight, Zap, ExternalLink, Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // On récupère l'id du produit (chariow_id) passé en paramètre par Chariow lors de la redirection
  const productId = searchParams.get("product_id") || searchParams.get("chariow_id");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchGuideAccess = async () => {
      if (!productId) return;
      try {
        const { data, error } = await supabase
          .from("guides")
          .select("*")
          .eq("chariow_id", productId)
          .single();

        if (data) setGuide(data);
      } catch (err) {
        console.error("Erreur récupération accès:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuideAccess();
  }, [productId, supabase]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="text-[10px] font-black uppercase italic text-slate-400 mt-4 tracking-widest">Vérification de la transaction...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-20 px-6">
      <div className="max-w-2xl mx-auto space-y-12">
        
        {/* HEADER RÉUSSITE */}
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-200"
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-900">
              Paiement <span className="text-blue-600">Validé !</span>
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">
              Bienvenue dans l&apos;élite DrenoLearn
            </p>
          </div>
        </div>

        {/* ACCÈS AUX LIVRABLES */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-[3.5rem] border-2 border-slate-100 p-10 md:p-14 shadow-[0_40px_80px_rgba(0,0,0,0.06)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16" />
          
          <div className="space-y-10 relative z-10">
            <div className="space-y-2">
               <h2 className="text-2xl font-black italic uppercase tracking-tight">Récupérer vos accès</h2>
               <p className="text-slate-400 text-xs font-medium uppercase">Guide : {guide?.title || "Chargement..."}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* ACCÈS PDF */}
              <div className="space-y-6 flex flex-col">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-1 flex-grow">
                  <h3 className="font-black text-sm uppercase italic tracking-tighter">Votre Guide PDF</h3>
                  <p className="text-slate-400 text-[10px] font-medium leading-relaxed">Inclut le plan d&apos;action complet et les modèles de lettres.</p>
                </div>
                <Button asChild className="w-full h-14 bg-slate-900 hover:bg-blue-600 rounded-xl font-black italic uppercase text-[10px] transition-all">
                  <a href={guide?.drive_pdf_link} target="_blank" rel="noreferrer">
                    Télécharger <ExternalLink className="w-3 h-3 ml-2" />
                  </a>
                </Button>
              </div>

              {/* ACCÈS WHATSAPP */}
              <div className="space-y-6 flex flex-col">
                <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-1 flex-grow">
                  <h3 className="font-black text-sm uppercase italic tracking-tighter">Groupe WhatsApp VIP</h3>
                  <p className="text-slate-400 text-[10px] font-medium leading-relaxed">Rejoignez la communauté et posez vos questions aux experts.</p>
                </div>
                <Button asChild className="w-full h-14 bg-green-600 hover:bg-green-700 rounded-xl font-black italic uppercase text-[10px] transition-all">
                  <a href="https://chat.whatsapp.com/votre-lien-ici" target="_blank" rel="noreferrer">
                    Rejoindre <ArrowRight className="w-3 h-3 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FOOTER */}
        <div className="text-center space-y-4">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
            Un reçu de paiement a été envoyé à votre adresse email.
          </p>
          <Button asChild variant="link" className="text-blue-600 font-black text-[10px] uppercase italic tracking-widest">
            <Link href="/guides">Retourner à la boutique</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Wrapper Suspense obligatoire pour useSearchParams dans Next.js
export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black italic uppercase text-slate-300">Synchronisation...</div>}>
      <SuccessContent />
    </Suspense>
  );
}