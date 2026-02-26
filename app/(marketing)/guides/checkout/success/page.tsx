"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Download, MessageSquare, ArrowRight, Loader2, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const chariowId = searchParams.get("slug") || searchParams.get("product_id");
  const name = searchParams.get("name") || "Elite";

  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchGuide = async () => {
      if (!chariowId) return setLoading(false);
      const { data } = await supabase.from("guides").select("*").eq("chariow_id", chariowId).single();
      if (data) setGuide(data);
      setLoading(false);
    };
    fetchGuide();
  }, [chariowId, supabase]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="text-[10px] font-black uppercase italic text-slate-400">Génération de vos accès...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-20 px-6 font-sans">
      <div className="max-w-2xl mx-auto space-y-12">
        
        <div className="text-center space-y-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-100">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">Paiement <span className="text-blue-600">Validé !</span></h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Ravi de vous compter parmi nous, {name}</p>
          </div>
        </div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-[3.5rem] border-2 border-slate-100 p-10 md:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16" />
          
          <div className="space-y-10 relative z-10">
            <div className="space-y-2">
               <h2 className="text-2xl font-black italic uppercase tracking-tight">Vos livrables stratégiques</h2>
               <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest underline decoration-blue-600/30 underline-offset-4">{guide?.title || "Guide Elite"}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* PDF */}
              <div className="space-y-6 flex flex-col bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:border-blue-100 transition-colors">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg"><Download className="w-6 h-6 text-white" /></div>
                <div className="flex-grow space-y-1">
                  <h3 className="font-black text-sm uppercase italic tracking-tighter">Guide PDF Officiel</h3>
                  <p className="text-slate-400 text-[10px] font-medium leading-relaxed">Votre plan d&apos;action complet.</p>
                </div>
                <Button asChild className="w-full h-14 bg-slate-900 hover:bg-blue-600 rounded-xl font-black uppercase italic text-[10px] transition-all">
                  <a href={guide?.drive_pdf_link} target="_blank">Télécharger <ExternalLink className="ml-2 w-3 h-3" /></a>
                </Button>
              </div>

              {/* WhatsApp */}
              <div className="space-y-6 flex flex-col bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:border-green-100 transition-colors">
                <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg"><MessageSquare className="w-6 h-6 text-white" /></div>
                <div className="flex-grow space-y-1">
                  <h3 className="font-black text-sm uppercase italic tracking-tighter">Accès WhatsApp VIP</h3>
                  <p className="text-slate-400 text-[10px] font-medium leading-relaxed">Conseils & Entraide.</p>
                </div>
                <Button asChild className="w-full h-14 bg-green-600 hover:bg-green-700 rounded-xl font-black uppercase italic text-[10px] transition-all">
                  <a href="https://chat.whatsapp.com/votre-lien" target="_blank">Rejoindre <Sparkles className="ml-2 w-3 h-3 text-yellow-300" /></a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="text-center">
          <Button asChild variant="link" className="text-slate-400 font-bold uppercase text-[10px] italic tracking-widest hover:text-blue-600">
            <Link href="/guides">Retourner à la marketplace</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return <Suspense><SuccessContent /></Suspense>;
}