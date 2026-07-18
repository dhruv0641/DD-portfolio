'use server';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateMessageStatus(id: number, status: 'read' | 'unread' | 'archived' | 'spam') {
  try {
    await db
      .update(schema.messages)
      .set({ status })
      .where(eq(schema.messages.id, id));
    
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error: any) {
    console.error('Message update status error:', error);
    return { success: false, error: error.message || 'Database status update error.' };
  }
}

export async function deleteMessage(id: number) {
  try {
    await db.delete(schema.messages).where(eq(schema.messages.id, id));
    
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error: any) {
    console.error('Message delete error:', error);
    return { success: false, error: error.message || 'Database message deletion error.' };
  }
}
