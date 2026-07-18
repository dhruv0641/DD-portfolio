'use server';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function saveProject(formData: any) {
  try {
    const {
      id,
      title,
      slug,
      subtitle,
      role,
      company,
      timeline,
      problem,
      challenge,
      solution,
      techStack,
      metrics,
      screenshots,
      githubUrl,
      demoUrl,
      isFeatured,
      isPinned,
      isDraft,
      position,
    } = formData;

    if (!title || !slug) {
      return { success: false, error: 'Title and Slug are required.' };
    }

    const payload = {
      title,
      slug,
      subtitle,
      role,
      company,
      timeline,
      problem,
      challenge,
      solution,
      techStack: typeof techStack === 'string' ? techStack : JSON.stringify(techStack || []),
      metrics: typeof metrics === 'string' ? metrics : JSON.stringify(metrics || []),
      screenshots: typeof screenshots === 'string' ? screenshots : JSON.stringify(screenshots || []),
      githubUrl,
      demoUrl,
      isFeatured: isFeatured ? 1 : 0,
      isPinned: isPinned ? 1 : 0,
      isDraft: isDraft ? 1 : 0,
      position: position ? parseInt(position, 10) : 0,
      updatedAt: new Date(),
    };

    if (id) {
      // Update
      await db.update(schema.projects).set(payload).where(eq(schema.projects.id, id));
    } else {
      // Insert
      await db.insert(schema.projects).values({
        ...payload,
        createdAt: new Date(),
      });
    }

    revalidatePath('/');
    revalidatePath('/admin/projects');
    return { success: true };
  } catch (error: any) {
    console.error('Project save error:', error);
    return { success: false, error: error.message || 'Database write transaction failed.' };
  }
}

export async function deleteProject(id: number) {
  try {
    await db.delete(schema.projects).where(eq(schema.projects.id, id));
    revalidatePath('/');
    revalidatePath('/admin/projects');
    return { success: true };
  } catch (error: any) {
    console.error('Project delete error:', error);
    return { success: false, error: error.message || 'Database delete transaction failed.' };
  }
}

export async function updateProjectOrder(orderList: { id: number; position: number }[]) {
  try {
    for (const item of orderList) {
      await db
        .update(schema.projects)
        .set({ position: item.position })
        .where(eq(schema.projects.id, item.id));
    }
    revalidatePath('/');
    revalidatePath('/admin/projects');
    return { success: true };
  } catch (error: any) {
    console.error('Order update error:', error);
    return { success: false, error: 'Failed to update catalog order.' };
  }
}
