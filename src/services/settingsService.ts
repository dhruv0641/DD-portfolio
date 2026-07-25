import { supabase } from '@/lib/supabase';

export const settingsService = {
  async getSettings(): Promise<Record<string, string>> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching site settings:', error);
      return {};
    }

    return (data || []).reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {} as Record<string, string>);
  },

  async getSettingsList(): Promise<{ key: string; value: string }[]> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching site settings list:', error);
      return [];
    }

    return data || [];
  },
};
