'use server';

import { projectService } from '@/services/projectService';
import { verifyAuthSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { ProjectData } from '@/types';

export async function saveProject(formData: Partial<ProjectData>) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized administrative operation.' };
  }

  try {
    const result = await projectService.saveProject(formData);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to save case study.' };
    }

    revalidatePath('/');
    revalidatePath('/admin/projects');
    return { success: true };
  } catch (error: any) {
    console.error('Project save error:', error);
    return { success: false, error: error.message || 'Database write transaction failed.' };
  }
}

export async function deleteProject(id: string | number) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized administrative operation.' };
  }

  try {
    const result = await projectService.deleteProject(id.toString());
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to delete case study.' };
    }
    revalidatePath('/');
    revalidatePath('/admin/projects');
    return { success: true };
  } catch (error: any) {
    console.error('Project delete error:', error);
    return { success: false, error: error.message || 'Database delete transaction failed.' };
  }
}

export async function updateProjectOrder(orderList: { id: string | number; position: number }[]) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized administrative operation.' };
  }

  try {
    const formattedList = orderList.map((item) => ({
      id: item.id.toString(),
      position: item.position,
    }));
    const result = await projectService.updateProjectOrder(formattedList);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to update catalog order.' };
    }
    revalidatePath('/');
    revalidatePath('/admin/projects');
    return { success: true };
  } catch (error: any) {
    console.error('Order update error:', error);
    return { success: false, error: 'Failed to update catalog order.' };
  }
}
