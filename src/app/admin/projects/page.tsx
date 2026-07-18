import React from 'react';
import ProjectsCMS from './ProjectsCMS';
import { redirect } from 'next/navigation';
import { verifyAuthSession } from '@/lib/auth';
import { projectService } from '@/services/projectService';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const session = await verifyAuthSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Query all project elements directly from Supabase service
  const allProjects = await projectService.getProjects(true);

  return <ProjectsCMS initialProjects={allProjects} />;
}
