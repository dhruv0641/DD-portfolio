import React from 'react';
import { experienceService } from '@/services/experienceService';
import ExperienceCMS from './ExperienceCMS';
import { redirect } from 'next/navigation';
import { verifyAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminExperiencePage() {
  const session = await verifyAuthSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Fetch initial experience details
  const experiences = await experienceService.getExperience();

  return <ExperienceCMS initialExperiences={experiences} />;
}
