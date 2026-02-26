"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  Lock, 
  Smartphone,
  ChevronLeft,
  Zap,
  Mail,
  User,
  CheckCircle2,
  MessageSquare,
  Tag 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { createBrowserClient } from "@supabase/ssr";
import { initiateChariowCheckout } from "@/app/actions/checkout";

export default function GuideCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;
  
  const [guide, setGuide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    phone: "", 
    email: "",
    promoCode: "" 
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchGuide = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("guides")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) throw error;
        setGuide(data);
      } catch (err) {
        console.error("Erreur checkout:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchGuide();
  }, [slug, supabase]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.phone || !formData.name) {
      return alert("Veuillez remplir tous les champs pour recevoir votre accès.");
    }

    setIsSubmitting(true);
    try {
      const result = await initiateChariowCheckout({
        product_id: guide.chariow_id,
        email: formData.email,
        full_name: formData.name,
        phone: formData.phone,
        promo_code: formData.promoCode,
        product_type: "guide" // ✅ On précise le type pour la redirection
      });

      if (result.url) {
        window.location.href = result.url;
      } else {
        alert("Erreur Chariow: " + result.error);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="mt-4 text-[10px] font-black uppercase italic text-slate-400 tracking-widest">
        Sécurisation de la passerelle...
      </p>
    </div>
  );

  if (!guide) return <div className="p-20 text-center font-black uppercase">Guide Introuvable</div>;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-blue-100">
      
      {/* HEADER MINIMALISTE */}
      <header className="py-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black uppercase italic text-slate-400 hover:text-blue-600 transition-all">
            <ChevronLeft className="w-4 h-4" /> Retour
          </button>
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg rotate-12 flex items-center justify-center shadow-lg shadow-blue-200">
                <Zap className="w-4 h-4 text-white fill-white" />
             </div>
             <span className="font-black italic uppercase tracking-tighter text-lg">Dreno<span className="text-blue-600">Learn</span></span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">
            <Lock className="w-3 h-3 text-green-500" /> Paiement 100% Sécurisé
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* COLONNE GAUCHE : FORMULAIRE */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none text-slate-900">
                Finaliser votre <br/> <span className="text-blue-600 underline decoration-blue-100">Commande</span>
              </h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                Remplissez vos accès pour recevoir le pack stratégique
              </p>
            </div>

            <form onSubmit={handlePayment} className="space-y-8">
              <div className="space-y-6">
                {/* NOM */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                    <User className="w-3 h-3" /> Nom complet
                  </label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Amadou Koné"
                    className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* WHATSAPP */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                      <Smartphone className="w-3 h-3" /> WhatsApp
                    </label>
                    <input 
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="Ex: +225 07..."
                      className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm"
                    />
                  </div>

                  {/* EMAIL */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                      <Mail className="w-3 h-3" /> Email
                    </label>
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="votre@email.com"
                      className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* CHAMP CODE PROMO */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                    <Tag className="w-3 h-3" /> Code Promo (Optionnel)
                  </label>
                  <div className="relative">
                    <input 
                      value={formData.promoCode}
                      onChange={(e) => setFormData({...formData, promoCode: e.target.value.toUpperCase()})}
                      placeholder="ENTREZ VOTRE CODE ICI"
                      className="w-full h-16 px-6 rounded-2xl border-2 border-dashed border-slate-200 bg-white font-black text-blue-600 outline-none focus:border-blue-600 focus:border-solid transition-all text-sm tracking-widest placeholder:font-bold placeholder:text-slate-200"
                    />
                    {formData.promoCode && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 space-y-4">
                 <h4 className="font-black italic uppercase text-xs text-blue-600 flex items-center gap-2">
                   <CheckCircle2 className="w-4 h-4" /> Ce que vous allez recevoir :
                 </h4>
                 <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Guide PDF Interactif",
                      "Modèles de lettres Word",
                      "Checklist Anti-Refus",
                      "Accès Groupe WhatsApp VIP"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase italic">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> {item}
                      </li>
                    ))}
                 </ul>
              </div>

              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-20 bg-blue-600 hover:bg-slate-900 text-white font-black rounded-[2rem] text-xl shadow-2xl shadow-blue-200 transition-all active:scale-[0.98] group overflow-hidden relative"
              >
                {isSubmitting ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <span className="relative z-10 flex items-center gap-3 italic uppercase tracking-tighter">
                    Payer via Chariow <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                )}
                <motion.div className="absolute inset-0 bg-white/10" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity }} />
              </Button>
            </form>
          </div>

          {/* COLONNE DROITE : RÉCAPITULATIF COMMANDE */}
          <div className="lg:col-span-5 sticky top-32">
             <div className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_40px_100px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="relative h-64 w-full">
                  <Image src={guide.image_url} fill className="object-cover" alt="cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                     <span className="px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase rounded-full mb-3 inline-block">{guide.category}</span>
                     <h3 className="text-white font-black italic uppercase text-xl leading-tight tracking-tighter">{guide.title}</h3>
                  </div>
                </div>

                <div className="p-10 space-y-8">
                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 italic">
                        <span>Prix Public</span>
                        <span className="line-through">{guide.old_price?.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-black italic uppercase text-sm text-slate-900">Offre DrenoLearn</span>
                        <span className="font-black text-3xl text-blue-600 tracking-tighter italic">{guide.price?.toLocaleString()} FCFA</span>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-slate-50 space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-green-600" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase text-slate-900">Garantie Mise à jour</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase">Valable pour toute l&apos;année 2026</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase text-slate-900">Accompagnement VIP</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase">Groupe privé inclus dans l&apos;offre</p>
                         </div>
                      </div>
                   </div>

                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Transaction sécurisée par Chariow. <br/> Vos données sont chiffrées de bout en bout.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}