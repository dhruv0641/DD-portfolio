import { supabase } from '@/lib/supabase';
import { fallbackSettings } from '@/lib/fallbackData';

export const settingsService = {
  async getSettings(): Promise<Record<string, string>> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .eq('status', 'active');

      if (error || !data || data.length === 0) {
        console.warn('Error fetching settings, using fallback data:', error);
        return fallbackSettings;
      }

      return (data || []).reduce((acc, row) => {
        acc[row.key] = row.value;
        return acc;
      }, {} as Record<string, string>);
    } catch (err) {
      console.warn('Network error in settingsService.getSettings, using fallback:', err);
      return fallbackSettings;
    }
  },

  async getSettingsList(): Promise<{ key: string; value: string }[]> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .eq('status', 'active');

      if (error || !data || data.length === 0) {
        console.warn('Error fetching settings list, using fallback data:', error);
        return Object.entries(fallbackSettings).map(([key, value]) => ({ key, value }));
      }

      return data || [];
    } catch (err) {
      console.warn('Network error in settingsService.getSettingsList, using fallback:', err);
      return Object.entries(fallbackSettings).map(([key, value]) => ({ key, value }));
    }
  },
};
