import React from 'react';
import { educationService } from '@/services/educationService';
import EducationCMS from './EducationCMS';
import { redirect } from 'next/navigation';
import { verifyAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminEducationPage() {
  const session = await verifyAuthSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Fetch initial education details
  const education = await educationService.getEducation();

  return <EducationCMS initialEducation={education} />;
}
