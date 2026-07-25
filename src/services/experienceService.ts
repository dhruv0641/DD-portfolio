import { supabase } from '@/lib/supabase';

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
};
