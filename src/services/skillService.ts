import { supabase, getSupabaseAdmin } from '@/lib/supabase';

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

  async saveSkill(skill: any): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = {
        category_id: skill.categoryId,
        name: skill.name,
        proficiency: skill.proficiency,
        position: skill.position || 0,
        updated_at: new Date().toISOString(),
      };

      const admin = getSupabaseAdmin();
      let res;
      if (skill.id) {
        res = await admin.from('skills').update(payload).eq('id', skill.id);
      } else {
        res = await admin.from('skills').insert([payload]);
      }
      if (res.error) {
        return { success: false, error: res.error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save skill.' };
    }
  },

  async deleteSkill(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const admin = getSupabaseAdmin();
      const { error } = await admin.from('skills').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete skill.' };
    }
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

  async saveCategory(category: any): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const payload = {
        name: category.name,
        position: category.position || 0,
        updated_at: new Date().toISOString(),
      };

      const admin = getSupabaseAdmin();
      let res;
      if (category.id) {
        res = await admin.from('skill_categories').update(payload).eq('id', category.id);
      } else {
        res = await admin.from('skill_categories').insert([payload]).select();
      }

      if (res.error) {
        return { success: false, error: res.error.message };
      }
      const savedId = !category.id && res.data ? res.data[0]?.id : category.id;
      return { success: true, id: savedId };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save category.' };
    }
  },

  async deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const admin = getSupabaseAdmin();
      const { error } = await admin.from('skill_categories').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete category.' };
    }
  },
};
