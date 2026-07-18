'use server';

import { settingsService } from '@/services/settingsService';
import { verifyAuthSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { SettingUpdateItem } from '@/types';

export async function saveSettings(settingsList: SettingUpdateItem[]) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized administrative operation.' };
  }

  try {
    const result = await settingsService.saveSettings(settingsList);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to update settings.' };
    }
    
    // Revalidate paths globally to propagate theme and copy changes immediately
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/admin/settings');
    
    return { success: true };
  } catch (error: any) {
    console.error('Settings save error:', error);
    return { success: false, error: error.message || 'Database settings write error.' };
  }
}
