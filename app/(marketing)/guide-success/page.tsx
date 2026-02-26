"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2, CheckCircle2 } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  
  // RÉCUPÉRATION DE L'ID DEPUIS LES PARAMÈTRES QUERY (?chariow_id=...)
  const chariowId = searchParams.get("chariow_id"); 
  const name = searchParams.get("name") || "Elite";

  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

      // RECHERCHE PAR chariow_id ET NON PAR SLUG
      const { data, error } = await supabase
        .from("guides")
        .select("*")
        .eq("chariow_id", chariowId)
        .single();

      if (data) {
        setGuide(data);
      } else {
        console.error("Guide non trouvé pour chariow_id:", chariowId);
      }
      setLoading(false);
    };

    fetchGuide();
  }, [chariowId, supabase]);

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

  if (!guide) return (
    <div className="p-20 text-center">
      <h1 className="text-xl font-black text-red-500">ERREUR DE RÉCUPÉRATION</h1>
      <p className="text-sm text-slate-500 mt-2">Impossible de trouver le guide : {chariowId}</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-black italic uppercase">Paiement Validé !</h1>
      <p className="text-slate-500 mt-2">Félicitations {name}, vous avez accès à :</p>
      <h2 className="text-blue-600 font-bold text-xl mt-1">{guide.title}</h2>
      <a 
        href={guide.drive_pdf_link} 
        target="_blank" 
        className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase italic"
      >
        Télécharger mon guide
      </a>
    </div>
  );
}

export default function SuccessPage() {
  return <Suspense><SuccessContent /></Suspense>;
}