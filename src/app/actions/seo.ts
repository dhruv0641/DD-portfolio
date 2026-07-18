'use server';

import { seoService, SeoData } from '@/services/seoService';
import { verifyAuthSession } from '@/lib/auth';
import { activityService } from '@/services/activityService';
import { revalidatePath } from 'next/cache';

export async function saveSeoAction(data: Partial<SeoData>) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    const result = await seoService.saveSeo(data);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to save SEO.' };
    }

    await activityService.logEvent({
      user_name: session.username,
      action: 'UPDATE',
      entity: 'SEO',
      details: 'Global website SEO meta configurations updated.',
    });

    revalidatePath('/admin/seo');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server action error.' };
  }
}
