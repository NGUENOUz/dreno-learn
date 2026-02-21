"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Loader2, Lock, Mail, Phone, User, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-pattern-afro px-4 py-12">
      
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-all bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-slate-100">
        <ChevronLeft className="w-4 h-4" /> Retour
      </Link>

      <Card className="w-full max-w-120 border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] bg-white/95 backdrop-blur-md overflow-hidden">
        <div className="h-2 bg-blue-600 w-full" />
        <CardHeader className="space-y-2 pb-8 pt-10 text-center">
          <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Rejoignez l&apos;aventure</CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            Créez votre compte et accédez à +50 formations.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-5">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase text-slate-400 ml-1">Nom Complet</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <Input placeholder="Moussa T." className="pl-11 h-12 rounded-xl border-slate-200 bg-slate-50/50" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase text-slate-400 ml-1">WhatsApp</Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <Input placeholder="+221..." className="pl-11 h-12 rounded-xl border-slate-200 bg-slate-50/50" required />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase text-slate-400 ml-1">Adresse Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <Input type="email" placeholder="nom@exemple.com" className="pl-11 h-12 rounded-xl border-slate-200 bg-slate-50/50" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase text-slate-400 ml-1">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <Input type="password" placeholder="••••••••" className="pl-11 h-12 rounded-xl border-slate-200 bg-slate-50/50" required />
              </div>
            </div>

            <div className="bg-blue-50/50 p-4 rounded-2xl flex gap-3 border border-blue-100">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-blue-800 leading-normal font-medium">
                En vous inscrivant, vous recevez un accès gratuit au groupe WhatsApp d&apos;entraide de <strong>Dreno learn</strong>.
              </p>
            </div>

            <Button 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl mt-2 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]" 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Devenir membre Dreno"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-50 bg-slate-50/30 py-6">
          <p className="text-sm text-slate-500 font-medium">
            Déjà inscrit ?{" "}
            <Link href="/login" className="text-blue-600 font-black hover:underline transition-all">Se connecter</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}