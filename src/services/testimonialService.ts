import { supabase } from '@/lib/supabase';

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
    let query = supabase
      .from('testimonials')
      .select('*')
      .order('position', { ascending: true });

    if (!includeInactive) {
      query = query.eq('status', 'active');
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching testimonials:', error);
      return [];
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
  },
};
