import { ProjectData, BlogPostData } from '@/types';
import { CertificateData } from '@/services/certificateService';
import { SkillCategory } from '@/services/skillService';
import { ExperienceData } from '@/services/experienceService';
import { EducationData } from '@/services/educationService';
import { TestimonialData } from '@/services/testimonialService';
import { ServiceData } from '@/services/coreService';
import { SeoData } from '@/services/seoService';

export const fallbackSettings: Record<string, string> = {
  name: 'Dhruv Dobariya',
  title: 'Applied AI Engineer',
  tagline: 'I build intelligent systems that feel human.',
  bio: 'An Applied AI Engineer designing the orchestration structures, state guardrails, and validation pipelines that transform stochastic model outputs into robust, deterministic systems.',
  ctaText: 'Explore Selected Work',
  contactEmail: 'dhruv.dobariya0641@gmail.com',
  githubUrl: 'https://github.com/dhruv0641',
  linkedinUrl: 'https://linkedin.com/in/dhruv-dobariya',
  instagramUrl: 'https://instagram.com',
  status: 'AVAILABLE FOR NEW WORK',
  themeMode: 'dark',
  colorBg: '#090909',
  colorSurface: '#111111',
  colorText: '#F5F5F5',
  colorTextMuted: '#A1A1AA',
  colorAccent: '#0066FF',
  colorAccentRgb: '0, 102, 255',
  radius: '8px',
  showNoise: '1',
  reduceMotion: '0',
  cursorAura: '1',
  thoughtWave: '1',
};

export const fallbackProfile = {
  id: 'default-profile',
  name: 'Dhruv Dobariya',
  title: 'Applied AI Engineer',
  tagline: 'I build intelligent systems that feel human.',
  bio: 'An Applied AI Engineer designing the orchestration structures, state guardrails, and validation pipelines that transform stochastic model outputs into robust, deterministic systems.',
  contactEmail: 'dhruv.dobariya0641@gmail.com',
  location: 'Surat, India',
  resumeUrl: '#',
};

export const fallbackProjects: ProjectData[] = [
  {
    id: 'project-1',
    title: 'Atlas',
    slug: 'atlas',
    subtitle: 'Context-Aware Enterprise Memory Layer',
    role: 'Lead AI Engineer',
    company: 'Cognitive Infrastructure Corp',
    timeline: '6 Months (2025)',
    problem: 'Enterprise support portals suffered from high turnaround latency (~12 hours) and inconsistent query response context, loading massive duplicate information sets into token histories.',
    challenge: 'Scaling real-time semantic caching under 200ms while maintaining vector semantic overlap checks across multi-tenant permission layers.',
    solution: 'Orchestrated dynamic cache routing using hierarchical document tree indexing combined with semantic similarity searches in pgvector, cutting down token load speeds.',
    techStack: ['Next.js', 'Python', 'pgvector', 'Claude API', 'FastAPI'],
    metrics: [
      { value: '-71%', label: 'First-response latency' },
      { value: '38%', label: 'Autonomous ticket resolution' }
    ],
    screenshots: ['/uploads/hero_visual.png'],
    githubUrl: 'https://github.com/dhruv0641/atlas',
    demoUrl: 'https://atlas.dhruv.dev',
    isFeatured: true,
    isPinned: true,
    isDraft: false,
    position: 0,
  },
  {
    id: 'project-2',
    title: 'Forge',
    slug: 'forge',
    subtitle: 'CI-Integrated Code Quality Evaluator',
    role: 'Core Architect',
    company: 'LogiFlow Solutions',
    timeline: '4 Months (2024)',
    problem: 'Developer code review loops created high release latency; senior engineers spent hours flagging minor syntax, styling, and structural logic bugs.',
    challenge: 'Parsing complex GitHub diff targets under rate limits without missing deep thread concurrency risks or memory allocation bugs.',
    solution: 'Built a multi-agent logic checker using Claude.js API pipelines that evaluates changes relative to local workspace specifications, compiling results in CI logs.',
    techStack: ['TypeScript', 'Node.js', 'GitHub Actions', 'Claude API', 'Docker'],
    metrics: [
      { value: '-45%', label: 'Review cycle turnaround' },
      { value: '89%', label: 'PR suggestion acceptance' }
    ],
    screenshots: ['/uploads/hero_visual.png'],
    githubUrl: 'https://github.com/dhruv0641/forge',
    demoUrl: 'https://forge.dhruv.dev',
    isFeatured: true,
    isPinned: false,
    isDraft: false,
    position: 1,
  }
];

