"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { finalizeSignUpAction } from "@/app/actions/auth";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // RÉCUPÉRATION DES DONNÉES DU PAIEMENT DEPUIS L'URL
  const email = searchParams.get("email") || "";
  const name = searchParams.get("name") || "";
  const phone = searchParams.get("phone") || "";

  const [password, setPassword] = useState("");
  const [isFinalizing, setIsFinalizing] = useState(false);

  const handleComplete = async () => {
    if (!email) return toast.error("Données de session manquantes.");
    setIsFinalizing(true);

    const result = await finalizeSignUpAction({
      email,
      password,
      full_name: name,
      phone: phone
    });

    if (result.success) {
      toast.success(`Félicitations ${name.split(' ')[0]} ! Votre compte Elite est prêt. 🎉`);
      router.push("/dashboard");
    } else {
      toast.error(result.error);
      setIsFinalizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-10 text-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Étape Finale
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter italic uppercase">
            Plus qu'une étape <br/> pour vos accès
          </h1>
          <p className="text-slate-500 font-medium">
            Ravi de vous compter parmi nous, <span className="text-blue-600 font-bold">{name}</span>. <br/>
            Créez votre mot de passe pour retrouver vos formations dans votre espace personnel.
          </p>
        </div>

        <div className="bg-slate-50 p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-2xl space-y-6 text-left relative overflow-hidden">
           <div className="space-y-2">
             <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Mot de passe secret</label>
             <div className="relative">
               <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
               <input 
                 type="password"
                 required
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full h-16 pl-14 pr-6 rounded-2xl border-2 border-white bg-white font-bold outline-none focus:border-blue-600 transition-all shadow-sm"
                 placeholder="6 caractères minimum"
               />
             </div>
           </div>

           <Button 
             onClick={handleComplete}
             disabled={password.length < 6 || isFinalizing}
             className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-lg group shadow-xl shadow-blue-200"
           >
             {isFinalizing ? <Loader2 className="animate-spin" /> : (
               <span className="flex items-center gap-2 uppercase italic tracking-tighter">
                 Activer mon accès Elite <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </span>
             )}
           </Button>
           
           <p className="text-[9px] text-center text-slate-400 font-bold uppercase">
             Utilisez l'email {email} pour vos futures connexions.
           </p>
        </div>
      </div>
    </div>
  );
}

// Wrapper pour Suspense (Obligatoire pour useSearchParams dans Next.js)
export default function FinalizeAccountPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>}>
            <SuccessContent />
        </Suspense>
    );
}