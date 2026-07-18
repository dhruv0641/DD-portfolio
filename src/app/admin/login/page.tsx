import React from 'react';
import { redirect } from 'next/navigation';
import { verifyAuthSession } from '@/lib/auth';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  const session = await verifyAuthSession();
  
  // If already logged in, redirect to dashboard directly
  if (session) {
    redirect('/admin/dashboard');
  }

  return <LoginForm />;
}

