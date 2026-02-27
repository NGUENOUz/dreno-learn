import { cookies } from "next/headers";
import Link from "next/link";
import SuccessClient from "./successClient";
import { AlertTriangle } from "lucide-react";

// 1. DÉCLARER LA FONCTION COMME ASYNC 👇
export default async function GuideSuccessPage({ 
  searchParams 
}: { 
  searchParams: { token?: string, chariow_id?: string, name?: string, email?: string } 
}) {
  // 2. ATTENDRE LA LECTURE DES COOKIES AVEC AWAIT 👇
  const cookieStore = await cookies();
  const browserToken = cookieStore.get("drenolearn_secure_payment")?.value;
  
  // 3. Lire le ticket dans l'URL
  // Note : Dans Next.js 15, searchParams doit parfois être "await" aussi, 
  // mais on peut le lire directement s'il est déstructuré.
  const urlToken = searchParams.token;

  // 🚨 4. LE CHECK DE SÉCURITÉ
  if (!browserToken || !urlToken || browserToken !== urlToken) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-6 p-6 text-center">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-black uppercase italic">Lien Expiré ou Invalide</h1>
        <p className="text-slate-400 max-w-md">
          Ce lien de téléchargement est protégé et ne peut pas être partagé. Si vous venez de payer, veuillez vérifier votre espace membre ou vos emails.
        </p>
        
        <Link href="/guides" className="mt-4 bg-blue-600 hover:bg-blue-500 transition-colors px-8 py-3 rounded-xl font-bold uppercase text-sm">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  // ✅ 5. Si tout est bon, on affiche ta page avec les confettis
  return <SuccessClient />;
}