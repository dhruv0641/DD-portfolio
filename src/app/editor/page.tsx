import React from 'react';
import { settingsService } from '@/services/settingsService';
import { projectService } from '@/services/projectService';
import { blogService } from '@/services/blogService';
import { skillService } from '@/services/skillService';
import { testimonialService } from '@/services/testimonialService';
import { profileService } from '@/services/profileService';
import EditorClient from './EditorClient';

export const dynamic = 'force-dynamic';

export default async function EditorPage() {
  // Fetch current database records to populate the form states
  const [
    settings,
    profile,
    projects,
    blogs,
    skillsData,
    skillCategories,
    testimonials
  ] = await Promise.all([
    settingsService.getSettings(),
    profileService.getProfile(),
    projectService.getProjects(true), // Include drafts
    blogService.getBlogPosts(true),   // Include drafts
    skillService.getSkillsWithCategories(),
    skillService.getCategories(),
    testimonialService.getTestimonials(true)
  ]);

  // Flatten the skills list out of the categories for easy CRUD operations
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
              🛠️ LOCAL DEVELOPER ENVIRONMENT
            </div>
            <h1 className="text-3xl font-light tracking-tight text-white">
              Portfolio Content Editor
            </h1>
          </div>
          <p className="font-mono text-[10px] text-zinc-500 max-w-[360px] md:text-right leading-relaxed">
            All writes hit the active Supabase instance directly. Path cache revalidation triggers instantly on save.
          </p>
        </div>

        <EditorClient 
          initialSettings={settings}
          initialProfile={profile || {}}
          initialProjects={projects}
          initialBlogs={blogs}
          initialSkills={skillsList}
          skillCategories={skillCategories}
          initialTestimonials={testimonials}
        />
      </div>
    </div>
  );
}
