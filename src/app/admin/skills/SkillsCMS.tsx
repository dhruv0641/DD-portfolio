'use client';

import React, { useState } from 'react';
import { saveSkillAction, deleteSkillAction, saveCategoryAction, deleteCategoryAction } from '@/app/actions/skills';
import Toast from '@/components/admin/Toast';

interface SkillsCMSProps {
  initialCategories: any[];
}

export default function SkillsCMS({ initialCategories }: SkillsCMSProps) {
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal / form states for category edit
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [currentCat, setCurrentCat] = useState<{ id?: string; name: string; position: number }>({ name: '', position: 0 });

  // Modal / form states for skill edit
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<{ id?: string; categoryId: string; name: string; proficiency: number; position: number }>({
    categoryId: '',
    name: '',
    proficiency: 80,
    position: 0
  });

  const handleOpenCatModal = (cat?: any) => {
    setCurrentCat(cat ? { id: cat.id, name: cat.name, position: cat.position || 0 } : { name: '', position: 0 });
    setCatModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    const res = await saveCategoryAction(currentCat);
    if (res.success) {
      setToast({ message: 'Skill category saved successfully.', type: 'success' });
      setCatModalOpen(false);
      window.location.reload();
    } else {
      setToast({ message: res.error || 'Failed to save category.', type: 'error' });
    }
    setLoading(false);
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}" and all its skills?`)) return;
    setLoading(true);
    const res = await deleteCategoryAction(id, name);
    if (res.success) {
      setToast({ message: 'Category deleted successfully.', type: 'success' });
      window.location.reload();
    } else {
      setToast({ message: res.error || 'Deletion failed.', type: 'error' });
    }
    setLoading(false);
  };

  const handleOpenSkillModal = (catId: string, skill?: any) => {
    setCurrentSkill(skill 
      ? { id: skill.id, categoryId: catId, name: skill.name, proficiency: skill.proficiency, position: skill.position || 0 } 
      : { categoryId: catId, name: '', proficiency: 80, position: 0 }
    );
    setSkillModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    const res = await saveSkillAction(currentSkill);
    if (res.success) {
      setToast({ message: 'Skill item saved successfully.', type: 'success' });
      setSkillModalOpen(false);
      window.location.reload();
    } else {
      setToast({ message: res.error || 'Failed to save skill.', type: 'error' });
    }
    setLoading(false);
  };

  const handleDeleteSkill = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete skill "${name}"?`)) return;
    setLoading(true);
    const res = await deleteSkillAction(id, name);
    if (res.success) {
      setToast({ message: 'Skill deleted successfully.', type: 'success' });
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
          <h1 className="text-3xl font-light tracking-tight mb-2">Platform Skills Console</h1>
          <p className="text-sm text-gray-400">Manage developer skills categorization hierarchy, competency index parameters, and order listings.</p>
        </div>
        <button
          onClick={() => handleOpenCatModal()}
          className="bg-white text-black px-4 py-2.5 rounded-lg text-xs font-mono font-medium hover:bg-gray-200 transition-colors cursor-pointer"
        >
          CREATE CATEGORY
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl overflow-hidden shadow-sm">
            {/* Category Header */}
            <div className="px-6 py-4 border-b border-[#1a1a22] bg-[#070708] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-gray-400">CATEGORY /</span>
                <span className="text-sm font-semibold tracking-wide text-white">{cat.name.toUpperCase()}</span>
                <span className="font-mono text-[9px] text-gray-600">POS: {cat.position || 0}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenSkillModal(cat.id)}
                  className="bg-[#16161e] border border-[#222] hover:bg-gray-800 text-[10px] font-mono text-gray-400 hover:text-white px-2.5 py-1.5 rounded cursor-pointer"
                >
                  ADD SKILL
                </button>
                <button
                  onClick={() => handleOpenCatModal(cat)}
                  className="bg-[#16161e] border border-[#222] hover:bg-gray-800 text-[10px] font-mono text-gray-400 hover:text-white px-2.5 py-1.5 rounded cursor-pointer"
                >
                  EDIT
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id, cat.name)}
                  className="bg-red-950/20 text-red-400 hover:bg-red-900/40 text-[10px] font-mono px-2.5 py-1.5 rounded cursor-pointer"
                >
                  DELETE
                </button>
              </div>
            </div>

            {/* Category Skills Grid */}
            <div className="p-6">
              {cat.skills.length === 0 ? (
                <div className="text-center font-mono text-xs text-gray-500 py-6">
                  NO SKILL ENTRIES IN THIS CATEGORY
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cat.skills.map((skill: any) => (
                    <div key={skill.id} className="bg-[#070708] border border-[#1a1a22] rounded-lg p-4 flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-white">{skill.name}</span>
                          <span className="font-mono text-xs text-[var(--accent)]">{skill.proficiency}%</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-[#16161e] h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[var(--accent)] h-full transition-all duration-500" 
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end border-t border-[#16161e] pt-3">
                        <button
                          onClick={() => handleOpenSkillModal(cat.id, skill)}
                          className="text-[9px] font-mono text-gray-400 hover:text-white cursor-pointer"
                        >
                          EDIT
                        </button>
                        <span className="text-gray-600 text-[9px] font-mono">|</span>
                        <button
                          onClick={() => handleDeleteSkill(skill.id, skill.name)}
                          className="text-[9px] font-mono text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Category Modal */}
      {catModalOpen && (
        <div className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[420px] bg-[#0d0d10] border border-[#1a1a22] rounded-xl overflow-hidden shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono text-xs text-gray-400">CATEGORY DETAILS</span>
              <button onClick={() => setCatModalOpen(false)} className="text-gray-400 hover:text-white font-mono text-xs cursor-pointer">[ ESC ]</button>
            </div>
            <form onSubmit={handleSaveCategory} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase text-gray-500">Category Name</label>
                <input
                  type="text"
                  required
                  value={currentCat.name}
                  onChange={(e) => setCurrentCat((prev: any) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase text-gray-500">Order Position</label>
                <input
                  type="number"
                  required
                  value={currentCat.position}
                  onChange={(e) => setCurrentCat((prev: any) => ({ ...prev, position: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--accent)] text-white text-xs font-mono uppercase tracking-widest py-3 rounded-lg hover:bg-[rgba(var(--accent-rgb),0.8)] focus:outline-none transition-colors duration-300 font-semibold cursor-pointer"
              >
                {loading ? 'SAVING...' : 'SAVE CATEGORY'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {skillModalOpen && (
        <div className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[420px] bg-[#0d0d10] border border-[#1a1a22] rounded-xl overflow-hidden shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono text-xs text-gray-400">SKILL PARAMETERS</span>
              <button onClick={() => setSkillModalOpen(false)} className="text-gray-400 hover:text-white font-mono text-xs cursor-pointer">[ ESC ]</button>
            </div>
            <form onSubmit={handleSaveSkill} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase text-gray-500">Skill Name</label>
                <input
                  type="text"
                  required
                  value={currentSkill.name}
                  onChange={(e) => setCurrentSkill((prev: any) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono uppercase text-gray-500">Proficiency Level</label>
                  <span className="text-xs font-mono text-[var(--accent)]">{currentSkill.proficiency}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentSkill.proficiency}
                  onChange={(e) => setCurrentSkill((prev: any) => ({ ...prev, proficiency: parseInt(e.target.value) || 80 }))}
                  className="w-full accent-[var(--accent)] cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase text-gray-500">Order Position</label>
                <input
                  type="number"
                  required
                  value={currentSkill.position}
                  onChange={(e) => setCurrentSkill((prev: any) => ({ ...prev, position: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--accent)] text-white text-xs font-mono uppercase tracking-widest py-3 rounded-lg hover:bg-[rgba(var(--accent-rgb),0.8)] focus:outline-none transition-colors duration-300 font-semibold cursor-pointer"
              >
                {loading ? 'SAVING...' : 'SAVE SKILL'}
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
