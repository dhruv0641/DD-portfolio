import { supabase, getSupabaseAdmin } from '@/lib/supabase';

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

  async saveProfile(profile: any): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = {
        name: profile.name,
        title: profile.title,
        tagline: profile.tagline,
        bio: profile.bio,
        contact_email: profile.contactEmail,
        location: profile.location,
        resume_url: profile.resumeUrl,
        updated_at: new Date().toISOString(),
      };

      const admin = getSupabaseAdmin();
      let res;
      if (profile.id) {
        res = await admin.from('profiles').update(payload).eq('id', profile.id);
      } else {
        res = await admin.from('profiles').insert([payload]);
      }

      if (res.error) {
        return { success: false, error: res.error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save profile.' };
    }
  },
};
