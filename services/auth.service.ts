import { z } from "zod";
import { createBrowserClient } from "@supabase/ssr";

// ⚠️ IMPORTANT : On s'assure d'utiliser le bon client browser
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * ==========================================
 * 1. SCHÉMAS DE VALIDATION (ZOD)
 * ==========================================
 */

export const loginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

// On garde le schema pour l'utiliser ailleurs si besoin, 
// même si la page register a maintenant sa propre validation.
export const registerSchema = z.object({
  fullName: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  email: z.string().email("Format d'email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * ==========================================
 * 2. AUTH SERVICE (NETTOYÉ)
 * ==========================================
 */

export const AuthService = {
  /**
   * Connecte un utilisateur existant (Reste côté client, c'est OK)
   */
  async login(data: LoginInput) {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw new Error("Email ou mot de passe incorrect.");
    }

    return authData;
  },

  /**
   * ❌ L'ANCIENNE FONCTION REGISTER A ÉTÉ SUPPRIMÉE
   * On utilise maintenant 'finalizeSignUpAction' dans 'app/actions/auth.ts'
   * pour garantir la synchronisation avec la base de données.
   */

  /**
   * Déconnecte l'utilisateur
   */
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // On force le rafraîchissement de la page pour nettoyer les états
    window.location.href = "/"; 
  },

  /**
   * Récupère la session actuelle
   */
  async getCurrentUser() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return null;
    return session.user;
  },
};