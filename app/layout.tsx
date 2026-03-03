// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from 'sonner';
import "./globals.css";
import StructuredData from '../components/structuredData';
import { Analytics } from "@vercel/analytics/react";
import { MicrosoftClarity } from "@/components/MicrosoftClarity";
import { FacebookPixel } from "@/components/FacebookPixel";
import { Suspense } from "react";
import { ExitPopup } from "@/components/ExitPopup";
const inter = Inter({ subsets: ["latin"] });




export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://drenolearn.com'),
  title: {
    default: "Formation : Réussir son Dossier Canada (Méthode 2026)", // "Formation" est le mot magique
    template: "%s | DrenoLearn Academy" // "Academy" renforce l'éducation
  },
  description: "Téléchargez le support de cours complet pour comprendre la procédure Entrée Express. Formation étape par étape, modèles de documents et auto-évaluation.",
  keywords: [
    "Formation en ligne", 
    "Guide pratique 2026", 
    "Apprentissage autodidacte", 
    "Support de cours PDF", 
    "Modèles administratifs", 
    "Tutoriel Entrée Express",
    "Méthodologie Canada",
    "Auto-évaluation"
  ],
  openGraph: {
    type: "book", // On dit à Facebook que c'est un LIVRE, pas un service politique
    locale: "fr_FR",
    url: "https://drenolearn.com",
    title: "📚 Formation DrenoLearn : Le Guide de l'Autonomie 2026",
    description: "Apprenez à monter votre dossier vous-même. Support PDF complet + Accès Communauté d'Apprentissage.",
    siteName: "DrenoLearn Academy",
    images: [
      {
        url: "https://res.cloudinary.com/dcsl6xhli/image/upload/v1772423462/guide_entr%C3%A9e_express_canada_3_hqgkmm.png",
        width: 1200,
        height: 630,
        alt: "Couverture du Guide de Formation 2026",
      },
    ],
  },
  
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        {/* On a retiré le Header d'ici */}
        <MicrosoftClarity />
         <ExitPopup />
       <Suspense fallback={null}>
            <FacebookPixel />
        </Suspense>
        {children}
        <StructuredData/>
        <Analytics />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}