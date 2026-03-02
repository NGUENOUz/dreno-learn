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
const inter = Inter({ subsets: ["latin"] });



export const metadata: Metadata = {
  metadataBase: new URL('https://drenolearn.com'), // Ton vrai domaine
  title: {
    default: "Guide Entrée Express Canada 2026 | Immigrer sans Agence",
    template: "%s | DrenoLearn"
  },
  description: "Téléchargez le guide complet pour réussir votre immigration au Canada (Entrée Express) depuis l'Afrique. Méthode étape par étape, sans intermédiaire. Modèles CV et Lettres inclus.",
  keywords: [
    "Immigration Canada", 
    "Entrée Express 2026", 
    "Visa Canada Cameroun", 
    "Immigrer sans agence", 
    "Guide Canada PDF", 
    "Travail Canada depuis l'Afrique",
    "Score CRS",
    "Guichet Emploi"
  ],
  authors: [{ name: "DrenoLearn Team" }],
  creator: "DrenoLearn",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://drenolearn.com",
    title: "🇨🇦 Stop aux Agences : Faites votre procédure Canada vous-même",
    description: "La méthode exacte pour obtenir votre Visa Résident Permanent. Guide + Groupe WhatsApp + Modèles Word. À partir de 2900 FCFA.",
    siteName: "DrenoLearn",
    images: [
      {
        url: "https://res.cloudinary.com/dcsl6xhli/image/upload/v1772423462/guide_entr%C3%A9e_express_canada_3_hqgkmm.png", // Ton image de couverture
        width: 1200,
        height: 630,
        alt: "Guide Entrée Express Canada 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "🇨🇦 Guide Canada 2026 : Immigrez seul et économisez 1 Million",
    description: "Tout ce qu'il faut savoir sur l'Entrée Express. PDF Téléchargeable immédiatement.",
    images: ["https://res.cloudinary.com/dcsl6xhli/image/upload/v1772423462/guide_entr%C3%A9e_express_canada_3_hqgkmm.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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