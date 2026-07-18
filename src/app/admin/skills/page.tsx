import React from 'react';
import { skillService } from '@/services/skillService';
import SkillsCMS from './SkillsCMS';
import { redirect } from 'next/navigation';
import { verifyAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminSkillsPage() {
  const session = await verifyAuthSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Fetch initial skills categorizations
  const categories = await skillService.getSkillsWithCategories();

  return <SkillsCMS initialCategories={categories} />;
}
