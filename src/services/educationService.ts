import { supabase } from '@/lib/supabase';
import { fallbackEducation } from '@/lib/fallbackData';

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
    try {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .eq('status', 'active')
        .order('position', { ascending: true });

      if (error || !data || data.length === 0) {
        console.warn('Error fetching education records, using fallback data:', error);
        return fallbackEducation;
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
    } catch (err) {
      console.warn('Network error in educationService.getEducation, using fallback:', err);
      return fallbackEducation;
    }
  },
};
