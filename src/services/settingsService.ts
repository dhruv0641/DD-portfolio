import { cache } from 'react';
import { supabase } from '@/lib/supabase';
import { fallbackSettings } from '@/lib/fallbackData';
import { withTimeout } from '@/lib/utils';

export const settingsService = {
  getSettings: cache(async (): Promise<Record<string, string>> => {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('site_settings')
          .select('key, value')
          .eq('status', 'active'),
        2500,
        'getSettings'
      );

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
  }),

  getSettingsList: cache(async (): Promise<{ key: string; value: string }[]> => {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('site_settings')
          .select('key, value')
          .eq('status', 'active'),
        2500,
        'getSettingsList'
      );

      if (error || !data || data.length === 0) {
        console.warn('Error fetching settings list, using fallback data:', error);
        return Object.entries(fallbackSettings).map(([key, value]) => ({ key, value }));
      }

      return data || [];
    } catch (err) {
      console.warn('Network error in settingsService.getSettingsList, using fallback:', err);
      return Object.entries(fallbackSettings).map(([key, value]) => ({ key, value }));
    }
  }),
};

