import { supabase, getSupabaseAdmin } from '@/lib/supabase';

export interface EducationData {
  id?: string;
  degree: string;
  institution: string;
  location?: string;
  timeline: string;
  description?: string;
  position: number;
}

export const educationService = {
  async getEducation(): Promise<EducationData[]> {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .eq('status', 'active')
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching education records:', error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      degree: row.degree,
      institution: row.institution,
      location: row.location,
      timeline: row.timeline,
      description: row.description,
      position: row.position,
    }));
  },

  async saveEducation(edu: Partial<EducationData>): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = {
        degree: edu.degree,
        institution: edu.institution,
        location: edu.location,
        timeline: edu.timeline,
        description: edu.description,
        position: edu.position || 0,
        updated_at: new Date().toISOString(),
      };

      const admin = getSupabaseAdmin();
      let res;
      if (edu.id) {
        res = await admin.from('education').update(payload).eq('id', edu.id);
      } else {
        res = await admin.from('education').insert([payload]);
      }

      if (res.error) {
        return { success: false, error: res.error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save education.' };
    }
  },

  async deleteEducation(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const admin = getSupabaseAdmin();
      const { error } = await admin.from('education').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete education.' };
    }
  },
};
