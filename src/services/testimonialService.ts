import { supabase, getSupabaseAdmin } from '@/lib/supabase';

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

  async saveTestimonial(data: Partial<TestimonialData>): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = {
        client_name: data.clientName,
        client_role: data.clientRole,
        client_company: data.clientCompany,
        text: data.text,
        avatar_url: data.avatarUrl,
        position: data.position || 0,
        status: data.status || 'active',
        updated_at: new Date().toISOString(),
      };

      const admin = getSupabaseAdmin();
      let res;
      if (data.id) {
        res = await admin.from('testimonials').update(payload).eq('id', data.id);
      } else {
        res = await admin.from('testimonials').insert([payload]);
      }

      if (res.error) {
        return { success: false, error: res.error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save testimonial.' };
    }
  },

  async deleteTestimonial(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const admin = getSupabaseAdmin();
      const { error } = await admin.from('testimonials').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete testimonial.' };
    }
  },
};
