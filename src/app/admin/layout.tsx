import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { decryptSession, getSessionCookieName } from '@/lib/auth';
import LogoutButton from '@/components/admin/LogoutButton';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName());
  const session = token ? await decryptSession(token.value) : null;
  
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#070708] text-[#F3F4F6] flex flex-col md:flex-row relative z-20">
      {/* Dynamic Sidebar Admin Control Panel */}
      <aside className="w-full md:w-64 bg-[#0d0d10] border-r border-[#1a1a22] p-8 flex flex-col justify-between">
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <span className="font-mono text-xs tracking-widest text-[#9CA3AF] uppercase">VANCE ENGINE</span>
          </div>

          <nav className="flex flex-col gap-2 font-sans text-sm">
            <Link 
              href="/admin/dashboard" 
              className="px-4 py-3 rounded-lg hover:bg-[rgba(255,255,255,0.03)] text-gray-300 hover:text-white transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link 
              href="/admin/projects" 
              className="px-4 py-3 rounded-lg hover:bg-[rgba(255,255,255,0.03)] text-gray-300 hover:text-white transition-colors duration-200"
            >
              Projects CMS
            </Link>
            <Link 
              href="/admin/blog" 
              className="px-4 py-3 rounded-lg hover:bg-[rgba(255,255,255,0.03)] text-gray-300 hover:text-white transition-colors duration-200"
            >
              Writing CMS
            </Link>
            <Link 
              href="/admin/messages" 
              className="px-4 py-3 rounded-lg hover:bg-[rgba(255,255,255,0.03)] text-gray-300 hover:text-white transition-colors duration-200"
            >
              Leads &amp; Messages
            </Link>
            <Link 
              href="/admin/settings" 
              className="px-4 py-3 rounded-lg hover:bg-[rgba(255,255,255,0.03)] text-gray-300 hover:text-white transition-colors duration-200"
            >
              System Settings
            </Link>
          </nav>
        </div>

        <div className="border-t border-[#1a1a22] pt-6 mt-8 md:mt-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-medium">{session.username}</span>
              <span className="text-[10px] text-gray-500 font-mono">ADMINISTRATOR</span>
            </div>
            <LogoutButton />
          </div>
          <Link href="/" className="text-[10px] font-mono text-gray-500 hover:text-white transition-colors">
            ← VIEW CORE APP
          </Link>
        </div>
      </aside>

      {/* Main Working Panel Wrapper */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto max-w-full">
        {children}
      </main>
    </div>
  );
}
