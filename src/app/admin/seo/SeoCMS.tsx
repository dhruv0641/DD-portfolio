'use client';

import React, { useState, useEffect } from 'react';
import { saveSeoAction } from '@/app/actions/seo';
import Toast from '@/components/admin/Toast';
import MediaLibraryModal from '@/components/admin/MediaLibraryModal';

interface SeoCMSProps {
  initialSeo: any;
}

export default function SeoCMS({ initialSeo }: SeoCMSProps) {
  const [seo, setSeo] = useState(initialSeo || {
    metaDescription: '',
    ogImage: '',
    twitterCard: 'summary_large_image'
  });

  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [mediaOpen, setMediaOpen] = useState(false);

  // Unsaved changes warnings
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'Unsaved changes remain. Leave anyway?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleChange = (field: string, val: string) => {
    setSeo((prev: any) => ({ ...prev, [field]: val }));
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    const res = await saveSeoAction(seo);
    if (res.success) {
      setToast({ message: 'SEO settings saved successfully.', type: 'success' });
      setIsDirty(false);
    } else {
      setToast({ message: res.error || 'Failed to save SEO.', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-10 max-w-[800px]">
      <div>
        <h1 className="text-3xl font-light tracking-tight mb-2">SEO Settings CMS</h1>
        <p className="text-sm text-gray-400">Configure search engine metadata descriptors, Open Graph thumbnail sharing urls, and Twitter card layouts.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Meta Description</label>
          <textarea
            required
            rows={4}
            value={seo.metaDescription}
            onChange={(e) => handleChange('metaDescription', e.target.value)}
            className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] resize-none"
            placeholder="Search engines display this snippet to describe the site contents."
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Open Graph Social Image URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={seo.ogImage || ''}
              onChange={(e) => handleChange('ogImage', e.target.value)}
              className="flex-1 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              placeholder="https://..."
            />
            <button
              type="button"
              onClick={() => setMediaOpen(true)}
              className="bg-[#16161e] border border-[#222] hover:bg-gray-800 text-xs font-mono text-gray-300 hover:text-white px-4 rounded-lg cursor-pointer"
            >
              BROWSE
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Twitter Card Layout</label>
          <select
            value={seo.twitterCard || 'summary_large_image'}
            onChange={(e) => handleChange('twitterCard', e.target.value)}
            className="bg-[#111116] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
          >
            <option value="summary_large_image">Summary with Large Image (Recommended)</option>
            <option value="summary">Summary Card</option>
            <option value="app">App Card</option>
          </select>
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
        isOpen={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelect={(url) => {
          handleChange('ogImage', url);
          setMediaOpen(false);
        }}
        defaultBucket="site-assets"
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
