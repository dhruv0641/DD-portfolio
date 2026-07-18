'use server';

import { experienceService, ExperienceData } from '@/services/experienceService';
import { verifyAuthSession } from '@/lib/auth';
import { activityService } from '@/services/activityService';
import { revalidatePath } from 'next/cache';

export async function saveExperienceAction(data: Partial<ExperienceData>) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    const result = await experienceService.saveExperience(data);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to save experience.' };
    }

    await activityService.logEvent({
      user_name: session.username,
      action: 'UPDATE',
      entity: 'EXPERIENCE',
      details: `Saved experience entry for role ${data.role} at ${data.company}`,
    });

    revalidatePath('/admin/experience');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server action error.' };
  }
}

export async function deleteExperienceAction(id: string, role: string, company: string) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    const result = await experienceService.deleteExperience(id);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to delete experience.' };
    }

    await activityService.logEvent({
      user_name: session.username,
      action: 'DELETE',
      entity: 'EXPERIENCE',
      details: `Deleted experience entry: ${role} at ${company}`,
    });

    revalidatePath('/admin/experience');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server action error.' };
  }
}
