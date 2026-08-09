import { supabase } from '@/lib/supabase';
import { ContactInput } from '@/types';

export interface InboundMessage {
  id: string | number;
  name: string;
  email: string;
  objective?: string;
  details: string;
  status: 'unread' | 'read' | 'starred' | 'archived' | 'trash';
  created_at?: string;
  createdAt?: string;
}

export const contactService = {
  async submitMessage(data: ContactInput): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        objective: data.objective || 'General Inquiry',
        details: data.details,
        status: 'unread',
        created_at: new Date().toISOString(),
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

  async getMessages(): Promise<InboundMessage[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        console.warn('Supabase getMessages query warning:', error?.message);
        return [];
      }

      return data.map((item: any) => ({
        id: item.id,
        name: item.name || 'Anonymous',
        email: item.email || 'no-email@provided.com',
        objective: item.objective || 'General Inquiry',
        details: item.details || '',
        status: item.status || 'unread',
        created_at: item.created_at || item.createdAt || new Date().toISOString(),
      }));
    } catch (err: any) {
      console.error('getMessages exception:', err);
      return [];
    }
  },

  async updateMessageStatus(id: string | number, status: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update message status.' };
    }
  },

  async deleteMessage(id: string | number): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete message.' };
    }
  },

  async clearAllMessages(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .not('id', 'is', null); // Delete all rows cleanly

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to clear messages.' };
    }
  },

  async emptyTrash(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('status', 'trash');

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to empty recycle bin.' };
    }
  },
};
