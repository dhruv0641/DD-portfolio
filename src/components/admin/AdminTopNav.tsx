'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import MediaLibraryModal from './MediaLibraryModal';

interface AdminTopNavProps {
  unreadCount: number;
}

export default function AdminTopNav({ unreadCount }: AdminTopNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  
  // Global search variables
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  // Generate breadcrumbs from pathname
  const pathParts = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, index) => {
    const href = '/' + pathParts.slice(0, index + 1).join('/');
    return {
      label: part.toUpperCase(),
      href
    };
  });

  const handleGlobalSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    
    try {
      // Mock / quick search mapping for client
      // Since pages are client-driven, we redirect or list shortcuts
      const searchItems = [
        { label: 'PROJECTS INDEX', path: '/admin/projects', keywords: ['project', 'work', 'case'] },
        { label: 'WRITING JOURNAL', path: '/admin/blog', keywords: ['blog', 'writing', 'essay'] },
        { label: 'LEADS INBOX', path: '/admin/messages', keywords: ['message', 'lead', 'contact'] },
        { label: 'SYSTEM SETTINGS', path: '/admin/settings', keywords: ['settings', 'config', 'visual'] },
        { label: 'OWNER PROFILE', path: '/admin/profile', keywords: ['profile', 'bio', 'owner'] },
        { label: 'SKILLS & LEVELS', path: '/admin/skills', keywords: ['skill', 'level', 'experience'] },
        { label: 'TIMELINE EXPERIENCE', path: '/admin/experience', keywords: ['experience', 'job', 'work'] },
        { label: 'CERTIFICATIONS', path: '/admin/certificates', keywords: ['cert', 'aws', 'tensor'] }
      ];

      const filtered = searchItems.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keywords.some(k => k.includes(searchQuery.toLowerCase()))
      );

      setSearchResults(filtered);
    } catch (err) {
      console.error(err);
    }
    setSearching(false);
  };

  return (
    <>
      <header className="bg-[#0d0d10] border-b border-[#1a1a22] sticky top-0 z-40 px-8 py-4 flex items-center justify-between">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 font-mono text-[10px] text-gray-500">
          <span className="hover:text-white cursor-pointer" onClick={() => router.push('/admin/dashboard')}>CONSOLE</span>
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={b.href}>
              <span>/</span>
              <span 
                onClick={() => router.push(b.href)}
                className={`hover:text-white cursor-pointer ${i === breadcrumbs.length - 1 ? 'text-[var(--text)] font-semibold' : ''}`}
              >
                {b.label}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Quick Actions Panel */}
        <div className="flex items-center gap-6">
          {/* Global Search Button */}
          <button 
            onClick={() => setSearchOpen(true)}
            className="text-xs font-mono text-gray-400 hover:text-white border border-[#222] bg-[#16161e] px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-2"
          >
            <span>SEARCH...</span>
            <kbd className="text-[9px] bg-zinc-800 text-gray-400 px-1.5 py-0.5 rounded">⌘K</kbd>
          </button>

          {/* Media Manager Shortcut */}
          <button
            onClick={() => setIsMediaOpen(true)}
            className="text-xs font-mono text-gray-400 hover:text-white border border-[#222] bg-[#16161e] px-3 py-1.5 rounded-lg cursor-pointer"
          >
            MEDIA MANAGER
          </button>

          {/* Messages Notification indicator */}
          <div 
            onClick={() => router.push('/admin/messages')}
            className="relative cursor-pointer hover:text-white transition-colors text-gray-400 flex items-center gap-1.5"
            title={`${unreadCount} Unread Messages`}
          >
            <span className="font-mono text-xs">INBOX</span>
            {unreadCount > 0 && (
              <span className="bg-[var(--accent)] text-white text-[9px] font-mono font-medium w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[600] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[500px] bg-[#0d0d10] border border-[#1a1a22] rounded-xl overflow-hidden shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono text-xs text-gray-400">GLOBAL PANEL SEARCH</span>
              <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-white font-mono text-xs cursor-pointer">[ ESC ]</button>
            </div>
            
            <form onSubmit={handleGlobalSearch} className="flex gap-2 mb-4">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search CMS sections..."
                className="flex-1 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
              <button type="submit" className="bg-[var(--accent)] text-white text-xs font-mono px-4 rounded-lg cursor-pointer">
                FIND
              </button>
            </form>

            <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto">
              {searching ? (
                <div className="text-xs font-mono text-gray-500 py-4 text-center">Searching indexes...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map(res => (
                  <div 
                    key={res.path} 
                    onClick={() => {
                      router.push(res.path);
                      setSearchOpen(false);
                    }}
                    className="p-3 bg-[#16161e] border border-[#222] rounded-lg hover:border-[var(--accent)] hover:bg-[#1f1f2e] cursor-pointer transition-all duration-200 text-xs font-mono flex items-center justify-between"
                  >
                    <span>{res.label}</span>
                    <span className="text-[10px] text-gray-500">GO TO PANEL →</span>
                  </div>
                ))
              ) : searchQuery ? (
                <div className="text-xs font-mono text-gray-500 py-4 text-center">No CMS section found matching &quot;{searchQuery}&quot;</div>
              ) : (
                <div className="text-[10px] font-mono text-gray-500 py-2 text-center uppercase">Type query keyword above to query indices</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Media Library */}
      <MediaLibraryModal 
        isOpen={isMediaOpen} 
        onClose={() => setIsMediaOpen(false)} 
        onSelect={(url) => {
          setIsMediaOpen(false);
        }}
      />
    </>
  );
}
