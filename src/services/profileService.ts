import { supabase } from '@/lib/supabase';

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
  async getProfile(): Promise<any | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      console.error('Error fetching profile:', error);
      return null;
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
  },
};
