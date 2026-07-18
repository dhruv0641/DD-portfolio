import React from 'react';
import { certificateService } from '@/services/certificateService';
import CertificatesCMS from './CertificatesCMS';
import { redirect } from 'next/navigation';
import { verifyAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminCertificatesPage() {
  const session = await verifyAuthSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Fetch initial certificate records
  const certificates = await certificateService.getCertificates();

  return <CertificatesCMS initialCertificates={certificates} />;
}
