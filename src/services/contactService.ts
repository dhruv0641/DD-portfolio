import { supabase, getSupabaseAdmin } from '@/lib/supabase';
import { ContactInput } from '@/types';

export const contactService = {
  async getMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading leads messages:', error);
      return [];
    }

    return data || [];
  },

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

  async updateMessageStatus(id: string, status: 'read' | 'unread' | 'archived' | 'spam'): Promise<{ success: boolean; error?: string }> {
    const admin = getSupabaseAdmin();
    const { error } = await admin
      .from('messages')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  async deleteMessage(id: string): Promise<{ success: boolean; error?: string }> {
    const admin = getSupabaseAdmin();
    const { error } = await admin.from('messages').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  },
};
