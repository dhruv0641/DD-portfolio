'use client';

import React, { useState, useEffect } from 'react';
import { saveProfile } from '@/app/actions/profile';
import Toast from '@/components/admin/Toast';
import MediaLibraryModal from '@/components/admin/MediaLibraryModal';

export default function ProfileCMS({ initialProfile }: { initialProfile: any }) {
  const [profile, setProfile] = useState(initialProfile || {
    name: '',
    title: '',
    tagline: '',
    bio: '',
    contactEmail: '',
    location: '',
    resumeUrl: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Media library integration
  const [mediaTarget, setMediaTarget] = useState<'resume' | null>(null);

  // Detect unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleChange = (field: string, val: string) => {
    setProfile((prev: any) => ({ ...prev, [field]: val }));
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    const res = await saveProfile(profile);
    if (res.success) {
      setToast({ message: 'Profile details saved successfully.', type: 'success' });
      setIsDirty(false);
    } else {
      setToast({ message: res.error || 'Failed to update profile.', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-10 max-w-[800px]">
      <div>
        <h1 className="text-3xl font-light tracking-tight mb-2">Owner Profile CMS</h1>
        <p className="text-sm text-gray-400">Configure owner details, contact coordinates, availability, and public resume files.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Owner Name</label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Professional Title</label>
            <input
              type="text"
              required
              value={profile.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Headline Tagline</label>
          <input
            type="text"
            value={profile.tagline || ''}
            onChange={(e) => handleChange('tagline', e.target.value)}
            className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Biography Copy</label>
          <textarea
            value={profile.bio || ''}
            onChange={(e) => handleChange('bio', e.target.value)}
            rows={5}
            className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Contact Email</label>
            <input
              type="email"
              value={profile.contactEmail || ''}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Location coordinates</label>
            <input
              type="text"
              value={profile.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Resume / CV Document URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={profile.resumeUrl || ''}
              onChange={(e) => handleChange('resumeUrl', e.target.value)}
              className="flex-1 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              placeholder="https://..."
            />
            <button
              type="button"
              onClick={() => setMediaTarget('resume')}
              className="bg-[#16161e] border border-[#222] hover:bg-gray-800 text-xs font-mono text-gray-300 hover:text-white px-4 rounded-lg cursor-pointer"
            >
              BROWSE
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-[#1a1a22] pt-6 mt-4">
          {isDirty && (
            <span className="text-[10px] font-mono text-amber-500 uppercase tracking-wide">
              * UNSAVED CHANGES IN PLATFORM BUFFER
            </span>
          )}
          <button
            type="submit"
            disabled={loading}
            className="ml-auto bg-[var(--accent)] text-white text-xs font-mono uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-[rgba(var(--accent-rgb),0.8)] focus:outline-none transition-colors duration-300 font-semibold cursor-pointer"
          >
            {loading ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </div>
      </form>

      {/* Media Library */}
      <MediaLibraryModal
        isOpen={mediaTarget !== null}
        onClose={() => setMediaTarget(null)}
        onSelect={(url) => {
          if (mediaTarget === 'resume') {
            handleChange('resumeUrl', url);
          }
          setMediaTarget(null);
        }}
        defaultBucket={mediaTarget === 'resume' ? 'resume' : 'profile-images'}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
