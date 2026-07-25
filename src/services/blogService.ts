import { supabase } from '@/lib/supabase';
import { BlogPostData } from '@/types';

export const blogService = {
  async getBlogPosts(includeDrafts = false): Promise<BlogPostData[]> {
    let query = supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (!includeDrafts) {
      query = query.eq('is_draft', false).eq('status', 'active');
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      contentMarkdown: row.content_markdown,
      categories: typeof row.categories === 'string' ? JSON.parse(row.categories) : row.categories,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
      isDraft: row.is_draft ? 1 : 0,
      publishedAt: row.published_at,
      readingTime: row.reading_time,
      excerpt: row.excerpt,
    })) as BlogPostData[];
  },

  async getPostBySlug(slug: string): Promise<BlogPostData | null> {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .eq('is_draft', false)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      contentMarkdown: data.content_markdown,
      categories: typeof data.categories === 'string' ? JSON.parse(data.categories) : data.categories,
      tags: typeof data.tags === 'string' ? JSON.parse(data.tags) : data.tags,
      isDraft: data.is_draft ? 1 : 0,
      publishedAt: data.published_at,
      readingTime: data.reading_time,
      excerpt: data.excerpt,
    } as BlogPostData;
  },
};
