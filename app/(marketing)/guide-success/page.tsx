import { cookies } from "next/headers";
import Link from "next/link";
import SuccessClient from "./successClient";
import { AlertTriangle } from "lucide-react";

// 1. Définition correcte du type pour Next.js 15
type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function GuideSuccessPage({ searchParams }: Props) {
  // 🔐 1. Lire le ticket dans le navigateur (Cookie)
  const cookieStore = await cookies();
  const browserToken = cookieStore.get("drenolearn_secure_payment")?.value;
  
  // 🔐 2. Lire le ticket dans l'URL (CORRECTION NEXT.JS 15 👇)
  // Il faut attendre la résolution de la promesse searchParams
  const resolvedParams = await searchParams;
  const urlToken = resolvedParams.token;

  // Debug (à regarder dans votre terminal VS Code si ça bloque encore)
  console.log("🔒 SECURITY CHECK:");
  console.log("   - Cookie Token:", browserToken);
  console.log("   - URL Token:", urlToken);

  // 🚨 3. LE CHECK DE SÉCURITÉ
  // Si le visiteur n'a pas de cookie, ou pas de token URL, ou qu'ils sont différents => BLOQUÉ
  if (!browserToken || !urlToken || browserToken !== urlToken) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-6 p-6 text-center">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-black uppercase italic">Lien Expiré ou Invalide</h1>
        <p className="text-slate-400 max-w-md">
          Ce lien est protégé. Si vous venez de payer, votre navigateur a peut-être bloqué le cookie de sécurité.
        </p>
        <p className="text-xs text-slate-600 font-mono mt-2">
           Code erreur: {browserToken ? "MISMATCH" : "NO_COOKIE"}
        </p>
        
        <Link href="/guides" className="mt-4 bg-blue-600 hover:bg-blue-500 transition-colors px-8 py-3 rounded-xl font-bold uppercase text-sm">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  // ✅ 4. Si tout est bon, on affiche les confettis
  return <SuccessClient />;
}