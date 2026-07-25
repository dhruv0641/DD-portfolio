import { supabase } from '@/lib/supabase';

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
};
