import { supabase, getSupabaseAdmin } from '@/lib/supabase';

export interface ExperienceData {
  id?: string;
  role: string;
  company: string;
  location?: string;
  timeline: string;
  description?: string;
  position: number;
}

export const experienceService = {
  async getExperience(): Promise<ExperienceData[]> {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .eq('status', 'active')
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching experiences:', error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      role: row.role,
      company: row.company,
      location: row.location,
      timeline: row.timeline,
      description: row.description,
      position: row.position,
    }));
  },

  async saveExperience(exp: Partial<ExperienceData>): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = {
        role: exp.role,
        company: exp.company,
        location: exp.location,
        timeline: exp.timeline,
        description: exp.description,
        position: exp.position || 0,
        updated_at: new Date().toISOString(),
      };

      const admin = getSupabaseAdmin();
      let res;
      if (exp.id) {
        res = await admin.from('experience').update(payload).eq('id', exp.id);
      } else {
        res = await admin.from('experience').insert([payload]);
      }

      if (res.error) {
        return { success: false, error: res.error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save experience.' };
    }
  },

  async deleteExperience(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const admin = getSupabaseAdmin();
      const { error } = await admin.from('experience').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete experience.' };
    }
  },
};
