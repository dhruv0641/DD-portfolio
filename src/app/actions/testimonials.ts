'use server';

import { testimonialService, TestimonialData } from '@/services/testimonialService';
import { verifyAuthSession } from '@/lib/auth';
import { activityService } from '@/services/activityService';
import { revalidatePath } from 'next/cache';

export async function saveTestimonialAction(data: Partial<TestimonialData>) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    const result = await testimonialService.saveTestimonial(data);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to save testimonial.' };
    }

    await activityService.logEvent({
      user_name: session.username,
      action: 'UPDATE',
      entity: 'TESTIMONIAL',
      details: `Saved testimonial by client: ${data.clientName}`,
    });

    revalidatePath('/admin/testimonials');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server action error.' };
  }
}

export async function deleteTestimonialAction(id: string, clientName: string) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    const result = await testimonialService.deleteTestimonial(id);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to delete testimonial.' };
    }

    await activityService.logEvent({
      user_name: session.username,
      action: 'DELETE',
      entity: 'TESTIMONIAL',
      details: `Deleted testimonial by client: ${clientName}`,
    });

    revalidatePath('/admin/testimonials');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server action error.' };
  }
}
