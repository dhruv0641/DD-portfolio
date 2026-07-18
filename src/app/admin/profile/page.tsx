import React from 'react';
import { profileService } from '@/services/profileService';
import ProfileCMS from './ProfileCMS';
import { redirect } from 'next/navigation';
import { verifyAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminProfilePage() {
  const session = await verifyAuthSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Fetch initial profile records
  const profile = await profileService.getProfile();

  return <ProfileCMS initialProfile={profile} />;
}
