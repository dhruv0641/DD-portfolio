import { supabase } from '@/lib/supabase';

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
    // 1. Fetch categories
    const { data: categories, error: catError } = await supabase
      .from('skill_categories')
      .select('*')
      .eq('status', 'active')
      .order('position', { ascending: true });

    if (catError) {
      console.error('Error fetching categories:', catError);
      return [];
    }

    // 2. Fetch skills
    const { data: skills, error: skillError } = await supabase
      .from('skills')
      .select('*')
      .eq('status', 'active')
      .order('position', { ascending: true });

    if (skillError) {
      console.error('Error fetching skills:', skillError);
      return [];
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
  },

  async getCategories(): Promise<any[]> {
    const { data, error } = await supabase
      .from('skill_categories')
      .select('*')
      .eq('status', 'active')
      .order('position', { ascending: true });
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    return data || [];
  },
};
