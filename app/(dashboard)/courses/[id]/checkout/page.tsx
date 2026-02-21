"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation"; // Import de useParams
import { 
  ShieldCheck, Lock, Smartphone, 
  ShoppingBag, Loader2, ArrowRight, ChevronLeft 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { initiateChariowCheckout } from "@/app/actions/checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams(); // Utilisation du hook pour récupérer l'ID de l'URL
  const productId = params.id as string; // C'est ici qu'on récupère prd_ju2u42

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.phone || !formData.name || !productId) {
      alert("Informations manquantes");
      return;
    }
    
    setLoading(true);
    
    // Appel à l'API Chariow avec l'ID récupéré dynamiquement
    const result = await initiateChariowCheckout({
      product_id: productId, // On passe directement l'ID de l'URL
      email: formData.email,
      full_name: formData.name,
      phone: formData.phone,
    });

    if (result.url) {
      window.location.href = result.url; // Redirection vers la page de paiement sécurisée
    } else {
      alert("Erreur: " + result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white lg:bg-slate-50 flex items-center justify-center p-0 md:p-4">
      <div className="w-full max-w-5xl bg-white md:rounded-[2.5rem] md:shadow-2xl md:border md:border-slate-100 overflow-hidden flex flex-col md:flex-row h-screen md:h-auto">
        
        {/* --- SECTION RÉCAPITULATIF (GAUCHE) --- */}
        <div className="w-full md:w-5/12 bg-slate-900 text-white p-6 md:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 space-y-8">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <ShoppingBag className="text-white w-6 h-6" />
                </div>
                <h1 className="text-xl font-black italic tracking-tighter">DrenoLearn Secure</h1>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                     <ShoppingBag className="w-8 h-8 text-blue-500" />
                  </div>
                  <p className="font-bold text-sm leading-tight italic">Formation sélectionnée</p>
                </div>
                <div className="text-3xl font-black text-blue-500 tracking-tighter italic uppercase">Validation d&apos;accès</div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 text-slate-500 relative z-10">
            <Lock className="w-4 h-4" />
            <p className="text-[10px] font-black uppercase tracking-widest leading-none">Protection SSL 256-bit</p>
          </div>
        </div>

        {/* --- SECTION FORMULAIRE (DROITE) --- */}
        <div className="flex-1 p-6 md:p-12 lg:p-16 bg-white flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter italic leading-none">Finalisez vos accès</h2>
              <p className="text-xs text-slate-400 font-medium">L&apos;accès au guide et aux groupes VIP sera envoyé ici.</p>
            </div>

            <form onSubmit={handlePayment} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nom Complet</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Amadou Coulibaly"
                    className="w-full h-12 md:h-14 px-5 rounded-xl border-2 border-slate-100 bg-slate-50 font-bold text-sm focus:border-blue-600 focus:bg-white outline-none transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex justify-between">
                    WhatsApp <span className="text-blue-600 italic">(Pour les Groupes VIP)</span>
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="Ex: 77 000 00 00"
                      className="w-full h-12 md:h-14 pl-11 pr-5 rounded-xl border-2 border-slate-100 bg-slate-50 font-bold text-sm focus:border-blue-600 focus:bg-white outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email de réception</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="votre@email.com"
                    className="w-full h-12 md:h-14 px-5 rounded-xl border-2 border-slate-100 bg-slate-50 font-bold text-sm focus:border-blue-600 focus:bg-white outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-6 pt-2">
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 md:h-20 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-lg shadow-[0_20px_50px_rgba(37,99,235,0.25)] flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 group"
                >
                  {loading ? (
                    <Loader2 className="w-7 h-7 animate-spin" />
                  ) : (
                    <>
                      Valider mon paiement
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                    <ShieldCheck className="w-4 h-4 text-green-500" /> Sécurisé par DrenoLearn
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