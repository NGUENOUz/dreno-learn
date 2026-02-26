"use client";

import Link from "next/link";
import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  ChevronLeft, Loader2, Lock, Mail, Phone, 
  User, CheckCircle2, MailCheck, Sparkles 
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { registerSchema, AuthService } from "@/services/auth.service";
import { useUserStore } from "@/store/useUserStore";

function RegisterContent() {
  const searchParams = useSearchParams();
  const defaultEmail = searchParams.get("email") || "";
  const defaultName = searchParams.get("name") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const setUserData = useUserStore((state) => state.setUserData);

  const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: defaultName,
      email: defaultEmail,
      phone: "",
      password: ""
    }
  });

  // Si les paramètres URL changent (ou mettent du temps à charger), on force la mise à jour des champs
  useEffect(() => {
    if (defaultName) setValue("fullName", defaultName);
    if (defaultEmail) setValue("email", defaultEmail);
  }, [defaultName, defaultEmail, setValue]);

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const authData = await AuthService.register(values);
      
      if (authData.user) {
        setUserData({
          name: values.fullName,
          email: values.email,
          phone: values.phone,
          id: authData.user.id
        });
        setIsSuccess(true);
        toast.success("Compte créé ! Vérifiez vos emails.");
      }
    } catch (error: any) {
      setServerError(error.message || "Erreur lors de l'inscription");
      toast.error("Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-pattern-afro px-4">
        <Card className="w-full max-w-[500px] border-none shadow-2xl rounded-[2.5rem] bg-white p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto text-blue-600">
            <MailCheck className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-black italic tracking-tight">Vérifiez vos mails !</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Un lien de confirmation vient d'être envoyé à <br />
              <span className="text-blue-600 font-bold">{getValues("email")}</span>
            </CardDescription>
          </div>
          <p className="text-sm text-slate-400">
            Vous devez cliquer sur le lien dans l'email pour activer votre accès aux formations de <strong>DrenoLearn</strong>.
          </p>
          <div className="pt-4">
            <Button asChild className="w-full h-12 bg-slate-900 rounded-xl font-bold">
              <Link href="/login">Retour à la connexion</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-pattern-afro px-4 py-12 relative">
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-all bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-slate-100">
        <ChevronLeft className="w-4 h-4" /> Retour
      </Link>

      <Card className="w-full max-w-[500px] border-none shadow-2xl rounded-[2.5rem] bg-white/95 backdrop-blur-md overflow-hidden">
        <div className="h-2 bg-blue-600 w-full" />
        <CardHeader className="space-y-2 pb-8 pt-10 text-center relative">
          
          {/* Badge informatif si l'utilisateur vient d'un achat */}
          {defaultEmail && (
            <div className="absolute top-4 right-4 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Sécurisation d'achat
            </div>
          )}

          <CardTitle className="text-3xl font-black text-slate-900 tracking-tight italic">Rejoignez l'élite</CardTitle>
          <CardDescription className="text-slate-500 font-medium italic">
            Créez votre compte pour accéder à vie à vos formations.
          </CardDescription>
          {serverError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold animate-shake">
              {serverError}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase text-slate-400 ml-1 tracking-widest">Nom Complet</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <Input {...register("fullName")} placeholder="Moussa T." className={`pl-11 h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-blue-50 transition-all ${errors.fullName ? 'border-red-500' : ''}`} />
                </div>
                {errors.fullName && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.fullName.message as string}</p>}
              </div>
              
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase text-slate-400 ml-1 tracking-widest">WhatsApp</Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <Input {...register("phone")} placeholder="2376..." className={`pl-11 h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-blue-50 transition-all ${errors.phone ? 'border-red-500' : ''}`} />
                </div>
                {errors.phone && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.phone.message as string}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase text-slate-400 ml-1 tracking-widest">Adresse Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <Input {...register("email")} type="email" placeholder="nom@exemple.com" className={`pl-11 h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-blue-50 transition-all ${errors.email ? 'border-red-500' : ''}`} />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase text-slate-400 ml-1 tracking-widest">Mot de passe secret</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <Input {...register("password")} type="password" placeholder="••••••••" className={`pl-11 h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-blue-50 transition-all ${errors.password ? 'border-red-500' : ''}`} />
              </div>
              {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.password.message as string}</p>}
            </div>

            <Button type="submit" className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl mt-4 shadow-xl shadow-blue-100 transition-all uppercase text-xs tracking-[0.2em]" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sécuriser mon compte"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-50 bg-slate-50/30 py-6 rounded-b-[2.5rem]">
          <p className="text-sm text-slate-500 font-medium">
            Déjà membre ? <Link href={`/login${defaultEmail ? `?email=${encodeURIComponent(defaultEmail)}` : ''}`} className="text-blue-600 font-black hover:underline transition-all italic">Se connecter</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

// WRAPPER OBLIGATOIRE POUR NEXT.JS
export default function RegisterPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-10 h-10"/></div>}><RegisterContent /></Suspense>;
}