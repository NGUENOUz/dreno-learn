// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from 'sonner';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dreno learn | Formations en ligne expertes",
  description: "Développez vos compétences avec Dreno learn.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        {/* On a retiré le Header d'ici */}
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}