import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { 
  Search, Filter, MapPin, 
  Clock, Flame, ArrowRight,
  ChevronLeft, ChevronRight,
  Navigation
} from "lucide-react";
import Link from "next/link";
import GuideCard from "@/components/guides/guidesCard";
import { Button } from "@/components/ui/button";

export default async function GuidesMarketplace({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // --- CONFIGURATION SUPABASE ---
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  // --- LOGIQUE DE FILTRAGE & PAGINATION ---
  const query = (searchParams.query as string) || "";
  const category = (searchParams.category as string) || "all";
  const page = Number(searchParams.page) || 1;
  const itemsPerPage = 6;

  let supabaseQuery = supabase
    .from("guides")
    .select("*", { count: "exact" })
    .eq("is_published", true);

  if (query) {
    supabaseQuery = supabaseQuery.ilike("title", `%${query}%`);
  }
  
  if (category !== "all") {
    supabaseQuery = supabaseQuery.eq("category", category);
  }

  const { data: guides, count } = await supabaseQuery
    .order("created_at", { ascending: false })
    .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      
      {/* 1. BANNIÈRE PROMO ÉLITE (Urgence) */}
      <section className="w-full bg-blue-600 text-white py-3 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 fill-white animate-bounce" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Offre de Lancement : -50% sur tous les guides
            </span>
          </div>
          <div className="h-4 w-[1px] bg-white/20 hidden md:block" />
          <div className="hidden md:flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase italic">Finit dans 12h 45m</span>
          </div>
        </div>
      </section>

      {/* 2. HEADER & RECHERCHE */}
      <section className="bg-white border-b border-slate-100 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
                Marketplace <span className="text-blue-600 underline decoration-blue-100">Guides</span>
              </h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                Trouvez votre destination, gérez votre visa en solo.
              </p>
            </div>
          </div>

          {/* BARRE DE RECHERCHE & FILTRES */}
          <form className="flex flex-col lg:flex-row gap-4 p-2 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex-grow relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                name="query"
                defaultValue={query}
                placeholder="Quelle destination ? (ex: Dubaï, Canada, France...)"
                className="w-full h-14 pl-14 pr-6 bg-transparent font-bold text-slate-700 outline-none placeholder:text-slate-300"
              />
            </div>
            
            <div className="h-10 w-[1px] bg-slate-200 hidden lg:block self-center" />

            <div className="flex flex-col sm:flex-row gap-4">
              <select 
                name="category"
                defaultValue={category}
                className="h-14 px-6 bg-transparent font-black uppercase text-[10px] tracking-widest text-slate-500 outline-none cursor-pointer"
              >
                <option value="all">Toutes Catégories</option>
                <option value="Guide Complet">💎 Guide Complet</option>
                <option value="Études">🎓 Études</option>
                <option value="Travail">💼 Travail</option>
                <option value="Visiteur">✈️ Visiteur</option>
                <option value="Investissement">💰 Investissement</option>
              </select>

              <Button type="submit" className="h-14 px-10 bg-slate-950 hover:bg-blue-600 rounded-[1.5rem] font-black italic uppercase text-xs transition-all">
                Rechercher
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* 3. GRILLE DE RÉSULTATS */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {guides && guides.length > 0 ? (
          <div className="space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {guides.map((guide) => {
                // 📊 Calcul du pourcentage de réduction en temps réel
                const discountBadge = guide.old_price 
                  ? Math.round(((guide.old_price - guide.price) / guide.old_price) * 100)
                  : null;

                return (
                  <GuideCard 
                    key={guide.id} 
                    guide={{
                      ...guide,
                      discountPercentage: discountBadge, // On injecte le % calculé
                      // On s'assure que oldPrice est bien passé au composant
                      oldPrice: guide.old_price 
                    }} 
                  />
                );
              })}
            </div>

            {/* PAGINATION ÉLITE */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-10">
                <Button 
                  disabled={page <= 1} 
                  variant="outline" 
                  className="rounded-full w-12 h-12 p-0 border-slate-100 hover:bg-blue-50"
                  asChild={page > 1}
                >
                  {page > 1 ? (
                    <Link href={`/guides?page=${page - 1}&query=${query}&category=${category}`}>
                      <ChevronLeft className="w-5 h-5" />
                    </Link>
                  ) : <ChevronLeft className="w-5 h-5" />}
                </Button>

                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <Link 
                      key={i} 
                      href={`/guides?page=${i + 1}&query=${query}&category=${category}`}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                        page === i + 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-100"
                      }`}
                    >
                      {i + 1}
                    </Link>
                  ))}
                </div>

                <Button 
                  disabled={page >= totalPages} 
                  variant="outline" 
                  className="rounded-full w-12 h-12 p-0 border-slate-100 hover:bg-blue-50"
                  asChild={page < totalPages}
                >
                  {page < totalPages ? (
                    <Link href={`/guides?page=${page + 1}&query=${query}&category=${category}`}>
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  ) : <ChevronRight className="w-5 h-5" />}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-32 text-center bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-100 space-y-6">
            <Navigation className="w-16 h-16 mx-auto text-slate-200" />
            <div className="space-y-2">
               <h3 className="text-2xl font-black italic text-slate-400 uppercase">Aucun guide trouvé</h3>
               <p className="text-slate-400 text-sm max-w-xs mx-auto">Essayez une autre destination ou réinitialisez les filtres.</p>
            </div>
            <Button asChild variant="link" className="text-blue-600 font-bold uppercase tracking-widest text-[10px]">
                <Link href="/guides">Afficher tous les guides</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}