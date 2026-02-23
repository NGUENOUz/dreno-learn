import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { 
  BookOpen, PlayCircle, Trophy, Clock, 
  LayoutGrid, MessageSquare, ChevronRight, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { createServerClient } from "@supabase/ssr";

export default async function Dashboard() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookies()).getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(async ({ name, value, options }) =>
            (await cookies()).set(name, value, options),
          );
        },
      },
    },
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  const { data: userAccess } = await supabase
    .from("user_access")
    .select(`
      item_id,
      courses:item_id (
        id,
        title,
        slug,
        image_url,
        description,
        drive_link
      )
    `)
    .eq("user_id", session.user.id)
    .eq("item_type", "course");

  const purchasedCourses = userAccess?.map((access: any) => access.courses) || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* --- HERO BANNER FULL WIDTH --- */}
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
                Ravi de vous revoir. Vous avez <span className="text-white font-bold">{purchasedCourses.length} formation(s)</span> prêtes à être explorées aujourd'hui.
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
            
            {/* STATS RAPIDES (Optionnel) */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 text-center">
                    <p className="text-3xl font-black italic">{purchasedCourses.length}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Cours</p>
                </div>
                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 text-center">
                    <p className="text-3xl font-black italic text-blue-500">100%</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Accès</p>
                </div>
            </div>
          </div>
        </div>
        
        {/* FILIGRANE DE FOND */}
        <LayoutGrid className="absolute -right-20 -bottom-20 w-96 h-96 opacity-[0.03] -rotate-12 pointer-events-none" />
      </section>

      {/* --- SECTION COURS --- */}
      <main className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black italic text-slate-900 uppercase tracking-tighter flex items-center gap-3">
              <BookOpen className="text-blue-600 w-8 h-8" /> Ma Bibliothèque
            </h2>
            <p className="text-slate-500 text-sm font-medium">Accédez à vos ressources exclusives.</p>
          </div>
          <Button variant="ghost" asChild className="font-bold text-blue-600 hover:bg-blue-50 rounded-xl gap-2 transition-all">
            <Link href="/catalog">Explorer le catalogue <ChevronRight className="w-4 h-4" /></Link>
          </Button>
        </div>

        {purchasedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {purchasedCourses.map((course: any) => (
              <div
                key={course.id}
                className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden flex flex-col p-5"
              >
                {/* IMAGE AVEC OVERLAY */}
                <div className="relative h-56 w-full rounded-[2rem] overflow-hidden mb-6 shadow-inner">
                  <Image
                    src={course.image_url || "/placeholder-course.jpg"}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-6">
                    <span className="bg-blue-600 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                        Premium Access
                    </span>
                  </div>
                </div>

                {/* CONTENU TEXTE */}
                <div className="space-y-4 px-2 grow">
                  <h3 className="font-black text-xl text-slate-900 leading-[1.1] italic uppercase tracking-tight line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-slate-400 text-xs font-medium line-clamp-2 leading-relaxed">
                    {course.description || "Formation complète débloquée. Prêt à commencer ?"}
                  </p>
                </div>

                {/* DOUBLE BOUTONS ACTION */}
                <div className="pt-8 flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="w-full h-14 border-2 border-slate-100 rounded-2xl font-black italic text-xs uppercase tracking-widest gap-2 text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    <MessageSquare className="w-4 h-4 text-green-500" /> Rejoindre le Groupe VIP
                  </Button>
                  
                  <Button
                    asChild
                    className="w-full h-14 bg-slate-950 hover:bg-blue-600 rounded-2xl font-black italic text-xs uppercase tracking-widest gap-2 shadow-xl shadow-slate-200 transition-all active:scale-95"
                  >
                    <Link href={`/dashboard/courses/${course.id}`}>
                        <PlayCircle className="w-4 h-4" /> Accéder à la formation
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ÉTAT VIDE PREMIUM */
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 space-y-8 text-center px-10">
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center shadow-inner text-slate-300">
              <BookOpen className="w-12 h-12" />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">
                Votre bibliothèque est vide
              </h3>
              <p className="text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                Le chemin vers le succès commence ici. Explorez nos formations et passez au niveau supérieur.
              </p>
            </div>
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 rounded-2xl h-16 px-10 font-black uppercase text-xs tracking-widest shadow-2xl shadow-blue-200 transition-all active:scale-95"
            >
              <Link href="/catalog">Découvrir le catalogue Elite</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}