'use server';

import { contactService } from '@/services/contactService';
import { verifyAuthSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateMessageStatus(id: string | number, status: 'read' | 'unread' | 'archived' | 'spam') {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized administrative operation.' };
  }

  try {
    const result = await contactService.updateMessageStatus(id.toString(), status);
    if (!result.success) {
      return { success: false, error: result.error || 'Database status update error.' };
    }
    
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error: any) {
    console.error('Message update status error:', error);
    return { success: false, error: error.message || 'Database status update error.' };
  }
}

export async function deleteMessage(id: string | number) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized administrative operation.' };
  }

  try {
    const result = await contactService.deleteMessage(id.toString());
    if (!result.success) {
      return { success: false, error: result.error || 'Database message deletion error.' };
    }
    
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error: any) {
    console.error('Message delete error:', error);
    return { success: false, error: error.message || 'Database message deletion error.' };
  }
}
