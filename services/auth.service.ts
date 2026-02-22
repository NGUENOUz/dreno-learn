import { z } from "zod";
import { supabase } from "@/lib/supabase";

/**
 * ==========================================
 * 1. SCHÉMAS DE VALIDATION (ZOD)
 * ==========================================
 * Ces schémas garantissent que les données sont propres 
 * avant même de toucher la base de données.
 */

export const loginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export const registerSchema = z.object({
  fullName: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  email: z.string().email("Format d'email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

// Définition des types basés sur les schémas
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * ==========================================
 * 2. AUTH SERVICE
 * ==========================================
 */

export const AuthService = {
  /**
   * Connecte un utilisateur existant
   */
  async login(data: LoginInput) {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return authData;
  },

  /**
   * Crée un nouveau compte utilisateur
   * Les métadonnées (full_name, phone) seront récupérées par le trigger SQL 
   * 'handle_new_user' pour remplir ta table 'profiles'.
   */
  async register(data: RegisterInput) {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          phone: data.phone,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return authData;
  },

  /**
   * Déconnecte l'utilisateur et nettoie la session
   */
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Récupère la session actuelle (utile pour le Dashboard)
   */
  async getCurrentUser() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return null;
    return session.user;
  },

  /**
   * Récupère le profil complet de l'utilisateur depuis la table 'profiles'
   */
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }
};