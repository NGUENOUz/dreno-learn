"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* LOGO & DESCRIPTION */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Dreno<span className="text-blue-500">learn</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              La plateforme leader pour maîtriser les compétences numériques et business en Afrique. 
              Apprenez à votre rythme, où que vous soyez.
            </p>
          </div>

          {/* LIENS RAPIDES */}
          <div>
            <h4 className="text-white font-bold mb-6">Plateforme</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/courses" className="hover:text-blue-500 transition-colors">Toutes les formations</Link></li>
              <li><Link href="/categories" className="hover:text-blue-500 transition-colors">Catégories</Link></li>
              <li><Link href="/premium" className="hover:text-blue-500 transition-colors">Offre Premium</Link></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="text-white font-bold mb-6">Aide & Support</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/contact" className="hover:text-blue-500 transition-colors">Contactez-nous</Link></li>
              <li><Link href="/faq" className="hover:text-blue-500 transition-colors">Questions fréquentes</Link></li>
              <li><Link href="https://wa.me/ton_numero" className="text-green-500 font-bold">Support WhatsApp</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER / CTA */}
          <div>
            <h4 className="text-white font-bold mb-6">Prêt à commencer ?</h4>
            <p className="text-sm text-slate-400 mb-4">Rejoignez notre communauté et recevez des conseils exclusifs.</p>
            <Link href="/register" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all w-full text-center shadow-lg shadow-blue-900/20">
              S'inscrire gratuitement
            </Link>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Dreno learn. Tous droits réservés. Conçu pour le succès.</p>
        </div>
      </div>
    </footer>
  );
}