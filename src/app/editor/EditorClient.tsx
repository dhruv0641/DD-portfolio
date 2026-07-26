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
  deleteTestimonialAction,
  saveServiceAction,
  deleteServiceAction,
  saveExperienceAction,
  deleteExperienceAction,
  saveEducationAction,
  deleteEducationAction,
  saveCertificateAction,
  deleteCertificateAction,
  saveSeoAction,
  logoutAction,
  initializeDatabaseAction
} from './actions';

type Tab = 'settings' | 'profile' | 'projects' | 'blogs' | 'skills' | 'testimonials' | 'services' | 'experience' | 'education' | 'certificates' | 'seo';

interface EditorClientProps {
  initialSettings: Record<string, string>;
  initialProfile: any;
  initialProjects: any[];
  initialBlogs: any[];
  initialSkills: any[];
  skillCategories: any[];
  initialTestimonials: any[];
  initialServices: any[];
  initialExperiences: any[];
  initialEducations: any[];
  initialCertificates: any[];
  initialSeo: any;
}

export default function EditorClient({
  initialSettings,
  initialProfile,
  initialProjects,
  initialBlogs,
  initialSkills,
  skillCategories,
  initialTestimonials,
  initialServices,
  initialExperiences,
  initialEducations,
  initialCertificates,
  initialSeo,
}: EditorClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('settings');
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);

  const triggerToast = (text: string, success: boolean) => {
    setMessage({ text, success });
    setTimeout(() => setMessage(null), 3500);
  };

  const handleLogout = () => {
    startTransition(async () => {
      const res = await logoutAction();
      if (res.success) {
        window.location.reload();
      } else {
        triggerToast('Failed to log out.', false);
      }
    });
  };

  // --- TAB 1: SETTINGS STATES & SAVER ---
  const [settings, setSettings] = useState(initialSettings);
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

  // --- TAB 2: PROFILE STATES & SAVER ---
  const [profile, setProfile] = useState(initialProfile);
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

  // --- TAB 3: PROJECTS STATES & CRUD ---
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
    techStack: '[]',
    metrics: '[]',
    screenshots: '[]',
    githubUrl: '',
    demoUrl: '',
    isFeatured: false,
    isPinned: false,
    isDraft: false,
    position: '0',
  });

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

  // --- TAB 4: BLOGS STATES & CRUD ---
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

  // --- TAB 5: SKILLS STATES & CRUD ---
  const [skills, setSkills] = useState(initialSkills);
  const [skillForm, setSkillForm] = useState({
    id: '',
    name: '',
    proficiency: '80',
    categoryId: skillCategories[0]?.id || '',
    position: '0',
  });

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

  // --- TAB 6: TESTIMONIALS STATES & CRUD ---
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [testimonialForm, setTestimonialForm] = useState({
    id: '',
    clientName: '',
    clientRole: '',
    clientCompany: '',
    text: '',
    avatarUrl: '',
    position: '0',
  });

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

  const handleEditTestimonial = (t: any) => {
    setTestimonialForm({
      id: t.id,
      clientName: t.clientName || '',
      clientRole: t.clientRole || '',
      clientCompany: t.clientCompany || '',
      text: t.text || '',
      avatarUrl: t.avatarUrl || '',
      position: String(t.position || '0'),
    });
  };

  // --- TAB 7: SERVICES STATES & CRUD ---
  const [services, setServices] = useState(initialServices);
  const [serviceForm, setServiceForm] = useState({
    id: '',
    name: '',
    description: '',
    icon: 'CodeXml',
    position: '0',
  });

  const handleSaveService = () => {
    startTransition(async () => {
      const res = await saveServiceAction(serviceForm);
      if (res.success) {
        triggerToast('Service saved successfully!', true);
        window.location.reload();
      } else {
        triggerToast(res.error || 'Failed to save service.', false);
      }
    });
  };

  const handleDeleteService = (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    startTransition(async () => {
      const res = await deleteServiceAction(id);
      if (res.success) {
        triggerToast('Service deleted successfully!', true);
        window.location.reload();
      } else {
        triggerToast(res.error || 'Failed to delete service.', false);
      }
    });
  };

  const handleEditService = (s: any) => {
    setServiceForm({
      id: s.id,
      name: s.name || '',
      description: s.description || '',
      icon: s.icon || 'CodeXml',
      position: String(s.position || '0'),
    });
  };

  // --- TAB 8: EXPERIENCE STATES & CRUD ---
  const [experiences, setExperiences] = useState(initialExperiences);
  const [experienceForm, setExperienceForm] = useState({
    id: '',
    company: '',
    role: '',
    timeline: '',
    location: '',
    description: '',
    position: '0',
  });

  const handleSaveExperience = () => {
    startTransition(async () => {
      const res = await saveExperienceAction(experienceForm);
      if (res.success) {
        triggerToast('Experience saved successfully!', true);
        window.location.reload();
      } else {
        triggerToast(res.error || 'Failed to save experience.', false);
      }
    });
  };

  const handleDeleteExperience = (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    startTransition(async () => {
      const res = await deleteExperienceAction(id);
      if (res.success) {
        triggerToast('Experience deleted successfully!', true);
        window.location.reload();
      } else {
        triggerToast(res.error || 'Failed to delete experience.', false);
      }
    });
  };

  const handleEditExperience = (e: any) => {
    setExperienceForm({
      id: e.id,
      company: e.company || '',
      role: e.role || '',
      timeline: e.timeline || '',
      location: e.location || '',
      description: e.description || '',
      position: String(e.position || '0'),
    });
  };

  // --- TAB 9: EDUCATION STATES & CRUD ---
  const [educations, setEducations] = useState(initialEducations);
  const [educationForm, setEducationForm] = useState({
    id: '',
    institution: '',
    degree: '',
    fieldOfStudy: '',
    period: '',
    description: '',
    gpa: '',
    position: '0',
  });

  const handleSaveEducation = () => {
    startTransition(async () => {
      const res = await saveEducationAction(educationForm);
      if (res.success) {
        triggerToast('Education saved successfully!', true);
        window.location.reload();
      } else {
        triggerToast(res.error || 'Failed to save education.', false);
      }
    });
  };

  const handleDeleteEducation = (id: string) => {
    if (!confirm('Are you sure you want to delete this education?')) return;
    startTransition(async () => {
      const res = await deleteEducationAction(id);
      if (res.success) {
        triggerToast('Education deleted successfully!', true);
        window.location.reload();
      } else {
        triggerToast(res.error || 'Failed to delete education.', false);
      }
    });
  };

  const handleEditEducation = (edu: any) => {
    setEducationForm({
      id: edu.id,
      institution: edu.institution || '',
      degree: edu.degree || '',
      fieldOfStudy: edu.fieldOfStudy || '',
      period: edu.period || '',
      description: edu.description || '',
      gpa: edu.gpa || '',
      position: String(edu.position || '0'),
    });
  };

  // --- TAB 10: CERTIFICATES STATES & CRUD ---
  const [certificates, setCertificates] = useState(initialCertificates);
  const [certificateForm, setCertificateForm] = useState({
    id: '',
    title: '',
    issuer: '',
    timeline: '',
    score: '100',
    suffix: '%',
    description: '',
    position: '0',
  });

  const handleSaveCertificate = () => {
    startTransition(async () => {
      const res = await saveCertificateAction(certificateForm);
      if (res.success) {
        triggerToast('Certificate saved successfully!', true);
        window.location.reload();
      } else {
        triggerToast(res.error || 'Failed to save certificate.', false);
      }
    });
  };

  const handleDeleteCertificate = (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    startTransition(async () => {
      const res = await deleteCertificateAction(id);
      if (res.success) {
        triggerToast('Certificate deleted successfully!', true);
        window.location.reload();
      } else {
        triggerToast(res.error || 'Failed to delete certificate.', false);
      }
    });
  };

  const handleEditCertificate = (c: any) => {
    setCertificateForm({
      id: c.id,
      title: c.title || '',
      issuer: c.issuer || '',
      timeline: c.timeline || '',
      score: String(c.score || '100'),
      suffix: c.suffix || '%',
      description: c.description || '',
      position: String(c.position || '0'),
    });
  };

  // --- TAB 11: SEO STATES & SAVER ---
  const [seo, setSeo] = useState(initialSeo);
  const handleSaveSeo = () => {
    startTransition(async () => {
      const res = await saveSeoAction(seo);
      if (res.success) {
        triggerToast('SEO metadata saved successfully!', true);
      } else {
        triggerToast(res.error || 'Failed to save SEO metadata.', false);
      }
    });
  };

  // --- 1-CLICK INITIALIZER TRIGGER ---
  const handleInitializeDatabase = () => {
    if (!confirm('This will seed your Supabase database with default projects, essays, and layouts. Proceed?')) return;
    startTransition(async () => {
      const res = await initializeDatabaseAction();
      if (res.success) {
        triggerToast('Database initialized successfully! Reloading...', true);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        triggerToast(res.error || 'Failed to initialize database.', false);
      }
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

      {/* Header Panel with Logout */}
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
        <span className="font-mono text-[10px] text-zinc-500 uppercase">CMS CONTROL PANEL</span>
        <button 
          onClick={handleLogout}
          className="border border-white/10 hover:border-red-500/30 hover:bg-red-950/20 hover:text-red-400 text-zinc-400 font-mono text-[9px] uppercase tracking-wider px-3.5 py-1.5 rounded transition-all duration-300"
        >
          Sign Out
        </button>
      </div>

      {/* Control Tabs */}
      <div className="flex flex-wrap gap-2.5 mb-10 border-b border-white/5 pb-6">
        {(['settings', 'profile', 'projects', 'blogs', 'skills', 'testimonials', 'services', 'experience', 'education', 'certificates', 'seo'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg border font-mono text-[9px] uppercase tracking-wider transition-all duration-300 ${
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
            <div className="md:col-span-2">
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Availability Status</label>
              <input 
                type="text" 
                value={settings.status || ''} 
                onChange={(e) => setSettings({ ...settings, status: e.target.value })}
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs font-mono text-white focus:outline-none"
              />
            </div>
          </div>
          <button 
            onClick={handleSaveSettings}
            className="bg-white text-black font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Save Settings
          </button>

          <div className="mt-8 pt-8 border-t border-white/5">
            <h4 className="font-mono text-[10px] uppercase text-zinc-500 mb-2.5">Database Initialization</h4>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              If your Supabase tables are completely empty, click the button below to automatically sync all default portfolio details (projects, blogs, skills, experiences, and layouts) to your database.
            </p>
            <button 
              onClick={handleInitializeDatabase}
              className="border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-emerald-900/20 transition-colors"
            >
              Sync Default Data to Supabase
            </button>
          </div>
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
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Job Title</label>
              <input 
                type="text" 
                value={profile.title || ''} 
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Contact Email</label>
              <input 
                type="email" 
                value={profile.contactEmail || ''} 
                onChange={(e) => setProfile({ ...profile, contactEmail: e.target.value })}
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Location</label>
              <input 
                type="text" 
                value={profile.location || ''} 
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Hero Tagline</label>
              <input 
                type="text" 
                value={profile.tagline || ''} 
                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Professional Biography</label>
              <textarea 
                rows={4}
                value={profile.bio || ''} 
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none leading-relaxed"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Resume / Document URL</label>
              <input 
                type="text" 
                value={profile.resumeUrl || ''} 
                onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
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
                  <div className="mt-1 text-[8px] opacity-60">
                    {proj.company || 'Personal'} / {proj.role || 'Creator'}
                  </div>
                </button>
              ))}
            </div>
          </div>

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
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Display Position</label>
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
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Metrics (JSON list of &#123; value, label &#125;)</label>
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
                  <div className="mt-1 text-[8px] opacity-60">
                    {blog.slug} / {blog.readingTime}m
                  </div>
                </button>
              ))}
            </div>
          </div>

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
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Short Excerpt</label>
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
                  rows={12} 
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
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Skill Group</label>
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
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Proficiency (0-100)</label>
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
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Review Quote</label>
                <textarea 
                  rows={4} 
                  value={testimonialForm.text} 
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, text: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none leading-relaxed"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Avatar URL</label>
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

      {/* ==================== TAB 7: SERVICES ==================== */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
          <div className="bg-[#111115]/80 border border-white/5 rounded-xl p-8 backdrop-blur-xl h-fit">
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">Services List</h3>
            <div className="flex flex-col border border-white/5 rounded-lg overflow-hidden bg-[#09090b]">
              <div className="grid grid-cols-[1.5fr_2fr_1fr] p-3 border-b border-white/5 bg-[#121216] font-mono text-[8px] uppercase text-zinc-500">
                <span>Service Name</span>
                <span>Description</span>
                <span className="text-right">Actions</span>
              </div>
              {services.map((s) => (
                <div key={s.id} className="grid grid-cols-[1.5fr_2fr_1fr] p-3 border-b border-white/5 last:border-b-0 items-center font-mono text-[9px] text-zinc-300">
                  <span className="font-semibold text-white">{s.name}</span>
                  <span className="opacity-70 truncate">{s.description}</span>
                  <div className="flex justify-end gap-3 text-right">
                    <button 
                      onClick={() => handleEditService(s)}
                      className="text-white hover:underline font-bold"
                    >
                      EDIT
                    </button>
                    <button 
                      onClick={() => handleDeleteService(s.id)}
                      className="text-red-400 hover:text-red-300 font-bold"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111115]/80 border border-white/5 rounded-xl p-8 backdrop-blur-xl h-fit">
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">Add / Modify Service</h3>
            <div className="flex flex-col gap-5 mb-8">
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Service Name</label>
                <input 
                  type="text" 
                  value={serviceForm.name} 
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Lucide Icon Name</label>
                <input 
                  type="text" 
                  value={serviceForm.icon} 
                  onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                  placeholder="e.g. CodeXml, Globe, Terminal, Sparkles"
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Description</label>
                <textarea 
                  rows={4} 
                  value={serviceForm.description} 
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none leading-relaxed"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Display Position</label>
                <input 
                  type="number" 
                  value={serviceForm.position} 
                  onChange={(e) => setServiceForm({ ...serviceForm, position: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
            <button 
              onClick={handleSaveService}
              className="bg-white text-black font-mono text-[10px] uppercase tracking-widest w-full py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Save Service
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB 8: EXPERIENCE ==================== */}
      {activeTab === 'experience' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-8">
          <div className="bg-[#111115]/80 border border-white/5 rounded-xl p-6 backdrop-blur-xl h-fit">
            <span className="font-mono text-[10px] text-zinc-500 uppercase block mb-4 border-b border-white/5 pb-2">Employment History</span>
            <div className="flex flex-col gap-2">
              {experiences.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => handleEditExperience(exp)}
                  className="w-full text-left p-3.5 rounded-lg font-mono text-[10px] border border-white/5 bg-transparent text-zinc-400 hover:border-zinc-700 hover:text-white transition-all duration-300"
                >
                  <div className="font-semibold uppercase text-white">{exp.role}</div>
                  <div className="mt-1 text-[8px] opacity-75">{exp.company} | {exp.timeline}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#111115]/80 border border-white/5 rounded-xl p-8 backdrop-blur-xl">
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">Add / Modify Experience</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Company Name</label>
                <input 
                  type="text" 
                  value={experienceForm.company} 
                  onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Role Title</label>
                <input 
                  type="text" 
                  value={experienceForm.role} 
                  onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Job Timeline</label>
                <input 
                  type="text" 
                  value={experienceForm.timeline} 
                  onChange={(e) => setExperienceForm({ ...experienceForm, timeline: e.target.value })}
                  placeholder="e.g. 2025 - Present"
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Location</label>
                <input 
                  type="text" 
                  value={experienceForm.location} 
                  onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
                  placeholder="e.g. Remote / Surat, India"
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Job Description</label>
                <textarea 
                  rows={4} 
                  value={experienceForm.description} 
                  onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none leading-relaxed"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Display Position</label>
                <input 
                  type="number" 
                  value={experienceForm.position} 
                  onChange={(e) => setExperienceForm({ ...experienceForm, position: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleSaveExperience}
                className="bg-white text-black font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Save Experience
              </button>
              {experienceForm.id && (
                <button 
                  onClick={() => handleDeleteExperience(experienceForm.id)}
                  className="border border-red-500/20 bg-red-950/20 text-red-400 font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-red-900/20 transition-colors"
                >
                  Delete Record
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 9: EDUCATION ==================== */}
      {activeTab === 'education' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-8">
          <div className="bg-[#111115]/80 border border-white/5 rounded-xl p-6 backdrop-blur-xl h-fit">
            <span className="font-mono text-[10px] text-zinc-500 uppercase block mb-4 border-b border-white/5 pb-2">Academic Background</span>
            <div className="flex flex-col gap-2">
              {educations.map((edu) => (
                <button
                  key={edu.id}
                  onClick={() => handleEditEducation(edu)}
                  className="w-full text-left p-3.5 rounded-lg font-mono text-[10px] border border-white/5 bg-transparent text-zinc-400 hover:border-zinc-700 hover:text-white transition-all duration-300"
                >
                  <div className="font-semibold uppercase text-white">{edu.degree}</div>
                  <div className="mt-1 text-[8px] opacity-75">{edu.institution} | {edu.period}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#111115]/80 border border-white/5 rounded-xl p-8 backdrop-blur-xl">
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">Add / Modify Education</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Institution Name</label>
                <input 
                  type="text" 
                  value={educationForm.institution} 
                  onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Degree / Diploma</label>
                <input 
                  type="text" 
                  value={educationForm.degree} 
                  onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Field of Study</label>
                <input 
                  type="text" 
                  value={educationForm.fieldOfStudy} 
                  onChange={(e) => setEducationForm({ ...educationForm, fieldOfStudy: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Academic Period (Timeline)</label>
                <input 
                  type="text" 
                  value={educationForm.period} 
                  onChange={(e) => setEducationForm({ ...educationForm, period: e.target.value })}
                  placeholder="e.g. 2021 - 2024"
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">GPA / Score</label>
                <input 
                  type="text" 
                  value={educationForm.gpa} 
                  onChange={(e) => setEducationForm({ ...educationForm, gpa: e.target.value })}
                  placeholder="e.g. 9.1 / 10"
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Display Position</label>
                <input 
                  type="number" 
                  value={educationForm.position} 
                  onChange={(e) => setEducationForm({ ...educationForm, position: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Description</label>
                <textarea 
                  rows={4} 
                  value={educationForm.description} 
                  onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none leading-relaxed"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleSaveEducation}
                className="bg-white text-black font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Save Education
              </button>
              {educationForm.id && (
                <button 
                  onClick={() => handleDeleteEducation(educationForm.id)}
                  className="border border-red-500/20 bg-red-950/20 text-red-400 font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-red-900/20 transition-colors"
                >
                  Delete Record
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 10: CERTIFICATES ==================== */}
      {activeTab === 'certificates' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-8">
          <div className="bg-[#111115]/80 border border-white/5 rounded-xl p-6 backdrop-blur-xl h-fit">
            <span className="font-mono text-[10px] text-zinc-500 uppercase block mb-4 border-b border-white/5 pb-2">Academic & Tech Credentials</span>
            <div className="flex flex-col gap-2">
              {certificates.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleEditCertificate(c)}
                  className="w-full text-left p-3.5 rounded-lg font-mono text-[10px] border border-white/5 bg-transparent text-zinc-400 hover:border-zinc-700 hover:text-white transition-all duration-300"
                >
                  <div className="font-semibold uppercase text-white">{c.title}</div>
                  <div className="mt-1 text-[8px] opacity-75">{c.issuer} | {c.score}{c.suffix}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#111115]/80 border border-white/5 rounded-xl p-8 backdrop-blur-xl">
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">Add / Modify Certificate</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Certificate Name</label>
                <input 
                  type="text" 
                  value={certificateForm.title} 
                  onChange={(e) => setCertificateForm({ ...certificateForm, title: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Issuer / Organization</label>
                <input 
                  type="text" 
                  value={certificateForm.issuer} 
                  onChange={(e) => setCertificateForm({ ...certificateForm, issuer: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Credential Date</label>
                <input 
                  type="text" 
                  value={certificateForm.timeline} 
                  onChange={(e) => setCertificateForm({ ...certificateForm, timeline: e.target.value })}
                  placeholder="e.g. 2025"
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Score / Grade</label>
                <input 
                  type="number" 
                  value={certificateForm.score} 
                  onChange={(e) => setCertificateForm({ ...certificateForm, score: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Suffix Symbol (e.g. %, /100, /4.0)</label>
                <input 
                  type="text" 
                  value={certificateForm.suffix} 
                  onChange={(e) => setCertificateForm({ ...certificateForm, suffix: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Short Description</label>
                <textarea 
                  rows={3} 
                  value={certificateForm.description} 
                  onChange={(e) => setCertificateForm({ ...certificateForm, description: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none leading-relaxed"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Display Position</label>
                <input 
                  type="number" 
                  value={certificateForm.position} 
                  onChange={(e) => setCertificateForm({ ...certificateForm, position: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleSaveCertificate}
                className="bg-white text-black font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Save Certificate
              </button>
              {certificateForm.id && (
                <button 
                  onClick={() => handleDeleteCertificate(certificateForm.id)}
                  className="border border-red-500/20 bg-red-950/20 text-red-400 font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-red-900/20 transition-colors"
                >
                  Delete Certificate
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 11: SEO ==================== */}
      {activeTab === 'seo' && (
        <div className="bg-[#111115]/80 border border-white/5 shadow-2xl rounded-xl p-8 backdrop-blur-xl max-w-3xl">
          <h3 className="text-lg font-light mb-6 text-white tracking-tight">Meta SEO Configurations</h3>
          <div className="flex flex-col gap-6 mb-8">
            <div>
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Meta Description Tag</label>
              <textarea 
                rows={3}
                value={seo.metaDescription || ''} 
                onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                placeholder="A compelling summary of your site to display in search index results"
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none leading-relaxed"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Social OpenGraph Image Path (og:image)</label>
              <input 
                type="text" 
                value={seo.ogImage || ''} 
                onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                placeholder="e.g. /uploads/hero_visual.png"
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Twitter Card Type</label>
              <select 
                value={seo.twitterCard || 'summary_large_image'} 
                onChange={(e) => setSeo({ ...seo, twitterCard: e.target.value })}
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
              >
                <option value="summary">Summary Card</option>
                <option value="summary_large_image">Large Image Card (Recommended)</option>
                <option value="app">App Card</option>
              </select>
            </div>
          </div>
          <button 
            onClick={handleSaveSeo}
            className="bg-white text-black font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Save SEO Metadata
          </button>
        </div>
      )}
    </div>
  );
}
