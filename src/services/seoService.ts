import { supabase, getSupabaseAdmin } from '@/lib/supabase';

export interface SeoData {
  id?: string;
  metaDescription: string;
  ogImage?: string;
  twitterCard?: string;
}

export const seoService = {
  async getSeo(): Promise<SeoData | null> {
    const { data, error } = await supabase
      .from('seo')
      .select('*')
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      console.error('Error fetching SEO metadata:', error);
      return null;
    }

    return {
      id: data.id,
      metaDescription: data.meta_description,
      ogImage: data.og_image,
      twitterCard: data.twitter_card,
    };
  },

  async saveSeo(seo: Partial<SeoData>): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = {
        meta_description: seo.metaDescription,
        og_image: seo.ogImage,
        twitter_card: seo.twitterCard || 'summary_large_image',
        updated_at: new Date().toISOString(),
      };

      const admin = getSupabaseAdmin();
      let res;
      if (seo.id) {
        res = await admin.from('seo').update(payload).eq('id', seo.id);
      } else {
        res = await admin.from('seo').insert([payload]);
      }

      if (res.error) {
        return { success: false, error: res.error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save SEO metadata.' };
    }
  },
};
