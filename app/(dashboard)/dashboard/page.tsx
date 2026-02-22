import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BookOpen, PlayCircle, Trophy, Clock, LayoutGrid } from "lucide-react";
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

  // 1. Vérifier la session
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  // 2. Récupérer le profil et les accès
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  // 3. Récupérer les cours achetés via la table de liaison
  const { data: userAccess } = await supabase
    .from("user_access")
    .select(
      `
      item_id,
      courses:item_id (
        id,
        title,
        slug,
        image_url,
        description
      )
    `,
    )
    .eq("user_id", session.user.id)
    .eq("item_type", "course");

  const purchasedCourses = userAccess?.map((access) => access.courses) || [];

  return (
    <div className="p-4 md:p-8 space-y-10 max-w-7xl mx-auto">
      {/* HEADER : BIENVENUE PERSONNALISÉE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 p-8 md:p-12 rounded-[3rem] text-white overflow-hidden relative">
        <div className="space-y-4 z-10">
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter">
            Bonjour, {profile?.full_name?.split(" ")[0] || "Champion"} ! 🎉
          </h1>
          <p className="text-slate-400 font-medium max-w-md">
            Ravi de vous revoir. Vous avez actuellement{" "}
            <strong>{purchasedCourses.length} formation(s)</strong> actives.
          </p>
          <div className="flex gap-4 pt-2">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Membre {profile?.is_premium ? "VIP" : "Standard"}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <LayoutGrid className="w-64 h-64 -rotate-12" />
        </div>
      </div>

      {/* SECTION : MES COURS ACHETÉS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black italic text-slate-900 flex items-center gap-3">
            <BookOpen className="text-blue-600" /> Mes Formations
          </h2>
          <Link
            href="/catalog"
            className="text-sm font-bold text-blue-600 hover:underline"
          >
            Voir le catalogue
          </Link>
        </div>

        {purchasedCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {purchasedCourses.map((course: any) => (
              <div
                key={course.id}
                className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={course.image_url || "/placeholder-course.jpg"}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle className="text-white w-12 h-12" />
                  </div>
                </div>

                <div className="p-6 space-y-4 grow flex flex-col">
                  <h3 className="font-black text-lg text-slate-900 leading-tight italic line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-slate-400 text-xs font-medium line-clamp-2 uppercase leading-relaxed tracking-wide">
                    {course.description ||
                      "Commencez votre apprentissage dès maintenant."}
                  </p>

                  <div className="pt-4 mt-auto">
                    <Button
                      asChild
                      className="w-full h-12 bg-slate-900 hover:bg-blue-600 rounded-2xl font-black italic transition-all"
                    >
                      <Link href={`/my-courses/${course.slug}`}>Continuer</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ÉTAT VIDE : AUCUN ACHAT */
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 space-y-6 text-center px-6">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm text-slate-300">
              <BookOpen className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-black text-slate-900 italic">
                Vous n&apos;avez pas encore de formation
              </p>
              <p className="text-sm text-slate-400 font-medium">
                Explorez notre catalogue pour commencer votre transformation.
              </p>
            </div>
            <Button
              asChild
              className="bg-blue-600 rounded-2xl h-14 px-8 font-black uppercase text-xs tracking-widest"
            >
              <Link href="/catalog">Découvrir le catalogue</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
