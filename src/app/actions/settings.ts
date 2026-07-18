'use server';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export interface SettingUpdateItem {
  key: string;
  value: string;
}

export async function saveSettings(settingsList: SettingUpdateItem[]) {
  try {
    for (const item of settingsList) {
      await db
        .update(schema.settings)
        .set({ value: item.value })
        .where(eq(schema.settings.key, item.key));
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
