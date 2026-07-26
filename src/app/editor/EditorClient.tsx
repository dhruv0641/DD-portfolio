'use client';

import React, { useState, useTransition } from 'react';
import ThoughtWave from '@/components/ThoughtWave';
import AIPipelineViz from '@/components/AIPipelineViz';
import Certifications from '@/components/Certifications';
import CoreBeliefs from '@/components/CoreBeliefs';
import ArchitectureStory from '@/components/ArchitectureStory';
import SocialCards from '@/components/SocialCards';
import Link from 'next/link';
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
  initializeDatabaseAction,
  saveSkillCategoryAction,
  deleteSkillCategoryAction
} from './actions';

type ModalType = 'profile' | 'project' | 'blog' | 'skill' | 'testimonial' | 'service' | 'experience' | 'education' | 'certificate' | 'seo';

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
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
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

  // --- SETTINGS (Availability, etc.) ---
  const [settings, setSettings] = useState(initialSettings);
  const handleSaveSettings = () => {
    startTransition(async () => {
      const payload = Object.entries(settings).map(([key, value]) => ({ key, value }));
      const res = await saveSettingsAction(payload);
      if (res.success) {
        triggerToast('Availability settings updated!', true);
      } else {
        triggerToast(res.error || 'Failed to update settings.', false);
      }
    });
  };

  // --- PROFILE ---
  const [profile, setProfile] = useState(initialProfile);
  const handleSaveProfile = () => {
    startTransition(async () => {
      const res = await saveProfileAction(profile);
      if (res.success) {
        triggerToast('Profile info updated successfully!', true);
        setActiveModal(null);
        if (res.data) setProfile(res.data);
      } else {
        triggerToast(res.error || 'Failed to update profile.', false);
      }
    });
  };

  // --- PROJECTS ---
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
        const savedItem = {
          ...projectForm,
          id: res.data?.id || projectForm.id,
          techStack: typeof projectForm.techStack === 'string' ? JSON.parse(projectForm.techStack) : projectForm.techStack,
          metrics: typeof projectForm.metrics === 'string' ? JSON.parse(projectForm.metrics) : projectForm.metrics,
          screenshots: typeof projectForm.screenshots === 'string' ? JSON.parse(projectForm.screenshots) : projectForm.screenshots,
          position: parseInt(projectForm.position || '0', 10),
          isFeatured: projectForm.isFeatured,
          isPinned: projectForm.isPinned,
          isDraft: projectForm.isDraft,
        };
        setProjects(prev => {
          if (projectForm.id && !projectForm.id.startsWith('project-') && prev.some(p => p.id === projectForm.id)) {
            return prev.map(p => p.id === projectForm.id ? savedItem : p);
          } else {
            return [...prev, savedItem];
          }
        });
        setActiveModal(null);
      } else {
        triggerToast(res.error || 'Failed to save project.', false);
      }
    });
  };

  const handleDeleteProject = (projId?: string) => {
    const id = projId || projectForm.id;
    if (!id || !confirm('Are you sure you want to delete this project?')) return;
    startTransition(async () => {
      const res = await deleteProjectAction(id);
      if (res.success) {
        triggerToast('Project deleted successfully!', true);
        setProjects(prev => prev.filter(p => p.id !== id));
        setActiveModal(null);
      } else {
        triggerToast(res.error || 'Failed to delete project.', false);
      }
    });
  };

  // --- BLOGS ---
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
        const savedItem = {
          ...blogForm,
          id: res.data?.id || blogForm.id,
          categories: typeof blogForm.categories === 'string' ? JSON.parse(blogForm.categories) : blogForm.categories,
          tags: typeof blogForm.tags === 'string' ? JSON.parse(blogForm.tags) : blogForm.tags,
          readingTime: parseInt(blogForm.readingTime || '5', 10),
          isDraft: blogForm.isDraft,
        };
        setBlogs(prev => {
          if (blogForm.id && !blogForm.id.startsWith('blog-') && prev.some(b => b.id === blogForm.id)) {
            return prev.map(b => b.id === blogForm.id ? savedItem : b);
          } else {
            return [...prev, savedItem];
          }
        });
        setActiveModal(null);
      } else {
        triggerToast(res.error || 'Failed to save blog post.', false);
      }
    });
  };

  const handleDeleteBlog = (blogId?: string) => {
    const id = blogId || blogForm.id;
    if (!id || !confirm('Are you sure you want to delete this blog post?')) return;
    startTransition(async () => {
      const res = await deleteBlogAction(id);
      if (res.success) {
        triggerToast('Blog post deleted successfully!', true);
        setBlogs(prev => prev.filter(b => b.id !== id));
        setActiveModal(null);
      } else {
        triggerToast(res.error || 'Failed to delete blog post.', false);
      }
    });
  };

  // --- SKILLS ---
  const [skills, setSkills] = useState(initialSkills);
  const [categoriesList, setCategoriesList] = useState(skillCategories);
  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
    position: '0',
  });

  const handleNewCategory = () => {
    setCategoryForm({ id: '', name: '', position: '0' });
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name) {
      triggerToast('Please provide a category name.', false);
      return;
    }
    startTransition(async () => {
      const res = await saveSkillCategoryAction(categoryForm);
      if (res.success) {
        triggerToast('Skill group saved successfully!', true);
        const savedItem = {
          ...categoryForm,
          id: res.data?.id || categoryForm.id,
          position: parseInt(categoryForm.position || '0', 10),
        };
        setCategoriesList(prev => {
          if (categoryForm.id && prev.some(c => c.id === categoryForm.id)) {
            return prev.map(c => c.id === categoryForm.id ? { ...c, ...savedItem } : c);
          } else {
            return [...prev, savedItem];
          }
        });
        handleNewCategory();
      } else {
        triggerToast(res.error || 'Failed to save skill group.', false);
      }
    });
  };

  const handleDeleteCategory = (id: string) => {
    if (!confirm('Warning: Deleting a category will also delete all skills inside it. Proceed?')) return;
    startTransition(async () => {
      const res = await deleteSkillCategoryAction(id);
      if (res.success) {
        triggerToast('Skill group deleted successfully!', true);
        setCategoriesList(prev => prev.filter(c => c.id !== id));
        setSkills(prev => prev.filter(s => s.categoryId !== id));
      } else {
        triggerToast(res.error || 'Failed to delete skill group.', false);
      }
    });
  };

  const [skillForm, setSkillForm] = useState({
    id: '',
    name: '',
    proficiency: '80',
    categoryId: skillCategories[0]?.id || '',
    position: '0',
  });

  const handleNewSkill = () => {
    setSkillForm({
      id: '',
      name: '',
      proficiency: '80',
      categoryId: skillCategories[0]?.id || '',
      position: '0',
    });
  };

  const handleSaveSkill = () => {
    startTransition(async () => {
      const res = await saveSkillAction(skillForm);
      if (res.success) {
        triggerToast('Skill saved successfully!', true);
        const savedItem = {
          ...skillForm,
          id: res.data?.id || skillForm.id,
          proficiency: parseInt(skillForm.proficiency || '80', 10),
          position: parseInt(skillForm.position || '0', 10),
        };
        setSkills(prev => {
          if (skillForm.id && !skillForm.id.startsWith('s-') && prev.some(s => s.id === skillForm.id)) {
            return prev.map(s => s.id === skillForm.id ? savedItem : s);
          } else {
            return [...prev, savedItem];
          }
        });
        handleNewSkill();
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
        setSkills(prev => prev.filter(s => s.id !== id));
      } else {
        triggerToast(res.error || 'Failed to delete skill.', false);
      }
    });
  };

  // --- TESTIMONIALS ---
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

  const handleNewTestimonial = () => {
    setTestimonialForm({
      id: '',
      clientName: '',
      clientRole: '',
      clientCompany: '',
      text: '',
      avatarUrl: '',
      position: '0',
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

  const handleSaveTestimonial = () => {
    startTransition(async () => {
      const res = await saveTestimonialAction(testimonialForm);
      if (res.success) {
        triggerToast('Testimonial saved successfully!', true);
        const savedItem = {
          ...testimonialForm,
          id: res.data?.id || testimonialForm.id,
          position: parseInt(testimonialForm.position || '0', 10),
        };
        setTestimonials(prev => {
          if (testimonialForm.id && !testimonialForm.id.startsWith('test-') && prev.some(t => t.id === testimonialForm.id)) {
            return prev.map(t => t.id === testimonialForm.id ? savedItem : t);
          } else {
            return [...prev, savedItem];
          }
        });
        setActiveModal(null);
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
        setTestimonials(prev => prev.filter(t => t.id !== id));
      } else {
        triggerToast(res.error || 'Failed to delete testimonial.', false);
      }
    });
  };

  // --- SERVICES ---
  const [services, setServices] = useState(initialServices);
  const [serviceForm, setServiceForm] = useState({
    id: '',
    name: '',
    description: '',
    icon: 'CodeXml',
    position: '0',
  });

  const handleNewService = () => {
    setServiceForm({
      id: '',
      name: '',
      description: '',
      icon: 'CodeXml',
      position: '0',
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

  const handleSaveService = () => {
    startTransition(async () => {
      const res = await saveServiceAction(serviceForm);
      if (res.success) {
        triggerToast('Service saved successfully!', true);
        const savedItem = {
          ...serviceForm,
          id: res.data?.id || serviceForm.id,
          position: parseInt(serviceForm.position || '0', 10),
        };
        setServices(prev => {
          if (serviceForm.id && !serviceForm.id.startsWith('service-') && prev.some(s => s.id === serviceForm.id)) {
            return prev.map(s => s.id === serviceForm.id ? savedItem : s);
          } else {
            return [...prev, savedItem];
          }
        });
        setActiveModal(null);
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
        setServices(prev => prev.filter(s => s.id !== id));
      } else {
        triggerToast(res.error || 'Failed to delete service.', false);
      }
    });
  };

  // --- EXPERIENCE ---
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

  const handleNewExperience = () => {
    setExperienceForm({
      id: '',
      company: '',
      role: '',
      timeline: '',
      location: '',
      description: '',
      position: '0',
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

  const handleSaveExperience = () => {
    startTransition(async () => {
      const res = await saveExperienceAction(experienceForm);
      if (res.success) {
        triggerToast('Experience saved successfully!', true);
        const savedItem = {
          ...experienceForm,
          id: res.data?.id || experienceForm.id,
          position: parseInt(experienceForm.position || '0', 10),
        };
        setExperiences(prev => {
          if (experienceForm.id && !experienceForm.id.startsWith('exp-') && prev.some(e => e.id === experienceForm.id)) {
            return prev.map(e => e.id === experienceForm.id ? savedItem : e);
          } else {
            return [...prev, savedItem];
          }
        });
        setActiveModal(null);
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
        setExperiences(prev => prev.filter(e => e.id !== id));
        setActiveModal(null);
      } else {
        triggerToast(res.error || 'Failed to delete experience.', false);
      }
    });
  };

  // --- EDUCATION ---
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

  const handleNewEducation = () => {
    setEducationForm({
      id: '',
      institution: '',
      degree: '',
      fieldOfStudy: '',
      period: '',
      description: '',
      gpa: '',
      position: '0',
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

  const handleSaveEducation = () => {
    startTransition(async () => {
      const res = await saveEducationAction(educationForm);
      if (res.success) {
        triggerToast('Education saved successfully!', true);
        const savedItem = {
          ...educationForm,
          id: res.data?.id || educationForm.id,
          position: parseInt(educationForm.position || '0', 10),
        };
        setEducations(prev => {
          if (educationForm.id && !educationForm.id.startsWith('edu-') && prev.some(e => e.id === educationForm.id)) {
            return prev.map(e => e.id === educationForm.id ? savedItem : e);
          } else {
            return [...prev, savedItem];
          }
        });
        setActiveModal(null);
      } else {
        triggerToast(res.error || 'Failed to save education record.', false);
      }
    });
  };

  const handleDeleteEducation = (id: string) => {
    if (!confirm('Are you sure you want to delete this education?')) return;
    startTransition(async () => {
      const res = await deleteEducationAction(id);
      if (res.success) {
        triggerToast('Education deleted successfully!', true);
        setEducations(prev => prev.filter(e => e.id !== id));
      } else {
        triggerToast(res.error || 'Failed to delete education record.', false);
      }
    });
  };

  // --- CERTIFICATES ---
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

  const handleNewCertificate = () => {
    setCertificateForm({
      id: '',
      title: '',
      issuer: '',
      timeline: '',
      score: '100',
      suffix: '%',
      description: '',
      position: '0',
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

  const handleSaveCertificate = () => {
    startTransition(async () => {
      const res = await saveCertificateAction(certificateForm);
      if (res.success) {
        triggerToast('Certificate saved successfully!', true);
        const savedItem = {
          ...certificateForm,
          id: res.data?.id || certificateForm.id,
          score: parseInt(certificateForm.score || '100', 10),
          position: parseInt(certificateForm.position || '0', 10),
        };
        setCertificates(prev => {
          if (certificateForm.id && !certificateForm.id.startsWith('cert-') && prev.some(c => c.id === certificateForm.id)) {
            return prev.map(c => c.id === certificateForm.id ? savedItem : c);
          } else {
            return [...prev, savedItem];
          }
        });
        setActiveModal(null);
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
        setCertificates(prev => prev.filter(c => c.id !== id));
      } else {
        triggerToast(res.error || 'Failed to delete certificate.', false);
      }
    });
  };

  // --- SEO ---
  const [seo, setSeo] = useState(initialSeo);
  const handleSaveSeo = () => {
    startTransition(async () => {
      const res = await saveSeoAction(seo);
      if (res.success) {
        triggerToast('SEO metadata saved successfully!', true);
        setActiveModal(null);
        if (res.data) setSeo(res.data);
      } else {
        triggerToast(res.error || 'Failed to save SEO metadata.', false);
      }
    });
  };

  // --- DATABASE INITIALIZER ---
  const handleInitializeDatabase = () => {
    if (!confirm('This will reset your database to default settings, projects, essays, and layouts. Proceed?')) return;
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

  const bio = settings.bio || 'Applied AI Systems Architect.';
  const availability = settings.status || 'AVAILABLE FOR NEW WORK';
  const dbProjects = projects.filter(p => !p.isDraft);
  const dbPosts = blogs.filter(b => !b.isDraft);

  // Group skills by category for visual mapping
  const skillCategoriesMap = categoriesList.map(cat => ({
    ...cat,
    skills: skills.filter(s => s.categoryId === cat.id)
  }));

  return (
    <div className="relative min-h-screen bg-[#090909] text-[#F5F5F5] font-sans selection:bg-[var(--accent)] selection:text-white pb-32">
      
      {/* Flat static admin controls panel (not fixed, scrolls with page) */}
      <div className="max-w-[1400px] mx-auto px-[8%] pt-8 pb-4 relative z-20 flex flex-col md:flex-row items-center justify-between border-b border-white/5 gap-4">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-white">CMS Customizer Console</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setActiveModal('profile')}
            className="border border-white/5 bg-[#0f0f13] hover:border-white/20 text-zinc-400 hover:text-white px-3 py-1.5 rounded font-mono text-[9px] uppercase tracking-wider transition-colors duration-150"
          >
            👤 Hero & Bio
          </button>
          <button 
            onClick={() => setActiveModal('seo')}
            className="border border-white/5 bg-[#0f0f13] hover:border-white/20 text-zinc-400 hover:text-white px-3 py-1.5 rounded font-mono text-[9px] uppercase tracking-wider transition-colors duration-150"
          >
            🔍 SEO Tags
          </button>
          <button 
            onClick={() => { handleNewSkill(); setActiveModal('skill'); }}
            className="border border-white/5 bg-[#0f0f13] hover:border-white/20 text-zinc-400 hover:text-white px-3 py-1.5 rounded font-mono text-[9px] uppercase tracking-wider transition-colors duration-150"
          >
            🛠️ Skills DB
          </button>
          <span className="h-3 w-[1px] bg-white/10 mx-1" />
          <button 
            onClick={() => { handleNewProject(); setActiveModal('project'); }}
            className="border border-emerald-500/20 bg-emerald-950/20 hover:border-emerald-500 text-emerald-400 hover:text-white px-3 py-1.5 rounded font-mono text-[9px] uppercase tracking-wider transition-colors duration-150"
          >
            ➕ Project
          </button>
          <button 
            onClick={() => { handleNewBlog(); setActiveModal('blog'); }}
            className="border border-emerald-500/20 bg-emerald-950/20 hover:border-emerald-500 text-emerald-400 hover:text-white px-3 py-1.5 rounded font-mono text-[9px] uppercase tracking-wider transition-colors duration-150"
          >
            📝 Essay
          </button>
          <span className="h-3 w-[1px] bg-white/10 mx-1" />
          <button 
            onClick={handleInitializeDatabase}
            className="border border-amber-500/20 bg-amber-950/20 hover:border-amber-500 text-amber-400 hover:text-white px-3 py-1.5 rounded font-mono text-[9px] uppercase tracking-wider transition-colors duration-150"
          >
            🔄 Sync Defaults
          </button>
          <button 
            onClick={handleLogout}
            className="border border-red-500/20 bg-red-950/20 hover:border-red-500 text-red-400 hover:text-white px-3 py-1.5 rounded font-mono text-[9px] uppercase tracking-wider transition-colors duration-150"
          >
            🚪 Sign Out
          </button>
        </div>
      </div>

      {/* Editorial Grid Lines */}
      <div className="fixed inset-0 pointer-events-none max-w-[1600px] mx-auto px-[8%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 z-0 opacity-15">
        <div className="border-r border-white/5 border-l h-full" />
        <div className="border-r border-white/5 h-full hidden md:block" />
        <div className="border-r border-white/5 h-full hidden lg:block" />
        <div className="border-r border-white/5 h-full hidden lg:block" />
      </div>

      {/* Dynamic Saving Indicator overlay */}
      {isPending && (
        <div className="fixed top-20 right-[8%] z-50 bg-[#111115] border border-white/5 px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-3 font-mono text-[10px] text-white">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
          <span>UPDATING DATABASE...</span>
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

      {/* SECTION 1: HERO (WITH EDIT HOVER HIGHLIGHT) */}
      <section id="intro" className="min-h-screen flex items-center pt-[140px] pb-24 border-b border-[var(--grid-line)] relative overflow-hidden group/hero hover:outline hover:outline-dashed hover:outline-[var(--accent)]/30 rounded-xl m-2">
        <div className="absolute top-[20%] left-[50%] -translate-x-[50%] w-[500px] h-[500px] rounded-full bg-[rgba(var(--accent-rgb),0.05)] blur-[120px] pointer-events-none z-0" />
        
        {/* Floating section modifier overlay */}
        <div className="absolute top-4 right-8 opacity-0 group-hover/hero:opacity-100 transition-opacity z-20 flex gap-2">
          <button 
            onClick={() => setActiveModal('profile')}
            className="bg-[#111115] border border-white/10 hover:border-white rounded px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-white flex items-center gap-1.5 shadow-md font-semibold"
          >
            ✏️ Edit Hero Info
          </button>
        </div>

        <div className="max-w-[1400px] mx-auto px-[8%] w-full relative z-10">
          <div className="max-w-[950px] flex flex-col gap-8">
            <div className="w-fit flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.03)] bg-[#0c0c0e] font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{availability}</span>
            </div>

            <h1 className="text-[clamp(2.5rem,7.5vw,6rem)] font-light leading-[1.05] tracking-tight text-white">
              Designing <span className="serif-italic text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-zinc-400">deterministic</span> workflows <br />for AI agents.
            </h1>

            <p className="text-[clamp(1.1rem,2vw,1.4rem)] text-[var(--text-muted)] max-w-[680px] leading-[1.6] font-light">
              {bio}
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              <a href="#work" className="bg-white text-black text-xs font-mono uppercase tracking-widest px-8 py-4 rounded-lg hover:bg-gray-200 transition-all font-semibold">
                Explore Case Studies
              </a>
              <a href="#build" className="border border-[rgba(255,255,255,0.08)] bg-[#0d0d10] text-white text-xs font-mono uppercase tracking-widest px-8 py-4 rounded-lg hover:bg-gray-900 transition-all">
                Let&apos;s Build Together
              </a>
            </div>
          </div>
          <div className="absolute right-0 top-[20%] opacity-20 pointer-events-none lg:opacity-100">
            <ThoughtWave />
          </div>
        </div>
      </section>

      {/* SECTION 2: IDENTITY */}
      <section id="identity" className="py-40 border-b border-[var(--grid-line)] relative group/about hover:outline hover:outline-dashed hover:outline-[var(--accent)]/30 rounded-xl m-2">
        <div className="absolute top-4 right-8 opacity-0 group-hover/about:opacity-100 transition-opacity z-20">
          <button 
            onClick={() => setActiveModal('profile')}
            className="bg-[#111115] border border-white/10 hover:border-white rounded px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-white shadow-md font-semibold"
          >
            ✏️ Edit Identity Details
          </button>
        </div>
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-12 flex items-center gap-2">
            <span>01 / About</span>
            <div className="flex-1 h-[1px] bg-[var(--grid-line)]" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-20">
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-[1.2] font-light text-white tracking-tight">
              Building software <br /><span className="serif-italic text-[var(--text-muted)]">that solves real problems.</span>
            </h2>
            <div className="flex flex-col gap-8">
              <p className="text-[var(--text-muted)] text-[1.1rem] leading-[1.7] font-light font-sans">
                {profile.bio || 'Professional biography details loaded dynamically.'}
              </p>
            </div>
          </div>
          <CoreBeliefs />
        </div>
      </section>

      {/* SECTION 3: PROJECTS SHOWCASE */}
      <section id="work" className="py-40 border-b border-[var(--grid-line)] relative">
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-20 flex items-center gap-2">
            <span>02 / Featured Projects</span>
            <div className="flex-1 h-[1px] bg-[var(--grid-line)]" />
            <button 
              onClick={() => { handleNewProject(); setActiveModal('project'); }}
              className="ml-4 border border-emerald-500/20 bg-emerald-950/20 hover:border-emerald-500 text-emerald-400 hover:text-white px-3.5 py-1.5 rounded font-mono text-[9px] uppercase tracking-wider transition-colors duration-200 font-semibold"
            >
              ➕ Add New Project
            </button>
          </div>

          <div className="flex flex-col gap-40">
            {dbProjects.map((project, index) => {
              const isEven = index % 2 === 0;
              const metrics: Array<{ value: string; label: string }> = typeof project.metrics === 'string' ? JSON.parse(project.metrics || '[]') : (project.metrics || []);
              const images: string[] = typeof project.screenshots === 'string' ? JSON.parse(project.screenshots || '[]') : (project.screenshots || []);
              const projectImg = images[0] || '/uploads/hero_visual.png';

              return (
                <div
                  key={project.id}
                  className={`grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-24 items-center relative group/proj-card hover:outline hover:outline-dashed hover:outline-[var(--accent)]/30 p-6 rounded-2xl ${!isEven ? 'lg:grid-cols-[1fr_1.1fr]' : ''}`}
                >
                  {/* Floating Project Controls */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover/proj-card:opacity-100 transition-opacity z-20 flex gap-2">
                    <button 
                      onClick={() => { handleSelectProject(project); setActiveModal('project'); }}
                      className="bg-[#111115] border border-white/10 hover:border-white rounded px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-wider text-white font-semibold"
                    >
                      ✏️ Edit Project
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(project.id)}
                      className="bg-red-950/30 border border-red-500/20 hover:border-red-500 text-red-400 rounded px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-wider font-semibold"
                    >
                      🗑️ Delete
                    </button>
                  </div>

                  {isEven && (
                    <div className="project-visual group rounded-2xl border border-[var(--grid-line)] overflow-hidden bg-[#0d0d10] aspect-[16/10] relative">
                      <img src={projectImg} alt={project.title} className="w-full h-full object-cover opacity-80" />
                    </div>
                  )}

                  <div className="flex flex-col gap-6">
                    <div className="font-mono text-[10px] text-[var(--text-dim)] flex gap-4 uppercase">
                      <span>0{index + 1} / {project.subtitle}</span>
                      <span>•</span>
                      <span>{project.timeline}</span>
                      {project.isDraft && <span className="text-amber-400 border border-amber-500/30 px-1 rounded text-[8px]">DRAFT</span>}
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-light text-white tracking-tight">{project.title}</h3>
                    <p className="text-[var(--text-muted)] leading-[1.7] font-light text-sm lg:text-base">
                      {project.problem}
                    </p>

                    <div className="grid grid-cols-2 gap-8 border-t border-[var(--grid-line)] pt-6 mt-2">
                      {metrics.slice(0, 2).map((m, idx) => (
                        <div key={idx}>
                          <div className="font-mono text-2xl text-white font-medium">{m.value}</div>
                          <div className="text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-wider">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {!isEven && (
                    <div className="project-visual group rounded-2xl border border-[var(--grid-line)] overflow-hidden bg-[#0d0d10] aspect-[16/10] relative lg:order-last order-first">
                      <img src={projectImg} alt={project.title} className="w-full h-full object-cover opacity-80" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: CASE STUDY */}
      <section id="case" className="py-40 border-b border-[var(--grid-line)]">
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
            <span>03 / Engineering Case Study</span>
            <div className="flex-1 h-[1px] bg-[var(--grid-line)]" />
          </div>
          <ArchitectureStory />
        </div>
      </section>

      {/* SECTION 5: SKILLS CONSOLE */}
      <section className="py-40 border-b border-[var(--grid-line)] relative group/skills hover:outline hover:outline-dashed hover:outline-[var(--accent)]/30 rounded-xl m-2">
        <div className="absolute top-4 right-8 opacity-0 group-hover/skills:opacity-100 transition-opacity z-20">
          <button 
            onClick={() => { handleNewSkill(); setActiveModal('skill'); }}
            className="bg-[#111115] border border-white/10 hover:border-white rounded px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-white shadow-md font-semibold"
          >
            🛠️ Manage Skills List
          </button>
        </div>
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
            <span>04 / Technical Skills</span>
            <div className="flex-1 h-[1px] bg-[var(--grid-line)]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {skillCategoriesMap.map((cat) => (
              <div key={cat.id} className="bg-[#09090b] border border-[var(--grid-line)] rounded-xl p-8 flex flex-col gap-6">
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">{cat.name}</span>
                <div className="flex flex-col gap-4">
                  {cat.skills.map((skill: any) => (
                    <div key={skill.id} className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white font-medium">{skill.name}</span>
                        <span className="font-mono text-gray-500">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full bg-[#131317] h-1 rounded-full overflow-hidden">
                        <div className="bg-white h-full" style={{ width: `${skill.proficiency}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: Timelines (Experience & Education) */}
      <section className="py-40 border-b border-[var(--grid-line)]">
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            
            {/* Experience timeline list */}
            <div className="relative group/experience hover:outline hover:outline-dashed hover:outline-[var(--accent)]/30 p-6 rounded-xl">
              <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
                <span>05.1 / Experience</span>
                <div className="flex-1 h-[1px] bg-[var(--grid-line)]" />
                <button 
                  onClick={() => { handleNewExperience(); setActiveModal('experience'); }}
                  className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 hover:text-white px-2.5 py-0.5 rounded font-mono text-[8px] uppercase tracking-wider transition-colors duration-200 font-semibold"
                >
                  ➕ Add
                </button>
              </div>

              <div className="flex flex-col gap-10 border-l border-[var(--grid-line)] pl-8">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative flex flex-col gap-2 group/exp-card p-3 rounded hover:bg-white/[0.01]">
                    <div className="absolute right-0 top-0 opacity-0 group-hover/exp-card:opacity-100 transition-opacity z-20 flex gap-2">
                      <button onClick={() => { handleEditExperience(exp); setActiveModal('experience'); }} className="text-white hover:underline text-[9px] font-mono font-semibold">EDIT</button>
                      <button onClick={() => handleDeleteExperience(exp.id)} className="text-red-400 hover:text-red-300 text-[9px] font-mono font-semibold">DELETE</button>
                    </div>
                    <div className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-[#050506] border-2 border-[var(--accent)] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#fafafa]" />
                    </div>
                    <span className="font-mono text-[10px] text-[var(--accent)] uppercase">{exp.timeline}</span>
                    <h3 className="text-lg font-medium text-white">{exp.role}</h3>
                    <span className="text-xs text-[var(--text-muted)] font-mono uppercase">{exp.company}</span>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed font-light mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education timeline list */}
            <div className="relative group/education hover:outline hover:outline-dashed hover:outline-[var(--accent)]/30 p-6 rounded-xl">
              <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
                <span>05.2 / Education</span>
                <div className="flex-1 h-[1px] bg-[var(--grid-line)]" />
                <button 
                  onClick={() => { handleNewEducation(); setActiveModal('education'); }}
                  className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 hover:text-white px-2.5 py-0.5 rounded font-mono text-[8px] uppercase tracking-wider transition-colors duration-200 font-semibold"
                >
                  ➕ Add
                </button>
              </div>

              <div className="flex flex-col gap-10 border-l border-[var(--grid-line)] pl-8">
                {educations.map((edu) => (
                  <div key={edu.id} className="relative flex flex-col gap-2 group/edu-card p-3 rounded hover:bg-white/[0.01]">
                    <div className="absolute right-0 top-0 opacity-0 group-hover/edu-card:opacity-100 transition-opacity z-20 flex gap-2">
                      <button onClick={() => { handleEditEducation(edu); setActiveModal('education'); }} className="text-white hover:underline text-[9px] font-mono font-semibold">EDIT</button>
                      <button onClick={() => handleDeleteEducation(edu.id)} className="text-red-400 hover:text-red-300 text-[9px] font-mono font-semibold">DELETE</button>
                    </div>
                    <div className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-[#050506] border-2 border-zinc-700 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                    </div>
                    <span className="font-mono text-[10px] text-gray-500 uppercase">{edu.timeline || edu.period}</span>
                    <h3 className="text-lg font-medium text-white">{edu.degree}</h3>
                    <span className="text-xs text-[var(--text-muted)] font-mono uppercase">{edu.institution}</span>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed font-light mt-2">{edu.description}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7: What I Build (Services) */}
      <section className="py-40 border-b border-[var(--grid-line)] relative group/services hover:outline hover:outline-dashed hover:outline-[var(--accent)]/20 p-6 rounded-xl m-2">
        <div className="absolute top-4 right-8 opacity-0 group-hover/services:opacity-100 transition-opacity z-20">
          <button 
            onClick={() => { handleNewService(); setActiveModal('service'); }}
            className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 hover:text-white px-3 py-1.5 rounded font-mono text-[9px] uppercase tracking-wider transition-colors duration-200 font-semibold"
          >
            ➕ Add Service Card
          </button>
        </div>
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
            <span>06 / What I Build</span>
            <div className="flex-1 h-[1px] bg-[var(--grid-line)]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((srv) => (
              <div key={srv.id} className="bg-[#09090b] border border-[var(--grid-line)] rounded-xl p-8 flex flex-col justify-between min-h-[220px] relative group/srv-card hover:border-[var(--accent)]/40 transition-all duration-300">
                <div className="absolute top-2 right-2 opacity-0 group-hover/srv-card:opacity-100 transition-opacity z-20 flex gap-2">
                  <button onClick={() => { handleEditService(srv); setActiveModal('service'); }} className="text-white text-[8px] font-mono border border-white/10 px-1.5 py-0.5 rounded bg-zinc-900 font-semibold">EDIT</button>
                  <button onClick={() => handleDeleteService(srv.id)} className="text-red-400 text-[8px] font-mono border border-red-500/10 px-1.5 py-0.5 rounded bg-zinc-900 font-semibold">DEL</button>
                </div>
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[rgba(var(--accent-rgb),0.05)] border border-[rgba(var(--accent-rgb),0.1)] flex items-center justify-center text-[var(--accent)] font-mono text-xs uppercase mb-6 font-semibold">
                    {srv.icon?.slice(0, 3).toUpperCase() || 'SRV'}
                  </div>
                  <h3 className="text-lg font-medium text-white mb-3">{srv.name}</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed font-light">{srv.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: CLIENT TESTIMONIALS */}
      <section className="py-40 border-b border-[var(--grid-line)] relative group/testimonials hover:outline hover:outline-dashed hover:outline-[var(--accent)]/20 p-6 rounded-xl m-2">
        <div className="absolute top-4 right-8 opacity-0 group-hover/testimonials:opacity-100 transition-opacity z-20">
          <button 
            onClick={() => { handleNewTestimonial(); setActiveModal('testimonial'); }}
            className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 hover:text-white px-3 py-1.5 rounded font-mono text-[9px] uppercase tracking-wider transition-colors duration-200 font-semibold"
          >
            ➕ Add Recommendation
          </button>
        </div>
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
            <span>07 / Recommendations</span>
            <div className="flex-1 h-[1px] bg-[var(--grid-line)]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-[#09090b] border border-[var(--grid-line)] rounded-xl p-8 flex flex-col justify-between gap-8 relative group/test-card hover:border-[var(--accent)]/40 transition-all duration-300">
                <div className="absolute top-2 right-2 opacity-0 group-hover/test-card:opacity-100 transition-opacity z-20 flex gap-2">
                  <button onClick={() => { handleEditTestimonial(t); setActiveModal('testimonial'); }} className="text-white text-[8px] font-mono border border-white/10 px-1.5 py-0.5 rounded bg-zinc-900 font-semibold">EDIT</button>
                  <button onClick={() => handleDeleteTestimonial(t.id)} className="text-red-400 text-[8px] font-mono border border-red-500/10 px-1.5 py-0.5 rounded bg-zinc-900 font-semibold">DEL</button>
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed italic font-light font-sans">
                  &quot;{t.text}&quot;
                </p>
                <div className="flex items-center gap-3">
                  {t.avatarUrl ? (
                    <img src={t.avatarUrl} alt={t.clientName} className="w-10 h-10 rounded-full object-cover bg-zinc-800" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-mono text-[10px] text-gray-500">C</div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">{t.clientName}</span>
                    <span className="text-[10px] text-[var(--text-dim)] font-mono uppercase">{t.clientRole} at {t.clientCompany}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: AI PIPELINE SIMULATOR */}
      <section id="thinking" className="py-40 border-b border-[var(--grid-line)]">
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-8 flex items-center gap-2">
            <span>08 / Engineering Process</span>
            <div className="flex-1 h-[1px] bg-[var(--grid-line)]" />
          </div>
          <AIPipelineViz />
        </div>
      </section>

      {/* SECTION 10: CERTIFICATIONS */}
      <section id="certifications" className="py-40 border-b border-[var(--grid-line)] relative group/certs hover:outline hover:outline-dashed hover:outline-[var(--accent)]/20 p-6 rounded-xl m-2">
        <div className="absolute top-4 right-8 opacity-0 group-hover/certs:opacity-100 transition-opacity z-20">
          <button 
            onClick={() => { handleNewCertificate(); setActiveModal('certificate'); }}
            className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 hover:text-white px-3 py-1.5 rounded font-mono text-[9px] uppercase tracking-wider transition-colors duration-200 font-semibold"
          >
            ➕ Add Certificate
          </button>
        </div>
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
            <span>09 / Certifications</span>
            <div className="flex-1 h-[1px] bg-[var(--grid-line)]" />
          </div>
          <div className="relative group/cert-inside">
            <Certifications initialCertificates={certificates} />
            
            {/* List Certificates with actions for direct editing */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-white/5 pt-8">
              {certificates.map(c => (
                <div key={c.id} className="border border-white/5 bg-[#09090b] rounded-lg p-4 flex justify-between items-center text-xs">
                  <div>
                    <div className="text-white font-mono uppercase truncate font-semibold">{c.title}</div>
                    <div className="text-[10px] text-zinc-500">{c.issuer} • Score: {c.score}{c.suffix}</div>
                  </div>
                  <div className="flex gap-2.5">
                    <button onClick={() => { handleEditCertificate(c); setActiveModal('certificate'); }} className="text-white hover:underline text-[9px] font-mono font-semibold">EDIT</button>
                    <button onClick={() => handleDeleteCertificate(c.id)} className="text-red-400 hover:text-red-300 text-[9px] font-mono font-semibold font-semibold">DEL</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: WRITING */}
      <section id="writing" className="py-40 border-b border-[var(--grid-line)] relative group/blogs hover:outline hover:outline-dashed hover:outline-[var(--accent)]/20 p-6 rounded-xl m-2">
        <div className="absolute top-4 right-8 opacity-0 group-hover/blogs:opacity-100 transition-opacity z-20">
          <button 
            onClick={() => { handleNewBlog(); setActiveModal('blog'); }}
            className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 hover:text-white px-3 py-1.5 rounded font-mono text-[9px] uppercase tracking-wider transition-colors duration-200 font-semibold"
          >
            ➕ Write Essay
          </button>
        </div>
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
            <span>10 / Technical Writing</span>
            <div className="flex-1 h-[1px] bg-[var(--grid-line)]" />
          </div>

          <div className="flex flex-col">
            {dbPosts.map((post) => {
              const categories: string[] = typeof post.categories === 'string' ? JSON.parse(post.categories || '[]') : (post.categories || []);
              return (
                <div
                  key={post.id}
                  className="grid grid-cols-[1fr_3fr_1fr] items-center py-10 border-t border-[var(--grid-line)] hover:pl-5 group/blog-row transition-all duration-300 ease-out last:border-b relative"
                >
                  <div className="font-mono text-xs text-[var(--text-dim)] flex items-center gap-2">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase() : 'DRAFT'}
                    {post.isDraft && <span className="text-amber-400 border border-amber-500/20 rounded px-1 text-[8px] uppercase">DRAFT</span>}
                  </div>
                  <div className="text-xl text-white group-hover/blog-row:text-[var(--accent)] transition-colors duration-300 font-light flex items-center justify-between">
                    <span>{post.title}</span>
                    <div className="opacity-0 group-hover/blog-row:opacity-100 transition-opacity z-20 flex gap-3 text-right pr-6">
                      <button onClick={() => { handleSelectBlog(post); setActiveModal('blog'); }} className="text-white border border-white/10 px-2 py-0.5 rounded bg-[#09090b] text-[9px] font-mono font-semibold">EDIT</button>
                      <button onClick={() => handleDeleteBlog(post.id)} className="text-red-400 border border-red-500/20 px-2 py-0.5 rounded bg-[#09090b] text-[9px] font-mono font-semibold">DEL</button>
                    </div>
                  </div>
                  <div className="font-mono text-[10px] text-[var(--text-dim)] text-right">
                    {categories.join(' & ').toUpperCase()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 12: CONTACT */}
      <section id="build" className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 80%, rgba(var(--accent-rgb), 0.04) 0%, transparent 70%)' }} />
        <div className="max-w-[1400px] mx-auto px-[8%] relative z-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-20 flex items-center gap-2">
            <span>11 / Contact</span>
            <div className="flex-1 h-[1px] bg-[var(--grid-line)]" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-24">
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-[clamp(2.2rem,4.5vw,3.8rem)] mb-10 font-light leading-[1.15] tracking-tight">
                  <span className="text-white">Let&apos;s build software</span>
                  <br />
                  <span className="serif-italic text-[var(--text-muted)]">that solves real problems.</span>
                </h3>
              </div>
              <div className="flex flex-col gap-5 font-mono text-xs">
                <div className="flex items-center gap-3 text-[var(--text-muted)]">
                  <span>{settings.contactEmail || 'dhruv.dobariya0641@gmail.com'}</span>
                </div>
                <SocialCards />
              </div>
            </div>
            <div className="bg-[#09090b] border border-white/5 rounded-xl p-8 font-mono text-xs text-zinc-500 flex items-center justify-center min-h-[300px]">
              $ CONTACT FORM PREVIEW INACTIVE IN ADMIN CUSTOMIZER
            </div>
          </div>
        </div>
      </section>


      {/* ==================== OVERLAY CUSTOMIZER MODALS ==================== */}

      {activeModal === 'profile' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#111115] border border-white/5 rounded-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white font-mono text-xs">✕ CLOSE</button>
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">Edit Profile & Hero Identity</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Availability Status</label>
                <input 
                  type="text" 
                  value={settings.status || ''} 
                  onChange={(e) => setSettings({ ...settings, status: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none font-mono"
                />
              </div>
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
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Resume / Document URL</label>
                <input 
                  type="text" 
                  value={profile.resumeUrl || ''} 
                  onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">GitHub Profile URL</label>
                <input 
                  type="text" 
                  value={settings.githubUrl || ''} 
                  onChange={(e) => setSettings({ ...settings, githubUrl: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">LinkedIn Profile URL</label>
                <input 
                  type="text" 
                  value={settings.linkedinUrl || ''} 
                  onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Instagram Profile URL</label>
                <input 
                  type="text" 
                  value={settings.instagramUrl || ''} 
                  onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none font-mono"
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
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Biography Paragraph</label>
                <textarea 
                  rows={4}
                  value={profile.bio || ''} 
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none leading-relaxed"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => { handleSaveProfile(); handleSaveSettings(); }} className="bg-white text-black font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Save Hero & Bio Details
              </button>
              <button onClick={() => setActiveModal(null)} className="border border-white/5 text-zinc-400 font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-white/5 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'project' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#111115] border border-white/5 rounded-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white font-mono text-xs">✕ CLOSE</button>
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">
              {selectedProject ? `Modify Case Study: ${selectedProject.title}` : 'Draft New Project Case Study'}
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
                  rows={2} 
                  value={projectForm.problem} 
                  onChange={(e) => setProjectForm({ ...projectForm, problem: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">The Architecture Challenge</label>
                <textarea 
                  rows={2} 
                  value={projectForm.challenge} 
                  onChange={(e) => setProjectForm({ ...projectForm, challenge: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">The Solution Implementation</label>
                <textarea 
                  rows={2} 
                  value={projectForm.solution} 
                  onChange={(e) => setProjectForm({ ...projectForm, solution: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">GitHub URL</label>
                <input 
                  type="text" 
                  value={projectForm.githubUrl} 
                  onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Demo / Live URL</label>
                <input 
                  type="text" 
                  value={projectForm.demoUrl} 
                  onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
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
                  <input type="checkbox" checked={projectForm.isFeatured} onChange={(e) => setProjectForm({ ...projectForm, isFeatured: e.target.checked })} className="accent-[var(--accent)]" />
                  Featured Case Study
                </label>
                <label className="flex items-center gap-2 font-mono text-[10px] text-white">
                  <input type="checkbox" checked={projectForm.isPinned} onChange={(e) => setProjectForm({ ...projectForm, isPinned: e.target.checked })} className="accent-[var(--accent)]" />
                  Pinned in Home Grid
                </label>
                <label className="flex items-center gap-2 font-mono text-[10px] text-white">
                  <input type="checkbox" checked={projectForm.isDraft} onChange={(e) => setProjectForm({ ...projectForm, isDraft: e.target.checked })} className="accent-[var(--accent)]" />
                  Save as Draft
                </label>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={handleSaveProject} className="bg-white text-black font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Save Case Study
              </button>
              {selectedProject && (
                <button onClick={() => handleDeleteProject()} className="border border-red-500/20 bg-red-950/20 text-red-400 font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-red-900/20 transition-colors">
                  Delete
                </button>
              )}
              <button onClick={() => setActiveModal(null)} className="border border-white/5 text-zinc-400 font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-white/5 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'blog' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#111115] border border-white/5 rounded-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white font-mono text-xs">✕ CLOSE</button>
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">
              {selectedBlog ? `Modify Essay: ${selectedBlog.title}` : 'Draft New Essay Journal'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Essay Title</label>
                <input type="text" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none" />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Slug (URL Path)</label>
                <input type="text" value={blogForm.slug} onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none" />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Reading Time (Minutes)</label>
                <input type="number" value={blogForm.readingTime} onChange={(e) => setBlogForm({ ...blogForm, readingTime: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none" />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Categories (JSON list)</label>
                <input type="text" value={blogForm.categories} onChange={(e) => setBlogForm({ ...blogForm, categories: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs font-mono text-white focus:outline-none" />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Tags (JSON list)</label>
                <input type="text" value={blogForm.tags} onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs font-mono text-white focus:outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Article Body Content (Markdown)</label>
                <textarea rows={8} value={blogForm.contentMarkdown} onChange={(e) => setBlogForm({ ...blogForm, contentMarkdown: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-4 text-xs font-mono text-white focus:outline-none leading-relaxed" />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 font-mono text-[10px] text-white">
                  <input type="checkbox" checked={blogForm.isDraft} onChange={(e) => setBlogForm({ ...blogForm, isDraft: e.target.checked })} className="accent-[var(--accent)]" />
                  Save as Draft (Unpublished)
                </label>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={handleSaveBlog} className="bg-white text-black font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Save Essay
              </button>
              {selectedBlog && (
                <button onClick={() => handleDeleteBlog()} className="border border-red-500/20 bg-red-950/20 text-red-400 font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-red-900/20 transition-colors">
                  Delete
                </button>
              )}
              <button onClick={() => setActiveModal(null)} className="border border-white/5 text-zinc-400 font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-white/5 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'skill' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#111115] border border-white/5 rounded-xl max-w-5xl w-full p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white font-mono text-xs">✕ CLOSE</button>
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">Technical Skills Console</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Column 1: Manage Skill Categories */}
              <div className="flex flex-col gap-4 border-r border-white/5 pr-6">
                <span className="block font-mono text-[9px] text-zinc-500 uppercase pb-2 border-b border-white/5">1. Skill Categories</span>
                
                <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto">
                  {categoriesList.map(cat => (
                    <div key={cat.id} className="flex justify-between items-center text-[10px] font-mono text-zinc-300 py-1.5 border-b border-white/5 last:border-b-0 group/cat-row">
                      <span className="text-white truncate font-medium">{cat.name}</span>
                      <div className="flex gap-2 opacity-60 hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setCategoryForm({ id: cat.id, name: cat.name, position: String(cat.position || '0') })} 
                          className="text-zinc-400 hover:text-white text-[8px]"
                          title="Rename Group"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(cat.id)} 
                          className="text-red-400 hover:text-red-300 text-[8px]"
                          title="Delete Group"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/5 pt-4 mt-2 flex flex-col gap-2.5">
                  <span className="block font-mono text-[8px] text-zinc-500 uppercase">
                    {categoryForm.id ? '✏️ Edit Group Name' : '➕ Create Skill Group'}
                  </span>
                  <input 
                    type="text" 
                    placeholder="Group Name (e.g., Frontend)"
                    value={categoryForm.name} 
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} 
                    className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none" 
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSaveCategory} 
                      className="bg-white text-black font-mono text-[9px] uppercase tracking-wider py-1.5 px-3 rounded font-semibold hover:bg-gray-200 transition-colors flex-1"
                    >
                      {categoryForm.id ? 'Update' : 'Create'}
                    </button>
                    {categoryForm.id && (
                      <button 
                        onClick={handleNewCategory} 
                        className="border border-white/10 text-zinc-400 font-mono text-[9px] uppercase tracking-wider py-1.5 px-3 rounded hover:bg-white/5 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Column 2: Active Skill Metrics List */}
              <div className="flex flex-col gap-4 border-r border-white/5 pr-6">
                <span className="block font-mono text-[9px] text-zinc-500 uppercase pb-2 border-b border-white/5">2. Skill Metrics</span>
                <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
                  {skills.map(s => {
                    const parentCat = categoriesList.find(c => c.id === s.categoryId);
                    return (
                      <div key={s.id} className="flex justify-between items-center text-[10px] font-mono text-zinc-300 py-1.5 border-b border-white/5 last:border-b-0">
                        <div className="truncate max-w-[140px] flex flex-col">
                          <span className="text-white font-medium">{s.name}</span>
                          <span className="text-[8px] text-zinc-500 truncate">{parentCat?.name || 'No Group'}</span>
                        </div>
                        <span className="text-zinc-500 font-semibold">{s.proficiency}%</span>
                        <button onClick={() => handleDeleteSkill(s.id)} className="text-red-400 hover:text-red-300 font-semibold">DEL</button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Column 3: Add Skill Form */}
              <div className="flex flex-col gap-4">
                <span className="block font-mono text-[9px] text-zinc-500 uppercase pb-2 border-b border-white/5">3. Add Skill Metric</span>
                <div>
                  <label className="block font-mono text-[8px] text-zinc-500 uppercase mb-1">Skill Name</label>
                  <input type="text" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none" placeholder="e.g., TypeScript" />
                </div>
                <div>
                  <label className="block font-mono text-[8px] text-zinc-500 uppercase mb-1">Skill Category / Group</label>
                  <select value={skillForm.categoryId} onChange={(e) => setSkillForm({ ...skillForm, categoryId: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none">
                    <option value="" disabled>Select category group</option>
                    {categoriesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[8px] text-zinc-500 uppercase mb-1">Proficiency ({skillForm.proficiency}%)</label>
                  <input type="range" min="0" max="100" value={skillForm.proficiency} onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value })} className="w-full accent-[var(--accent)]" />
                </div>
                <button onClick={handleSaveSkill} className="bg-white text-black font-mono text-[9px] uppercase tracking-wider py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors w-full mt-2">
                  Add Skill
                </button>
              </div>

            </div>
            
            <div className="flex justify-end mt-8 border-t border-white/5 pt-4">
              <button onClick={() => setActiveModal(null)} className="border border-white/5 text-zinc-400 font-mono text-[10px] uppercase tracking-widest px-6 py-3 transition-colors duration-150 hover:bg-white/5 rounded-lg">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'testimonial' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#111115] border border-white/5 rounded-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white font-mono text-xs">✕ CLOSE</button>
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">Add / Modify Recommendation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Client Name</label>
                <input type="text" value={testimonialForm.clientName} onChange={(e) => setTestimonialForm({ ...testimonialForm, clientName: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white" />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Client Role</label>
                <input type="text" value={testimonialForm.clientRole} onChange={(e) => setTestimonialForm({ ...testimonialForm, clientRole: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white" />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Client Company</label>
                <input type="text" value={testimonialForm.clientCompany} onChange={(e) => setTestimonialForm({ ...testimonialForm, clientCompany: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white" />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Avatar URL</label>
                <input type="text" value={testimonialForm.avatarUrl} onChange={(e) => setTestimonialForm({ ...testimonialForm, avatarUrl: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Review Quote</label>
                <textarea rows={3} value={testimonialForm.text} onChange={(e) => setTestimonialForm({ ...testimonialForm, text: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white leading-relaxed" />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={handleSaveTestimonial} className="bg-white text-black font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors">Save Recommendation</button>
              <button onClick={() => setActiveModal(null)} className="border border-white/5 text-zinc-400 font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-white/5">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'service' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#111115] border border-white/5 rounded-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white font-mono text-xs">✕ CLOSE</button>
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">Add / Modify Service Card</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Service Name</label>
                <input type="text" value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white" />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Lucide Icon Name</label>
                <input type="text" value={serviceForm.icon} onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white" />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Display Position</label>
                <input type="number" value={serviceForm.position} onChange={(e) => setServiceForm({ ...serviceForm, position: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Description</label>
                <textarea rows={3} value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white leading-relaxed" />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={handleSaveService} className="bg-white text-black font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors">Save Service</button>
              <button onClick={() => setActiveModal(null)} className="border border-white/5 text-zinc-400 font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-white/5">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'experience' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#111115] border border-white/5 rounded-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white font-mono text-xs">✕ CLOSE</button>
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">Add / Modify Employment Record</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Role Title</label>
                <input type="text" value={experienceForm.role} onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white" />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Company Name</label>
                <input type="text" value={experienceForm.company} onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white" />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Timeline</label>
                <input type="text" value={experienceForm.timeline} onChange={(e) => setExperienceForm({ ...experienceForm, timeline: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white" />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Location</label>
                <input type="text" value={experienceForm.location} onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Short Description</label>
                <textarea rows={3} value={experienceForm.description} onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white leading-relaxed" />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={handleSaveExperience} className="bg-white text-black font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors">Save Experience</button>
              <button onClick={() => setActiveModal(null)} className="border border-white/5 text-zinc-400 font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-white/5">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'education' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#111115] border border-white/5 rounded-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white font-mono text-xs">✕ CLOSE</button>
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">Add / Modify Education Record</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Degree Title</label>
                <input type="text" value={educationForm.degree} onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white" />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Institution Name</label>
                <input type="text" value={educationForm.institution} onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white" />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Period / Timeline</label>
                <input type="text" value={educationForm.period} onChange={(e) => setEducationForm({ ...educationForm, period: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white" />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Field of Study</label>
                <input type="text" value={educationForm.fieldOfStudy} onChange={(e) => setEducationForm({ ...educationForm, fieldOfStudy: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Short Description</label>
                <textarea rows={3} value={educationForm.description} onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white leading-relaxed" />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={handleSaveEducation} className="bg-white text-black font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors">Save Education</button>
              <button onClick={() => setActiveModal(null)} className="border border-white/5 text-zinc-400 font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-white/5">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'certificate' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#111115] border border-white/5 rounded-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white font-mono text-xs">✕ CLOSE</button>
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">Add / Modify Certificate</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Certificate Name</label>
                <input type="text" value={certificateForm.title} onChange={(e) => setCertificateForm({ ...certificateForm, title: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white" />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Issuer / Organization</label>
                <input type="text" value={certificateForm.issuer} onChange={(e) => setCertificateForm({ ...certificateForm, issuer: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white" />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Credential Date</label>
                <input type="text" value={certificateForm.timeline} onChange={(e) => setCertificateForm({ ...certificateForm, timeline: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white font-mono" />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Score / Grade</label>
                <input type="number" value={certificateForm.score} onChange={(e) => setCertificateForm({ ...certificateForm, score: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white" />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Suffix Symbol (e.g. %)</label>
                <input type="text" value={certificateForm.suffix} onChange={(e) => setCertificateForm({ ...certificateForm, suffix: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Short Description</label>
                <textarea rows={3} value={certificateForm.description} onChange={(e) => setCertificateForm({ ...certificateForm, description: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white leading-relaxed" />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={handleSaveCertificate} className="bg-white text-black font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors">Save Certificate</button>
              <button onClick={() => setActiveModal(null)} className="border border-white/5 text-zinc-400 font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-white/5">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'seo' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#111115] border border-white/5 rounded-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white font-mono text-xs">✕ CLOSE</button>
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">Meta SEO Configurations</h3>
            
            <div className="flex flex-col gap-6 mb-8">
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Meta Description Tag</label>
                <textarea rows={3} value={seo.metaDescription || ''} onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })} placeholder="A summary for search results" className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none leading-relaxed" />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">OpenGraph Image Path</label>
                <input type="text" value={seo.ogImage || ''} onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })} placeholder="e.g. /uploads/hero_visual.png" className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none" />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Twitter Card Type</label>
                <select value={seo.twitterCard || 'summary_large_image'} onChange={(e) => setSeo({ ...seo, twitterCard: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none">
                  <option value="summary">Summary Card</option>
                  <option value="summary_large_image">Large Image Card</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={handleSaveSeo} className="bg-white text-black font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors">Save SEO Settings</button>
              <button onClick={() => setActiveModal(null)} className="border border-white/5 text-zinc-400 font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-white/5">Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
