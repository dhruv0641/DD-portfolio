import { supabase } from '@/lib/supabase';
import { fallbackSeo } from '@/lib/fallbackData';

export interface SeoData {
  id?: string;
  metaDescription: string;
  ogImage?: string;
  twitterCard?: string;
}

export const seoService = {
  async getSeo(): Promise<SeoData | null> {
    try {
      const { data, error } = await supabase
        .from('seo')
        .select('*')
        .eq('status', 'active')
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        console.warn('Error fetching SEO metadata, using fallback data:', error);
        return fallbackSeo;
      }

      return {
        id: data.id,
        metaDescription: data.meta_description,
        ogImage: data.og_image,
        twitterCard: data.twitter_card,
      };
    } catch (err) {
      console.warn('Network error in seoService.getSeo, using fallback:', err);
      return fallbackSeo;
    }
  },
};
