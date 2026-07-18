import React from 'react';
import MessagesCMS from './MessagesCMS';
import { redirect } from 'next/navigation';
import { verifyAuthSession } from '@/lib/auth';
import { contactService } from '@/services/contactService';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  const session = await verifyAuthSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Query all contact messages from Supabase service
  const allMessages = await contactService.getMessages();

  return <MessagesCMS initialMessages={allMessages} />;
}