export const fallbackBlogs: BlogPostData[] = [
  {
    id: 'blog-1',
    title: 'Designing for the Stochastic Era: Interaction Beyond Chat',
    slug: 'designing-stochastic-interaction',
    excerpt: 'Text prompts force high cognitive load. Modern architectures should isolate agent execution states into structured, visual nodes.',
    contentMarkdown: `## The Chat Interface Fallacy
Most builders believe that wrapping a raw LLM text input in a chat UI is the final form of AI products. It is actually the most primitive. Text prompts force high cognitive load on the user, requiring them to learn magic phrases to control stochastic models.

### Moving to Object-Oriented AI
Rather than forcing natural language dialog, modern architectures should isolate agent execution states into structured, visual nodes. Users interact with predictable dashboard triggers, while the agent handles retrieval, context checking, and schema evaluation in the background.

\`\`\`python
# Example: Running a structured execution state
from pydantic import BaseModel

class UserIntent(BaseModel):
    intent_type: str
    target_id: str
    parameters: dict
\`\`\`

### Guidelines for Stochastic UX
1. **Never show raw tokens**: Render completed structural elements instead of typing streams.
2. **Expose system status**: Give the user dynamic progress labels (e.g. *Retrieving documents... Checking checksums...*) rather than a blank loader.
3. **Introduce deterministic fallbacks**: When confidence values fall under thresholds, route actions back to structured inputs.`,
    categories: ['Product', 'Design'],
    tags: ['UX', 'Product Thinking', 'Agents'],
    readingTime: 6,
    isDraft: false,
    publishedAt: new Date().toISOString(),
  },
  {
    id: 'blog-2',
    title: 'Why Vector Databases are Not Search Engine Substitutes',
    slug: 'vector-databases-are-not-search-engines',
    excerpt: 'Vector similarity searches look for global conceptual overlap, but fail on exact string queries and numerical identifiers.',
    contentMarkdown: `## Semantic Search is Not Keyword Matching
Many engineers drop vector embeddings (e.g., Cosine Similarity checks on vector databases) into their applications and expect it to act like search. In production, this breaks.

### The Limitations of Cosine Similarity
Vector similarity searches look for global conceptual overlap. If a user queries a specific invoice ID or numerical value, standard vector lookup fails because invoice numbers have little semantic relationship to other texts.

### Designing Hybrid Retrievers
To build robust search, you must orchestrate **Hybrid Retrieval** setups:
- **Keyword matching**: BM25 algorithms to fetch exact strings, names, and IDs.
- **Dense retrieval**: Vector lookup to capture conceptual questions.
- **Cross-Encoder reranking**: Using small models to score the relevance of compiled chunks.

\`\`\`typescript
// Hybrid routing pattern
const keywordResults = await dbSearch.exactKeyword(query);
const semanticResults = await vectorStore.query(query, 10);
const mergedResults = rerank(keywordResults, semanticResults);
\`\`\`
`,
    categories: ['Systems Architecture'],
    tags: ['Databases', 'RAG', 'Vector Search'],
    readingTime: 5,
    isDraft: false,
    publishedAt: new Date().toISOString(),
  }
];

