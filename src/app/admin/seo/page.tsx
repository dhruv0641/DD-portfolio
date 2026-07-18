import React from 'react';
import { seoService } from '@/services/seoService';
import SeoCMS from './SeoCMS';
import { redirect } from 'next/navigation';
import { verifyAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminSeoPage() {
  const session = await verifyAuthSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Fetch initial SEO records
  const seo = await seoService.getSeo();

  return <SeoCMS initialSeo={seo} />;
}
