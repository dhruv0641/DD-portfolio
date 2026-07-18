import React from 'react';
import SettingsCMS from './SettingsCMS';
import { redirect } from 'next/navigation';
import { verifyAuthSession } from '@/lib/auth';
import { settingsService } from '@/services/settingsService';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const session = await verifyAuthSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Query all visual and config parameters directly from Supabase service
  const allSettings = await settingsService.getSettingsList();

  return <SettingsCMS initialSettings={allSettings} />;
}
