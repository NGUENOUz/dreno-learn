import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { 
  BookOpen, PlayCircle, Trophy, LayoutGrid, 
  MessageSquare, ChevronRight, Sparkles, FileText, Download 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { createServerClient } from "@supabase/ssr";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  // 1. Récupérer le profil utilisateur
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  // 2. Récupérer TOUS les accès de l'utilisateur (MÉTHODE ULTRA SÉCURISÉE SANS CRASH DE JOINTURE)
  const { data: accesses } = await supabase
    .from("user_access")
    .select("item_id, item_type")
    .eq("user_id", session.user.id);

  const courseIds = accesses?.filter(a => a.item_type === 'course').map(a => a.item_id) || [];
  const guideIds = accesses?.filter(a => a.item_type === 'guide').map(a => a.item_id) || [];

  let purchasedCourses = [];
  let purchasedGuides = [];

  // 3. Charger les détails des formations
  if (courseIds.length > 0) {
    const { data: courses } = await supabase.from('courses').select('*').in('id', courseIds);
    if (courses) purchasedCourses = courses;
  }

  // 4. Charger les détails des guides
  if (guideIds.length > 0) {
    const { data: guides } = await supabase.from('guides').select('*').in('id', guideIds);
    if (guides) purchasedGuides = guides;
  }

  const totalItems = purchasedCourses.length + purchasedGuides.length;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* --- HERO BANNER --- */}
      <section className="w-full bg-slate-950 text-white relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(37,99,235,0.1),transparent)]" />
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 px-4 py-1.5 rounded-full border border-blue-600/30 text-[10px] font-black uppercase tracking-[0.2em]">
                <Sparkles className="w-3 h-3" /> Espace Membre Elite
              </div>
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none">
                Bonjour, <span className="text-blue-500">{profile?.full_name?.split(" ")[0] || "Champion"}</span> ! 🎉
              </h1>
              <p className="text-slate-400 font-medium max-w-lg text-lg leading-relaxed">
                Ravi de vous revoir. Vous avez <span className="text-white font-bold">{totalItems} accès</span> prêts à être explorés aujourd'hui.
              </p>
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 shadow-2xl">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-black uppercase tracking-widest italic">
                    Membre {profile?.is_premium ? "VIP Global" : "Standard"}
                  </span>
                </div>
              </div>
            </div>
            
            {/* STATS RAPIDES */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 text-center">
                    <p className="text-3xl font-black italic">{purchasedCourses.length}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Formations</p>
                </div>
                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 text-center">
                    <p className="text-3xl font-black italic text-blue-500">{purchasedGuides.length}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Guides</p>
                </div>
            </div>
          </div>
        </div>
        <LayoutGrid className="absolute -right-20 -bottom-20 w-96 h-96 opacity-[0.03] -rotate-12 pointer-events-none" />
      </section>

      <main className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        
        {/* --- SECTION: GUIDES ACHETÉS --- */}
        {purchasedGuides.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-black italic text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                  <FileText className="text-blue-600 w-8 h-8" /> Mes Guides Stratégiques
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {purchasedGuides.map((guide: any) => (
                <div key={guide.id} className="group bg-white rounded-[2rem] border border-slate-100 p-5 shadow-sm hover:shadow-xl transition-all flex flex-col">
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-5">
                    <Image src={guide.image_url || "/placeholder.jpg"} alt={guide.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-black text-lg text-slate-900 uppercase italic leading-tight line-clamp-2 mb-2">{guide.title}</h3>
                  <p className="text-slate-500 text-xs font-medium line-clamp-2 mb-6 grow">{guide.description}</p>
                  
                  <div className="flex flex-col gap-2">
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black italic uppercase text-xs">
                       <a href={guide.drive_pdf_link} target="_blank" rel="noopener noreferrer"><Download className="w-4 h-4 mr-2" /> Télécharger PDF</a>
                    </Button>
                    <Button variant="outline" className="w-full border-slate-200 text-slate-600 rounded-xl font-bold uppercase text-[10px]">
                       <MessageSquare className="w-4 h-4 mr-2 text-green-500" /> Accès WhatsApp
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- SECTION: FORMATIONS ACHETÉES --- */}
        {purchasedCourses.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-black italic text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                  <BookOpen className="text-blue-600 w-8 h-8" /> Mes Formations Vidéos
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {purchasedCourses.map((course: any) => (
                <div key={course.id} className="group bg-slate-900 rounded-[2rem] border border-slate-800 p-5 shadow-xl hover:shadow-2xl transition-all flex flex-col text-white">
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-5">
                    <Image src={course.image_url || "/placeholder.jpg"} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <PlayCircle className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <h3 className="font-black text-lg uppercase italic leading-tight line-clamp-2 mb-2">{course.title}</h3>
                  <p className="text-slate-400 text-xs font-medium line-clamp-2 mb-6 grow">{course.description}</p>
                  
                  <Button asChild className="w-full bg-white hover:bg-blue-50 text-slate-900 rounded-xl font-black italic uppercase text-xs">
                      <Link href={`/dashboard/courses/${course.id}`}><PlayCircle className="w-4 h-4 mr-2" /> Lancer le cours</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ÉTAT VIDE (Si l'utilisateur n'a rien acheté du tout) --- */}
        {totalItems === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 space-y-8 text-center px-10">
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center shadow-inner text-slate-300">
              <Trophy className="w-12 h-12" />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Votre arsenal est vide</h3>
              <p className="text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">Le chemin vers le succès commence ici. Passez à l'action dès aujourd'hui.</p>
            </div>
            <div className="flex gap-4">
               <Button asChild className="bg-blue-600 hover:bg-blue-700 rounded-2xl h-14 px-8 font-black uppercase text-xs">
                 <Link href="/courses">Voir les formations</Link>
               </Button>
               <Button asChild variant="outline" className="rounded-2xl h-14 px-8 font-black uppercase text-xs border-slate-200">
                 <Link href="/guides">Voir les guides</Link>
               </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}