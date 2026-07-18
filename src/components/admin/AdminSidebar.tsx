'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';

interface AdminSidebarProps {
  username: string;
}

export default function AdminSidebar({ username }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: '/admin/dashboard', label: 'Overview' },
    { href: '/admin/projects', label: 'Projects CMS' },
    { href: '/admin/blog', label: 'Writing CMS' },
    { href: '/admin/messages', label: 'Leads & Messages' },
    { href: '/admin/settings', label: 'System Settings' },
    { href: '/admin/profile', label: 'Owner Profile' },
    { href: '/admin/skills', label: 'Skills & Levels' },
    { href: '/admin/experience', label: 'Experience Logs' },
    { href: '/admin/education', label: 'Education Logs' },
    { href: '/admin/certificates', label: 'Certifications' },
    { href: '/admin/testimonials', label: 'Testimonials' },
    { href: '/admin/services', label: 'Core Services' },
    { href: '/admin/seo', label: 'SEO Settings' },
    { href: '/admin/activity', label: 'Security & Logs' },
  ];

  return (
    <aside className={`bg-[#0d0d10] border-r border-[#1a1a22] flex flex-col justify-between transition-all duration-300 ${
      collapsed ? 'w-16 p-4' : 'w-64 p-8'
    }`}>
      <div className="flex flex-col gap-10">
        {/* Toggle & Branding */}
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              <span className="font-mono text-xs tracking-widest text-[#9CA3AF] uppercase">DHRUV ENGINE</span>
            </div>
          )}
          {collapsed && (
            <div className="w-3 h-3 rounded-full bg-[var(--accent)] mx-auto" />
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="text-gray-500 hover:text-white cursor-pointer font-mono text-[9px] border border-zinc-800 rounded px-1.5 py-0.5 ml-auto"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 font-sans text-xs">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={`px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors duration-200 ${
                  isActive 
                    ? 'bg-[var(--accent)] text-white font-medium' 
                    : 'text-gray-400 hover:bg-[rgba(255,255,255,0.02)] hover:text-white'
                }`}
                title={collapsed ? link.label : ''}
              >
                <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-white' : 'bg-transparent'}`} />
                {!collapsed && <span>{link.label.toUpperCase()}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className={`border-t border-[#1a1a22] pt-6 mt-8 ${collapsed ? 'text-center' : ''}`}>
        {!collapsed && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-medium truncate max-w-[120px]">{username}</span>
              <span className="text-[8px] text-gray-500 font-mono">ADMINISTRATOR</span>
            </div>
            <LogoutButton />
          </div>
        )}
        <Link href="/" className="text-[9px] font-mono text-gray-500 hover:text-white transition-colors block">
          {collapsed ? '←' : '← VIEW APP'}
        </Link>
      </div>
    </aside>
  );
}
