import { supabase, getSupabaseAdmin } from '@/lib/supabase';
import { SettingUpdateItem } from '@/types';

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

  async saveSettings(settingsList: SettingUpdateItem[]): Promise<{ success: boolean; error?: string }> {
    try {
      const admin = getSupabaseAdmin();
      for (const item of settingsList) {
        const { error } = await admin
          .from('site_settings')
          .update({ value: item.value, updated_at: new Date().toISOString() })
          .eq('key', item.key);
        if (error) throw error;
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update settings.' };
    }
  },
};
