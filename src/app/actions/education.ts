'use server';

import { educationService, EducationData } from '@/services/educationService';
import { verifyAuthSession } from '@/lib/auth';
import { activityService } from '@/services/activityService';
import { revalidatePath } from 'next/cache';

export async function saveEducationAction(data: Partial<EducationData>) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    const result = await educationService.saveEducation(data);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to save education.' };
    }

    await activityService.logEvent({
      user_name: session.username,
      action: 'UPDATE',
      entity: 'EDUCATION',
      details: `Saved education record: ${data.degree} at ${data.institution}`,
    });

    revalidatePath('/admin/education');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server action error.' };
  }
}

export async function deleteEducationAction(id: string, degree: string, institution: string) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    const result = await educationService.deleteEducation(id);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to delete education.' };
    }

    await activityService.logEvent({
      user_name: session.username,
      action: 'DELETE',
      entity: 'EDUCATION',
      details: `Deleted education record: ${degree} at ${institution}`,
    });

    revalidatePath('/admin/education');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server action error.' };
  }
}
