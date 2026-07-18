'use client';

import React, { useState } from 'react';
import { saveCoreServiceAction, deleteCoreServiceAction } from '@/app/actions/services';
import Toast from '@/components/admin/Toast';

interface ServicesCMSProps {
  initialServices: any[];
}

export default function ServicesCMS({ initialServices }: ServicesCMSProps) {
  const [services, setServices] = useState<any[]>(initialServices);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<any>({
    name: '',
    description: '',
    icon: '',
    position: 0,
    status: 'active'
  });

  const handleOpenModal = (s?: any) => {
    setCurrentService(s ? { ...s } : {
      name: '',
      description: '',
      icon: '',
      position: 0,
      status: 'active'
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    const res = await saveCoreServiceAction(currentService);
    if (res.success) {
      setToast({ message: 'Service saved successfully.', type: 'success' });
      setModalOpen(false);
      window.location.reload();
    } else {
      setToast({ message: res.error || 'Failed to save service.', type: 'error' });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete core service "${name}"?`)) return;
    setLoading(true);
    const res = await deleteCoreServiceAction(id, name);
    if (res.success) {
      setToast({ message: 'Service deleted successfully.', type: 'success' });
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
          <h1 className="text-3xl font-light tracking-tight mb-2">Core Services CMS</h1>
          <p className="text-sm text-gray-400">Configure visual service offerings, descriptions, icons, position properties, and visibility status.</p>
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
          {services.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-gray-500">
              NO SERVICE ENTRIES IN THE PLATFORM REPOSITORY
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1a1a22] text-[10px] font-mono uppercase text-gray-500">
                  <th className="py-4 px-6">Service Name</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6">Icon Keyword</th>
                  <th className="py-4 px-6">Position</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {services.map((s) => (
                  <tr key={s.id} className="border-b border-[#111116] hover:bg-[#111116] transition-colors last:border-b-0">
                    <td className="py-4 px-6">
                      <span className="font-medium text-white">{s.name}</span>
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-400 max-w-[280px] truncate">
                      {s.description}
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-400 font-mono">
                      {s.icon || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-400 font-mono">
                      {s.position}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                        s.status === 'active' 
                          ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/10' 
                          : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {s.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleOpenModal(s)}
                          className="text-[10px] font-mono text-gray-400 hover:text-white cursor-pointer"
                        >
                          EDIT
                        </button>
                        <span className="text-gray-700 text-[10px] font-mono">|</span>
                        <button
                          onClick={() => handleDelete(s.id, s.name)}
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
              <span className="font-mono text-xs text-gray-400">SERVICE OFFERING</span>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white font-mono text-xs cursor-pointer">[ ESC ]</button>
            </div>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase text-gray-500">Service Name</label>
                <input
                  type="text"
                  required
                  value={currentService.name}
                  onChange={(e) => setCurrentService((prev: any) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase text-gray-500">Icon Keyword</label>
                  <input
                    type="text"
                    placeholder="e.g., CPU, database, terminal"
                    value={currentService.icon || ''}
                    onChange={(e) => setCurrentService((prev: any) => ({ ...prev, icon: e.target.value }))}
                    className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase text-gray-500">Order Position</label>
                  <input
                    type="number"
                    required
                    value={currentService.position}
                    onChange={(e) => setCurrentService((prev: any) => ({ ...prev, position: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase text-gray-500">Status</label>
                <select
                  value={currentService.status}
                  onChange={(e) => setCurrentService((prev: any) => ({ ...prev, status: e.target.value }))}
                  className="w-full bg-[#111116] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase text-gray-500">Description Summary</label>
                <textarea
                  rows={4}
                  required
                  value={currentService.description}
                  onChange={(e) => setCurrentService((prev: any) => ({ ...prev, description: e.target.value }))}
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
