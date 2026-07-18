'use server';

import { blogService } from '@/services/blogService';
import { verifyAuthSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { BlogPostData } from '@/types';

export async function saveBlogPost(formData: Partial<BlogPostData>) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized administrative operation.' };
  }

  try {
    const result = await blogService.saveBlogPost(formData);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to save essay.' };
    }

    revalidatePath('/');
    revalidatePath('/blog');
    if (formData.slug) {
      revalidatePath(`/blog/${formData.slug}`);
    }
    revalidatePath('/admin/blog');
    return { success: true };
  } catch (error: any) {
    console.error('Blog save error:', error);
    return { success: false, error: error.message || 'Database write transaction failed.' };
  }
}

export async function deleteBlogPost(id: string | number) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized administrative operation.' };
  }

  try {
    const result = await blogService.deleteBlogPost(id.toString());
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to delete essay.' };
    }
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/admin/blog');
    return { success: true };
  } catch (error: any) {
    console.error('Blog delete error:', error);
    return { success: false, error: error.message || 'Database delete transaction failed.' };
  }
}
