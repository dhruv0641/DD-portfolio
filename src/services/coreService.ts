import { supabase } from '@/lib/supabase';
import { fallbackServices } from '@/lib/fallbackData';

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
    try {
      let query = supabase
        .from('services')
        .select('*')
        .order('position', { ascending: true });

      if (!includeInactive) {
        query = query.eq('status', 'active');
      }

      const { data, error } = await query;
      if (error || !data) {
        console.warn('Error fetching services, using fallback data:', error);
        return fallbackServices;
      }

      return (data || []).map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        icon: row.icon,
        position: row.position,
        status: row.status,
      }));
    } catch (err) {
      console.warn('Network error in coreService.getServices, using fallback:', err);
      return fallbackServices;
    }
  },
};
