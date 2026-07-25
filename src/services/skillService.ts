import { supabase } from '@/lib/supabase';
import { fallbackSkills } from '@/lib/fallbackData';

export interface SkillItem {
  id: string;
  name: string;
  proficiency: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: SkillItem[];
}

export const skillService = {
  async getSkillsWithCategories(): Promise<SkillCategory[]> {
    try {
      // 1. Fetch categories
      const { data: categories, error: catError } = await supabase
        .from('skill_categories')
        .select('*')
        .eq('status', 'active')
        .order('position', { ascending: true });

      if (catError || !categories) {
        console.warn('Error fetching skill categories, using fallback data:', catError);
        return fallbackSkills;
      }

      // 2. Fetch skills
      const { data: skills, error: skillError } = await supabase
        .from('skills')
        .select('*')
        .eq('status', 'active')
        .order('position', { ascending: true });

      if (skillError) {
        console.warn('Error fetching skills, using fallback data:', skillError);
        return fallbackSkills;
      }

      // 3. Map categories to their child skills
      return (categories || []).map((cat) => {
        const childSkills = (skills || [])
          .filter((skill) => skill.category_id === cat.id)
          .map((s) => ({
            id: s.id,
            name: s.name,
            proficiency: s.proficiency,
          }));

        return {
          id: cat.id,
          name: cat.name,
          skills: childSkills,
        };
      });
    } catch (err) {
      console.warn('Network error in skillService.getSkillsWithCategories, using fallback:', err);
      return fallbackSkills;
    }
  },

  async getCategories(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('skill_categories')
        .select('*')
        .eq('status', 'active')
        .order('position', { ascending: true });
      if (error || !data) {
        return fallbackSkills.map(c => ({ id: c.id, name: c.name, status: 'active', position: 0 }));
      }
      return data || [];
    } catch (err) {
      return fallbackSkills.map(c => ({ id: c.id, name: c.name, status: 'active', position: 0 }));
    }
  },
};
