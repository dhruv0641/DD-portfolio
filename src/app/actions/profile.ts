'use server';

import { profileService } from '@/services/profileService';
import { verifyAuthSession } from '@/lib/auth';
import { activityService } from '@/services/activityService';
import { revalidatePath } from 'next/cache';

export async function saveProfile(data: any) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized operation.' };
  }

  try {
    const result = await profileService.saveProfile(data);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to update profile.' };
    }

    await activityService.logEvent({
      user_name: session.username,
      action: 'UPDATE',
      entity: 'PROFILE',
      details: 'Administrator profile details modified.',
    });

    revalidatePath('/admin/profile');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Save profile error:', error);
    return { success: false, error: error.message || 'Server error updating profile.' };
  }
}
