"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2, CheckCircle2, AlertCircle, Database } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  
  // L'ID reçu directement de l'URL (envoyé par le checkout)
  const chariowId = searchParams.get("chariow_id"); 
  const name = searchParams.get("name") || "Elite";

  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchGuide = async () => {
      if (!chariowId) {
        setLoading(false);
        return;
      }

      console.log("🔍 RECHERCHE EN BD POUR :", chariowId);

      // HYPOTHÈSE APPLIQUÉE : maybeSingle() pour ne pas crasher si 0 lignes
      const { data, error } = await supabase
        .from("guides")
        .select("*")
        .eq("chariow_id", chariowId)
        .maybeSingle();

      if (error) {
        console.error("Erreur Supabase :", error.message);
        setDbError(error.message);
      }
      
      if (data) {
        setGuide(data);
      }
      
      setLoading(false);
    };

    fetchGuide();
  }, [chariowId, supabase]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>;

  // CAS 1 : GUIDE NON TROUVÉ (Affichage de la zone de Debug)
  if (!guide) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 p-6 text-center">
      <AlertCircle className="w-20 h-20 text-red-500" />
      <h1 className="text-3xl font-black text-slate-900 uppercase">Guide introuvable</h1>
      
      {/* 🛑 PANNEAU DE DIAGNOSTIC ROUGE */}
      <div className="bg-white p-6 rounded-2xl border-2 border-red-100 shadow-xl max-w-lg w-full text-left space-y-4">
         <h3 className="font-black text-red-600 uppercase text-sm tracking-widest border-b border-red-50 pb-2 flex items-center gap-2">
            <Database className="w-4 h-4" /> Diagnostic du problème
         </h3>
         
         <div>
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">ID depuis l'URL :</p>
            <code className="bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg text-sm font-bold block">
                "{chariowId}"
            </code>
         </div>

         <div>
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Erreur Supabase renvoyée :</p>
            <code className="bg-slate-100 text-red-600 px-3 py-1.5 rounded-lg text-sm font-bold block">
                {dbError || "Aucune erreur (juste 0 lignes trouvées)"}
            </code>
         </div>

         <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-800 font-medium">
                <strong>💡 Si l'ID ci-dessus est correct :</strong> Le problème vient à 100% des règles <strong>RLS (Row Level Security)</strong> dans Supabase. Allez dans Supabase et désactivez temporairement le RLS sur la table <code>guides</code> pour vérifier.
            </p>
         </div>
      </div>
    </div>
  );

  // CAS 2 : SUCCÈS (Affichage du guide et du logo de DB)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
      <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
      <h1 className="text-4xl font-black italic uppercase">Paiement Validé !</h1>
      <p className="mt-4 text-lg text-slate-600">Félicitations {name}, voici votre guide :</p>
      <h2 className="text-3xl font-black text-blue-600 mt-2">{guide.title}</h2>
      
      {/* ✅ PANNEAU DE DIAGNOSTIC VERT (Le "logo" demandé) */}
      <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Connecté avec succès en base de données</p>
          <div className="inline-flex items-center gap-3 bg-slate-900 text-white px-5 py-2.5 rounded-full text-xs shadow-lg">
            <Database className="w-4 h-4 text-green-400" />
            <span className="font-medium text-slate-300">ID BD :</span>
            <span className="font-mono font-bold text-green-400">{guide.chariow_id}</span>
          </div>
      </div>
      
      <a href={guide.drive_pdf_link} target="_blank" className="mt-10 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase shadow-xl hover:scale-105 transition-transform">
        Télécharger mon accès
      </a>
    </div>
  );
}

export default function GuideSuccessPage() {
  return <Suspense><SuccessContent /></Suspense>;
}