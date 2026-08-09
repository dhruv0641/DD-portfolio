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
import { contactService } from '@/services/contactService';

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

  // Load database record sets including inbound messages
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
    seo,
    messages
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
    seoService.getSeo(),
    contactService.getMessages()
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
      initialMessages={messages || []}
    />
  );
}
