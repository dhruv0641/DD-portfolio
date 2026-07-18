import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import ProjectsCMS from './ProjectsCMS';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  // Query all project elements directly from Drizzle SQLite client
  const allProjects = await db
    .select()
    .from(schema.projects)
    .orderBy(schema.projects.position);

  return <ProjectsCMS initialProjects={allProjects} />;
}
