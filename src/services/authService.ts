import { supabase } from '@/lib/supabase';
import { UserSession } from '@/types';

export const authService = {
  async signIn(username: string, passwordHash: string): Promise<{ success: boolean; session?: any; error?: string }> {
    try {
      // Supabase Auth expects an email. For our admin console, we map the username to an email
      // format to simplify the operator's sign-in flow.
      const email = `${username}@vance.engineering`;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: passwordHash,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, session: data.session };
    } catch (err: any) {
      return { success: false, error: err.message || 'Authentication error.' };
    }
  },

  async signOut(): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) return null;
    return session;
  },

  async resetPasswordForEmail(username: string, redirectTo: string): Promise<{ success: boolean; error?: string }> {
    try {
      const email = `${username}@vance.engineering`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Password reset request failed.' };
    }
  },

  async updatePassword(password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Password update failed.' };
    }
  },
};
