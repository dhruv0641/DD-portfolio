import React from 'react';
import ThoughtWave from '@/components/ThoughtWave';
import AIPipelineViz from '@/components/AIPipelineViz';
import Certifications from '@/components/Certifications';
import ContactForm from '@/components/ContactForm';
import CoreBeliefs from '@/components/CoreBeliefs';
import ArchitectureStory from '@/components/ArchitectureStory';
import Link from 'next/link';
import { settingsService } from '@/services/settingsService';
import { projectService } from '@/services/projectService';
import { blogService } from '@/services/blogService';
import { certificateService } from '@/services/certificateService';
import { skillService } from '@/services/skillService';
import { experienceService } from '@/services/experienceService';
import { educationService } from '@/services/educationService';
import { testimonialService } from '@/services/testimonialService';
import { coreService } from '@/services/coreService';

export const dynamic = 'force-dynamic';

export default async function Page() {
  // 1. Fetch Dynamic Data from Supabase Services
  const [
    settings,
    dbProjects,
    dbPostsAll,
    certificates,
    skillCategories,
    experiences,
    education,
    testimonials,
    services
  ] = await Promise.all([
    settingsService.getSettings(),
    projectService.getProjects(false),
    blogService.getBlogPosts(false),
    certificateService.getCertificates(),
    skillService.getSkillsWithCategories(),
    experienceService.getExperience(),
    educationService.getEducation(),
    testimonialService.getTestimonials(false),
    coreService.getServices(false)
  ]);

  const dbPosts = dbPostsAll.slice(0, 3);
  const bio = settings.bio || 'Applied AI Systems Architect.';
  const availability = settings.status || 'AVAILABLE FOR NEW WORK';

  return (
    <>
      {/* SECTION 1: DYNAMIC PREMIUM HERO */}
      <section id="intro" className="min-h-screen flex items-center pt-[140px] pb-24 border-b border-[var(--grid-line)] relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-[20%] left-[50%] -translate-x-[50%] w-[500px] h-[500px] rounded-full bg-[rgba(var(--accent-rgb),0.05)] blur-[120px] pointer-events-none z-0" />

        <div className="max-w-[1400px] mx-auto px-[8%] w-full relative z-10">
          <div className="max-w-[950px] flex flex-col gap-8">
            {/* Availability status badge */}
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
              <a 
                href="#work" 
                className="bg-white text-black text-xs font-mono uppercase tracking-widest px-8 py-4 rounded-lg hover:bg-gray-200 transition-all duration-300 font-semibold"
              >
                Explore Case Studies
              </a>
              <a 
                href="#build" 
                className="border border-[rgba(255,255,255,0.08)] bg-[#0d0d10] text-white text-xs font-mono uppercase tracking-widest px-8 py-4 rounded-lg hover:bg-gray-900 transition-all duration-300"
              >
                Let&apos;s Build Together
              </a>
            </div>
          </div>
          
          <div className="absolute right-0 top-[20%] opacity-20 pointer-events-none lg:opacity-100">
            <ThoughtWave />
          </div>
        </div>
      </section>

      {/* SECTION 2: STORYTELLING ABOUT & BELIEFS */}
      <section id="identity" className="py-40 border-b border-[var(--grid-line)]">
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
              <p className="text-[var(--text-muted)] text-[1.1rem] leading-[1.7] font-light">
                I operate at the intersection of machine cognition and human agency. Most modern AI products expose the raw, chaotic mechanics of underlying models. I believe software should tame that chaos—delivering high-utility, predictable, and deeply respectful interactions.
              </p>
              <p className="text-[var(--text-muted)] text-[1.1rem] leading-[1.7] font-light">
                I write robust, multi-agent state machines, optimized retrieval schemas, and evaluation harnesses. My work is built to be fast, production-ready, and architected to safeguard user attention instead of taxing it.
              </p>
            </div>
          </div>

          {/* Core Beliefs Grid */}
          <CoreBeliefs />
        </div>
      </section>

      {/* SECTION 3: WORK SHOWCASE */}
      <section id="work" className="py-40 border-b border-[var(--grid-line)]">
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-20 flex items-center gap-2">
            <span>02 / Featured Projects</span>
            <div className="flex-1 h-[1px] bg-[var(--grid-line)]" />
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
                  className={`grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-24 items-center ${!isEven ? 'lg:grid-cols-[1fr_1.1fr]' : ''}`}
                >
                  {isEven && (
                    <div className="project-visual group rounded-2xl border border-[var(--grid-line)] overflow-hidden bg-[#0d0d10] aspect-[16/10] relative">
                      <img 
                        src={projectImg} 
                        alt={project.title} 
                        className="w-full h-full object-cover opacity-80 group-hover:scale-102 group-hover:opacity-100 transition-all duration-700 ease-out" 
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-6">
                    <div className="font-mono text-[10px] text-[var(--text-dim)] flex gap-4 uppercase">
                      <span>0{index + 1} / {project.subtitle}</span>
                      <span>•</span>
                      <span>{project.timeline}</span>
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
                      <img 
                        src={projectImg} 
                        alt={project.title} 
                        className="w-full h-full object-cover opacity-80 group-hover:scale-102 group-hover:opacity-100 transition-all duration-700 ease-out" 
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: CASE STUDY DETAILS */}
      <section id="case" className="py-40 border-b border-[var(--grid-line)]">
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
            <span>03 / Engineering Case Study</span>
            <div className="flex-1 h-[1px] bg-[var(--grid-line)]" />
          </div>

          <div className="max-w-[900px] mb-20">
            <h2 className="text-[clamp(2rem,5vw,4.2rem)] leading-[1.15] text-white font-light tracking-tight">
              Designing scalable software for production environments.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 mb-24">
            <div className="font-mono text-xs text-[var(--text-dim)] flex flex-col gap-6">
              <div>
                <h4 className="text-[var(--text-dim)] font-medium mb-1 uppercase tracking-wider">Role</h4>
                <p className="text-[var(--text-muted)]">Lead AI Engineer</p>
              </div>
              <div>
                <h4 className="text-[var(--text-dim)] font-medium mb-1 uppercase tracking-wider">Timeline</h4>
                <p className="text-[var(--text-muted)]">12 Weeks (Q1 2026)</p>
              </div>
              <div>
                <h4 className="text-[var(--text-dim)] font-medium mb-1 uppercase tracking-wider">Technologies</h4>
                <p className="text-[var(--text-muted)]">Python, LangGraph, Qdrant, Claude 3.5 Sonnet, AWS ECS</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-10">
              <div>
                <h3 className="text-xl mb-4 text-white font-medium">The Context</h3>
                <p className="text-[var(--text-muted)] leading-[1.7] font-light">
                  Enterprise workflows were heavily dependent on manual data entry and unstructured review steps, creating a 12-hour turnaround bottleneck. Automated scripts failed to handle variance in document formats and unstructured inputs.
                </p>
              </div>
              <div>
                <h3 className="text-xl mb-4 text-white font-medium">The Challenge</h3>
                <p className="text-[var(--text-muted)] leading-[1.7] font-light">
                  Parsing unstructured data tables and files into strict schema formats. Standard retrieval-augmented generation suffered from context leakage and output hallucination loops, causing errors in downstream production databases.
                </p>
              </div>
            </div>
          </div>

          {/* Premium Interactive Architecture Case Study */}
          <ArchitectureStory />
        </div>
      </section>

      {/* SECTION 5: SKILLS CONSOLE (REPLACES LISTS) */}
      <section className="py-40 border-b border-[var(--grid-line)]">
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
            <span>04 / Technical Skills</span>
            <div className="flex-1 h-[1px] bg-[var(--grid-line)]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {skillCategories.map((cat) => (
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
                        <div 
                          className="bg-white h-full transition-all duration-500" 
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: PREMIUM EXPERIENCE & EDUCATION TIMELINES */}
      <section className="py-40 border-b border-[var(--grid-line)]">
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            
            {/* Experience timeline */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
                <span>05.1 / Professional Experience</span>
                <div className="flex-1 h-[1px] bg-[var(--grid-line)]" />
              </div>
              <div className="flex flex-col gap-10 border-l border-[var(--grid-line)] pl-8">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative flex flex-col gap-2">
                    {/* Node indicator */}
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

            {/* Education timeline */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
                <span>05.2 / Education</span>
                <div className="flex-1 h-[1px] bg-[var(--grid-line)]" />
              </div>
              <div className="flex flex-col gap-10 border-l border-[var(--grid-line)] pl-8">
                {education.map((edu) => (
                  <div key={edu.id} className="relative flex flex-col gap-2">
                    <div className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-[#050506] border-2 border-zinc-700 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                    </div>
                    <span className="font-mono text-[10px] text-gray-500 uppercase">{edu.timeline}</span>
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

      {/* SECTION 7: SERVICES CORE OFFERINGS */}
      {services.length > 0 && (
        <section className="py-40 border-b border-[var(--grid-line)]">
          <div className="max-w-[1400px] mx-auto px-[8%]">
            <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
              <span>06 / What I Build</span>
              <div className="flex-1 h-[1px] bg-[var(--grid-line)]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((srv) => (
                <div key={srv.id} className="bg-[#09090b] border border-[var(--grid-line)] rounded-xl p-8 hover:border-gray-800 transition-all duration-300 flex flex-col justify-between min-h-[220px]">
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
      )}

      {/* SECTION 8: CLIENT TESTIMONIALS CAROUSEL */}
      {testimonials.length > 0 && (
        <section className="py-40 border-b border-[var(--grid-line)]">
          <div className="max-w-[1400px] mx-auto px-[8%]">
            <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
              <span>07 / Recommendations</span>
              <div className="flex-1 h-[1px] bg-[var(--grid-line)]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-[#09090b] border border-[var(--grid-line)] rounded-xl p-8 flex flex-col justify-between gap-8 shadow-sm">
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed italic font-light">
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
      )}

      {/* SECTION 9: LIVE AI SYSTEMS ARCHITECTURE */}
      <section id="thinking" className="py-40 border-b border-[var(--grid-line)]">
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-8 flex items-center gap-2">
            <span>08 / Engineering Process</span>
            <div className="flex-1 h-[1px] bg-[var(--grid-line)]" />
          </div>
          <div className="max-w-[800px] mb-12">
            <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-light text-white tracking-tight leading-snug mb-4">
              How I design and build <span className="serif-italic text-[var(--text-muted)]">production systems.</span>
            </h2>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed font-light max-w-[600px]">
              A live simulation of the complete request lifecycle—from query ingestion to production processing and delivery.
            </p>
          </div>
          <AIPipelineViz />
        </div>
      </section>

      {/* SECTION 10: CERTIFICATIONS & LEARNING */}
      <section id="certifications" className="py-40 border-b border-[var(--grid-line)]">
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
            <span>09 / Certifications</span>
            <div className="flex-1 h-[1px] bg-[var(--grid-line)]" />
          </div>
          <Certifications initialCertificates={certificates} />
        </div>
      </section>

      {/* SECTION 11: WRITING */}
      <section id="writing" className="py-40 border-b border-[var(--grid-line)]">
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
            <span>10 / Technical Writing</span>
            <div className="flex-1 h-[1px] bg-[var(--grid-line)]" />
          </div>

          <div className="flex flex-col">
            {dbPosts.map((post) => {
              const categories: string[] = typeof post.categories === 'string' ? JSON.parse(post.categories || '[]') : (post.categories || []);
              return (
                <Link 
                  href={`/blog/${post.slug}`} 
                  key={post.id}
                  className="grid grid-cols-[1fr_3fr_1fr] items-center py-10 border-t border-[var(--grid-line)] hover:pl-5 group transition-all duration-300 ease-out last:border-b"
                >
                  <div className="font-mono text-xs text-[var(--text-dim)]">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase() : 'DRAFT'}
                  </div>
                  <div className="text-xl text-white group-hover:text-[var(--accent)] transition-colors duration-300 font-light">
                    {post.title}
                  </div>
                  <div className="font-mono text-[10px] text-[var(--text-dim)] text-right">
                    {categories.join(' & ').toUpperCase()}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 12: CONTACT */}
      <section id="build" className="py-40 relative overflow-hidden">
        {/* Ambient radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 80%, rgba(var(--accent-rgb), 0.04) 0%, transparent 70%)',
          }}
        />

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
                <p className="text-[var(--text-muted)] font-light mb-16 leading-[1.8] text-[0.95rem] max-w-[480px]">
                  Whether you are looking to design robust backend architectures, scale query systems, or integrate intelligence into high-touch interfaces, I&apos;m always open to talking design and implementation.
                </p>
              </div>

              {/* Contact details with icons */}
              <div className="flex flex-col gap-5 font-mono text-xs">
                <a
                  href={`mailto:${settings.contactEmail || 'dhruv.dobariya0641@gmail.com'}`}
                  className="group flex items-center gap-3 text-[var(--text-muted)] hover:text-white transition-colors duration-300"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-40 group-hover:opacity-100 transition-opacity"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  <span>{settings.contactEmail || 'dhruv.dobariya0641@gmail.com'}</span>
                </a>
                <div className="flex items-center gap-3 text-[var(--text-muted)]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-40"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>San Francisco, CA &amp; Remote</span>
                </div>

                {/* Social links */}
                <div className="flex items-center gap-4 mt-4 pt-6 border-t border-[var(--grid-line)]">
                  <a
                    href="https://github.com/dhruv0641"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-[var(--text-dim)] hover:text-white transition-colors duration-300"
                    aria-label="GitHub Profile"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-50 group-hover:opacity-100 transition-opacity"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                    <span className="uppercase tracking-wider text-[10px]">GitHub</span>
                  </a>
                  <a
                    href="https://linkedin.com/in/dhruv-dobariya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-[var(--text-dim)] hover:text-white transition-colors duration-300"
                    aria-label="LinkedIn Profile"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-50 group-hover:opacity-100 transition-opacity"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    <span className="uppercase tracking-wider text-[10px]">LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
