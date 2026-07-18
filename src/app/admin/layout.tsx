import React from 'react';
import { cookies } from 'next/headers';
import { decryptSession, getSessionCookieName } from '@/lib/auth';
import { contactService } from '@/services/contactService';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopNav from '@/components/admin/AdminTopNav';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName());
  const session = token ? await decryptSession(token.value) : null;
  
  if (!session) {
    return <>{children}</>;
  }

  // Fetch unread messages count for notifications panel
  const messages = await contactService.getMessages();
  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="min-h-screen bg-[#070708] text-[#F3F4F6] flex flex-col md:flex-row relative z-20">
      {/* Sidebar Nav */}
      <AdminSidebar username={session.username} />

      {/* Main Panel Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Sticky Nav */}
        <AdminTopNav unreadCount={unreadCount} />

        {/* Scrollable Content */}
        <main className="flex-1 p-8 md:p-12 overflow-y-auto max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
