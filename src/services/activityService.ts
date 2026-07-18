import { supabase, getSupabaseAdmin } from '@/lib/supabase';

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
  async getLogs(limit = 100, offset = 0): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching activity logs:', error);
      return [];
    }

    return data || [];
  },

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
