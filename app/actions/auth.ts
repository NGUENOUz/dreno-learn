"use server";

import { createClient } from "@/lib/supabase/server";

export async function finalizeSignUpAction(formData: {
  email: string;
  password: string;
  full_name: string;
  phone: string;
}) {
  try {
    // On initialise le client serveur (qui utilise le fichier de l'étape 1)
    const supabase = await createClient();

    // On lance l'inscription
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.full_name,
          phone: formData.phone,
        },
        // IMPORTANT : Désactive la confirmation par email auto si tu veux tester
        // Mais garde-le pour la production si nécessaire
      },
    });

    if (error) {
      console.error("❌ Erreur Auth Supabase:", error.message);
      return { success: false, error: error.message };
    }

    if (data.user && data.user.identities && data.user.identities.length === 0) {
      return { success: false, error: "Cet email existe déjà." };
    }

    return { success: true };
    
  } catch (err: any) {
    console.error("🔥 Crash Serveur Inscription:", err);
    return { success: false, error: "Erreur interne du serveur." };
  }
}