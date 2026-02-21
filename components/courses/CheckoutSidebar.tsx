"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X,  Smartphone,  Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { initiateChariowCheckout } from "@/app/actions/checkout";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    id: string;
    title: string;
    price: string;
    image: string;
  };
}

export function CheckoutSidebar({ isOpen, onClose, course }: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });

  const handlePayment = async () => {
    if (!formData.email || !formData.phone || !formData.name) return alert("Veuillez remplir tous les champs");
    setLoading(true);
    const result = await initiateChariowCheckout({
      product_id: course.id,
      email: formData.email,
      full_name: formData.name,
      phone: formData.phone,
    });

    if (result.url) {
      window.location.href = result.url;
    } else {
      alert("Erreur: " + result.error);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          // z-[9999] pour être absolument au-dessus de TOUT (header, nav mobile, cta)
          className="fixed inset-0 bg-white md:bg-slate-950/60 md:backdrop-blur-2xl z-9999 flex items-center justify-center overflow-hidden"
        >
          {/* BOUTON FERMER (Desktop uniquement) */}
          <button 
            onClick={onClose}
            className="hidden md:flex absolute top-10 right-10 p-4 bg-white/10 text-white hover:bg-white/20 rounded-full transition-all border border-white/10"
          >
            <X className="w-6 h-6" />
          </button>

          <motion.div 
            initial={{ y: "100%", opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="w-full h-full md:h-[90vh] md:max-w-6xl md:rounded-[3rem] bg-white shadow-2xl flex flex-col md:flex-row relative"
          >
            {/* --- HEADER MOBILE (Remplace le header du site) --- */}
            <div className="flex md:hidden items-center justify-between p-6 border-b border-slate-50 bg-white sticky top-0 z-10">
                <button onClick={onClose} className="p-2 -ml-2 text-slate-400"><X className="w-6 h-6" /></button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">DrenoLearn Secure</span>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Transaction chiffrée SSL</p>
                </div>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* --- COLONNE GAUCHE : LE PANIER VISUEL --- */}
            
            {/* --- COLONNE DROITE : LE FORMULAIRE --- */}
            <div className="flex-1 bg-white p-8 md:p-20 overflow-y-auto">
              <div className="max-w-md mx-auto space-y-12">
                <div className="space-y-4">
                   <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter italic">Vos accès personnels</h2>
                   <p className="text-sm text-slate-500 font-medium">Vérifiez bien vos informations pour recevoir votre accès VIP.</p>
                </div>

                <div className="space-y-6">
                  {/* NOM COMPLET */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nom & Prénom complet</label>
                    <input 
                      value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: Amadou Coulibaly" 
                      className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50 font-black text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all text-sm"
                    />
                  </div>

                  {/* WHATSAPP AVEC PRÉFÉRENCE GROUPE */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex justify-between">
                      WhatsApp Préféré <span className="text-blue-600">(Groupe Apprenant)</span>
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        type="tel" placeholder="Ex: 77 000 00 00" 
                        className="w-full h-16 pl-16 pr-6 rounded-2xl border-2 border-slate-100 bg-slate-50 font-black text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email de réception</label>
                    <input 
                      value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                      type="email" placeholder="votre@email.com" 
                      className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50 font-black text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all text-sm"
                    />
                  </div>
                </div>

                {/* BLOC PRIX & BOUTON */}
                <div className="pt-10 space-y-6">
                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                      <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest italic">Montant à régler</span>
                      <span className="text-3xl font-black text-slate-900 italic tracking-tighter">{course.price}</span>
                   </div>

                   <Button 
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full h-20 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-4xl text-xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] flex items-center justify-center gap-4 transition-all active:scale-[0.97] disabled:opacity-70 group"
                   >
                     {loading ? (
                       <Loader2 className="w-8 h-8 animate-spin" />
                     ) : (
                       <>
                        Accéder au guide 
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                       </>
                     )}
                   </Button>
                   
                   <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest">
                      🔒 En cliquant, vous acceptez nos conditions de vente et d&apos;utilisation.
                   </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}