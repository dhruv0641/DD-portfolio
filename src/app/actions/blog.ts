'use server';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getReadingTime } from '@/lib/utils';

export async function saveBlogPost(formData: any) {
  try {
    const {
      id,
      title,
      slug,
      contentMarkdown,
      categories,
      tags,
      isDraft,
    } = formData;

    if (!title || !slug || !contentMarkdown) {
      return { success: false, error: 'Title, Slug, and content markdown are required.' };
    }

    const calculatedReadingTime = getReadingTime(contentMarkdown);

    const payload = {
      title,
      slug,
      contentMarkdown,
      categories: typeof categories === 'string' ? categories : JSON.stringify(categories || []),
      tags: typeof tags === 'string' ? tags : JSON.stringify(tags || []),
      readingTime: calculatedReadingTime,
      isDraft: isDraft ? 1 : 0,
      publishedAt: isDraft ? null : new Date(),
      updatedAt: new Date(),
    };

    if (id) {
      // Update
      await db.update(schema.blogPosts).set(payload).where(eq(schema.blogPosts.id, id));
    } else {
      // Insert
      await db.insert(schema.blogPosts).values({
        ...payload,
        createdAt: new Date(),
      });
    }

    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/admin/blog');
    return { success: true };
  } catch (error: any) {
    console.error('Blog save error:', error);
    return { success: false, error: error.message || 'Database write transaction failed.' };
  }
}

export async function deleteBlogPost(id: number) {
  try {
    await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, id));
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/admin/blog');
    return { success: true };
  } catch (error: any) {
    console.error('Blog delete error:', error);
    return { success: false, error: error.message || 'Database delete transaction failed.' };
  }
}
