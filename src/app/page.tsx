import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import ThoughtWave from '@/components/ThoughtWave';
import CodeComparer from '@/components/CodeComparer';
import Certifications from '@/components/Certifications';
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

      {/* SECTION 5: DEEP CASE STUDY (KOMBEE) */}
      <section id="case" className="py-40 border-b border-[rgba(255,255,255,0.04)]">
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
            <span>03 / Deep Case Study</span>
            <div className="flex-1 h-[1px] bg-[rgba(255,255,255,0.04)]" />
          </div>

          <div className="max-w-[800px] mb-20">
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.15] text-[var(--text)] font-light">
              Kombee: Orchestrating enterprise workflows with validated agentic pipelines.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 mb-32">
            <div className="font-mono text-xs text-[var(--text-dim)] flex flex-col gap-10">
              <div>
                <h4 className="text-[var(--text-dim)] font-medium mb-1">ROLE</h4>
                <p className="text-[var(--text-muted)]">Lead AI Engineer</p>
              </div>
              <div className="mt-6">
                <h4 className="text-[var(--text-dim)] font-medium mb-1">TIMELINE</h4>
                <p className="text-[var(--text-muted)]">12 Weeks (Q1 2026)</p>
              </div>
              <div className="mt-6">
                <h4 className="text-[var(--text-dim)] font-medium mb-1">TECHNOLOGIES</h4>
                <p className="text-[var(--text-muted)]">Python, LangGraph, Qdrant, Claude 3.5 Sonnet, AWS ECS</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-12">
              <div>
                <h3 className="text-2xl mb-6 text-[var(--text)] font-light">The Context</h3>
                <p className="text-[var(--text-muted)] leading-[1.7] font-light">
                  Enterprise workflows were heavily dependent on manual data entry and unstructured review steps, creating a 12-hour turnaround bottleneck. Automated scripts failed to handle variance in document formats and unstructured inputs.
                </p>
              </div>
              <div className="mt-8">
                <h3 className="text-2xl mb-6 text-[var(--text)] font-light">The Challenge</h3>
                <p className="text-[var(--text-muted)] leading-[1.7] font-light">
                  Parsing unstructured data tables and files into strict schema formats. Standard retrieval-augmented generation suffered from context leakage and output hallucination loops, causing errors in downstream production databases.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <h3 className="text-2xl mb-6 text-[var(--text)] font-light">System Architecture</h3>
            <p className="text-[var(--text-muted)] leading-[1.7] font-light max-w-[800px]">
              To automate the workflow without compromising data integrity, we built a multi-stage validation pipeline using LangGraph state machines. The architecture transitions from raw ingestion through offline evaluations and real-time schema validation before integration.
            </p>
            
            {/* Technical Diagram Container */}
            <div className="bg-[var(--surface)] border border-[var(--grid-line)] rounded-xl py-16 px-6 lg:px-16 my-16 flex justify-center items-center overflow-x-auto">
              <svg className="min-w-[800px] w-full max-w-[800px] h-auto" viewBox="0 0 800 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Node 1: Manual Process */}
                <rect className="diag-node" x="10" y="40" width="105" height="40" rx="4"/>
                <text className="diag-text bold" x="62.5" y="64">MANUAL PROCESS</text>
                
                {/* Connector 1 -> 2 */}
                <path className="diag-line" d="M115 60H135"/>
                
                {/* Node 2: Prompt Engineering */}
                <rect className="diag-node" x="135" y="40" width="115" height="40" rx="4"/>
                <text className="diag-text bold" x="192.5" y="64">PROMPT ENG</text>
                
                {/* Connector 2 -> 3 */}
                <path className="diag-line" d="M250 60H270"/>
                
                {/* Node 3: Prompt Evaluation */}
                <rect className="diag-node" x="270" y="40" width="130" height="40" rx="4"/>
                <text className="diag-text bold" x="335" y="64">PROMPT EVAL (A/B)</text>
                
                {/* Connector 3 -> 4 */}
                <path className="diag-line" d="M400 60H420"/>
                
                {/* Node 4: Output Validation */}
                <rect className="diag-node accented" x="420" y="40" width="125" height="40" rx="4"/>
                <text className="diag-text bold" x="482.5" y="64">OUTPUT VALIDATION</text>
                
                {/* Connector 4 -> 5 */}
                <path className="diag-line accented" d="M545 60H565"/>
                
                {/* Node 5: REST API Integration */}
                <rect className="diag-node" x="565" y="40" width="125" height="40" rx="4"/>
                <text className="diag-text bold" x="627.5" y="64">REST API INTEGRATION</text>
                
                {/* Connector 5 -> 6 */}
                <path className="diag-line accented" d="M690 60H710"/>
                
                {/* Node 6: Production Workflow */}
                <rect className="diag-node accented" x="710" y="40" width="80" height="40" rx="4"/>
                <text className="diag-text bold" x="750" y="64">PRODUCTION</text>
                
                {/* Feedback loop from Validation (Node 4) to Prompt Engineering (Node 2) */}
                <path className="diag-line accented" d="M482.5 80V140H192.5V80" />
                <rect className="diag-node accented" x="277.5" y="125" width="115" height="26" rx="3"/>
                <text className="diag-text mono" x="335" y="141">RETRY ON VALIDATION FAIL</text>
              </svg>
            </div>
          </div>

          <div className="max-w-[900px] flex flex-col gap-10 mt-16">
            <div>
              <h3 className="text-2xl mb-4 text-[var(--text)] font-light">What Failed &amp; What Changed</h3>
              <p className="text-[var(--text-muted)] leading-[1.7] font-light">
                The initial major bottleneck occurred when agents were tasked with fetching and parsing unstructured enterprise data sheets. The LLM regularly failed to extract structured values correctly, dropping formatting elements or parsing columns out of order.
              </p>
              <p className="text-[var(--text-muted)] leading-[1.7] font-light mt-6">
                Instead of hoping prompt updates would solve this, we hard-coded a deterministic verification state. The agent was forced to parse raw inputs into structured Pydantic schemas and cross-reference them with checksum verification rules. If the verification failed, the state machine rejected the output, adjusted the generation temperature, and triggered a retry loop. This strict validation layer brought database sync errors down to near zero.
              </p>
            </div>
            <div className="mt-10 border-t border-[rgba(255,255,255,0.04)] pt-12">
              <h3 className="text-2xl mb-4 text-[var(--text)] font-light">The Outcome</h3>
              <p className="text-[var(--text-muted)] leading-[1.7] font-light">
                The automation pipeline went live across operations teams. Processing time was reduced from 12 hours of manual sorting to just 4 minutes of automated verification—representing a 180x speedup with a verified database consistency rate of 99.9%.
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

      {/* SECTION 8: CERTIFICATIONS & LEARNING */}
      <section id="certifications" className="py-40 border-b border-[rgba(255,255,255,0.04)]">
        <div className="max-w-[1400px] mx-auto px-[8%]">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
            <span>06 / Certifications &amp; Learning</span>
            <div className="flex-1 h-[1px] bg-[rgba(255,255,255,0.04)]" />
          </div>
          <Certifications />
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
                  <a href={`mailto:${settings.contactEmail || 'dhruv.dobariya0641@gmail.com'}`} className="hover:text-[var(--accent)] transition-colors duration-300">
                    {settings.contactEmail || 'dhruv.dobariya0641@gmail.com'}
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
