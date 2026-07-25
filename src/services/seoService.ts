import { supabase } from '@/lib/supabase';

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
};
