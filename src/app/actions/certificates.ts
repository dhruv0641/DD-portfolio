'use server';

import { certificateService, CertificateData } from '@/services/certificateService';
import { verifyAuthSession } from '@/lib/auth';
import { activityService } from '@/services/activityService';
import { revalidatePath } from 'next/cache';

export async function saveCertificateAction(data: Partial<CertificateData>) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    const result = await certificateService.saveCertificate(data);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to save certificate.' };
    }

    await activityService.logEvent({
      user_name: session.username,
      action: 'UPDATE',
      entity: 'CERTIFICATE',
      details: `Saved certificate: ${data.title} (${data.issuer})`,
    });

    revalidatePath('/admin/certificates');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server action error.' };
  }
}

export async function deleteCertificateAction(id: string, title: string) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    const result = await certificateService.deleteCertificate(id);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to delete certificate.' };
    }

    await activityService.logEvent({
      user_name: session.username,
      action: 'DELETE',
      entity: 'CERTIFICATE',
      details: `Deleted certificate: ${title}`,
    });

    revalidatePath('/admin/certificates');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server action error.' };
  }
}
