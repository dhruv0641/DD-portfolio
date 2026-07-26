import React from 'react';
import { settingsService } from '@/services/settingsService';
import { projectService } from '@/services/projectService';
import { blogService } from '@/services/blogService';
import { skillService } from '@/services/skillService';
import { testimonialService } from '@/services/testimonialService';
import { profileService } from '@/services/profileService';
import { coreService } from '@/services/coreService';
import { experienceService } from '@/services/experienceService';
import { educationService } from '@/services/educationService';
import { certificateService } from '@/services/certificateService';
import { seoService } from '@/services/seoService';

import { checkAuthAction } from './actions';
import LoginForm from './LoginForm';
import EditorClient from './EditorClient';

export const dynamic = 'force-dynamic';

export default async function EditorPage() {
  // Check session status first
  const isAuthenticated = await checkAuthAction();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Load all 11 database record sets to feed into the CMS forms
  const [
    settings,
    profile,
    projects,
    blogs,
    skillsData,
    skillCategories,
    testimonials,
    services,
    experiences,
    educations,
    certificates,
    seo
  ] = await Promise.all([
    settingsService.getSettings(),
    profileService.getProfile(),
    projectService.getProjects(true), 
    blogService.getBlogPosts(true),   
    skillService.getSkillsWithCategories(),
    skillService.getCategories(),
    testimonialService.getTestimonials(true),
    coreService.getServices(true),
    experienceService.getExperience(),
    educationService.getEducation(),
    certificateService.getCertificates(),
    seoService.getSeo()
  ]);

  // Flatten the skills list out of categories for easy listing & edit bindings
  const skillsList = skillsData.flatMap(cat => 
    cat.skills.map(s => ({
      id: s.id,
      name: s.name,
      proficiency: s.proficiency,
      categoryId: cat.id,
      categoryName: cat.name,
      position: 0
    }))
  );

  return (
    <div className="min-h-screen bg-[#090909] text-[#F5F5F5] font-sans selection:bg-[var(--accent)] selection:text-white pb-32">
      {/* Editorial Grid Lines */}
      <div className="fixed inset-0 pointer-events-none max-w-[1600px] mx-auto px-[8%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 z-0 opacity-15">
        <div className="border-r border-white/5 border-l h-full" />
        <div className="border-r border-white/5 h-full hidden md:block" />
        <div className="border-r border-white/5 h-full hidden lg:block" />
        <div className="border-r border-white/5 h-full hidden lg:block" />
      </div>

      <div className="max-w-[1400px] mx-auto px-[8%] pt-32 relative z-10">
        <div className="border-b border-white/5 pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[rgba(var(--accent-rgb),0.85)] mb-2.5">
              🛠️ SECURE PORTFOLIO WORKSPACE
            </div>
            <h1 className="text-3xl font-light tracking-tight text-white">
              Database Admin Dashboard
            </h1>
          </div>
          <div className="flex flex-col md:items-end gap-2.5">
            <span className="font-mono text-[9px] text-zinc-500 max-w-[360px] md:text-right leading-relaxed">
              Logged in as Admin. Writes bypass RLS via Service Role validation.
            </span>
          </div>
        </div>

        <EditorClient 
          initialSettings={settings}
          initialProfile={profile || {}}
          initialProjects={projects}
          initialBlogs={blogs}
          initialSkills={skillsList}
          skillCategories={skillCategories}
          initialTestimonials={testimonials}
          initialServices={services}
          initialExperiences={experiences}
          initialEducations={educations}
          initialCertificates={certificates}
          initialSeo={seo || {}}
        />
      </div>
    </div>
  );
}
