import { supabase } from '@/lib/supabase';

export interface ActivityLog {
  id?: string;
  user_name: string;
  action: string;
  entity?: string;
  details?: string;
  ip_address?: string;
  created_at?: string;
}

export const activityService = {
  async logEvent(log: ActivityLog): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from('activity_logs').insert([log]);
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Logging event failed.' };
    }
  },
};
