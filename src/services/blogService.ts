import { supabase, getSupabaseAdmin } from '@/lib/supabase';
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

  async saveBlogPost(post: Partial<BlogPostData>): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = {
        title: post.title,
        slug: post.slug,
        content_markdown: post.contentMarkdown,
        categories: Array.isArray(post.categories) ? post.categories : JSON.parse(post.categories || '[]'),
        tags: Array.isArray(post.tags) ? post.tags : JSON.parse(post.tags || '[]'),
        is_draft: post.isDraft === 1 || post.isDraft === true,
        published_at: (post.isDraft === 1 || post.isDraft === true) ? null : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const admin = getSupabaseAdmin();
      let res;
      if (post.id) {
        res = await admin.from('blogs').update(payload).eq('id', post.id);
      } else {
        res = await admin.from('blogs').insert([payload]);
      }

      if (res.error) {
        return { success: false, error: res.error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save blog post.' };
    }
  },

  async deleteBlogPost(id: string): Promise<{ success: boolean; error?: string }> {
    const admin = getSupabaseAdmin();
    const { error } = await admin.from('blogs').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  },
};
