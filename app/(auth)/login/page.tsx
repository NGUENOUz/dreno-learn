"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Loader2, Lock, Mail, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000); // Simulation
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-pattern-afro px-4 py-8">
      
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-all bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-slate-100"
      >
        <ChevronLeft className="w-4 h-4" />
        Retour
      </Link>

      <Card className="w-full max-w-105 border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] bg-white/95 backdrop-blur-md">
        <CardHeader className="space-y-2 pb-8 pt-10 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 rotate-3">
              <span className="text-white font-black text-3xl">D</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Bon retour !</CardTitle>
          <CardDescription className="text-slate-500 font-medium italic">
            &quot;Le savoir est une arme, connectez-vous.&quot;
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* LOGIN SOCIAUX */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="rounded-xl h-11 font-bold border-slate-200 hover:bg-slate-50">
              <Image src="https://www.svgrepo.com/show/475656/google-color.svg" width={16} height={16} className="mr-2" alt="Google" />
              Google
            </Button>
            <Button variant="outline" className="rounded-xl h-11 font-bold border-slate-200 hover:bg-slate-50">
              <Image src="https://www.svgrepo.com/show/475647/facebook-color.svg" width={16} height={16} className="mr-2" alt="Facebook" />
              Facebook
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold">Ou avec email</span></div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase text-slate-400 ml-1">Email professionnel</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="nom@exemple.com" 
                  type="email"
                  className="pl-11 h-12 rounded-xl border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all bg-slate-50/50"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[11px] font-black uppercase text-slate-400">Mot de passe</Label>
                <Link href="#" className="text-[11px] font-bold text-blue-600 hover:text-blue-700">Oublié ?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <Input 
                  type={showPassword ? "text" : "password"}
                  className="pl-11 pr-11 h-12 rounded-xl border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all bg-slate-50/50"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl mt-2 shadow-lg shadow-blue-200 transition-all active:scale-[0.98] hover:shadow-blue-300" 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Accéder à mes cours"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-50 bg-slate-50/30 py-6">
          <p className="text-sm text-slate-500 font-medium">
            Nouveau ici ?{" "}
            <Link href="/register" className="text-blue-600 font-black hover:underline">Créer un compte</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}