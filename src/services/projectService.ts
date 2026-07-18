import { supabase, getSupabaseAdmin } from '@/lib/supabase';
import { ProjectData } from '@/types';

export const projectService = {
  async getProjects(includeDrafts = false): Promise<ProjectData[]> {
    let query = supabase
      .from('projects')
      .select('*')
      .order('position', { ascending: true });

    if (!includeDrafts) {
      query = query.eq('is_draft', false).eq('status', 'active');
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      subtitle: row.subtitle,
      role: row.role,
      company: row.company,
      timeline: row.timeline,
      problem: row.problem,
      challenge: row.challenge,
      solution: row.solution,
      techStack: typeof row.tech_stack === 'string' ? JSON.parse(row.tech_stack) : row.tech_stack,
      metrics: typeof row.metrics === 'string' ? JSON.parse(row.metrics) : row.metrics,
      screenshots: typeof row.screenshots === 'string' ? JSON.parse(row.screenshots) : row.screenshots,
      githubUrl: row.github_url,
      demoUrl: row.demo_url,
      isFeatured: row.is_featured ? 1 : 0,
      isPinned: row.is_pinned ? 1 : 0,
      isDraft: row.is_draft ? 1 : 0,
      position: row.position,
    })) as unknown as ProjectData[];
  },

  async saveProject(project: Partial<ProjectData>): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = {
        title: project.title,
        slug: project.slug,
        subtitle: project.subtitle,
        role: project.role,
        company: project.company,
        timeline: project.timeline,
        problem: project.problem,
        challenge: project.challenge,
        solution: project.solution,
        tech_stack: Array.isArray(project.techStack) ? project.techStack : JSON.parse(project.techStack || '[]'),
        metrics: Array.isArray(project.metrics) ? project.metrics : JSON.parse(project.metrics as any || '[]'),
        screenshots: Array.isArray(project.screenshots) ? project.screenshots : JSON.parse(project.screenshots || '[]'),
        github_url: project.githubUrl,
        demo_url: project.demoUrl,
        is_featured: project.isFeatured === 1 || project.isFeatured === true,
        is_pinned: project.isPinned === 1 || project.isPinned === true,
        is_draft: project.isDraft === 1 || project.isDraft === true,
        position: typeof project.position === 'string' ? parseInt(project.position, 10) : (project.position || 0),
        updated_at: new Date().toISOString(),
      };

      const admin = getSupabaseAdmin();
      let res;
      if (project.id) {
        res = await admin.from('projects').update(payload).eq('id', project.id);
      } else {
        res = await admin.from('projects').insert([payload]);
      }

      if (res.error) {
        return { success: false, error: res.error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save project.' };
    }
  },

  async deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
    const admin = getSupabaseAdmin();
    const { error } = await admin.from('projects').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  async updateProjectOrder(orderList: { id: string; position: number }[]): Promise<{ success: boolean; error?: string }> {
    try {
      const admin = getSupabaseAdmin();
      for (const item of orderList) {
        const { error } = await admin
          .from('projects')
          .update({ position: item.position })
          .eq('id', item.id);
        if (error) throw error;
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to reorder projects.' };
    }
  },
};
