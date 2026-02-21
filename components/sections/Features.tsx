"use client";

import { Smartphone, Infinity, MessageCircle, Zap } from "lucide-react";

const FEATURES = [
  {
    title: "Accès à Vie",
    desc: "Payez une seule fois et accédez à vos contenus pour toujours, sans abonnement caché.",
    icon: Infinity,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    title: "Support WhatsApp",
    desc: "Une question ? Notre équipe et les formateurs vous répondent directement sur WhatsApp.",
    icon: MessageCircle,
    color: "text-green-600",
    bg: "bg-green-50"
  },
  {
    title: "Optimisé Mobile",
    desc: "Apprenez depuis votre smartphone même avec une connexion internet faible.",
    icon: Smartphone,
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    title: "Résultats Rapides",
    desc: "Des formations 100% pratiques conçues pour être appliquées immédiatement.",
    icon: Zap,
    color: "text-orange-600",
    bg: "bg-orange-50"
  }
];

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex flex-col gap-4 p-6 rounded-3xl hover:bg-slate-50 transition-colors duration-300">
              <div className={`w-14 h-14 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center`}>
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}