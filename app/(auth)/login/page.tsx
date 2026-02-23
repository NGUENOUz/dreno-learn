"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader2, Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Services & Store
import { loginSchema, AuthService } from "@/services/auth.service";
import { useUserStore } from "@/store/useUserStore";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const setUserData = useUserStore((state) => state.setUserData);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const authData = await AuthService.login(values);

      if (authData.user) {
        toast.success("Connexion réussie !");
        
        // Sauvegarde dans le store pour l'UX (remplissage automatique futur)
        setUserData({
          name: authData.user.user_metadata?.full_name || "Utilisateur",
          email: authData.user.email || "",
          id:authData.user.id || "",
          phone:authData.user.phone || ""
        });

        // UTILISATION DE WINDOW.LOCATION POUR FORCER LE MIDDLEWARE À LIRE LE COOKIE
        window.location.href = "/dashboard";
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMsg = error.message.toLowerCase();
      
      // Gestion de l'erreur 400 (Email non confirmé ou mauvais identifiants)
      if (errorMsg.includes("confirm") || errorMsg.includes("verified")) {
        setServerError("Veuillez confirmer votre email avant de vous connecter.");
        toast.error("Vérification requise !");
      } else if (errorMsg.includes("invalid login")) {
        setServerError("Email ou mot de passe incorrect.");
      } else {
        setServerError("Une erreur est survenue lors de la connexion.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 px-4 py-8 relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('/pattern.png')] bg-repeat bg-center" />
      
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-all bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-slate-100 z-10"
      >
        <ChevronLeft className="w-4 h-4" />
        Retour
      </Link>

      <Card className="w-full max-w-[420px] border-none shadow-2xl rounded-[2.5rem] bg-white/95 backdrop-blur-md z-10 overflow-hidden">
        <CardHeader className="space-y-2 pb-8 pt-10 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 rotate-3">
              <span className="text-white font-black text-3xl">D</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-slate-900 tracking-tight italic">Bon retour !</CardTitle>
          <CardDescription className="text-slate-500 font-medium italic">
            &quot;Le savoir est une arme, connectez-vous.&quot;
          </CardDescription>
          
          {serverError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {serverError}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" className="rounded-xl h-11 font-bold border-slate-200">
              <Image src="https://www.svgrepo.com/show/475656/google-color.svg" width={16} height={16} className="mr-2" alt="Google" />
              Google
            </Button>
            <Button variant="outline" type="button" className="rounded-xl h-11 font-bold border-slate-200">
              <Image src="https://www.svgrepo.com/show/475647/facebook-color.svg" width={16} height={16} className="mr-2" alt="Facebook" />
              Facebook
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold">Ou avec email</span></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase text-slate-400 ml-1 tracking-widest">Email professionnel</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <Input 
                  {...register("email")}
                  placeholder="nom@exemple.com" 
                  type="email"
                  className={`pl-11 h-12 rounded-xl border-slate-200 focus:border-blue-600 transition-all bg-slate-50/50 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email.message as string}</p>}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Mot de passe</Label>
                <Link href="#" className="text-[11px] font-bold text-blue-600">Oublié ?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <Input 
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className={`pl-11 pr-11 h-12 rounded-xl border-slate-200 focus:border-blue-600 transition-all bg-slate-50/50 ${errors.password ? 'border-red-500' : ''}`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.password.message as string}</p>}
            </div>

            <Button 
              type="submit"
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl mt-4 shadow-xl shadow-blue-100 transition-all uppercase text-xs tracking-widest" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Vérification...</span>
                </div>
              ) : "Accéder à mes cours"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-50 bg-slate-50/30 py-6 rounded-b-[2.5rem]">
          <p className="text-sm text-slate-500 font-medium">
            Nouveau ici ?{" "}
            <Link href="/register" className="text-blue-600 font-black hover:underline italic">Créer un compte</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}