export const fallbackSkills: SkillCategory[] = [
  {
    id: 'cat-1',
    name: 'AI Engineering',
    skills: [
      { id: 's-1', name: 'LLM Orchestration (LangChain, LlamaIndex)', proficiency: 92 },
      { id: 's-2', name: 'Vector Search & pgvector', proficiency: 88 },
      { id: 's-3', name: 'Prompt Engineering & Guardrails', proficiency: 95 },
      { id: 's-4', name: 'RAG Architecture & Tuning', proficiency: 90 },
    ]
  },
  {
    id: 'cat-2',
    name: 'Software Engineering',
    skills: [
      { id: 's-5', name: 'Next.js & React', proficiency: 90 },
      { id: 's-6', name: 'TypeScript & Node.js', proficiency: 92 },
      { id: 's-7', name: 'Python & FastAPI', proficiency: 87 },
      { id: 's-8', name: 'SQL & Database Design', proficiency: 85 },
    ]
  }
];

export const fallbackExperience: ExperienceData[] = [
  {
    id: 'exp-1',
    role: 'Applied AI Engineer',
    company: 'Vance Engineering',
    location: 'Remote',
    timeline: '2025 - Present',
    description: 'Developing multi-agent orchestration frameworks, validation pipelines, and strict schema compliance systems for production enterprise customers.',
    position: 0,
  },
  {
    id: 'exp-2',
    role: 'Software Architect',
    company: 'Stochastic Labs',
    location: 'Surat, India',
    timeline: '2023 - 2025',
    description: 'Designed and deployed RAG search layers, caching databases, and robust microservices pipelines processing hundreds of thousands of daily tokens.',
    position: 1,
  }
];

export const fallbackEducation: EducationData[] = [
  {
    id: 'edu-1',
    degree: 'Bachelor of Computer Engineering',
    institution: 'Gujarat Technological University',
    location: 'Gujarat, India',
    timeline: '2019 - 2023',
    description: 'Specialization in software engineering, machine learning pipelines, and distributed databases.',
    position: 0,
  }
];

export const fallbackCertificates: CertificateData[] = [
  {
    id: 'cert-1',
    title: 'Deep Learning Specialization',
    issuer: 'DeepLearning.AI',
    timeline: '2024',
    score: 98,
    suffix: '%',
    description: 'Neural networks, optimization algorithms, hyperparameters tuning, and deep generative architectures.',
    position: 0,
  },
  {
    id: 'cert-2',
    title: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    timeline: '2024',
    score: 91,
    suffix: '%',
    description: 'Designing distributed, fault-tolerant systems on AWS cloud infrastructures.',
    position: 1,
  }
];

export const fallbackTestimonials: TestimonialData[] = [
  {
    id: 'test-1',
    clientName: 'Alex Mercer',
    clientRole: 'VP of Product',
    clientCompany: 'Cognitive Labs',
    text: 'Dhruv transformed our stochastic agent pipelines into solid, predictable workflows. Our error rates dropped by over 70% in less than a month.',
    avatarUrl: '/uploads/hero_visual.png',
    position: 0,
    status: 'active',
  },
  {
    id: 'test-2',
    clientName: 'Sarah Jenkins',
    clientRole: 'Engineering Manager',
    clientCompany: 'Aura Systems',
    text: 'A rare engineer who understands both core software engineering principles and the stochastic nuances of LLMs. Outstanding delivery and communication.',
    avatarUrl: '/uploads/hero_visual.png',
    position: 1,
    status: 'active',
  }
];

export const fallbackServices: ServiceData[] = [
  {
    id: 'serv-1',
    name: 'Agentic System Design',
    description: 'Designing deterministic workflow state-machines, feedback guardrails, and validation structures for LLM products.',
    position: 0,
    status: 'active',
  },
  {
    id: 'serv-2',
    name: 'Enterprise RAG Architectures',
    description: 'Optimizing retrieval pipelines with semantic caching, hybrid BM25 search, cross-encoder rerankers, and vector DB tuning.',
    position: 1,
    status: 'active',
  }
];

export const fallbackSeo: SeoData = {
  id: 'default-seo',
  metaDescription: 'Portfolio of Dhruv Dobariya, an Applied AI Engineer building robust, deterministic agentic products.',
  ogImage: '/uploads/hero_visual.png',
  twitterCard: 'summary_large_image',
};
