import { supabase } from '@/lib/supabase';
import { ContactInput } from '@/types';

export const contactService = {
  async submitMessage(data: ContactInput): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        objective: data.objective,
        details: data.details,
        status: 'unread',
      };

      const { error } = await supabase.from('messages').insert([payload]);
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Message dispatch failed.' };
    }
  },
};
