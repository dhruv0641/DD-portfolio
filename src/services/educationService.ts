import { supabase } from '@/lib/supabase';

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
};
