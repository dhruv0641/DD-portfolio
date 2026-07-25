import { supabase } from '@/lib/supabase';
import { fallbackTestimonials } from '@/lib/fallbackData';

export interface TestimonialData {
  id?: string;
  clientName: string;
  clientRole?: string;
  clientCompany?: string;
  text: string;
  avatarUrl?: string;
  position: number;
  status: string;
}

export const testimonialService = {
  async getTestimonials(includeInactive = false): Promise<TestimonialData[]> {
    try {
      let query = supabase
        .from('testimonials')
        .select('*')
        .order('position', { ascending: true });

      if (!includeInactive) {
        query = query.eq('status', 'active');
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        console.warn('Error fetching testimonials, using fallback data:', error);
        return fallbackTestimonials;
      }

      return (data || []).map(row => ({
        id: row.id,
        clientName: row.client_name,
        clientRole: row.client_role,
        clientCompany: row.client_company,
        text: row.text,
        avatarUrl: row.avatar_url,
        position: row.position,
        status: row.status,
      }));
    } catch (err) {
      console.warn('Network error in testimonialService.getTestimonials, using fallback:', err);
      return fallbackTestimonials;
    }
  },
};
