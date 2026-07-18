import React from 'react';
import { coreService } from '@/services/coreService';
import ServicesCMS from './ServicesCMS';
import { redirect } from 'next/navigation';
import { verifyAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  const session = await verifyAuthSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Fetch initial core services records
  const services = await coreService.getServices(true);

  return <ServicesCMS initialServices={services} />;
}
