"use client";

import { useState } from "react";
import { 
  Sparkles, Save, Eye, Loader2, Upload, 
  Plus, Trash2, ArrowLeft, Globe, Link as LinkIcon, Hash, BookOpen, Zap, FileText, Target, Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

import GuideCard from "@/components/guides/guidesCard";
import MarketplaceStyles from "@/app/(marketing)/guides/MarketplaceStyles";

export default function AdminNewGuide() {
  const router = useRouter();
  
 const [supabase] = useState(() => createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
));
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const [form, setForm] = useState({
    title: "Nouveau Guide Stratégique",
    slug: "nouveau-guide-2026",
    description: "Accroche courte pour la marketplace...",
    marketing_description: "Description détaillée pour la page produit...",
    price: 25000,
    old_price: 75000,
    savings_text: "Économisez 1.250.000 FCFA",
    image_url: "https://res.cloudinary.com/dcsl6xhli/image/upload/v1740000000/default_cover.png",
    drive_pdf_link: "",
    category: "Études", // Par défaut
    chariow_id: "",
    is_published: true,
    sales_target: 500,
    actual_sales: 0,
    content_list: [] as { title: string; description: string }[]
  });

  // --- LOGIQUE CHAPITRES ---
  const addChapter = () => {
    setForm({ ...form, content_list: [...form.content_list, { title: "", description: "" }] });
  };

  const updateChapter = (index: number, field: "title" | "description", value: string) => {
    const newList = [...form.content_list];
    newList[index][field] = value;
    setForm({ ...form, content_list: newList });
  };

  const removeChapter = (index: number) => {
    setForm({ ...form, content_list: form.content_list.filter((_, i) => i !== index) });
  };

  // --- LOGIQUE UTILITAIRES ---
  const generateSlug = () => {
    const slug = form.title.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    setForm({ ...form, slug });
  };

  const handleAIAnalysis = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsAnalyzing(true);
    const loadingToast = toast.loading("L&apos;IA analyse votre PDF...");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/analyse-pdf", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setForm(prev => ({ ...prev, ...data }));
      toast.success("Analyse terminée !", { id: loadingToast });
    } catch (err) {
      toast.error("Échec de l&apos;analyse.", { id: loadingToast });
    } finally { setIsAnalyzing(false); }
  };

  const handlePublish = async () => {
    if (!form.drive_pdf_link || !form.chariow_id) {
        return toast.error("Le lien Drive et l'ID Chario sont obligatoires !");
    }
    setIsPublishing(true);
    try {
      const { error } = await supabase.from('guides').insert([form]);
      if (error) throw error;
      toast.success("Guide publié avec succès !");
      router.push("/admin/guides");
      router.refresh();
    } catch (err: any) {
      toast.error(`Erreur Supabase : ${err.message}`);
    } finally { setIsPublishing(false); }
  };

  return (
    <div className="min-h-screen bg-white">
      <MarketplaceStyles />
      
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/guides" className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <h1 className="text-xl font-black italic uppercase tracking-tighter">Éditeur <span className="text-blue-600">DrenoAI</span></h1>
        </div>
        <Button disabled={isPublishing} onClick={handlePublish} className="bg-blue-600 hover:bg-slate-950 text-white font-black italic uppercase text-xs px-8 rounded-xl shadow-xl transition-all">
          {isPublishing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Publier
        </Button>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        <section className="p-10 border-r border-slate-50 space-y-12 overflow-y-auto max-h-[calc(100vh-80px)]">
          
          {/* MAGIC FILL IA */}
          <div className="bg-gradient-to-br from-blue-600/5 to-purple-600/5 p-8 rounded-[2.5rem] border border-blue-100 border-dashed relative group">
            <div className="flex flex-col items-center text-center space-y-4">
              <Sparkles className="w-8 h-8 text-blue-600 group-hover:rotate-12 transition-transform" />
              <div>
                <h3 className="text-sm font-black uppercase italic text-slate-900">Magic Fill IA</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Générez la fiche via PDF</p>
              </div>
              <input type="file" accept="application/pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleAIAnalysis} disabled={isAnalyzing} />
              <Button disabled={isAnalyzing} variant="outline" className="border-blue-100 text-blue-600 font-black italic uppercase text-[10px]">
                {isAnalyzing ? "Analyse..." : "Scanner le Guide"}
              </Button>
            </div>
          </div>

          <div className="space-y-10">
            {/* INFOS DE BASE */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2">
                <div className="w-4 h-[2px] bg-blue-600" /> Informations de base
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Titre Marketing</label>
                  <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full h-14 bg-slate-50 rounded-2xl px-6 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Slug URL</label>
                  <div className="relative">
                    <input value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} className="w-full h-14 bg-slate-50 rounded-2xl px-6 font-bold pr-16" />
                    <button onClick={generateSlug} className="absolute right-4 top-4 text-[8px] font-black text-blue-600 bg-white px-2 py-1 rounded-md shadow-sm uppercase">Auto</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 flex items-center gap-2"><Tag className="w-3 h-3"/> Catégorie</label>
                  <select 
                    value={form.category} 
                    onChange={(e) => setForm({...form, category: e.target.value})} 
                    className="w-full h-14 bg-slate-50 rounded-2xl px-6 font-bold text-slate-900 border-none outline-none appearance-none cursor-pointer"
                  >
                    <option value="Études">🎓 Études</option>
                    <option value="Travail">💼 Travail</option>
                    <option value="Visiteur">✈️ Visiteur</option>
                    <option value="Investissement">💰 Investissement</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Image URL (Cloudinary)</label>
                  <input value={form.image_url} onChange={(e) => setForm({...form, image_url: e.target.value})} className="w-full h-14 bg-slate-50 rounded-2xl px-6 font-bold text-slate-500 text-xs" />
                </div>
              </div>
            </div>

            {/* CONFIGURATION TECHNIQUE */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2">
                <div className="w-4 h-[2px] bg-blue-600" /> Livraison & Tracking
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 flex items-center gap-2"><Hash className="w-3 h-3"/> Réf / Chariow ID</label>
                  <input value={form.chariow_id} onChange={(e) => setForm({...form, chariow_id: e.target.value})} className="w-full h-14 bg-slate-50 rounded-2xl px-6 font-black text-blue-600" placeholder="Ex: CAN-2026-X" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 flex items-center gap-2"><FileText className="w-3 h-3"/> Lien Drive PDF</label>
                  <input value={form.drive_pdf_link} onChange={(e) => setForm({...form, drive_pdf_link: e.target.value})} className="w-full h-14 bg-slate-50 rounded-2xl px-6 font-bold text-xs" placeholder="Lien direct Google Drive" />
                </div>
              </div>
            </div>

            {/* PRIX & OBJECTIFS */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2">
                <div className="w-4 h-[2px] bg-blue-600" /> Business Model
              </h4>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Prix Marketplace</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({...form, price: Number(e.target.value)})} className="w-full h-14 bg-blue-50 rounded-2xl px-6 font-black text-blue-600" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Prix Barré</label>
                  <input type="number" value={form.old_price} onChange={(e) => setForm({...form, old_price: Number(e.target.value)})} className="w-full h-14 bg-slate-50 rounded-2xl px-6 font-bold text-slate-300" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 flex items-center gap-2"><Target className="w-3 h-3"/> Objectif</label>
                  <input type="number" value={form.sales_target} onChange={(e) => setForm({...form, sales_target: Number(e.target.value)})} className="w-full h-14 bg-slate-50 rounded-2xl px-6 font-bold" />
                </div>
              </div>
            </div>

            {/* DESCRIPTIONS & SOMMAIRE */}
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2">
                <div className="w-4 h-[2px] bg-blue-600" /> Contenu & Marketing
              </h4>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Accroche Carte (Courte)</label>
                <input value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full h-12 bg-slate-50 rounded-xl px-6 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Marketing Description (Storytelling)</label>
                <textarea rows={4} value={form.marketing_description} onChange={(e) => setForm({...form, marketing_description: e.target.value})} className="w-full bg-slate-50 rounded-[2rem] p-6 font-medium text-slate-600 border-none resize-none focus:ring-2 ring-blue-50" />
              </div>

              {/* SOMMAIRE JSONB */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase text-slate-900 italic flex items-center gap-2"><BookOpen className="w-4 h-4"/> Structure du Guide ({form.content_list.length})</p>
                  <Button onClick={addChapter} variant="ghost" className="h-8 text-[10px] font-black uppercase text-blue-600">
                    <Plus className="w-3 h-3 mr-1" /> Ajouter Chapitre
                  </Button>
                </div>
                <div className="space-y-4">
                  {form.content_list.map((chapter, index) => (
                    <div key={index} className="group bg-slate-50 p-6 rounded-[2rem] relative border border-transparent hover:border-blue-100 transition-all">
                      <button onClick={() => removeChapter(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      <div className="space-y-3">
                         <input placeholder="Titre..." value={chapter.title} onChange={(e) => updateChapter(index, "title", e.target.value)} className="w-full bg-transparent font-black italic uppercase text-xs text-slate-900 border-none p-0 focus:ring-0" />
                         <textarea placeholder="Description..." value={chapter.description} onChange={(e) => updateChapter(index, "description", e.target.value)} className="w-full bg-white/50 rounded-xl p-3 text-[10px] font-medium text-slate-500 border-none resize-none" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PREVIEW */}
        <section className="bg-slate-50/50 p-10 flex flex-col items-center justify-center relative overflow-hidden">
          <Globe className="absolute inset-0 z-0 opacity-[0.03] w-full h-full text-slate-900" />
          <div className="relative z-10 w-full max-w-[400px] space-y-12">
            <div className="text-center">
               <p className="text-[10px] font-black text-blue-600 uppercase italic flex items-center justify-center gap-2"><Eye className="w-3 h-3" /> Live Marketplace Preview</p>
            </div>
            <div className="shadow-2xl shadow-blue-900/10 scale-110">
              <GuideCard guide={{ ...form, oldPrice: form.old_price }} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}