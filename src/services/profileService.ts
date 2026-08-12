import { cache } from 'react';
import { supabase } from '@/lib/supabase';
import { fallbackProfile } from '@/lib/fallbackData';
import { withTimeout } from '@/lib/utils';

export interface ProfileData {
  id?: string;
  name: string;
  title: string;
  tagline?: string;
  bio?: string;
  contactEmail?: string;
  location?: string;
  resumeUrl?: string;
}

export const profileService = {
  getProfile: cache(async (): Promise<any | null> => {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('profiles')
          .select('*')
          .eq('status', 'active')
          .limit(1)
          .maybeSingle(),
        2500,
        'getProfile'
      );

      if (error || !data) {
        console.warn('Error fetching profile, using fallback data:', error);
        return fallbackProfile;
      }

      return {
        id: data.id,
        name: data.name,
        title: data.title,
        tagline: data.tagline,
        bio: data.bio,
        contactEmail: data.contact_email,
        location: data.location,
        resumeUrl: data.resume_url,
      };
    } catch (err) {
      console.warn('Network error in profileService.getProfile, using fallback:', err);
      return fallbackProfile;
    }
  }),
};

