'use client';

import React, { useState } from 'react';
import { saveProject, deleteProject } from '@/app/actions/projects';
import { useRouter } from 'next/navigation';

export interface ProjectData {
  id?: number;
  title: string;
  slug: string;
  subtitle: string;
  role: string;
  company: string;
  timeline: string;
  problem: string;
  challenge: string;
  solution: string;
  techStack: string;
  metrics: string;
  screenshots: string;
  githubUrl: string;
  demoUrl: string;
  isFeatured: number;
  isPinned: number;
  isDraft: number;
  position: number;
}

export default function ProjectsCMS({ initialProjects }: { initialProjects: any[] }) {
  const [projects] = useState(initialProjects);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleEditClick = (project: any) => {
    setCurrentProject({
      ...project,
      // Ensure JSON strings parse to simple strings or lists
      techStack: Array.isArray(JSON.parse(project.techStack || '[]')) 
        ? JSON.parse(project.techStack).join(', ') 
        : project.techStack,
      metrics: JSON.parse(project.metrics || '[]'),
      screenshots: Array.isArray(JSON.parse(project.screenshots || '[]')) 
        ? JSON.parse(project.screenshots).join(', ') 
        : project.screenshots,
    });
    setIsEditing(true);
    setError('');
  };

  const handleAddClick = () => {
    setCurrentProject({
      title: '',
      slug: '',
      subtitle: '',
      role: '',
      company: '',
      timeline: '',
      problem: '',
      challenge: '',
      solution: '',
      techStack: '',
      metrics: [],
      screenshots: '/uploads/hero_visual.png',
      githubUrl: '',
      demoUrl: '',
      isFeatured: 0,
      isPinned: 0,
      isDraft: 1,
      position: projects.length,
    });
    setIsEditing(true);
    setError('');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setCurrentProject((prev: any) => ({
      ...prev,
      [id]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleMetricChange = (index: number, field: 'value' | 'label', value: string) => {
    setCurrentProject((prev: any) => {
      const updatedMetrics = [...(prev.metrics as any[])];
      updatedMetrics[index] = { ...updatedMetrics[index], [field]: value };
      return { ...prev, metrics: updatedMetrics };
    });
  };

  const addMetricLine = () => {
    setCurrentProject((prev: any) => ({
      ...prev,
      metrics: [...(prev.metrics as any[] || []), { value: '', label: '' }],
    }));
  };

  const removeMetricLine = (index: number) => {
    setCurrentProject((prev: any) => ({
      ...prev,
      metrics: (prev.metrics as any[]).filter((_, idx: number) => idx !== index),
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Format fields back to JSON for database
    const formattedData = {
      ...currentProject,
      techStack: (currentProject.techStack as string)
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      screenshots: (currentProject.screenshots as string)
        .split(',')
        .map((path) => path.trim())
        .filter(Boolean),
    };

    const result = await saveProject(formattedData);
    if (result.success) {
      setIsEditing(false);
      router.refresh();
      window.location.reload(); // Quick state refresh
    } else {
      setError(result.error || 'Failed to save project.');
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    setLoading(true);
    const result = await deleteProject(id);
    if (result.success) {
      router.refresh();
      window.location.reload();
    } else {
      setError(result.error || 'Failed to delete.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-2">Projects Index</h1>
          <p className="text-sm text-gray-400">Add, edit, or archive case study lists.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={handleAddClick}
            className="bg-[var(--accent)] text-white text-xs font-mono uppercase tracking-wider px-5 py-3 rounded-lg hover:bg-[rgba(var(--accent-rgb),0.8)] transition-colors cursor-pointer"
          >
            + ADD CASE STUDY
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-mono p-4 rounded-lg">
          $ TRANSACTION FAIL: {error}
        </div>
      )}

      {isEditing ? (
        /* Edit / Create Form Panel */
        <form onSubmit={handleFormSubmit} className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-8 flex flex-col gap-6">
          <h3 className="text-sm font-semibold tracking-wide border-b border-[#1a1a22] pb-4 mb-4">
            {currentProject.id ? `EDIT CASE STUDY: ${currentProject.title}` : 'NEW CASE STUDY REGISTRY'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gray-400 uppercase">Project Title</label>
              <input 
                type="text" 
                id="title" 
                required 
                className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm"
                value={currentProject.title} 
                onChange={handleFormChange}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gray-400 uppercase">Slug URL</label>
              <input 
                type="text" 
                id="slug" 
                required 
                className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm"
                value={currentProject.slug} 
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-gray-400 uppercase">Subtitle / Brief tagline</label>
            <input 
              type="text" 
              id="subtitle" 
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm"
              value={currentProject.subtitle} 
              onChange={handleFormChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gray-400 uppercase">Role</label>
              <input 
                type="text" 
                id="role" 
                className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm"
                value={currentProject.role} 
                onChange={handleFormChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gray-400 uppercase">Company</label>
              <input 
                type="text" 
                id="company" 
                className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm"
                value={currentProject.company} 
                onChange={handleFormChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gray-400 uppercase">Timeline</label>
              <input 
                type="text" 
                id="timeline" 
                className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm"
                value={currentProject.timeline} 
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-gray-400 uppercase">Context / Problem</label>
            <textarea 
              id="problem" 
              rows={3}
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg p-4 text-sm"
              value={currentProject.problem || ''} 
              onChange={handleFormChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-gray-400 uppercase">Challenges</label>
            <textarea 
              id="challenge" 
              rows={3}
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg p-4 text-sm"
              value={currentProject.challenge || ''} 
              onChange={handleFormChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-gray-400 uppercase">Execution / Solutions</label>
            <textarea 
              id="solution" 
              rows={3}
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg p-4 text-sm"
              value={currentProject.solution || ''} 
              onChange={handleFormChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gray-400 uppercase">Tech Stack (comma separated)</label>
              <input 
                type="text" 
                id="techStack" 
                className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm"
                value={currentProject.techStack} 
                onChange={handleFormChange}
                placeholder="Next.js, Python, pgvector"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gray-400 uppercase">Screenshots (comma separated paths)</label>
              <input 
                type="text" 
                id="screenshots" 
                className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm"
                value={currentProject.screenshots} 
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gray-400 uppercase">Github Link</label>
              <input 
                type="text" 
                id="githubUrl" 
                className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm"
                value={currentProject.githubUrl || ''} 
                onChange={handleFormChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gray-400 uppercase">Demo URL</label>
              <input 
                type="text" 
                id="demoUrl" 
                className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm"
                value={currentProject.demoUrl || ''} 
                onChange={handleFormChange}
              />
            </div>
          </div>

          {/* Dynamic Metrics Section */}
          <div className="border-t border-[#1a1a22] pt-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono text-gray-400 uppercase">Impact Metrics</label>
              <button 
                type="button" 
                onClick={addMetricLine}
                className="text-[10px] font-mono text-[var(--accent)] hover:text-white"
              >
                + ADD LINE
              </button>
            </div>
            
            {(currentProject.metrics as any[] || []).map((metric, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <input 
                  type="text" 
                  placeholder="Value (e.g. -71%)" 
                  className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm w-1/3"
                  value={metric.value} 
                  onChange={(e) => handleMetricChange(idx, 'value', e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="Label (e.g. Turnaround reduction)" 
                  className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm flex-1"
                  value={metric.label} 
                  onChange={(e) => handleMetricChange(idx, 'label', e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => removeMetricLine(idx)}
                  className="text-xs text-red-500 font-mono"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Visibility Controls */}
          <div className="border-t border-[#1a1a22] pt-6 flex gap-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                id="isDraft" 
                checked={currentProject.isDraft === 1} 
                onChange={(e) => setCurrentProject((p: any) => ({ ...p, isDraft: e.target.checked ? 1 : 0 }))}
              />
              <span className="text-xs font-mono uppercase text-gray-400">Save as Draft</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                id="isFeatured" 
                checked={currentProject.isFeatured === 1} 
                onChange={(e) => setCurrentProject((p: any) => ({ ...p, isFeatured: e.target.checked ? 1 : 0 }))}
              />
              <span className="text-xs font-mono uppercase text-gray-400">Featured Work</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                id="isPinned" 
                checked={currentProject.isPinned === 1} 
                onChange={(e) => setCurrentProject((p: any) => ({ ...p, isPinned: e.target.checked ? 1 : 0 }))}
              />
              <span className="text-xs font-mono uppercase text-gray-400">Pin to Header</span>
            </label>
          </div>

          {/* Form Trigger Buttons */}
          <div className="border-t border-[#1a1a22] pt-6 flex gap-4 justify-end">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="text-xs font-mono text-gray-500 hover:text-white px-5 py-3 rounded-lg border border-[rgba(255,255,255,0.06)]"
              disabled={loading}
            >
              CANCEL
            </button>
            <button 
              type="submit" 
              className="bg-[var(--accent)] text-white text-xs font-mono uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-[rgba(var(--accent-rgb),0.8)]"
              disabled={loading}
            >
              {loading ? 'SAVING...' : 'SAVE TRANS ACTION'}
            </button>
          </div>
        </form>
      ) : (
        /* Project Lists Panel */
        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            {projects.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-gray-500">
                NO REGISTERED CASE STUDIES IN THE SQLite REPOSITORY
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1a1a22] text-[10px] font-mono uppercase text-gray-500">
                    <th className="py-4 px-6">Case Details</th>
                    <th className="py-4 px-6">Slug</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {projects.map((proj) => (
                    <tr key={proj.id} className="border-b border-[#111116] hover:bg-[#111116] transition-colors last:border-b-0">
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-medium text-white">{proj.title}</span>
                          <span className="text-xs text-gray-500">{proj.subtitle}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-gray-400">/{proj.slug}</td>
                      <td className="py-4 px-6">
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                          proj.isDraft === 1 
                            ? 'bg-yellow-950/20 text-yellow-500 border border-yellow-500/20' 
                            : 'bg-green-950/20 text-green-500 border border-green-500/20'
                        }`}>
                          {proj.isDraft === 1 ? 'DRAFT' : 'PUBLISHED'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-xs flex gap-4 justify-end">
                        <button 
                          onClick={() => handleEditClick(proj)}
                          className="text-[var(--accent)] hover:text-white transition-colors"
                          disabled={loading}
                        >
                          [EDIT]
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(proj.id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                          disabled={loading}
                        >
                          [DELETE]
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
