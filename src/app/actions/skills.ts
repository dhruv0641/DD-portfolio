'use server';

import { skillService } from '@/services/skillService';
import { verifyAuthSession } from '@/lib/auth';
import { activityService } from '@/services/activityService';
import { revalidatePath } from 'next/cache';

export async function saveSkillAction(data: any) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    const result = await skillService.saveSkill(data);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to save skill.' };
    }

    await activityService.logEvent({
      user_name: session.username,
      action: 'UPDATE',
      entity: 'SKILLS',
      details: `Saved skill item: ${data.name}`,
    });

    revalidatePath('/admin/skills');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server action error.' };
  }
}

export async function deleteSkillAction(id: string, name: string) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    const result = await skillService.deleteSkill(id);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to delete skill.' };
    }

    await activityService.logEvent({
      user_name: session.username,
      action: 'DELETE',
      entity: 'SKILLS',
      details: `Deleted skill item: ${name}`,
    });

    revalidatePath('/admin/skills');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server action error.' };
  }
}

export async function saveCategoryAction(data: any) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    const result = await skillService.saveCategory(data);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to save category.' };
    }

    await activityService.logEvent({
      user_name: session.username,
      action: 'UPDATE',
      entity: 'SKILLS',
      details: `Saved skill category: ${data.name}`,
    });

    revalidatePath('/admin/skills');
    revalidatePath('/');
    return { success: true, id: result.id };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server action error.' };
  }
}

export async function deleteCategoryAction(id: string, name: string) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    const result = await skillService.deleteCategory(id);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to delete category.' };
    }

    await activityService.logEvent({
      user_name: session.username,
      action: 'DELETE',
      entity: 'SKILLS',
      details: `Deleted skill category: ${name}`,
    });

    revalidatePath('/admin/skills');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server action error.' };
  }
}
