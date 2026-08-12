import { cache } from 'react';
import { supabase } from '@/lib/supabase';
import { fallbackExperience } from '@/lib/fallbackData';
import { withTimeout } from '@/lib/utils';

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
  getExperience: cache(async (): Promise<ExperienceData[]> => {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('experience')
          .select('*')
          .eq('status', 'active')
          .order('position', { ascending: true }),
        2500,
        'getExperience'
      );

      if (error || !data) {
        console.warn('Error fetching experience, using fallback data:', error);
        return fallbackExperience;
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
    } catch (err) {
      console.warn('Network error in experienceService.getExperience, using fallback:', err);
      return fallbackExperience;
    }
  }),
};

