'use server';

import { coreService, ServiceData } from '@/services/coreService';
import { verifyAuthSession } from '@/lib/auth';
import { activityService } from '@/services/activityService';
import { revalidatePath } from 'next/cache';

export async function saveCoreServiceAction(data: Partial<ServiceData>) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    const result = await coreService.saveService(data);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to save service.' };
    }

    await activityService.logEvent({
      user_name: session.username,
      action: 'UPDATE',
      entity: 'SERVICE',
      details: `Saved core service offering: ${data.name}`,
    });

    revalidatePath('/admin/services');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server action error.' };
  }
}

export async function deleteCoreServiceAction(id: string, name: string) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    const result = await coreService.deleteService(id);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to delete service.' };
    }

    await activityService.logEvent({
      user_name: session.username,
      action: 'DELETE',
      entity: 'SERVICE',
      details: `Deleted core service offering: ${name}`,
    });

    revalidatePath('/admin/services');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server action error.' };
  }
}
