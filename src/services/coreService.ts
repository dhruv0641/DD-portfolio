import { supabase, getSupabaseAdmin } from '@/lib/supabase';

export interface ServiceData {
  id?: string;
  name: string;
  description: string;
  icon?: string;
  position: number;
  status: string;
}

export const coreService = {
  async getServices(includeInactive = false): Promise<ServiceData[]> {
    let query = supabase
      .from('services')
      .select('*')
      .order('position', { ascending: true });

    if (!includeInactive) {
      query = query.eq('status', 'active');
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching core services:', error);
      return [];
    }

    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      icon: row.icon,
      position: row.position,
      status: row.status,
    }));
  },

  async saveService(data: Partial<ServiceData>): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        icon: data.icon,
        position: data.position || 0,
        status: data.status || 'active',
        updated_at: new Date().toISOString(),
      };

      const admin = getSupabaseAdmin();
      let res;
      if (data.id) {
        res = await admin.from('services').update(payload).eq('id', data.id);
      } else {
        res = await admin.from('services').insert([payload]);
      }

      if (res.error) {
        return { success: false, error: res.error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save core service.' };
    }
  },

  async deleteService(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const admin = getSupabaseAdmin();
      const { error } = await admin.from('services').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete core service.' };
    }
  },
};
