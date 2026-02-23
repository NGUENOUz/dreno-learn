"use client";
import { CheckCircle2, MessageSquare, Download,  UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="max-w-4xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* VISUEL GAUCHE */}
        <div className="md:w-1/3 bg-blue-600 p-10 text-white flex flex-col justify-center items-center text-center space-y-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-black italic">Paiement Réussi !</h2>
          <p className="text-sm font-medium text-blue-100">Votre aventure commence maintenant.</p>
        </div>

        {/* CONTENU DROITE */}
        <div className="flex-1 p-8 md:p-14 space-y-10">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Quelles sont vos prochaines étapes ?</h1>
            <p className="text-slate-400 text-sm font-medium">Suivez ces 3 étapes pour profiter de votre formation.</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* ETAPE 1 : DRIVE */}
            <div className="flex items-start gap-5 p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-blue-200 transition-all">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600"><Download className="w-6 h-6" /></div>
              <div className="space-y-1 grow">
                <p className="font-black text-slate-900 italic">Accéder aux Ressources Drive</p>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Téléchargez vos guides et fichiers PDF immédiatement.</p>
              </div>
              <Button size="sm" className="bg-blue-600 rounded-xl h-10 px-4">Ouvrir</Button>
            </div>

            {/* ETAPE 2 : WHATSAPP */}
            <div className="flex items-start gap-5 p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-green-200 transition-all">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-green-500"><MessageSquare className="w-6 h-6" /></div>
              <div className="space-y-1 grow">
                <p className="font-black text-slate-900 italic">Rejoindre le Groupe VIP</p>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Échangez avec les autres apprenants et les coaches.</p>
              </div>
              <Button size="sm" className="bg-green-500 hover:bg-green-600 rounded-xl h-10 px-4">Rejoindre</Button>
            </div>

            {/* ETAPE 3 : FINALISATION COMPTE */}
            <div className="flex flex-col p-8 bg-blue-50 rounded-[2.5rem] border-2 border-dashed border-blue-200 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md text-blue-600"><UserPlus className="w-7 h-7" /></div>
                <div>
                  <p className="font-black text-slate-900 italic text-lg leading-none">Sécurisez votre compte</p>
                  <p className="text-xs text-blue-600 font-bold mt-1 tracking-tight">Créez un mot de passe pour retrouver vos cours à tout moment.</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                 <input type="password" placeholder="Nouveau mot de passe" className="flex-1 h-14 px-6 rounded-2xl border-none outline-none font-bold text-sm shadow-inner" />
                 <Button className="h-14 px-8 bg-slate-900 text-white font-black rounded-2xl">Finaliser l&apos;accès</Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}