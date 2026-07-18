import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import ThoughtWave from '@/components/ThoughtWave';
import CodeComparer from '@/components/CodeComparer';
import ImpactCounters from '@/components/ImpactCounters';
import ContactForm from '@/components/ContactForm';
import Link from 'next/link';

export default async function Page() {
  // 1. Fetch Dynamic Data from SQLite Repository
  const dbSettings = await db.select().from(schema.settings);
  const dbProjects = await db
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.isDraft, 0))
    .orderBy(schema.projects.position);

  const dbPosts = await db
    .select()
    .from(schema.blogPosts)
    .where(eq(schema.blogPosts.isDraft, 0))
    .orderBy(desc(schema.blogPosts.createdAt))
    .limit(3);

  // Map settings key-values
  const settings = dbSettings.reduce((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {} as Record<string, string>);

  const bio = settings.bio || 'Applied AI Systems Architect.';

  return (
    <>
      {/* SECTION 1: INTRODUCTION (HERO) */}
      <section id="intro" className="min-h-screen flex items-center pt-[140px] pb-20 border-b border-[rgba(255,255,255,0.04)]">
        <div className="max-w-[1400px] mx-auto px-[8%] w-full relative">
          <div className="max-w-[900px] z-10 relative">
            <h1 className="text-[clamp(2.5rem,6.5vw,5.5rem)] font-light leading-[1.1] mb-10 tracking-tight text-[var(--text)]">
              I build <span className="serif-italic">intelligent systems</span><br />that feel human.
            </h1>
            <p className="text-[clamp(1.1rem,2vw,1.4rem)] text-[var(--text-muted)] max-w-[640px] leading-[1.6] mb-14 font-light">
              {bio}
            </p>
            <a href="#work" className="hero-cta">
              <span>Explore Selected Work</span>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 1V14M7.5 14L1 7.5M7.5 14L14 7.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </a>
          </div>
          <ThoughtWave />
        </div>
      </section>

      {/* SECTION 2: IDENTITY */}
      <section id="identity" className="py-40 border-b border-[rgba(255,255,255,0.04)]">
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-8 flex items-center gap-2">
            <span>01 / Identity</span>
            <div className="flex-1 h-[1px] bg-[rgba(255,255,255,0.04)]" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16">
            <h2 className="text-[clamp(1.8rem,4vw,3rem)] leading-[1.25] font-light text-[var(--text)]">
              Design is not the veneer. <span className="serif-italic">It is the architecture.</span>
            </h2>
            <div>
              <p className="text-[var(--text-muted)] text-[1.05rem] leading-[1.7] font-light mb-10">
                I operate at the intersection of machine cognition and human agency. Most modern AI products expose the raw, chaotic mechanics of underlying models. I believe software should tame that chaos—delivering high-utility, predictable, and deeply respectful interactions.
              </p>
              <p className="text-[var(--text-muted)] text-[1.05rem] leading-[1.7] font-light">
                I write robust, multi-agent state machines, optimized retrieval schemas, and evaluation harnesses. My work is built to be fast, production-ready, and architected to safeguard user attention instead of taxing it.
              </p>
            </div>
          </div>

          {/* SECTION 3: BELIEFS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-24">
            <div className="border-t border-[rgba(255,255,255,0.04)] pt-8">
              <span className="font-mono text-[10px] text-[var(--accent)] mb-6 block">01_</span>
              <h3 className="text-xl mb-4 text-[var(--text)] font-light">Human first, model second</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed font-light">
                AI should elevate and extend human capability, not replace or simulate it. We construct software to empower human intent, not to create automated noise.
              </p>
            </div>
            <div className="border-t border-[rgba(255,255,255,0.04)] pt-8">
              <span className="font-mono text-[10px] text-[var(--accent)] mb-6 block">02_</span>
              <h3 className="text-xl mb-4 text-[var(--text)] font-light">Deterministic guardrails</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed font-light">
                Stochastic models produce unpredictable results. We wrap intelligence in mathematical guardrails, ensuring reliability in high-stakes environments.
              </p>
            </div>
            <div className="border-t border-[rgba(255,255,255,0.04)] pt-8">
              <span className="font-mono text-[10px] text-[var(--accent)] mb-6 block">03_</span>
              <h3 className="text-xl mb-4 text-[var(--text)] font-light">Performance is respect</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed font-light">
                Lag is cognitive drag. Orchestration, retrieval, and interface rendering are optimized for zero latency, respecting the flow state of the operator.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SELECTED WORK */}
      <section id="work" className="py-40 border-b border-[rgba(255,255,255,0.04)]">
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
            <span>02 / Selected Work</span>
            <div className="flex-1 h-[1px] bg-[rgba(255,255,255,0.04)]" />
          </div>

          <div className="flex flex-col gap-48">
            {dbProjects.map((project, index) => {
              const isEven = index % 2 === 0;
              const metrics: Array<{ value: string; label: string }> = JSON.parse(project.metrics || '[]');
              const images: string[] = JSON.parse(project.screenshots || '[]');
              const projectImg = images[0] || '/uploads/hero_visual.png';

              return (
                <div 
                  key={project.id} 
                  className={`grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-24 items-center ${!isEven ? 'lg:grid-cols-[1fr_1.2fr]' : ''}`}
                >
                  {isEven && (
                    <div className="project-visual overflow-hidden">
                      <img 
                        src={projectImg} 
                        alt={`${project.title} Visual representation`} 
                        className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity duration-500 ease-out" 
                      />
                    </div>
                  )}

                  <div>
                    <div className="font-mono text-[10px] text-[var(--text-dim)] mb-6 flex gap-6">
                      <span>0{index + 1}. {project.subtitle?.toUpperCase()}</span>
                      <span>{project.timeline}</span>
                    </div>
                    <h3 className="text-[clamp(2rem,4vw,3rem)] mb-6 text-[var(--text)] font-light">{project.title}</h3>
                    <p className="text-[var(--text-muted)] leading-[1.7] mb-10 font-light text-sm lg:text-base">
                      {project.problem}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-8 border-t border-[rgba(255,255,255,0.04)] pt-8">
                      {metrics.slice(0, 2).map((m, idx) => (
                        <div key={idx}>
                          <div className="font-mono text-2xl text-[var(--text)] mb-2 font-medium">{m.value}</div>
                          <div className="text-xs text-[var(--text-muted)] font-light">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {!isEven && (
                    <div className="project-visual overflow-hidden lg:order-last order-first">
                      <img 
                        src={projectImg} 
                        alt={`${project.title} Visual representation`} 
                        className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity duration-500 ease-out" 
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: DEEP CASE STUDY (PULSE) */}
      <section id="case" className="py-40 border-b border-[rgba(255,255,255,0.04)]">
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
            <span>03 / Deep Case Study</span>
            <div className="flex-1 h-[1px] bg-[rgba(255,255,255,0.04)]" />
          </div>

          <div className="max-w-[800px] mb-20">
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.15] text-[var(--text)] font-light">
              Pulse: Re-engineering market research with agentic state machines.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 mb-32">
            <div className="font-mono text-xs text-[var(--text-dim)] flex flex-col gap-10">
              <div>
                <h4 className="text-[var(--text-dim)] font-medium mb-1">ROLE</h4>
                <p className="text-[var(--text-muted)]">Lead AI Systems Architect</p>
              </div>
              <div className="mt-6">
                <h4 className="text-[var(--text-dim)] font-medium mb-1">TIMELINE</h4>
                <p className="text-[var(--text-muted)]">12 Weeks (Q1 2025)</p>
              </div>
              <div className="mt-6">
                <h4 className="text-[var(--text-dim)] font-medium mb-1">TECHNOLOGIES</h4>
                <p className="text-[var(--text-muted)]">Python, LangGraph, Qdrant, Claude 3.5, AWS ECS</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-12">
              <div>
                <h3 className="text-2xl mb-6 text-[var(--text)] font-light">The Context</h3>
                <p className="text-[var(--text-muted)] leading-[1.7] font-light">
                  Institutional research analysts were spending an average of 12 hours aggregating, cleaning, and verifying information to compile a single comprehensive market brief. Latency in compiling reports directly impacted asset pricing decisions.
                </p>
              </div>
              <div className="mt-8">
                <h3 className="text-2xl mb-6 text-[var(--text)] font-light">The Challenge</h3>
                <p className="text-[var(--text-muted)] leading-[1.7] font-light">
                  Our initial prototype relied on flat retrieval-augmented generation. It suffered from chronic hallucination loops, missed edge cases buried in structured filings, and expanded queries so broadly that context windows overflowed, producing muddy summaries.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <h3 className="text-2xl mb-6 text-[var(--text)] font-light">System Architecture</h3>
            <p className="text-[var(--text-muted)] leading-[1.7] font-light max-w-[800px]">
              To solve the retrieval bottleneck, we introduced a <strong>Hierarchical Vector Tree</strong>. Instead of performing a flat lookup against isolated document chunks, the system recursively indexes files into parent-child trees. The outer coordinator routes queries to high-level nodes, descending to micro-chunks only when specific metrics or citations are demanded.
            </p>
            
            {/* Technical Diagram Container */}
            <div className="bg-[var(--surface)] border border-[var(--grid-line)] rounded-xl py-16 px-6 lg:px-16 my-16 flex justify-center items-center overflow-x-auto">
              <svg className="min-w-[800px] w-full max-w-[800px] h-auto" viewBox="0 0 800 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Node: Coordinator */}
                <rect className="diag-node accented" x="330" y="20" width="140" height="40" rx="4"/>
                <text className="diag-text bold" x="400" y="44">QUERY COORDINATOR</text>
                
                {/* Lines to level 1 */}
                <path className="diag-line accented" d="M400 60V90"/>
                <path className="diag-line" d="M400 75H180V90"/>
                <path className="diag-line" d="M400 75H620V90"/>
                
                {/* Nodes: Level 1 */}
                <rect className="diag-node" x="110" y="90" width="140" height="40" rx="4"/>
                <text className="diag-text bold" x="180" y="114">PARENT DOCUMENT A</text>
                
                <rect className="diag-node" x="330" y="90" width="140" height="40" rx="4"/>
                <text className="diag-text bold" x="400" y="114">PARENT DOCUMENT B</text>
                
                <rect className="diag-node" x="550" y="90" width="140" height="40" rx="4"/>
                <text className="diag-text bold" x="620" y="114">PARENT DOCUMENT C</text>
                
                {/* Lines to level 2 */}
                <path className="diag-line" d="M180 130V160"/>
                <path className="diag-line" d="M180 145H90V160"/>
                <path className="diag-line" d="M180 145H270V160"/>
                
                <path className="diag-line" d="M400 130V160"/>
                <path className="diag-line" d="M620 130V160"/>
                
                {/* Nodes: Level 2 (Chunks) */}
                <rect className="diag-node" x="30" y="160" width="100" height="30" rx="3"/>
                <text className="diag-text mono" x="80" y="178">SUB-CHUNK A1</text>
                
                <rect className="diag-node" x="135" y="160" width="90" height="30" rx="3"/>
                <text className="diag-text mono" x="180" y="178">SUB-CHUNK A2</text>
                
                <rect className="diag-node" x="230" y="160" width="90" height="30" rx="3"/>
                <text className="diag-text mono" x="275" y="178">SUB-CHUNK A3</text>
                
                <rect className="diag-node" x="350" y="160" width="100" height="30" rx="3"/>
                <text className="diag-text mono" x="400" y="178">SUB-CHUNK B1</text>
                
                <rect className="diag-node" x="570" y="160" width="100" height="30" rx="3"/>
                <text className="diag-text mono" x="620" y="178">SUB-CHUNK C1</text>
                
                {/* Feedback loop connection back to coordinator */}
                <path className="diag-line accented" d="M80 190V230H720V120H690" />
                <path className="diag-line accented" d="M720 230H400V205" />
                
                <rect className="diag-node accented" x="340" y="205" width="120" height="26" rx="3"/>
                <text className="diag-text mono" x="400" y="221">STATE EVALUATION LOOP</text>
              </svg>
            </div>
          </div>

          <div className="max-w-[900px] flex flex-col gap-10 mt-16">
            <div>
              <h3 className="text-2xl mb-4 text-[var(--text)] font-light">What Failed &amp; What Changed</h3>
              <p className="text-[var(--text-muted)] leading-[1.7] font-light">
                The first major bottleneck occurred when agents were tasked with fetching macro-economic data tables. The LLM regularly failed to extract structured numeric values correctly, dropping trailing zeros or parsing columns out of order.
              </p>
              <p className="text-[var(--text-muted)] leading-[1.7] font-light mt-6">
                Instead of hoping prompt updates would solve this, we hard-coded a deterministic verification state. The agent was forced to parse raw HTML tables into mathematical matrices and cross-reference them with checksum totals. If the checksum failed, the state machine rejected the output, refreshed the search query, and attempted a secondary target database pull. This strict state separation brought retrieval errors down to near zero.
              </p>
            </div>
            <div className="mt-10 border-t border-[rgba(255,255,255,0.04)] pt-12">
              <h3 className="text-2xl mb-4 text-[var(--text)] font-light">The Outcome</h3>
              <p className="text-[var(--text-muted)] leading-[1.7] font-light">
                Pulse went live across three institutional research desks. Turnaround time for an analyst brief was reduced from 12 hours of manual investigation to just 4 minutes of automated verification, delivering a 180x speedup with a verifiable accuracy rate of 98.4%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: THE PROCESS */}
      <section id="process" className="py-40 border-b border-[rgba(255,255,255,0.04)]">
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
            <span>04 / The Process</span>
            <div className="flex-1 h-[1px] bg-[rgba(255,255,255,0.04)]" />
          </div>

          <div className="flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-16 py-16 border-b border-[rgba(255,255,255,0.04)]">
              <div className="font-mono text-xl text-[var(--accent)]">01/</div>
              <div>
                <h3 className="text-xl mb-4 text-[var(--text)] font-light">Domain Slicing &amp; Modeling</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed font-light max-w-[640px]">
                  Every problem starts by isolating the uncertainty. We map the domain space, identifying where deterministic logic is absolute and where stochastic models can add reasoning utility.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-16 py-16 border-b border-[rgba(255,255,255,0.04)]">
              <div className="font-mono text-xl text-[var(--accent)]">02/</div>
              <div>
                <h3 className="text-xl mb-4 text-[var(--text)] font-light">Retrieval &amp; Index Design</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed font-light max-w-[640px]">
                  We build specialized semantic index layers. Information must be structurally aligned for LLM consumption, utilizing tree hierarchical indexes, hybrid weights, and clean semantic structures.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-16 py-16 border-b border-[rgba(255,255,255,0.04)]">
              <div className="font-mono text-xl text-[var(--accent)]">03/</div>
              <div>
                <h3 className="text-xl mb-4 text-[var(--text)] font-light">Orchestration &amp; State Guardrails</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed font-light max-w-[640px]">
                  We design the agentic loops using state machines. Every model invocation is framed by explicit expectations, timeout parameters, context limitations, and hard output validations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-16 py-16">
              <div className="font-mono text-xl text-[var(--accent)]">04/</div>
              <div>
                <h3 className="text-xl mb-4 text-[var(--text)] font-light">Evaluation Cycles</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed font-light max-w-[640px]">
                  Prompt tweaking is not engineering. We run offline test cycles on actual dataset runs to evaluate model versions, temperature configs, and retrieval configurations mathematically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: ENGINEERING THINKING (CODE COMPARER) */}
      <section id="thinking" className="py-40 border-b border-[rgba(255,255,255,0.04)]">
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
            <span>05 / Engineering Thinking</span>
            <div className="flex-1 h-[1px] bg-[rgba(255,255,255,0.04)]" />
          </div>
          <CodeComparer />
        </div>
      </section>

      {/* SECTION 8: IMPACT */}
      <section id="impact" className="py-40 border-b border-[rgba(255,255,255,0.04)]">
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
            <span>06 / Cumulative Impact</span>
            <div className="flex-1 h-[1px] bg-[rgba(255,255,255,0.04)]" />
          </div>
          <ImpactCounters />
        </div>
      </section>

      {/* SECTION 9: WRITING */}
      <section id="writing" className="py-40 border-b border-[rgba(255,255,255,0.04)]">
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
            <span>07 / Engineering Thoughts</span>
            <div className="flex-1 h-[1px] bg-[rgba(255,255,255,0.04)]" />
          </div>

          <div className="flex flex-col">
            {dbPosts.map((post) => {
              const categories: string[] = JSON.parse(post.categories || '[]');
              return (
                <Link 
                  href={`/blog/${post.slug}`} 
                  key={post.id}
                  className="grid grid-cols-[1fr_3fr_1fr] items-center py-10 border-t border-[rgba(255,255,255,0.04)] hover:pl-5 group transition-all duration-300 ease-out last:border-b"
                >
                  <div className="font-mono text-xs text-[var(--text-dim)]">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase() : 'DRAFT'}
                  </div>
                  <div className="text-xl text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-300 font-light">
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

      {/* SECTION 10: BUILD TOGETHER (CONTACT) */}
      <section id="build" className="py-40">
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
            <span>08 / Let&apos;s Build Together</span>
            <div className="flex-1 h-[1px] bg-[rgba(255,255,255,0.04)]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-24">
            <div>
              <h3 className="text-[clamp(2rem,4vw,3.5rem)] mb-10 text-[var(--text)] font-light leading-snug">
                Let&apos;s build systems <span className="serif-italic">that stand the test of time.</span>
              </h3>
              <p className="text-[var(--text-muted)] font-light mb-16 leading-relaxed">
                Whether you are looking to design robust agent structures, scale semantic search databases, or integrate intelligence into high-touch interfaces, I&apos;m always open to talking design and implementation.
              </p>
              <div className="font-mono text-xs flex flex-col gap-6">
                <div>
                  <span className="text-[var(--text-dim)] mr-4">LOC /</span>
                  <span>San Francisco, CA &amp; Remote</span>
                </div>
                <div>
                  <span className="text-[var(--text-dim)] mr-4">EML /</span>
                  <a href={`mailto:${settings.contactEmail || 'arthur@vance.engineering'}`} className="hover:text-[var(--accent)] transition-colors duration-300">
                    {settings.contactEmail || 'arthur@vance.engineering'}
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
