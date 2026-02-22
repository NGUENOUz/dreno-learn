import { supabase } from "@/lib/supabase";

export const SecurityService = {
  /**
   * Vérifie si l'utilisateur a le droit d'accéder à un cours ou un pack
   */
  async checkAccess(userId: string, itemId: string, type: 'course' | 'pack') {
    const { data, error } = await supabase
      .from('user_access')
      .select('id')
      .eq('user_id', userId)
      .eq('item_id', itemId)
      .eq('item_type', type)
      .single();

    if (error || !data) return false;
    return true;
  },

  /**
   * Vérifie si l'utilisateur est un Admin
   */
  async isAdmin(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    return data?.role === 'admin';
  }
};