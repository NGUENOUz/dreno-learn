"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ShieldCheck, Lock, ShoppingBag, Loader2, 
  ArrowRight, ChevronLeft, TicketPercent, MessageSquare 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { initiateChariowCheckout } from "@/app/actions/checkout";
import { createBrowserClient } from "@supabase/ssr";

// Import pour le champ téléphone intelligent
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; 

export default function GuideCheckoutPage() {
  const router = useRouter();
  const params = useParams();
  
  // L'ID dans l'URL (chariow_id)
  const guideId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState<any>(null);
  const [phoneValue, setPhoneValue] = useState<string | undefined>();
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "",
    promoCode: "" 
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Charger les informations du guide pour l'affichage
  useEffect(() => {
    const fetchGuide = async () => {
      const { data } = await supabase
        .from("guides")
        .select("*")
        .eq("chariow_id", guideId)
        .single();

      if (data) setGuide(data);
    };
    if (guideId) fetchGuide();
  }, [guideId, supabase]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !phoneValue || !formData.name || !guideId) {
      alert("Informations manquantes");
      return;
    }
    
    setLoading(true);
    
    // ✅ Appel à l'action : redirection vers /guides/success
    const result = await initiateChariowCheckout({
      product_id: guide?.chariow_id || guideId,
      email: formData.email,
      full_name: formData.name,
      phone: phoneValue,
      promo_code: formData.promoCode,
      product_type: "guides" // L'action saura qu'il faut aller vers /guides/success
    });

    if (result.url) {
      window.location.href = result.url;
    } else {
      alert("Erreur: " + result.error);
      setLoading(false);
    }
  };

  if (!guide && guideId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:bg-slate-50 flex items-center justify-center p-0 md:p-6 font-sans">
      <div className="w-full max-w-5xl bg-white md:rounded-[3rem] md:shadow-2xl md:shadow-blue-900/10 overflow-hidden flex flex-col md:flex-row min-h-150">
        
        {/* --- SECTION RÉCAPITULATIF (GAUCHE) --- */}
        <div className="hidden md:flex w-full md:w-[40%] bg-slate-900 text-white p-12 flex-col justify-between relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]" />
          
          <div className="relative z-10 space-y-10">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-all text-[10px] font-bold uppercase tracking-[0.2em]"
            >
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <ShoppingBag className="text-white w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">DrenoLearn <span className="text-blue-500 font-black italic text-xs">Secure</span></h1>
              </div>

              <div className="space-y-4 pt-6">
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Votre commande</p>
                <h2 className="text-3xl font-black italic tracking-tighter leading-tight uppercase">
                  {guide?.title || "Validation des accès VIP"}
                </h2>
                <p className="text-sm text-slate-400 font-medium">
                  Arsenal stratégique prêt pour envoi immédiat.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-500 border-t border-white/5 pt-8">
            <Lock className="w-4 h-4" />
            <p className="text-[9px] font-bold uppercase tracking-widest">Paiement sécurisé par Chariow</p>
          </div>
        </div>

        {/* --- SECTION FORMULAIRE (DROITE) --- */}
        <div className="flex-1 p-6 md:p-16 bg-white flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full space-y-8">
            <div className="hidden md:block space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Réception du Guide</h2>
              <p className="text-xs text-slate-400 font-medium">Vos accès seront envoyés à ces coordonnées.</p>
            </div>

            <form onSubmit={handlePayment} className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Nom Complet</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Amadou Coulibaly"
                    className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50 font-semibold text-sm focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-blue-600 tracking-widest ml-1 flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" /> Numéro WhatsApp
                  </label>
                  <div className="phone-elite-container">
                    <PhoneInput
                      international
                      defaultCountry="CM"
                      value={phoneValue}
                      onChange={setPhoneValue}
                      placeholder="Votre numéro WhatsApp"
                      className="w-full h-14 px-5 rounded-2xl border border-slate-100 bg-slate-50 font-semibold text-sm focus-within:ring-4 focus-within:ring-blue-600/5 focus-within:border-blue-600 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Email de réception</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="votre@email.com"
                    className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50 font-semibold text-sm focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Code Promo</label>
                  <div className="relative group">
                    <TicketPercent className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      value={formData.promoCode}
                      onChange={(e) => setFormData({...formData, promoCode: e.target.value.toUpperCase()})}
                      placeholder="CODE-REDUC"
                      className="w-full h-14 pl-12 pr-6 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-xs tracking-widest focus:border-blue-600 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-md shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-70 group"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  ) : (
                    <>
                      Valider mon paiement
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 px-4 py-2 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Transaction DrenoLearn Sécurisée
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}