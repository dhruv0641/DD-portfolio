import { supabase } from '@/lib/supabase';
import { ProjectData } from '@/types';
import { fallbackProjects } from '@/lib/fallbackData';

export const projectService = {
  async getProjects(includeDrafts = false): Promise<ProjectData[]> {
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .order('position', { ascending: true });

      if (!includeDrafts) {
        query = query.eq('is_draft', false).eq('status', 'active');
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        console.warn('Error fetching projects, using fallback data:', error);
        return fallbackProjects;
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
    } catch (err) {
      console.warn('Network error in projectService.getProjects, using fallback:', err);
      return fallbackProjects;
    }
  },
};
