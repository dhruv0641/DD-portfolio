'use client';

import React, { useState, useEffect, useTransition } from 'react';
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
  saveSkillCategoryAction,
  deleteSkillCategoryAction,
  getMessagesAction,
  updateMessageStatusAction,
  deleteMessageAction,
  clearAllMessagesAction,
  emptyTrashAction,
  uploadResumeAction,
  deleteResumeAction
} from './actions';

type ModalType = 'profile' | 'hero' | 'about' | 'contact' | 'project' | 'blog' | 'skill' | 'testimonial' | 'service' | 'experience' | 'education' | 'certificate' | 'seo' | 'messages';

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
  initialMessages?: any[];
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
  initialMessages = [],
}: EditorClientProps) {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);

  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.stop();
      }
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.start();
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.start();
      }
    };
  }, [activeModal]);

  const triggerToast = (text: string, success: boolean) => {
    setMessage({ text, success });
    setTimeout(() => setMessage(null), 3500);
  };

  // --- INBOUND MESSAGES INBOX STATE ---
  const [messagesList, setMessagesList] = useState<any[]>(initialMessages || []);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'starred' | 'archived' | 'trash'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMsgTab, setMobileMsgTab] = useState<'list' | 'detail'>('list');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = messagesList.filter(m => m.status === 'unread').length;
  const trashCount = messagesList.filter(m => m.status === 'trash').length;

  const handleRefreshMessages = () => {
    startTransition(async () => {
      const res = await getMessagesAction();
      if (res.success && res.data) {
        setMessagesList(res.data);
        triggerToast('Inbox refreshed!', true);
      } else {
        triggerToast(res.error || 'Failed to refresh inbox.', false);
      }
    });
  };

  const handleUpdateMessageStatus = (id: string | number, newStatus: string) => {
    startTransition(async () => {
      const res = await updateMessageStatusAction(id, newStatus);
      if (res.success) {
        setMessagesList(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage((prev: any) => prev ? { ...prev, status: newStatus } : null);
        }
        if (newStatus === 'trash') {
          triggerToast('Message moved to Recycle Bin.', true);
        } else if (newStatus === 'read') {
          triggerToast('Message restored to Inbox.', true);
        }
      } else {
        triggerToast(res.error || 'Failed to update message status.', false);
      }
    });
  };

  const handleDeleteMessage = (id: string | number, isPermanent = false) => {
    const target = messagesList.find(m => m.id === id);
    const inTrash = target?.status === 'trash';

    if (inTrash || isPermanent) {
      if (!confirm('Permanently delete this message from the database? This cannot be undone.')) return;
      startTransition(async () => {
        const res = await deleteMessageAction(id);
        if (res.success) {
          setMessagesList(prev => prev.filter(m => m.id !== id));
          if (selectedMessage && selectedMessage.id === id) {
            setSelectedMessage(null);
          }
          triggerToast('Message permanently deleted.', true);
        } else {
          triggerToast(res.error || 'Failed to delete message.', false);
        }
      });
    } else {
      // Soft-delete: Move to Recycle Bin (Trash)
      handleUpdateMessageStatus(id, 'trash');
    }
  };

  const handleEmptyTrash = () => {
    if (!confirm('Empty Recycle Bin? All trashed messages will be permanently deleted.')) return;
    startTransition(async () => {
      const res = await emptyTrashAction();
      if (res.success) {
        setMessagesList(prev => prev.filter(m => m.status !== 'trash'));
        if (selectedMessage && selectedMessage.status === 'trash') {
          setSelectedMessage(null);
        }
        triggerToast('Recycle Bin emptied.', true);
      } else {
        triggerToast(res.error || 'Failed to empty recycle bin.', false);
      }
    });
  };

  const handleClearAllMessages = () => {
    if (messageFilter === 'trash') {
      handleEmptyTrash();
      return;
    }

    if (!confirm('Move ALL active messages to Recycle Bin?')) return;
    startTransition(async () => {
      const res = await clearAllMessagesAction();
      if (res.success) {
        setMessagesList(prev => prev.map(m => ({ ...m, status: 'trash' })));
        setSelectedMessage(null);
        triggerToast('All messages moved to Recycle Bin.', true);
      } else {
        triggerToast(res.error || 'Failed to move messages to trash.', false);
      }
    });
  };

  const filteredMessages = messagesList.filter(msg => {
    let matchesFilter = false;
    if (messageFilter === 'all') {
      matchesFilter = msg.status !== 'trash';
    } else {
      matchesFilter = msg.status === messageFilter;
    }

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      (msg.name || '').toLowerCase().includes(q) || 
      (msg.email || '').toLowerCase().includes(q) || 
      (msg.objective || '').toLowerCase().includes(q) || 
      (msg.details || '').toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

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

  // --- RESUME UPLOAD & DELETE HANDLERS ---
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const handleUploadResumeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingResume(true);
    const formData = new FormData();
    formData.append('resume', file);

    startTransition(async () => {
      const res = await uploadResumeAction(formData);
      setIsUploadingResume(false);
      if (res.success && res.resumeUrl) {
        setSettings((prev: any) => ({ ...prev, resumeUrl: res.resumeUrl }));
        setProfile((prev: any) => ({ ...prev, resumeUrl: res.resumeUrl }));
        triggerToast('Resume document uploaded successfully!', true);
      } else {
        triggerToast(res.error || 'Failed to upload resume.', false);
      }
    });
  };

  const handleDeleteResumeFile = () => {
    if (!confirm('Are you sure you want to delete the uploaded resume file?')) return;
    startTransition(async () => {
      const res = await deleteResumeAction();
      if (res.success) {
        setSettings((prev: any) => ({ ...prev, resumeUrl: '' }));
        setProfile((prev: any) => ({ ...prev, resumeUrl: '' }));
        triggerToast('Resume deleted successfully!', true);
      } else {
        triggerToast(res.error || 'Failed to delete resume.', false);
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
    period: '',
    location: '',
    description: '',
    position: '0',
  });

  const handleNewEducation = () => {
    setEducationForm({
      id: '',
      institution: '',
      degree: '',
      period: '',
      location: '',
      description: '',
      position: '0',
    });
  };

  const handleEditEducation = (edu: any) => {
    setEducationForm({
      id: edu.id,
      institution: edu.institution || '',
      degree: edu.degree || '',
      period: edu.period || edu.timeline || '',
      location: edu.location || '',
      description: edu.description || '',
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
      
      {/* Static Admin Controls Header Panel */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-[8%] pt-4 md:pt-8 pb-4 relative z-30 border-b border-white/5">
        
        {/* Mobile Sticky / Top Bar (< md) */}
        <div className="flex md:hidden items-center justify-between gap-2 bg-[#121217]/90 border border-white/10 p-3 rounded-2xl backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-white">CMS Console</span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setActiveModal('messages');
                setMobileMsgTab('list');
                if (messagesList.length > 0 && !selectedMessage) {
                  setSelectedMessage(messagesList[0]);
                }
              }}
              className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded-xl font-mono text-[10px] uppercase font-bold flex items-center gap-1.5 active:scale-95 transition-transform"
            >
              <span>📬 Inbox</span>
              {unreadCount > 0 && (
                <span className="bg-blue-500 text-black px-1.5 py-0.2 rounded-full text-[9px]">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-white text-black px-3.5 py-1.5 rounded-xl font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-transform shadow-md"
            >
              <span>⚡ MENU</span>
              <span>{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* Desktop Navigation Toolbar (>= md) */}
        <div className="hidden md:flex items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-white">CMS Customizer Console</span>
          </div>
          
          <div className="overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-2 py-1 px-1 snap-x shrink-0">
            <button 
              onClick={() => setActiveModal('hero')}
              className="snap-start shrink-0 border border-white/5 bg-[#0f0f13] hover:border-white/20 hover:bg-[#13131a] hover:-translate-y-[1px] active:scale-95 text-zinc-400 hover:text-white px-3.5 py-2 rounded-lg font-mono text-[9px] uppercase tracking-wider transition-all duration-200 ease-out min-h-[36px] flex items-center shadow-sm"
            >
              ✨ Hero Section
            </button>
            <button 
              onClick={() => setActiveModal('about')}
              className="snap-start shrink-0 border border-white/5 bg-[#0f0f13] hover:border-white/20 hover:bg-[#13131a] hover:-translate-y-[1px] active:scale-95 text-zinc-400 hover:text-white px-3.5 py-2 rounded-lg font-mono text-[9px] uppercase tracking-wider transition-all duration-200 ease-out min-h-[36px] flex items-center shadow-sm"
            >
              👤 Identity & Beliefs
            </button>
            <button 
              onClick={() => setActiveModal('contact')}
              className="snap-start shrink-0 border border-white/5 bg-[#0f0f13] hover:border-white/20 hover:bg-[#13131a] hover:-translate-y-[1px] active:scale-95 text-zinc-400 hover:text-white px-3.5 py-2 rounded-lg font-mono text-[9px] uppercase tracking-wider transition-all duration-200 ease-out min-h-[36px] flex items-center shadow-sm"
            >
              ✉️ Contact & Links
            </button>
            <button 
              onClick={() => {
                setActiveModal('messages');
                setMobileMsgTab('list');
                if (messagesList.length > 0 && !selectedMessage) {
                  setSelectedMessage(messagesList[0]);
                }
              }}
              className="snap-start shrink-0 border border-blue-500/30 bg-blue-950/20 hover:border-blue-500 hover:bg-blue-950/40 hover:-translate-y-[1px] active:scale-95 text-blue-400 hover:text-white px-3.5 py-2 rounded-lg font-mono text-[9px] uppercase tracking-wider transition-all duration-200 ease-out flex items-center gap-1.5 min-h-[36px] shadow-sm"
            >
              <span>📬 Inbound Messages</span>
              {unreadCount > 0 && (
                <span className="bg-blue-500 text-black px-1.5 py-0.2 rounded-full text-[9px] font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveModal('seo')}
              className="snap-start shrink-0 border border-white/5 bg-[#0f0f13] hover:border-white/20 hover:bg-[#13131a] hover:-translate-y-[1px] active:scale-95 text-zinc-400 hover:text-white px-3.5 py-2 rounded-lg font-mono text-[9px] uppercase tracking-wider transition-all duration-200 ease-out min-h-[36px] flex items-center shadow-sm"
            >
              🔍 SEO Tags
            </button>
            <button 
              onClick={() => { handleNewSkill(); setActiveModal('skill'); }}
              className="snap-start shrink-0 border border-white/5 bg-[#0f0f13] hover:border-white/20 hover:bg-[#13131a] hover:-translate-y-[1px] active:scale-95 text-zinc-400 hover:text-white px-3.5 py-2 rounded-lg font-mono text-[9px] uppercase tracking-wider transition-all duration-200 ease-out min-h-[36px] flex items-center shadow-sm"
            >
              🛠️ Skills DB
            </button>
            <span className="h-4 w-[1px] bg-white/10 mx-1 shrink-0" />
            <button 
              onClick={() => { handleNewProject(); setActiveModal('project'); }}
              className="snap-start shrink-0 border border-emerald-500/20 bg-emerald-950/10 hover:border-emerald-500 hover:bg-emerald-950/30 hover:-translate-y-[1px] active:scale-95 text-emerald-400 hover:text-white px-3.5 py-2 rounded-lg font-mono text-[9px] uppercase tracking-wider transition-all duration-200 ease-out min-h-[36px] flex items-center shadow-sm"
            >
              ➕ Project
            </button>
            <button 
              onClick={() => { handleNewBlog(); setActiveModal('blog'); }}
              className="snap-start shrink-0 border border-emerald-500/20 bg-emerald-950/10 hover:border-emerald-500 hover:bg-emerald-950/30 hover:-translate-y-[1px] active:scale-95 text-emerald-400 hover:text-white px-3.5 py-2 rounded-lg font-mono text-[9px] uppercase tracking-wider transition-all duration-200 ease-out min-h-[36px] flex items-center shadow-sm"
            >
              📝 Essay
            </button>

            <button 
              onClick={handleLogout}
              className="snap-start shrink-0 border border-red-500/20 bg-red-950/10 hover:border-red-500 hover:bg-red-950/30 hover:-translate-y-[1px] active:scale-95 text-red-400 hover:text-white px-3.5 py-2 rounded-lg font-mono text-[9px] uppercase tracking-wider transition-all duration-200 ease-out min-h-[36px] flex items-center shadow-sm"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Glassmorphic Mobile Drawer Menu Modal */}
      {mobileMenuOpen && (
        <div 
          data-lenis-prevent
          className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 p-6 overflow-y-auto flex flex-col justify-between md:hidden"
        >
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">Admin Quick Menu</h3>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white text-sm font-bold active:scale-95"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Category 1: Customizers */}
              <div>
                <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span>🎨</span>
                  <span>Section Customizers</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => { setActiveModal('hero'); setMobileMenuOpen(false); }}
                    className="p-3.5 bg-[#14141a] border border-white/10 rounded-xl text-left hover:border-white/30 active:scale-98 transition-all flex flex-col gap-1 min-h-[56px]"
                  >
                    <span className="text-sm">✨ Hero Section</span>
                    <span className="font-mono text-[9px] text-zinc-500 uppercase">Titles & CTA</span>
                  </button>
                  <button
                    onClick={() => { setActiveModal('about'); setMobileMenuOpen(false); }}
                    className="p-3.5 bg-[#14141a] border border-white/10 rounded-xl text-left hover:border-white/30 active:scale-98 transition-all flex flex-col gap-1 min-h-[56px]"
                  >
                    <span className="text-sm">👤 Identity & Beliefs</span>
                    <span className="font-mono text-[9px] text-zinc-500 uppercase">Bio & Philosophy</span>
                  </button>
                  <button
                    onClick={() => { setActiveModal('contact'); setMobileMenuOpen(false); }}
                    className="p-3.5 bg-[#14141a] border border-white/10 rounded-xl text-left hover:border-white/30 active:scale-98 transition-all flex flex-col gap-1 min-h-[56px]"
                  >
                    <span className="text-sm">✉️ Contact & Links</span>
                    <span className="font-mono text-[9px] text-zinc-500 uppercase">Social Handles</span>
                  </button>
                  <button
                    onClick={() => { setActiveModal('seo'); setMobileMenuOpen(false); }}
                    className="p-3.5 bg-[#14141a] border border-white/10 rounded-xl text-left hover:border-white/30 active:scale-98 transition-all flex flex-col gap-1 min-h-[56px]"
                  >
                    <span className="text-sm">🔍 SEO Tags</span>
                    <span className="font-mono text-[9px] text-zinc-500 uppercase">Meta Descriptions</span>
                  </button>
                </div>
              </div>

              {/* Category 2: Messages & Database */}
              <div>
                <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span>📂</span>
                  <span>Data & Management</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      setActiveModal('messages');
                      setMobileMsgTab('list');
                      if (messagesList.length > 0 && !selectedMessage) {
                        setSelectedMessage(messagesList[0]);
                      }
                      setMobileMenuOpen(false);
                    }}
                    className="p-3.5 bg-blue-950/20 border border-blue-500/30 rounded-xl text-left hover:border-blue-500 active:scale-98 transition-all flex flex-col gap-1 min-h-[56px] relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-300 font-medium">📬 Messages</span>
                      {unreadCount > 0 && (
                        <span className="bg-blue-500 text-black px-2 py-0.5 rounded-full text-[9px] font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[9px] text-blue-400/70 uppercase">Inbound Inquiries</span>
                  </button>

                  <button
                    onClick={() => { handleNewSkill(); setActiveModal('skill'); setMobileMenuOpen(false); }}
                    className="p-3.5 bg-[#14141a] border border-white/10 rounded-xl text-left hover:border-white/30 active:scale-98 transition-all flex flex-col gap-1 min-h-[56px]"
                  >
                    <span className="text-sm">🛠️ Skills DB</span>
                    <span className="font-mono text-[9px] text-zinc-500 uppercase">Category Mapping</span>
                  </button>
                </div>
              </div>

              {/* Category 3: Content Creation */}
              <div>
                <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span>✏️</span>
                  <span>Content Creation</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => { handleNewProject(); setActiveModal('project'); setMobileMenuOpen(false); }}
                    className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-left hover:border-emerald-500 active:scale-98 transition-all flex flex-col gap-1 min-h-[56px]"
                  >
                    <span className="text-sm text-emerald-300">➕ Add Project</span>
                    <span className="font-mono text-[9px] text-emerald-500/70 uppercase">Case Study Entry</span>
                  </button>

                  <button
                    onClick={() => { handleNewBlog(); setActiveModal('blog'); setMobileMenuOpen(false); }}
                    className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-left hover:border-emerald-500 active:scale-98 transition-all flex flex-col gap-1 min-h-[56px]"
                  >
                    <span className="text-sm text-emerald-300">📝 Add Essay</span>
                    <span className="font-mono text-[9px] text-emerald-500/70 uppercase">Blog / Article</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 mt-8 flex flex-col gap-3">
            <button
              onClick={handleLogout}
              className="w-full bg-red-950/30 border border-red-500/30 text-red-400 py-3.5 rounded-xl font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 active:scale-98 transition-all min-h-[48px]"
            >
              <span>🚪 Sign Out of Admin</span>
            </button>
          </div>
        </div>
      )}

      {/* Editorial Grid Lines */}
      <div className="fixed inset-0 pointer-events-none max-w-[1600px] mx-auto px-[8%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 z-0 opacity-15">
        <div className="border-r border-white/5 border-l h-full" />
        <div className="border-r border-white/5 h-full hidden md:block" />
        <div className="border-r border-white/5 h-full hidden lg:block" />
        <div className="border-r border-white/5 h-full hidden lg:block" />
      </div>

      {/* Dynamic Saving Indicator overlay */}
      {isPending && (
        <div className="fixed top-20 left-4 right-4 md:left-auto md:right-[8%] z-50 bg-[#111115]/95 border border-white/10 px-4 py-3 rounded-xl shadow-2xl flex items-center justify-center gap-3 font-mono text-[10px] text-white backdrop-blur-xl">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
          <span>UPDATING DATABASE...</span>
        </div>
      )}

      {/* Floating Status Toast */}
      {message && (
        <div 
          className={`fixed top-20 left-4 right-4 md:left-auto md:right-[8%] z-50 px-4 py-3 rounded-xl border shadow-2xl flex items-center justify-center gap-3 font-mono text-[10px] backdrop-blur-xl ${
            message.success 
              ? 'bg-[#0f1712]/95 border-emerald-500/30 text-emerald-400' 
              : 'bg-[#1a1112]/95 border-red-500/30 text-red-400'
          }`}
        >
          <div className={`w-2 h-2 rounded-full shrink-0 ${message.success ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span>{message.text}</span>
        </div>
      )}

      {/* SECTION 1: HERO (WITH EDIT HOVER HIGHLIGHT) */}
      <section id="intro" className="min-h-screen flex items-center pt-[140px] pb-24 border-b border-[var(--grid-line)] relative overflow-hidden group/hero hover:outline hover:outline-dashed hover:outline-[var(--accent)]/30 rounded-xl m-2">
        <div className="absolute top-[20%] left-[50%] -translate-x-[50%] w-[500px] h-[500px] rounded-full bg-[rgba(var(--accent-rgb),0.05)] blur-[120px] pointer-events-none z-0" />
        
        {/* Floating section modifier overlay */}
        <div className="absolute top-4 right-4 md:right-8 opacity-100 md:opacity-0 md:group-hover/hero:opacity-100 transition-opacity z-20 flex gap-2">
          <button 
            onClick={() => setActiveModal('hero')}
            className="bg-[#111115]/90 backdrop-blur-md border border-white/15 hover:border-white rounded-xl px-3.5 py-2 font-mono text-[10px] md:text-[9px] uppercase tracking-wider text-white flex items-center gap-1.5 shadow-xl font-semibold active:scale-95"
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
              {settings.heroTitlePrefix || 'Designing'}{' '}
              <span className="serif-italic text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-zinc-400">
                {settings.heroTitleItalic || 'deterministic'}
              </span>{' '}
              {settings.heroTitleSuffix || 'workflows for AI agents.'}
            </h1>

            <p className="text-[clamp(1.1rem,2vw,1.4rem)] text-[var(--text-muted)] max-w-[680px] leading-[1.6] font-light">
              {bio}
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              <a href={settings.heroCta1Link || '#work'} className="bg-white text-black text-xs font-mono uppercase tracking-widest px-8 py-4 rounded-lg hover:bg-gray-200 transition-all font-semibold">
                {settings.heroCta1Text || 'Explore Case Studies'}
              </a>
              <a href={settings.heroCta2Link || '#build'} className="border border-[rgba(255,255,255,0.08)] bg-[#0d0d10] text-white text-xs font-mono uppercase tracking-widest px-8 py-4 rounded-lg hover:bg-gray-900 transition-all">
                {settings.heroCta2Text || "Let's Build Together"}
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
        <div className="absolute top-4 right-4 md:right-8 opacity-100 md:opacity-0 md:group-hover/about:opacity-100 transition-opacity z-20">
          <button 
            onClick={() => setActiveModal('about')}
            className="bg-[#111115]/90 backdrop-blur-md border border-white/15 hover:border-white rounded-xl px-3.5 py-2 font-mono text-[10px] md:text-[9px] uppercase tracking-wider text-white shadow-xl font-semibold active:scale-95"
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
              {settings.aboutTitlePrefix || 'Building software'} <br />
              <span className="serif-italic text-[var(--text-muted)]">
                {settings.aboutTitleItalic || 'that solves real problems.'}
              </span>
            </h2>
            <div className="flex flex-col gap-8">
              <p className="text-[var(--text-muted)] text-[1.1rem] leading-[1.7] font-light font-sans">
                {settings.aboutParagraph1 || profile.bio || 'I operate at the intersection of machine cognition and human agency...'}
              </p>
              <p className="text-[var(--text-muted)] text-[1.1rem] leading-[1.7] font-light font-sans">
                {settings.aboutParagraph2 || 'I write robust, multi-agent state machines...'}
              </p>
            </div>
          </div>
          <CoreBeliefs items={[
            { num: '01', title: settings.belief1Title || 'Human first, model second', desc: settings.belief1Desc || 'AI should elevate and extend human capability...' },
            { num: '02', title: settings.belief2Title || 'Deterministic guardrails', desc: settings.belief2Desc || 'Stochastic models produce unpredictable results...' },
            { num: '03', title: settings.belief3Title || 'Performance is respect', desc: settings.belief3Desc || 'Lag is cognitive drag...' }
          ]} />
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

      {/* SECTION 12: CONTACT (WITH EDIT HOVER HIGHLIGHT) */}
      <section id="build" className="py-40 relative overflow-hidden group/contact hover:outline hover:outline-dashed hover:outline-[var(--accent)]/30 rounded-xl m-2">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 80%, rgba(var(--accent-rgb), 0.04) 0%, transparent 70%)' }} />
        
        {/* Floating section modifier overlay */}
        <div className="absolute top-4 right-8 opacity-0 group-hover/contact:opacity-100 transition-opacity z-20 flex gap-2">
          <button 
            onClick={() => setActiveModal('contact')}
            className="bg-[#111115] border border-white/10 hover:border-white rounded px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-white flex items-center gap-1.5 shadow-md font-semibold"
          >
            ✏️ Edit Contact & Links
          </button>
        </div>

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
                <a
                  href={`mailto:${settings.contactEmail || 'dhruv.dobariya0641@gmail.com'}`}
                  className="group/mail flex items-center gap-3 text-[var(--text-muted)] hover:text-white transition-colors duration-300"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-40 group-hover/mail:opacity-100 transition-opacity"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  <span>{settings.contactEmail || 'dhruv.dobariya0641@gmail.com'}</span>
                </a>
                <div className="flex items-center gap-3 text-[var(--text-muted)]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-40"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  <span>{profile.location || 'San Francisco, CA & Remote'}</span>
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

      {/* Dedicated Hero Modal */}
      {activeModal === 'hero' && (
        <div 
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start md:items-center justify-center z-50 p-4 md:p-8 py-8 overflow-y-auto overscroll-contain"
        >
          <div data-lenis-prevent className="bg-[#111115] border border-white/5 rounded-xl max-w-2xl w-full p-6 md:p-8 relative shadow-2xl my-auto">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white font-mono text-xs">✕ CLOSE</button>
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">Edit Hero Section</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block font-mono text-[9px] text-zinc-400 uppercase mb-1">Availability Badge Status</label>
                <input 
                  type="text" 
                  value={settings.status || ''} 
                  onChange={(e) => setSettings({ ...settings, status: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-400 uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={profile.name || ''} 
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-400 uppercase mb-1">Hero Title Prefix</label>
                <input 
                  type="text" 
                  value={settings.heroTitlePrefix || ''} 
                  onChange={(e) => setSettings({ ...settings, heroTitlePrefix: e.target.value })}
                  placeholder="Designing"
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-400 uppercase mb-1">Hero Title Italic Word</label>
                <input 
                  type="text" 
                  value={settings.heroTitleItalic || ''} 
                  onChange={(e) => setSettings({ ...settings, heroTitleItalic: e.target.value })}
                  placeholder="deterministic"
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-400 uppercase mb-1">Hero Title Suffix</label>
                <input 
                  type="text" 
                  value={settings.heroTitleSuffix || ''} 
                  onChange={(e) => setSettings({ ...settings, heroTitleSuffix: e.target.value })}
                  placeholder="workflows for AI agents."
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-400 uppercase mb-1">Hero Bio Paragraph</label>
                <textarea 
                  rows={3}
                  value={settings.bio || profile.bio || ''} 
                  onChange={(e) => {
                    setSettings({ ...settings, bio: e.target.value });
                    setProfile({ ...profile, bio: e.target.value });
                  }}
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none leading-relaxed"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-400 uppercase mb-1">CTA 1 Button Text</label>
                <input 
                  type="text" 
                  value={settings.heroCta1Text || ''} 
                  onChange={(e) => setSettings({ ...settings, heroCta1Text: e.target.value })}
                  placeholder="Explore Case Studies"
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-400 uppercase mb-1">CTA 1 Target Link / Anchor</label>
                <input 
                  type="text" 
                  value={settings.heroCta1Link || ''} 
                  onChange={(e) => setSettings({ ...settings, heroCta1Link: e.target.value })}
                  placeholder="#work"
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-400 uppercase mb-1">CTA 2 Button Text</label>
                <input 
                  type="text" 
                  value={settings.heroCta2Text || ''} 
                  onChange={(e) => setSettings({ ...settings, heroCta2Text: e.target.value })}
                  placeholder="Let's Build Together"
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-zinc-400 uppercase mb-1">CTA 2 Target Link / Anchor</label>
                <input 
                  type="text" 
                  value={settings.heroCta2Link || ''} 
                  onChange={(e) => setSettings({ ...settings, heroCta2Link: e.target.value })}
                  placeholder="#build"
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => { handleSaveProfile(); handleSaveSettings(); }} className="bg-white text-black font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Save Hero Section
              </button>
              <button onClick={() => setActiveModal(null)} className="border border-white/5 text-zinc-400 font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-white/5 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Identity Modal */}
      {activeModal === 'about' && (
        <div 
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start md:items-center justify-center z-50 p-4 md:p-8 py-8 overflow-y-auto overscroll-contain"
        >
          <div data-lenis-prevent className="bg-[#111115] border border-white/5 rounded-xl max-w-3xl w-full p-6 md:p-8 relative shadow-2xl my-auto">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white font-mono text-xs">✕ CLOSE</button>
            <h3 className="text-lg font-light mb-6 text-white tracking-tight">Edit Identity & Core Beliefs</h3>
            
            <div className="flex flex-col gap-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[9px] text-zinc-400 uppercase mb-1">About Title Prefix</label>
                  <input 
                    type="text" 
                    value={settings.aboutTitlePrefix || ''} 
                    onChange={(e) => setSettings({ ...settings, aboutTitlePrefix: e.target.value })}
                    placeholder="Building software"
                    className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[9px] text-zinc-400 uppercase mb-1">About Title Italic Phrase</label>
                  <input 
                    type="text" 
                    value={settings.aboutTitleItalic || ''} 
                    onChange={(e) => setSettings({ ...settings, aboutTitleItalic: e.target.value })}
                    placeholder="that solves real problems."
                    className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-mono text-[9px] text-zinc-400 uppercase mb-1">About Paragraph 1</label>
                  <textarea 
                    rows={3}
                    value={settings.aboutParagraph1 || ''} 
                    onChange={(e) => setSettings({ ...settings, aboutParagraph1: e.target.value })}
                    className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none leading-relaxed"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-mono text-[9px] text-zinc-400 uppercase mb-1">About Paragraph 2</label>
                  <textarea 
                    rows={3}
                    value={settings.aboutParagraph2 || ''} 
                    onChange={(e) => setSettings({ ...settings, aboutParagraph2: e.target.value })}
                    className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Core Beliefs */}
              <div className="border-t border-white/5 pt-6 flex flex-col gap-4">
                <span className="font-mono text-xs text-[var(--accent)] uppercase tracking-wider font-semibold">Core Beliefs Cards</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Belief 1 */}
                  <div className="flex flex-col gap-2">
                    <label className="block font-mono text-[9px] text-zinc-400 uppercase">Belief 01 Title</label>
                    <input 
                      type="text" 
                      value={settings.belief1Title || ''} 
                      onChange={(e) => setSettings({ ...settings, belief1Title: e.target.value })}
                      className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none"
                    />
                    <label className="block font-mono text-[9px] text-zinc-400 uppercase mt-1">Belief 01 Description</label>
                    <textarea 
                      rows={3}
                      value={settings.belief1Desc || ''} 
                      onChange={(e) => setSettings({ ...settings, belief1Desc: e.target.value })}
                      className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none leading-relaxed"
                    />
                  </div>
                  {/* Belief 2 */}
                  <div className="flex flex-col gap-2">
                    <label className="block font-mono text-[9px] text-zinc-400 uppercase">Belief 02 Title</label>
                    <input 
                      type="text" 
                      value={settings.belief2Title || ''} 
                      onChange={(e) => setSettings({ ...settings, belief2Title: e.target.value })}
                      className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none"
                    />
                    <label className="block font-mono text-[9px] text-zinc-400 uppercase mt-1">Belief 02 Description</label>
                    <textarea 
                      rows={3}
                      value={settings.belief2Desc || ''} 
                      onChange={(e) => setSettings({ ...settings, belief2Desc: e.target.value })}
                      className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none leading-relaxed"
                    />
                  </div>
                  {/* Belief 3 */}
                  <div className="flex flex-col gap-2">
                    <label className="block font-mono text-[9px] text-zinc-400 uppercase">Belief 03 Title</label>
                    <input 
                      type="text" 
                      value={settings.belief3Title || ''} 
                      onChange={(e) => setSettings({ ...settings, belief3Title: e.target.value })}
                      className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none"
                    />
                    <label className="block font-mono text-[9px] text-zinc-400 uppercase mt-1">Belief 03 Description</label>
                    <textarea 
                      rows={3}
                      value={settings.belief3Desc || ''} 
                      onChange={(e) => setSettings({ ...settings, belief3Desc: e.target.value })}
                      className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => { handleSaveProfile(); handleSaveSettings(); }} className="bg-white text-black font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Save Identity Details
              </button>
              <button onClick={() => setActiveModal(null)} className="border border-white/5 text-zinc-400 font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-white/5 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Central Contact & Links Sync Modal */}
      {activeModal === 'contact' && (
        <div 
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start md:items-center justify-center z-50 p-4 md:p-8 py-8 overflow-y-auto overscroll-contain"
        >
          <div data-lenis-prevent className="bg-[#111115] border border-white/5 rounded-xl max-w-3xl w-full p-6 md:p-8 relative shadow-2xl my-auto">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white font-mono text-xs">✕ CLOSE</button>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-lg font-light text-white tracking-tight">Global Contact & Links Sync Console</h3>
            </div>
            <p className="text-xs text-zinc-400 mb-6 font-mono">
              Changes saved here will automatically sync across Header, Footer, Hero, Social Cards, and Email Dispatch in real-time.
            </p>

            <div className="bg-[#09090b] border border-white/5 rounded-lg p-4 mb-6 flex flex-col gap-2 font-mono text-[10px] text-zinc-400">
              <div className="flex items-center justify-between text-white border-b border-white/5 pb-2 font-semibold">
                <span>⚡ Automated Email Pipeline Routing</span>
                <span className="text-emerald-400">ACTIVE</span>
              </div>
              <p>• <strong className="text-zinc-300">Recipient Email (Main Mail):</strong> The address below receives all incoming visitor messages.</p>
              <p>• <strong className="text-zinc-300">Sender Email (Dummy Service Mail):</strong> Configured via <code className="text-blue-400">SMTP_USER</code> in <code className="text-blue-400">.env.local</code> to send the email securely.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="md:col-span-2">
                <label className="block font-mono text-[9px] text-emerald-400 uppercase mb-1 font-semibold">Destination Recipient Email (Main Mail)</label>
                <input 
                  type="email" 
                  value={settings.contactEmail || profile.contactEmail || ''} 
                  onChange={(e) => {
                    setSettings({ ...settings, contactEmail: e.target.value });
                    setProfile({ ...profile, contactEmail: e.target.value });
                  }}
                  placeholder="e.g. main.dhruv@gmail.com"
                  className="w-full bg-[#09090b] border border-emerald-500/30 rounded-lg p-2.5 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-mono text-[9px] text-zinc-400 uppercase mb-1">Physical Location</label>
                <input 
                  type="text" 
                  value={profile.location || ''} 
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="San Francisco, CA & Remote"
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[9px] text-zinc-400 uppercase mb-1">GitHub Profile URL</label>
                <input 
                  type="text" 
                  value={settings.githubUrl || ''} 
                  onChange={(e) => setSettings({ ...settings, githubUrl: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-mono text-[9px] text-zinc-400 uppercase mb-1">LinkedIn Profile URL</label>
                <input 
                  type="text" 
                  value={settings.linkedinUrl || ''} 
                  onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-mono text-[9px] text-zinc-400 uppercase mb-1">X / Twitter Profile URL</label>
                <input 
                  type="text" 
                  value={settings.twitterUrl || ''} 
                  onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                  placeholder="https://x.com/username"
                  className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              {/* Dedicated Resume Document Management Section */}
              <div className="md:col-span-2 border-t border-b border-white/5 py-4 my-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[9px] text-emerald-400 uppercase font-semibold flex items-center gap-1.5">
                    📄 Resume Document Management (Upload & Delete)
                  </span>
                  {(settings.resumeUrl || profile.resumeUrl) ? (
                    <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] px-2 py-0.5 rounded font-semibold">
                      RESUME ACTIVE
                    </span>
                  ) : (
                    <span className="bg-zinc-800 text-zinc-400 font-mono text-[9px] px-2 py-0.5 rounded font-semibold">
                      NO FILE UPLOADED
                    </span>
                  )}
                </div>

                <div className="bg-[#09090b] border border-white/5 rounded-lg p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1 font-mono text-xs overflow-hidden">
                    <span className="text-zinc-300 font-medium">Current Resume Link:</span>
                    <span className="text-zinc-500 text-[10px] truncate max-w-md">
                      {settings.resumeUrl || profile.resumeUrl || 'Not uploaded yet (defaults to /resume.pdf)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <label className={`cursor-pointer border border-emerald-500/30 bg-emerald-950/30 hover:bg-emerald-500/20 hover:-translate-y-[1px] active:scale-95 text-emerald-300 px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold flex items-center gap-1.5 transition-all duration-200 ease-out shadow-sm ${isUploadingResume ? 'opacity-50 pointer-events-none' : ''}`}>
                      <span>{isUploadingResume ? '⏳ Uploading...' : '📤 Upload Resume'}</span>
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        onChange={handleUploadResumeFile} 
                        className="hidden" 
                      />
                    </label>

                    {(settings.resumeUrl || profile.resumeUrl) && (
                      <>
                        <a
                          href={settings.resumeUrl || profile.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border border-white/10 bg-white/5 hover:bg-white/10 hover:-translate-y-[1px] active:scale-95 text-white px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-semibold transition-all duration-200 ease-out flex items-center gap-1 shadow-sm"
                        >
                          👁️ View
                        </a>
                        <button
                          type="button"
                          onClick={handleDeleteResumeFile}
                          className="border border-red-500/30 bg-red-950/30 hover:bg-red-950/50 hover:-translate-y-[1px] active:scale-95 text-red-400 px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold transition-all duration-200 ease-out flex items-center gap-1 shadow-sm"
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block font-mono text-[8px] text-zinc-500 uppercase mb-1">Custom Resume URL / Cloud Link (Alternative to uploading a file)</label>
                  <input 
                    type="text" 
                    value={settings.resumeUrl || profile.resumeUrl || ''} 
                    onChange={(e) => {
                      setSettings({ ...settings, resumeUrl: e.target.value });
                      setProfile({ ...profile, resumeUrl: e.target.value });
                    }}
                    placeholder="e.g. /uploads/resume.pdf or https://drive.google.com/file/d/..."
                    className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="md:col-span-2 border-t border-white/5 pt-4 mt-2">
                <span className="block font-mono text-[9px] text-zinc-400 uppercase mb-3">Contact Section Display Texts</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[8px] text-zinc-500 uppercase mb-1">Contact Heading Prefix</label>
                    <input 
                      type="text" 
                      value={settings.contactHeadingPrefix || ''} 
                      onChange={(e) => setSettings({ ...settings, contactHeadingPrefix: e.target.value })}
                      className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[8px] text-zinc-500 uppercase mb-1">Contact Heading Italic Phrase</label>
                    <input 
                      type="text" 
                      value={settings.contactHeadingItalic || ''} 
                      onChange={(e) => setSettings({ ...settings, contactHeadingItalic: e.target.value })}
                      className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-mono text-[8px] text-zinc-500 uppercase mb-1">Contact Section Subtitle Paragraph</label>
                    <textarea 
                      rows={2}
                      value={settings.contactParagraph || ''} 
                      onChange={(e) => setSettings({ ...settings, contactParagraph: e.target.value })}
                      className="w-full bg-[#09090b] border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 border-t border-white/5 pt-4">
              <button onClick={() => { handleSaveProfile(); handleSaveSettings(); }} className="bg-emerald-500 text-black font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-bold hover:bg-emerald-400 transition-colors">
                Save & Synchronize All Contact Links
              </button>
              <button onClick={() => setActiveModal(null)} className="border border-white/5 text-zinc-400 font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-white/5 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'project' && (
        <div data-lenis-prevent onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()} onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }} className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start md:items-center justify-center z-50 p-4 md:p-8 py-8 overflow-y-auto overscroll-contain">
          <div data-lenis-prevent className="bg-[#111115] border border-white/5 rounded-xl max-w-2xl w-full p-8 relative shadow-2xl my-auto">
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
        <div data-lenis-prevent onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()} onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }} className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start md:items-center justify-center z-50 p-4 md:p-8 py-8 overflow-y-auto overscroll-contain">
          <div data-lenis-prevent className="bg-[#111115] border border-white/5 rounded-xl max-w-2xl w-full p-8 relative shadow-2xl my-auto">
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
        <div data-lenis-prevent onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()} onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }} className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start md:items-center justify-center z-50 p-4 md:p-8 py-8 overflow-y-auto overscroll-contain">
          <div data-lenis-prevent className="bg-[#111115] border border-white/5 rounded-xl max-w-5xl w-full p-8 relative shadow-2xl my-auto">
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
        <div data-lenis-prevent onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()} onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }} className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start md:items-center justify-center z-50 p-4 md:p-8 py-8 overflow-y-auto overscroll-contain">
          <div data-lenis-prevent className="bg-[#111115] border border-white/5 rounded-xl max-w-2xl w-full p-8 relative shadow-2xl my-auto">
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
        <div data-lenis-prevent onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()} onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }} className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start md:items-center justify-center z-50 p-4 md:p-8 py-8 overflow-y-auto overscroll-contain">
          <div data-lenis-prevent className="bg-[#111115] border border-white/5 rounded-xl max-w-2xl w-full p-8 relative shadow-2xl my-auto">
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
        <div data-lenis-prevent onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()} onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }} className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start md:items-center justify-center z-50 p-4 md:p-8 py-8 overflow-y-auto overscroll-contain">
          <div data-lenis-prevent className="bg-[#111115] border border-white/5 rounded-xl max-w-2xl w-full p-8 relative shadow-2xl my-auto">
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
        <div data-lenis-prevent onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()} onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }} className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start md:items-center justify-center z-50 p-4 md:p-8 py-8 overflow-y-auto overscroll-contain">
          <div data-lenis-prevent className="bg-[#111115] border border-white/5 rounded-xl max-w-2xl w-full p-8 relative shadow-2xl my-auto">
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
                <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Location</label>
                <input type="text" value={educationForm.location} onChange={(e) => setEducationForm({ ...educationForm, location: e.target.value })} className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white" />
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
        <div data-lenis-prevent onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()} onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }} className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start md:items-center justify-center z-50 p-4 md:p-8 py-8 overflow-y-auto overscroll-contain">
          <div data-lenis-prevent className="bg-[#111115] border border-white/5 rounded-xl max-w-2xl w-full p-8 relative shadow-2xl my-auto">
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
        <div data-lenis-prevent onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()} onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }} className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start md:items-center justify-center z-50 p-4 md:p-8 py-8 overflow-y-auto overscroll-contain">
          <div data-lenis-prevent className="bg-[#111115] border border-white/5 rounded-xl max-w-2xl w-full p-8 relative shadow-2xl my-auto">
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

      {activeModal === 'messages' && (
        <div data-lenis-prevent onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()} onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }} className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-8 overflow-hidden">
          <div data-lenis-prevent className="bg-[#0f0f13] border border-white/10 rounded-2xl max-w-6xl w-full h-[88vh] flex flex-col relative shadow-2xl overflow-hidden">
            
            {/* Top Toolbar Header */}
            <div className="px-6 py-4 border-b border-white/5 bg-[#14141a] flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono text-sm font-semibold">
                  📬
                </div>
                <div>
                  <h3 className="text-base font-medium text-white tracking-tight flex items-center gap-2">
                    Inbound Messages Console
                    <span className="font-mono text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full uppercase">
                      {messagesList.filter(m => m.status !== 'trash').length} Active
                    </span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">Direct visitor inquiries submitted via portfolio contact form</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefreshMessages}
                  className="border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  🔄 Refresh
                </button>
                {messageFilter === 'trash' ? (
                  trashCount > 0 && (
                    <button
                      onClick={handleEmptyTrash}
                      className="border border-red-500/30 bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1 font-bold"
                    >
                      🔥 Empty Recycle Bin ({trashCount})
                    </button>
                  )
                ) : (
                  messagesList.filter(m => m.status !== 'trash').length > 0 && (
                    <button
                      onClick={handleClearAllMessages}
                      className="border border-red-500/20 bg-red-950/20 hover:bg-red-900/40 text-red-400 hover:text-red-200 px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-colors"
                    >
                      🗑️ Move All to Trash
                    </button>
                  )
                )}
                <button 
                  onClick={() => setActiveModal(null)} 
                  className="text-zinc-500 hover:text-white font-mono text-xs px-2 py-1"
                >
                  ✕ CLOSE
                </button>
              </div>
            </div>

            {/* Filter Bar & Search */}
            <div className="px-4 md:px-6 py-3 border-b border-white/5 bg-[#111116] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
              <div className="overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-1.5 py-0.5 max-w-full">
                {(['all', 'unread', 'starred', 'archived', 'trash'] as const).map(filterTab => {
                  let count = 0;
                  if (filterTab === 'all') {
                    count = messagesList.filter(m => m.status !== 'trash').length;
                  } else {
                    count = messagesList.filter(m => m.status === filterTab).length;
                  }

                  const isActive = messageFilter === filterTab;
                  const isTrashTab = filterTab === 'trash';
                  return (
                    <button
                      key={filterTab}
                      onClick={() => {
                        setMessageFilter(filterTab);
                        setSelectedMessage(null);
                      }}
                      className={`px-3 py-1.5 rounded-md font-mono text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1.5 shrink-0 min-h-[34px] ${
                        isActive
                          ? isTrashTab 
                            ? 'bg-red-900/60 border border-red-500/40 text-white font-medium shadow-sm'
                            : 'bg-[var(--accent)] text-white font-medium shadow-sm'
                          : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200'
                      }`}
                    >
                      <span>{isTrashTab ? '🗑️ Trash' : filterTab}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[9px] ${isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-zinc-500'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full sm:w-64 shrink-0">
                <input
                  type="text"
                  placeholder="Search name, email, topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#09090c] border border-white/10 rounded-lg px-3 py-2 pl-8 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 min-h-[38px]"
                />
                <span className="absolute left-2.5 top-2.5 text-zinc-500 text-xs">🔍</span>
              </div>
            </div>

            {/* Main Content Responsive Split-Pane */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Left Pane: Message List (Full width on mobile if list tab active) */}
              <div className={`w-full md:w-[380px] lg:w-[420px] border-r border-white/5 bg-[#0b0b0e] overflow-y-auto shrink-0 divide-y divide-white/5 ${
                mobileMsgTab === 'detail' ? 'hidden md:block' : 'block'
              }`}>
                {filteredMessages.length === 0 ? (
                  <div className="p-12 text-center text-zinc-500 font-mono text-xs flex flex-col items-center gap-3">
                    <span className="text-3xl">{messageFilter === 'trash' ? '🗑️' : '📭'}</span>
                    <span>{messageFilter === 'trash' ? 'Recycle Bin is empty' : 'No messages found'}</span>
                  </div>
                ) : (
                  filteredMessages.map((msg) => {
                    const isSelected = selectedMessage?.id === msg.id;
                    const isUnread = msg.status === 'unread';
                    const isStarred = msg.status === 'starred';
                    const isTrashed = msg.status === 'trash';
                    
                    return (
                      <div
                        key={msg.id}
                        onClick={() => {
                          setSelectedMessage(msg);
                          setMobileMsgTab('detail');
                          if (isUnread) {
                            handleUpdateMessageStatus(msg.id, 'read');
                          }
                        }}
                        className={`p-4 cursor-pointer transition-all duration-150 relative active:bg-blue-900/20 ${
                          isSelected 
                            ? 'bg-blue-600/10 border-l-2 border-blue-500' 
                            : 'hover:bg-white/[0.03]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            {isUnread && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />}
                            <span className={`text-xs truncate max-w-[180px] ${isUnread ? 'font-semibold text-white' : 'text-zinc-300'}`}>
                              {msg.name}
                            </span>
                          </div>
                          <span className="font-mono text-[9px] text-zinc-500 shrink-0">
                            {msg.created_at ? new Date(msg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                          </span>
                        </div>

                        <div className="text-[11px] text-blue-400 font-mono mb-1 truncate">
                          {msg.email}
                        </div>

                        {msg.objective && (
                          <div className="inline-block bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                            {msg.objective}
                          </div>
                        )}

                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {msg.details}
                        </p>

                        <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                          {isTrashed ? (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateMessageStatus(msg.id, 'read');
                                }}
                                className="p-1 text-emerald-400 hover:underline font-bold"
                              >
                                ♻️ Restore
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMessage(msg.id, true);
                                }}
                                className="p-1 text-red-400 hover:underline font-bold"
                              >
                                ❌ Delete Forever
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateMessageStatus(msg.id, isStarred ? 'read' : 'starred');
                                }}
                                className={`p-1 hover:text-amber-400 transition-colors ${isStarred ? 'text-amber-400 font-bold' : ''}`}
                              >
                                {isStarred ? '★ Starred' : '☆ Star'}
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMessage(msg.id);
                                }}
                                className="p-1 hover:text-red-400 transition-colors"
                              >
                                🗑️ Trash
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Pane: Detailed Message View (Full width on mobile if detail tab active) */}
              <div className={`flex-1 bg-[#0f0f13] overflow-y-auto p-4 md:p-8 flex flex-col justify-between ${
                mobileMsgTab === 'list' ? 'hidden md:flex' : 'flex'
              }`}>
                {selectedMessage ? (
                  <div className="w-full">
                    {/* Mobile Back Button */}
                    <button
                      onClick={() => setMobileMsgTab('list')}
                      className="md:hidden flex items-center gap-2 text-xs font-mono text-blue-400 mb-6 bg-blue-500/10 border border-blue-500/20 px-3 py-2 rounded-lg active:scale-95 transition-all"
                    >
                      <span>←</span>
                      <span>Back to Messages List</span>
                    </button>

                    {/* Message Header */}
                    <div className="border-b border-white/5 pb-6 mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                        <div>
                          <h2 className="text-xl font-light text-white tracking-tight mb-1">
                            {selectedMessage.name}
                          </h2>
                          <a 
                            href={`mailto:${selectedMessage.email}`} 
                            className="text-xs font-mono text-blue-400 hover:underline flex items-center gap-1.5 break-all"
                          >
                            ✉️ {selectedMessage.email}
                          </a>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {selectedMessage.status === 'trash' ? (
                            <>
                              <button
                                onClick={() => handleUpdateMessageStatus(selectedMessage.id, 'read')}
                                className="px-3 py-2 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-900/40 font-mono text-[10px] uppercase tracking-wider transition-colors min-h-[38px] font-bold"
                              >
                                ♻️ Restore to Inbox
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(selectedMessage.id, true)}
                                className="px-3 py-2 rounded-lg border border-red-500/30 bg-red-950/30 text-red-400 hover:bg-red-900/50 font-mono text-[10px] uppercase tracking-wider transition-colors min-h-[38px] font-bold"
                              >
                                ❌ Delete Forever
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleUpdateMessageStatus(selectedMessage.id, selectedMessage.status === 'starred' ? 'read' : 'starred')}
                                className={`px-3 py-2 rounded-lg border font-mono text-[10px] uppercase tracking-wider transition-colors min-h-[38px] ${
                                  selectedMessage.status === 'starred'
                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                                }`}
                              >
                                {selectedMessage.status === 'starred' ? '★ Starred' : '☆ Star'}
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(selectedMessage.id)}
                                className="px-3 py-2 rounded-lg border border-red-500/20 bg-red-950/20 text-red-400 hover:bg-red-900/40 font-mono text-[10px] uppercase tracking-wider transition-colors min-h-[38px]"
                              >
                                🗑️ Move to Trash
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
                        <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2.5 py-1 rounded-md uppercase text-[10px]">
                          Topic: {selectedMessage.objective || 'General Inquiry'}
                        </span>
                        <span className="text-zinc-500">
                          Received: {selectedMessage.created_at ? new Date(selectedMessage.created_at).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Message Body */}
                    <div className="bg-[#14141b] border border-white/5 rounded-xl p-5 md:p-6 mb-8">
                      <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
                        MESSAGE DETAILS:
                      </div>
                      <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap font-sans">
                        {selectedMessage.details}
                      </p>
                    </div>

                    {/* Quick Actions Footer */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <a
                        href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.objective || 'Portfolio Inquiry')}`}
                        className="bg-white text-black font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-xl font-semibold hover:bg-zinc-200 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 min-h-[44px]"
                      >
                        ✉️ Reply via Email Client
                      </a>
                      {selectedMessage.status !== 'trash' && (
                        <button
                          onClick={() => handleUpdateMessageStatus(selectedMessage.id, selectedMessage.status === 'unread' ? 'read' : 'unread')}
                          className="border border-white/10 bg-white/5 text-zinc-300 hover:text-white font-mono text-[10px] uppercase tracking-widest px-5 py-3.5 rounded-xl hover:bg-white/10 active:scale-[0.98] transition-all min-h-[44px]"
                        >
                          {selectedMessage.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-500 font-mono text-xs gap-3">
                    <span className="text-4xl opacity-40">{messageFilter === 'trash' ? '🗑️' : '📬'}</span>
                    <span>{messageFilter === 'trash' ? 'Select a trashed message to inspect or restore' : 'Select a message from the list to inspect details'}</span>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
