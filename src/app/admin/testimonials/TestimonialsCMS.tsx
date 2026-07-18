'use client';

import React, { useState } from 'react';
import { saveTestimonialAction, deleteTestimonialAction } from '@/app/actions/testimonials';
import Toast from '@/components/admin/Toast';
import MediaLibraryModal from '@/components/admin/MediaLibraryModal';

interface TestimonialsCMSProps {
  initialTestimonials: any[];
}

export default function TestimonialsCMS({ initialTestimonials }: TestimonialsCMSProps) {
  const [testimonials, setTestimonials] = useState<any[]>(initialTestimonials);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<any>({
    clientName: '',
    clientRole: '',
    clientCompany: '',
    text: '',
    avatarUrl: '',
    position: 0,
    status: 'active'
  });

  const [mediaOpen, setMediaOpen] = useState(false);

  const handleOpenModal = (t?: any) => {
    setCurrentTestimonial(t ? { ...t } : {
      clientName: '',
      clientRole: '',
      clientCompany: '',
      text: '',
      avatarUrl: '',
      position: 0,
      status: 'active'
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    const res = await saveTestimonialAction(currentTestimonial);
    if (res.success) {
      setToast({ message: 'Testimonial saved successfully.', type: 'success' });
      setModalOpen(false);
      window.location.reload();
    } else {
      setToast({ message: res.error || 'Failed to save testimonial.', type: 'error' });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete testimonial by "${name}"?`)) return;
    setLoading(true);
    const res = await deleteTestimonialAction(id, name);
    if (res.success) {
      setToast({ message: 'Testimonial deleted successfully.', type: 'success' });
      window.location.reload();
    } else {
      setToast({ message: res.error || 'Deletion failed.', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-2">Testimonials CMS</h1>
          <p className="text-sm text-gray-400">Configure client reviews, company details, avatar images, and list visibility settings.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-white text-black px-4 py-2.5 rounded-lg text-xs font-mono font-medium hover:bg-gray-200 transition-colors cursor-pointer"
        >
          CREATE RECORD
        </button>
      </div>

      <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {testimonials.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-gray-500">
              NO CLIENT TESTIMONIALS IN THE PLATFORM REPOSITORY
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1a1a22] text-[10px] font-mono uppercase text-gray-500">
                  <th className="py-4 px-6">Client Name &amp; Company</th>
                  <th className="py-4 px-6">Feedback text</th>
                  <th className="py-4 px-6">Position</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {testimonials.map((t) => (
                  <tr key={t.id} className="border-b border-[#111116] hover:bg-[#111116] transition-colors last:border-b-0">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {t.avatarUrl ? (
                          <img src={t.avatarUrl} alt={t.clientName} className="w-8 h-8 rounded-full object-cover bg-zinc-800" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-mono text-[9px] text-gray-500">C</div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium text-white">{t.clientName}</span>
                          <span className="text-xs text-gray-500">{t.clientRole} at {t.clientCompany}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-400 max-w-[320px] truncate">
                      {t.text}
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-400 font-mono">
                      {t.position}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                        t.status === 'active' 
                          ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/10' 
                          : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {t.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleOpenModal(t)}
                          className="text-[10px] font-mono text-gray-400 hover:text-white cursor-pointer"
                        >
                          EDIT
                        </button>
                        <span className="text-gray-700 text-[10px] font-mono">|</span>
                        <button
                          onClick={() => handleDelete(t.id, t.clientName)}
                          className="text-[10px] font-mono text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          DELETE
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[500px] bg-[#0d0d10] border border-[#1a1a22] rounded-xl overflow-hidden shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono text-xs text-gray-400">TESTIMONIAL DETAILS</span>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white font-mono text-xs cursor-pointer">[ ESC ]</button>
            </div>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase text-gray-500">Client Name</label>
                <input
                  type="text"
                  required
                  value={currentTestimonial.clientName}
                  onChange={(e) => setCurrentTestimonial((prev: any) => ({ ...prev, clientName: e.target.value }))}
                  className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase text-gray-500">Client Role</label>
                  <input
                    type="text"
                    value={currentTestimonial.clientRole || ''}
                    onChange={(e) => setCurrentTestimonial((prev: any) => ({ ...prev, clientRole: e.target.value }))}
                    className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase text-gray-500">Client Company</label>
                  <input
                    type="text"
                    value={currentTestimonial.clientCompany || ''}
                    onChange={(e) => setCurrentTestimonial((prev: any) => ({ ...prev, clientCompany: e.target.value }))}
                    className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase text-gray-500">Client Avatar Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentTestimonial.avatarUrl || ''}
                    onChange={(e) => setCurrentTestimonial((prev: any) => ({ ...prev, avatarUrl: e.target.value }))}
                    className="flex-1 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
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

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase text-gray-500">Order Position</label>
                  <input
                    type="number"
                    required
                    value={currentTestimonial.position}
                    onChange={(e) => setCurrentTestimonial((prev: any) => ({ ...prev, position: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase text-gray-500">Status</label>
                  <select
                    value={currentTestimonial.status}
                    onChange={(e) => setCurrentTestimonial((prev: any) => ({ ...prev, status: e.target.value }))}
                    className="w-full bg-[#111116] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase text-gray-500">Feedback Details</label>
                <textarea
                  rows={4}
                  required
                  value={currentTestimonial.text}
                  onChange={(e) => setCurrentTestimonial((prev: any) => ({ ...prev, text: e.target.value }))}
                  className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--accent)] text-white text-xs font-mono uppercase tracking-widest py-3 rounded-lg hover:bg-[rgba(var(--accent-rgb),0.8)] focus:outline-none transition-colors duration-300 font-semibold cursor-pointer"
              >
                {loading ? 'SAVING...' : 'SAVE RECORD'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Media Library */}
      <MediaLibraryModal
        isOpen={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelect={(url) => {
          setCurrentTestimonial((prev: any) => ({ ...prev, avatarUrl: url }));
          setMediaOpen(false);
        }}
        defaultBucket="profile-images"
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
