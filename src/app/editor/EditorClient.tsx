'use client';

import React, { useState, useTransition } from 'react';
import { 
  saveSettingsAction, 
  saveProfileAction, 
  saveProjectAction, 
  deleteProjectAction,
  saveBlogAction,
  deleteBlogAction,
  saveSkillAction,
  deleteSkillAction,
  saveTestimonialAction,
  deleteTestimonialAction
} from './actions';

type Tab = 'settings' | 'profile' | 'projects' | 'blogs' | 'skills' | 'testimonials';

interface EditorClientProps {
  initialSettings: Record<string, string>;
  initialProfile: any;
  initialProjects: any[];
  initialBlogs: any[];
  initialSkills: any[];
  skillCategories: any[];
  initialTestimonials: any[];
}

export default function EditorClient({
  initialSettings,
  initialProfile,
  initialProjects,
  initialBlogs,
  initialSkills,
  skillCategories,
  initialTestimonials,
}: EditorClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('settings');
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);

  // States for Settings
  const [settings, setSettings] = useState(initialSettings);
  
  // States for Profile
  const [profile, setProfile] = useState(initialProfile);

  // States for Projects CMS
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [projectForm, setProjectForm] = useState({
    id: '',
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
    metrics: '',
    screenshots: '',
    githubUrl: '',
    demoUrl: '',
    isFeatured: false,
    isPinned: false,
    isDraft: false,
    position: '0',
  });

  // States for Blogs CMS
  const [blogs, setBlogs] = useState(initialBlogs);
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);
  const [blogForm, setBlogForm] = useState({
    id: '',
    title: '',
    slug: '',
    excerpt: '',
    contentMarkdown: '',
    categories: '[]',
    tags: '[]',
    readingTime: '5',
    isDraft: true,
  });

  // States for Skills CMS
  const [skills, setSkills] = useState(initialSkills);
  const [skillForm, setSkillForm] = useState({
    id: '',
    name: '',
    proficiency: '80',
    categoryId: skillCategories[0]?.id || '',
    position: '0',
  });

  // States for Testimonials CMS
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [testimonialForm, setTestimonialForm] = useState({
    id: '',
    clientName: '',
    clientRole: '',
    clientCompany: '',
    text: '',
    avatarUrl: '',
    position: '0',
    status: 'active',
  });

  const triggerToast = (text: string, success: boolean) => {
    setMessage({ text, success });
    setTimeout(() => setMessage(null), 3500);
  };

  const handleSaveSettings = () => {
    startTransition(async () => {
      const payload = Object.entries(settings).map(([key, value]) => ({ key, value }));
      const res = await saveSettingsAction(payload);
      if (res.success) {
        triggerToast('Settings updated successfully!', true);
      } else {
        triggerToast(res.error || 'Failed to update settings.', false);
      }
    });
  };

  const handleSaveProfile = () => {
    startTransition(async () => {
      const res = await saveProfileAction(profile);
      if (res.success) {
        triggerToast('Profile updated successfully!', true);
      } else {
        triggerToast(res.error || 'Failed to update profile.', false);
      }
    });
  };

  // Projects Handlers
  const handleSelectProject = (proj: any) => {
    setSelectedProject(proj);
    setProjectForm({
      id: proj.id,
      title: proj.title || '',
      slug: proj.slug || '',
      subtitle: proj.subtitle || '',
      role: proj.role || '',
      company: proj.company || '',
      timeline: proj.timeline || '',
      problem: proj.problem || '',
      challenge: proj.challenge || '',
      solution: proj.solution || '',
      techStack: Array.isArray(proj.techStack) ? JSON.stringify(proj.techStack) : proj.techStack || '[]',
      metrics: Array.isArray(proj.metrics) ? JSON.stringify(proj.metrics) : proj.metrics || '[]',
      screenshots: Array.isArray(proj.screenshots) ? JSON.stringify(proj.screenshots) : proj.screenshots || '[]',
      githubUrl: proj.githubUrl || '',
      demoUrl: proj.demoUrl || '',
      isFeatured: proj.isFeatured === 1 || proj.isFeatured === true,
      isPinned: proj.isPinned === 1 || proj.isPinned === true,
      isDraft: proj.isDraft === 1 || proj.isDraft === true,
      position: String(proj.position || '0'),
    });
  };

  const handleNewProject = () => {
    setSelectedProject(null);
    setProjectForm({
      id: '',
      title: '',
      slug: '',
      subtitle: '',
      role: '',
      company: '',
      timeline: '',
      problem: '',
      challenge: '',
      solution: '',
      techStack: '[]',
      metrics: '[]',
      screenshots: '[]',
      githubUrl: '',
      demoUrl: '',
      isFeatured: false,
      isPinned: false,
      isDraft: true,
      position: '0',
    });
  };

  const handleSaveProject = () => {
    startTransition(async () => {
      const res = await saveProjectAction(projectForm);
      if (res.success) {
        triggerToast('Project saved successfully!', true);
        // Refresh list
        window.location.reload();
      } else {
        triggerToast(res.error || 'Failed to save project.', false);
      }
    });
  };

  const handleDeleteProject = () => {
    if (!projectForm.id || !confirm('Are you sure you want to delete this project?')) return;
    startTransition(async () => {
      const res = await deleteProjectAction(projectForm.id);
      if (res.success) {
        triggerToast('Project deleted successfully!', true);
        window.location.reload();
      } else {
        triggerToast(res.error || 'Failed to delete project.', false);
      }
    });
  };

  // Blogs Handlers
  const handleSelectBlog = (blog: any) => {
    setSelectedBlog(blog);
    setBlogForm({
      id: blog.id,
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      contentMarkdown: blog.contentMarkdown || '',
      categories: Array.isArray(blog.categories) ? JSON.stringify(blog.categories) : blog.categories || '[]',
      tags: Array.isArray(blog.tags) ? JSON.stringify(blog.tags) : blog.tags || '[]',
      readingTime: String(blog.readingTime || '5'),
      isDraft: blog.isDraft === 1 || blog.isDraft === true,
    });
  };

  const handleNewBlog = () => {
    setSelectedBlog(null);
    setBlogForm({
      id: '',
      title: '',
      slug: '',
      excerpt: '',
      contentMarkdown: '',
      categories: '[]',
      tags: '[]',
      readingTime: '5',
      isDraft: true,
    });
  };

  const handleSaveBlog = () => {
    startTransition(async () => {
      const res = await saveBlogAction(blogForm);
      if (res.success) {
        triggerToast('Blog post saved successfully!', true);
        window.location.reload();
      } else {
        triggerToast(res.error || 'Failed to save blog post.', false);
      }
    });
  };

  const handleDeleteBlog = () => {
    if (!blogForm.id || !confirm('Are you sure you want to delete this blog post?')) return;
    startTransition(async () => {
      const res = await deleteBlogAction(blogForm.id);
      if (res.success) {
        triggerToast('Blog post deleted successfully!', true);
        window.location.reload();
      } else {
        triggerToast(res.error || 'Failed to delete blog post.', false);
      }
    });
  };

  // Skills Handlers
  const handleSaveSkill = () => {
    startTransition(async () => {
      const res = await saveSkillAction(skillForm);
      if (res.success) {
        triggerToast('Skill saved successfully!', true);
        window.location.reload();
      } else {
        triggerToast(res.error || 'Failed to save skill.', false);
      }
    });
  };

  const handleDeleteSkill = (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    startTransition(async () => {
      const res = await deleteSkillAction(id);
      if (res.success) {
        triggerToast('Skill deleted successfully!', true);
        window.location.reload();
      } else {
        triggerToast(res.error || 'Failed to delete skill.', false);
      }
    });
  };

  // Testimonials Handlers
  const handleSaveTestimonial = () => {
    startTransition(async () => {
      const res = await saveTestimonialAction(testimonialForm);
      if (res.success) {
        triggerToast('Testimonial saved successfully!', true);
        window.location.reload();
      } else {
        triggerToast(res.error || 'Failed to save testimonial.', false);
      }
    });
  };

  const handleDeleteTestimonial = (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    startTransition(async () => {
      const res = await deleteTestimonialAction(id);
      if (res.success) {
        triggerToast('Testimonial deleted successfully!', true);
        window.location.reload();
      } else {
        triggerToast(res.error || 'Failed to delete testimonial.', false);
      }
    });
  };

  const handleEditTestimonial = (test: any) => {
    setTestimonialForm({
      id: test.id,
      clientName: test.clientName || '',
      clientRole: test.clientRole || '',
      clientCompany: test.clientCompany || '',
      text: test.text || '',
      avatarUrl: test.avatarUrl || '',
      position: String(test.position || '0'),
      status: test.status || 'active',
    });
  };

  return (
    <div className="relative">
      {/* Dynamic Saving Indicator overlay */}
      {isPending && (
        <div className="fixed top-6 right-[8%] z-50 bg-[#111115] border border-white/5 px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-3 font-mono text-[10px] text-white">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
          <span>WRITING TO SUPABASE...</span>
        </div>
      )}

      {/* Floating Status Toast */}
      {message && (
        <div 
          className={`fixed bottom-6 right-[8%] z-50 px-4 py-3 rounded-lg border shadow-xl flex items-center gap-3 font-mono text-[10px] ${
            message.success 
              ? 'bg-[#0f1712] border-emerald-500/20 text-emerald-400' 
              : 'bg-[#1a1112] border-red-500/20 text-red-400'
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${message.success ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span>{message.text}</span>
        </div>
      )}

      {/* Control Tabs */}
      <div className="flex flex-wrap gap-2.5 mb-10 border-b border-white/5 pb-6">
        {(['settings', 'profile', 'projects', 'blogs', 'skills', 'testimonials'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-lg border font-mono text-[10px] uppercase tracking-wider transition-all duration-300 ${
              activeTab === tab 
                ? 'bg-white text-black border-white' 
                : 'bg-transparent text-zinc-400 border-white/5 hover:border-zinc-700 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ==================== TAB 1: SETTINGS ==================== */}
      {activeTab === 'settings' && (
        <div className="bg-[#111115]/80 border border-white/5 shadow-2xl rounded-xl p-8 backdrop-blur-xl max-w-3xl">
          <h3 className="text-lg font-light mb-6 text-white tracking-tight">Global Configurations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Availability Status</label>
              <input 
                type="text" 
                value={settings.status || ''} 
                onChange={(e) => setSettings({ ...settings, status: e.target.value })}
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs font-mono text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Accent Color (Hex)</label>
              <input 
                type="text" 
                value={settings.colorAccent || ''} 
                onChange={(e) => setSettings({ ...settings, colorAccent: e.target.value })}
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs font-mono text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Accent Color RGB Values</label>
              <input 
                type="text" 
                value={settings.colorAccentRgb || ''} 
                onChange={(e) => setSettings({ ...settings, colorAccentRgb: e.target.value })}
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs font-mono text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Visual Noise Overlay (1=On, 0=Off)</label>
              <select 
                value={settings.showNoise || '1'} 
                onChange={(e) => setSettings({ ...settings, showNoise: e.target.value })}
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs font-mono text-white focus:outline-none focus:border-zinc-600"
              >
                <option value="1">Enabled</option>
                <option value="0">Disabled</option>
              </select>
            </div>
          </div>
          <button 
            onClick={handleSaveSettings}
            className="bg-white text-black font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Save Settings
          </button>
        </div>
      )}

      {/* ==================== TAB 2: PROFILE ==================== */}
      {activeTab === 'profile' && (
        <div className="bg-[#111115]/80 border border-white/5 shadow-2xl rounded-xl p-8 backdrop-blur-xl max-w-3xl">
          <h3 className="text-lg font-light mb-6 text-white tracking-tight">Identity Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Full Name</label>
              <input 
                type="text" 
                value={profile.name || ''} 
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Job Title</label>
              <input 
                type="text" 
                value={profile.title || ''} 
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Contact Email</label>
              <input 
                type="email" 
                value={profile.contactEmail || ''} 
                onChange={(e) => setProfile({ ...profile, contactEmail: e.target.value })}
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Location</label>
              <input 
                type="text" 
                value={profile.location || ''} 
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Hero Tagline</label>
              <input 
                type="text" 
                value={profile.tagline || ''} 
                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Professional Biography</label>
              <textarea 
                rows={4}
                value={profile.bio || ''} 
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-zinc-600 leading-relaxed"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Resume / Document URL</label>
              <input 
                type="text" 
                value={profile.resumeUrl || ''} 
                onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>
          <button 
            onClick={handleSaveProfile}
            className="bg-white text-black font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Save Identity Profile
          </button>
        </div>
      )}

      {/* ==================== TAB 3: PROJECTS ==================== */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-8">
          {/* Projects List sidebar */}
          <div className="bg-[#111115]/80 border border-white/5 rounded-xl p-6 backdrop-blur-xl h-fit">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <span className="font-mono text-[10px] text-zinc-500 uppercase">Case Studies</span>
              <button 
                onClick={handleNewProject}
                className="font-mono text-[9px] border border-white/10 rounded px-2.5 py-1 text-white hover:bg-white hover:text-black transition-colors"
              >
                + NEW
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => handleSelectProject(proj)}
                  className={`w-full text-left p-3.5 rounded-lg font-mono text-[10px] border transition-all duration-300 ${
                    selectedProject?.id === proj.id
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-zinc-400 border-white/5 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <div className="truncate font-semibold uppercase">{proj.title}</div>
                  <div className={`mt-1 text-[8px] opacity-60 ${selectedProject?.id === proj.id ? 'text-black' : 'text-zinc-500'}`}>
                    {proj.company || 'Personal'} / {proj.role || 'Creator'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Project Details Form */}
          <div className="bg-[#111115]/80 border border-white/5 rounded-xl p-8 backdrop-blur-xl">
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">
              {selectedProject ? `Modify: ${selectedProject.title}` : 'Create New Project Case Study'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Project Title</label>
                <input 
                  type="text" 
                  value={projectForm.title} 
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Slug (URL Path)</label>
                <input 
                  type="text" 
                  value={projectForm.slug} 
                  onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })}
                  placeholder="e.g. project-slug"
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Subtitle / Short Tagline</label>
                <input 
                  type="text" 
                  value={projectForm.subtitle} 
                  onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Orchestration Role</label>
                <input 
                  type="text" 
                  value={projectForm.role} 
                  onChange={(e) => setProjectForm({ ...projectForm, role: e.target.value })}
                  placeholder="e.g. Lead AI Systems Architect"
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Company / Enterprise</label>
                <input 
                  type="text" 
                  value={projectForm.company} 
                  onChange={(e) => setProjectForm({ ...projectForm, company: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Project Timeline</label>
                <input 
                  type="text" 
                  value={projectForm.timeline} 
                  onChange={(e) => setProjectForm({ ...projectForm, timeline: e.target.value })}
                  placeholder="e.g. 6 Months (2025)"
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Display Position (0=First)</label>
                <input 
                  type="number" 
                  value={projectForm.position} 
                  onChange={(e) => setProjectForm({ ...projectForm, position: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">The Problem Statement</label>
                <textarea 
                  rows={3} 
                  value={projectForm.problem} 
                  onChange={(e) => setProjectForm({ ...projectForm, problem: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">The Architecture Challenge</label>
                <textarea 
                  rows={3} 
                  value={projectForm.challenge} 
                  onChange={(e) => setProjectForm({ ...projectForm, challenge: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">The Solution Implementation</label>
                <textarea 
                  rows={3} 
                  value={projectForm.solution} 
                  onChange={(e) => setProjectForm({ ...projectForm, solution: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Tech Stack Tags (JSON list)</label>
                <input 
                  type="text" 
                  value={projectForm.techStack} 
                  onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs font-mono text-white focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Metrics mapping (JSON list of &#123; value, label &#125;)</label>
                <textarea 
                  rows={2} 
                  value={projectForm.metrics} 
                  onChange={(e) => setProjectForm({ ...projectForm, metrics: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs font-mono text-white focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">GitHub URL</label>
                <input 
                  type="text" 
                  value={projectForm.githubUrl} 
                  onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Demo / Live URL</label>
                <input 
                  type="text" 
                  value={projectForm.demoUrl} 
                  onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Screenshot Paths (JSON list of strings)</label>
                <input 
                  type="text" 
                  value={projectForm.screenshots} 
                  onChange={(e) => setProjectForm({ ...projectForm, screenshots: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs font-mono text-white focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-6 md:col-span-2">
                <label className="flex items-center gap-2 font-mono text-[10px] text-white">
                  <input 
                    type="checkbox" 
                    checked={projectForm.isFeatured} 
                    onChange={(e) => setProjectForm({ ...projectForm, isFeatured: e.target.checked })}
                    className="accent-[var(--accent)]"
                  />
                  Featured Case Study
                </label>
                <label className="flex items-center gap-2 font-mono text-[10px] text-white">
                  <input 
                    type="checkbox" 
                    checked={projectForm.isPinned} 
                    onChange={(e) => setProjectForm({ ...projectForm, isPinned: e.target.checked })}
                    className="accent-[var(--accent)]"
                  />
                  Pinned in Home Grid
                </label>
                <label className="flex items-center gap-2 font-mono text-[10px] text-white">
                  <input 
                    type="checkbox" 
                    checked={projectForm.isDraft} 
                    onChange={(e) => setProjectForm({ ...projectForm, isDraft: e.target.checked })}
                    className="accent-[var(--accent)]"
                  />
                  Save as Draft
                </label>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleSaveProject}
                className="bg-white text-black font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Save Case Study
              </button>
              {selectedProject && (
                <button 
                  onClick={handleDeleteProject}
                  className="border border-red-500/20 bg-red-950/20 text-red-400 font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-red-900/20 transition-colors"
                >
                  Delete Project
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: BLOGS ==================== */}
      {activeTab === 'blogs' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-8">
          {/* Blogs List sidebar */}
          <div className="bg-[#111115]/80 border border-white/5 rounded-xl p-6 backdrop-blur-xl h-fit">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <span className="font-mono text-[10px] text-zinc-500 uppercase">Journal Entries</span>
              <button 
                onClick={handleNewBlog}
                className="font-mono text-[9px] border border-white/10 rounded px-2.5 py-1 text-white hover:bg-white hover:text-black transition-colors"
              >
                + NEW
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {blogs.map((blog) => (
                <button
                  key={blog.id}
                  onClick={() => handleSelectBlog(blog)}
                  className={`w-full text-left p-3.5 rounded-lg font-mono text-[10px] border transition-all duration-300 ${
                    selectedBlog?.id === blog.id
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-zinc-400 border-white/5 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <div className="truncate font-semibold uppercase">{blog.title}</div>
                  <div className={`mt-1 text-[8px] opacity-60 ${selectedBlog?.id === blog.id ? 'text-black' : 'text-zinc-500'}`}>
                    {blog.slug} / {blog.readingTime}m
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Blog details form */}
          <div className="bg-[#111115]/80 border border-white/5 rounded-xl p-8 backdrop-blur-xl">
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">
              {selectedBlog ? `Modify: ${selectedBlog.title}` : 'Draft New Essay Journal'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Essay Title</label>
                <input 
                  type="text" 
                  value={blogForm.title} 
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Slug (URL Path)</label>
                <input 
                  type="text" 
                  value={blogForm.slug} 
                  onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Reading Time (Minutes)</label>
                <input 
                  type="number" 
                  value={blogForm.readingTime} 
                  onChange={(e) => setBlogForm({ ...blogForm, readingTime: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Short Excerpt / Intro Summary</label>
                <input 
                  type="text" 
                  value={blogForm.excerpt} 
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Categories (JSON list)</label>
                <input 
                  type="text" 
                  value={blogForm.categories} 
                  onChange={(e) => setBlogForm({ ...blogForm, categories: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs font-mono text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Tags (JSON list)</label>
                <input 
                  type="text" 
                  value={blogForm.tags} 
                  onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs font-mono text-white focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Article Body Content (Markdown syntax)</label>
                <textarea 
                  rows={15} 
                  value={blogForm.contentMarkdown} 
                  onChange={(e) => setBlogForm({ ...blogForm, contentMarkdown: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-4 text-xs font-mono text-white focus:outline-none leading-relaxed"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 font-mono text-[10px] text-white">
                  <input 
                    type="checkbox" 
                    checked={blogForm.isDraft} 
                    onChange={(e) => setBlogForm({ ...blogForm, isDraft: e.target.checked })}
                    className="accent-[var(--accent)]"
                  />
                  Save as Draft (Unpublished)
                </label>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleSaveBlog}
                className="bg-white text-black font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Save Essay
              </button>
              {selectedBlog && (
                <button 
                  onClick={handleDeleteBlog}
                  className="border border-red-500/20 bg-red-950/20 text-red-400 font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-red-900/20 transition-colors"
                >
                  Delete Essay
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 5: SKILLS ==================== */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
          {/* Skills database table */}
          <div className="bg-[#111115]/80 border border-white/5 rounded-xl p-8 backdrop-blur-xl h-fit">
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">Active Skills Database</h3>
            <div className="flex flex-col border border-white/5 rounded-lg overflow-hidden bg-[#09090b]">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr] p-3 border-b border-white/5 bg-[#121216] font-mono text-[8px] uppercase text-zinc-500">
                <span>Skill Name</span>
                <span>Category</span>
                <span>Proficiency</span>
                <span className="text-right">Action</span>
              </div>
              {skills.map((s) => (
                <div key={s.id} className="grid grid-cols-[2fr_1fr_1fr_1fr] p-3 border-b border-white/5 last:border-b-0 items-center font-mono text-[9px] text-zinc-300">
                  <span className="font-semibold text-white">{s.name}</span>
                  <span className="opacity-70 truncate">{s.categoryName}</span>
                  <span>{s.proficiency}%</span>
                  <button 
                    onClick={() => handleDeleteSkill(s.id)}
                    className="text-red-400 text-right hover:text-red-300 font-bold"
                  >
                    DELETE
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* New skill forms */}
          <div className="bg-[#111115]/80 border border-white/5 rounded-xl p-8 backdrop-blur-xl h-fit">
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">Add Skill Metric</h3>
            <div className="flex flex-col gap-5 mb-8">
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Skill Name</label>
                <input 
                  type="text" 
                  value={skillForm.name} 
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Skill Group / Category</label>
                <select 
                  value={skillForm.categoryId} 
                  onChange={(e) => setSkillForm({ ...skillForm, categoryId: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                >
                  {skillCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Proficiency Percent (0-100)</label>
                <input 
                  type="number" 
                  value={skillForm.proficiency} 
                  onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
            <button 
              onClick={handleSaveSkill}
              className="bg-white text-black font-mono text-[10px] uppercase tracking-widest w-full py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Add Skill
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB 6: TESTIMONIALS ==================== */}
      {activeTab === 'testimonials' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
          {/* Testimonial list */}
          <div className="bg-[#111115]/80 border border-white/5 rounded-xl p-8 backdrop-blur-xl h-fit">
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">Social Testimonials</h3>
            <div className="flex flex-col border border-white/5 rounded-lg overflow-hidden bg-[#09090b]">
              <div className="grid grid-cols-[2fr_1.5fr_1fr] p-3 border-b border-white/5 bg-[#121216] font-mono text-[8px] uppercase text-zinc-500">
                <span>Client / Partner</span>
                <span>Title & Company</span>
                <span className="text-right">Actions</span>
              </div>
              {testimonials.map((test) => (
                <div key={test.id} className="grid grid-cols-[2fr_1.5fr_1fr] p-3 border-b border-white/5 last:border-b-0 items-center font-mono text-[9px] text-zinc-300">
                  <span className="font-semibold text-white">{test.clientName}</span>
                  <span className="opacity-70 truncate">{test.clientRole} at {test.clientCompany}</span>
                  <div className="flex justify-end gap-3 text-right">
                    <button 
                      onClick={() => handleEditTestimonial(test)}
                      className="text-white hover:underline font-bold"
                    >
                      EDIT
                    </button>
                    <button 
                      onClick={() => handleDeleteTestimonial(test.id)}
                      className="text-red-400 hover:text-red-300 font-bold"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial Forms */}
          <div className="bg-[#111115]/80 border border-white/5 rounded-xl p-8 backdrop-blur-xl h-fit">
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">Add / Modify Testimonial</h3>
            <div className="flex flex-col gap-5 mb-8">
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Client Name</label>
                <input 
                  type="text" 
                  value={testimonialForm.clientName} 
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, clientName: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Client Role</label>
                <input 
                  type="text" 
                  value={testimonialForm.clientRole} 
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, clientRole: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Client Company</label>
                <input 
                  type="text" 
                  value={testimonialForm.clientCompany} 
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, clientCompany: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Review Quote Content</label>
                <textarea 
                  rows={4} 
                  value={testimonialForm.text} 
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, text: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none leading-relaxed"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Avatar Image Path</label>
                <input 
                  type="text" 
                  value={testimonialForm.avatarUrl} 
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, avatarUrl: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
            <button 
              onClick={handleSaveTestimonial}
              className="bg-white text-black font-mono text-[10px] uppercase tracking-widest w-full py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Save Testimonial
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
