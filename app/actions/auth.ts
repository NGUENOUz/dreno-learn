"use server";

import { createClient } from "@/lib/supabase/server";

export async function finalizeSignUpAction(formData: {
  email: string;
  password: string;
  full_name: string;
  phone: string;
}) {
  // 🚀 LE FIX : Il faut mettre 'await' devant createClient()
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.full_name,
        phone: formData.phone,
      }
    }
  });

  if (error) {
    console.error("Erreur Auth:", error.message);
    return { success: false, error: error.message };
  }

  // Si l'inscription réussit, ton Trigger SQL 'handle_new_user' 
  // s'exécutera automatiquement pour créer le profil et lier les cours.

  return { success: true };
}