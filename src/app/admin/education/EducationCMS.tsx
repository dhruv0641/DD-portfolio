'use client';

import React, { useState } from 'react';
import { saveEducationAction, deleteEducationAction } from '@/app/actions/education';
import Toast from '@/components/admin/Toast';

interface EducationCMSProps {
  initialEducation: any[];
}

export default function EducationCMS({ initialEducation }: EducationCMSProps) {
  const [educationList, setEducationList] = useState<any[]>(initialEducation);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEdu, setCurrentEdu] = useState<any>({
    degree: '',
    institution: '',
    location: '',
    timeline: '',
    description: '',
    position: 0
  });

  const handleOpenModal = (edu?: any) => {
    setCurrentEdu(edu ? { ...edu } : {
      degree: '',
      institution: '',
      location: '',
      timeline: '',
      description: '',
      position: 0
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    const res = await saveEducationAction(currentEdu);
    if (res.success) {
      setToast({ message: 'Education record saved successfully.', type: 'success' });
      setModalOpen(false);
      window.location.reload();
    } else {
      setToast({ message: res.error || 'Failed to save education.', type: 'error' });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, degree: string, institution: string) => {
    if (!confirm(`Are you sure you want to delete education "${degree} at ${institution}"?`)) return;
    setLoading(true);
    const res = await deleteEducationAction(id, degree, institution);
    if (res.success) {
      setToast({ message: 'Education record deleted successfully.', type: 'success' });
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
          <h1 className="text-3xl font-light tracking-tight mb-2">Education History CMS</h1>
          <p className="text-sm text-gray-400">Configure academic records, graduation timelines, achievements, degrees, and institutions.</p>
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
          {educationList.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-gray-500">
              NO ACADEMIC RECORDS IN THE PLATFORM REPOSITORY
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1a1a22] text-[10px] font-mono uppercase text-gray-500">
                  <th className="py-4 px-6">Degree &amp; Institution</th>
                  <th className="py-4 px-6">Timeline</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Position</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {educationList.map((edu) => (
                  <tr key={edu.id} className="border-b border-[#111116] hover:bg-[#111116] transition-colors last:border-b-0">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{edu.degree}</span>
                        <span className="text-xs text-gray-500">{edu.institution}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-400 font-mono">
                      {edu.timeline}
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-400">
                      {edu.location || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-400 font-mono">
                      {edu.position}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleOpenModal(edu)}
                          className="text-[10px] font-mono text-gray-400 hover:text-white cursor-pointer"
                        >
                          EDIT
                        </button>
                        <span className="text-gray-700 text-[10px] font-mono">|</span>
                        <button
                          onClick={() => handleDelete(edu.id, edu.degree, edu.institution)}
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
              <span className="font-mono text-xs text-gray-400">EDUCATION RECORD</span>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white font-mono text-xs cursor-pointer">[ ESC ]</button>
            </div>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase text-gray-500">Degree</label>
                  <input
                    type="text"
                    required
                    value={currentEdu.degree}
                    onChange={(e) => setCurrentEdu((prev: any) => ({ ...prev, degree: e.target.value }))}
                    className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase text-gray-500">Institution</label>
                  <input
                    type="text"
                    required
                    value={currentEdu.institution}
                    onChange={(e) => setCurrentEdu((prev: any) => ({ ...prev, institution: e.target.value }))}
                    className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase text-gray-500">Timeline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 2022 - 2024"
                    value={currentEdu.timeline}
                    onChange={(e) => setCurrentEdu((prev: any) => ({ ...prev, timeline: e.target.value }))}
                    className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase text-gray-500">Location</label>
                  <input
                    type="text"
                    placeholder="e.g., San Francisco, CA"
                    value={currentEdu.location || ''}
                    onChange={(e) => setCurrentEdu((prev: any) => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase text-gray-500">Order Position</label>
                <input
                  type="number"
                  required
                  value={currentEdu.position}
                  onChange={(e) => setCurrentEdu((prev: any) => ({ ...prev, position: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase text-gray-500">Description Summary</label>
                <textarea
                  rows={4}
                  value={currentEdu.description || ''}
                  onChange={(e) => setCurrentEdu((prev: any) => ({ ...prev, description: e.target.value }))}
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
