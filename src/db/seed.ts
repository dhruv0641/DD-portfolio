import { db } from './index';
import * as schema from './schema';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding SQLite database...');

  // 0. Clear existing data to allow fresh seed
  await db.delete(schema.settings);
  await db.delete(schema.projects);
  await db.delete(schema.blogPosts);
  console.log('✔ Cleared existing settings, projects, and blog posts');

  // 1. Create Default Admin User
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'dhruv_secure_admin_password_2026';

  // Wipe previous admin users to clear any weak defaults (e.g. admin/password)
  await db.delete(schema.users);
  console.log('✔ Cleared existing admin users');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(adminPassword, salt);
  await db.insert(schema.users).values({
    username: adminUsername,
    passwordHash,
    email: 'dhruv.dobariya0641@gmail.com',
  });
  console.log(`✔ Created default admin user (${adminUsername} / ${process.env.ADMIN_PASSWORD ? '******' : adminPassword})`);

  // 2. Initialize Dynamic Layout & Visual Settings
  const defaultSettings = [
    // Category: Hero Text & Actions
    { category: 'hero', key: 'heroTitlePrefix', value: 'Designing' },
    { category: 'hero', key: 'heroTitleItalic', value: 'deterministic' },
    { category: 'hero', key: 'heroTitleSuffix', value: 'workflows for AI agents.' },
    { category: 'hero', key: 'heroCta1Text', value: 'Explore Case Studies' },
    { category: 'hero', key: 'heroCta1Link', value: '#work' },
    { category: 'hero', key: 'heroCta2Text', value: "Let's Build Together" },
    { category: 'hero', key: 'heroCta2Link', value: '#build' },

    // Category: Identity / About
    { category: 'about', key: 'aboutTitlePrefix', value: 'Building software' },
    { category: 'about', key: 'aboutTitleItalic', value: 'that solves real problems.' },
    { category: 'about', key: 'aboutParagraph1', value: 'I operate at the intersection of machine cognition and human agency. Most modern AI products expose the raw, chaotic mechanics of underlying models. I believe software should tame that chaos—delivering high-utility, predictable, and deeply respectful interactions.' },
    { category: 'about', key: 'aboutParagraph2', value: 'I write robust, multi-agent state machines, optimized retrieval schemas, and evaluation harnesses. My work is built to be fast, production-ready, and architected to safeguard user attention instead of taxing it.' },

    // Category: Core Beliefs
    { category: 'beliefs', key: 'belief1Title', value: 'Human first, model second' },
    { category: 'beliefs', key: 'belief1Desc', value: 'AI should elevate and extend human capability, not replace or simulate it. We construct software to empower human intent, not to create automated noise.' },
    { category: 'beliefs', key: 'belief2Title', value: 'Deterministic guardrails' },
    { category: 'beliefs', key: 'belief2Desc', value: 'Stochastic models produce unpredictable results. We wrap intelligence in mathematical guardrails, ensuring reliability in high-stakes environments.' },
    { category: 'beliefs', key: 'belief3Title', value: 'Performance is respect' },
    { category: 'beliefs', key: 'belief3Desc', value: 'Lag is cognitive drag. Orchestration, retrieval, and interface rendering are optimized for zero latency, respecting the flow state of the operator.' },

    // Category: Engineering Case Study
    { category: 'casestudy', key: 'caseStudyHeading', value: 'Designing scalable software for production environments.' },
    { category: 'casestudy', key: 'caseStudyRole', value: 'Lead AI Engineer' },
    { category: 'casestudy', key: 'caseStudyTimeline', value: '12 Weeks (Q1 2026)' },
    { category: 'casestudy', key: 'caseStudyTech', value: 'Python, LangGraph, Qdrant, Claude 3.5 Sonnet, AWS ECS' },
    { category: 'casestudy', key: 'caseStudyContextTitle', value: 'The Context' },
    { category: 'casestudy', key: 'caseStudyContextText', value: 'Enterprise workflows were heavily dependent on manual data entry and unstructured review steps, creating a 12-hour turnaround bottleneck. Automated scripts failed to handle variance in document formats and unstructured inputs.' },
    { category: 'casestudy', key: 'caseStudyChallengeTitle', value: 'The Challenge' },
    { category: 'casestudy', key: 'caseStudyChallengeText', value: 'Parsing unstructured data tables and files into strict schema formats. Standard retrieval-augmented generation suffered from context leakage and output hallucination loops, causing errors in downstream production databases.' },

    // Category: Process
    { category: 'process', key: 'processHeadingPrefix', value: 'How I design and build' },
    { category: 'process', key: 'processHeadingItalic', value: 'production systems.' },
    { category: 'process', key: 'processSubtitle', value: 'A live simulation of the complete request lifecycle—from query ingestion to production processing and delivery.' },

    // Category: Contact
    { category: 'contact', key: 'contactHeadingPrefix', value: "Let's build software" },
    { category: 'contact', key: 'contactHeadingItalic', value: 'that solves real problems.' },
    { category: 'contact', key: 'contactParagraph', value: "Whether you are looking to design robust backend architectures, scale query systems, or integrate intelligence into high-touch interfaces, I'm always open to talking design and implementation." },
  ];

  for (const set of defaultSettings) {
    await db.insert(schema.settings).values(set);
  }
  console.log('✔ Seeded layout and theme settings');

  // 3. Create Default Projects
  const defaultProjects = [
    {
      title: 'Atlas',
      slug: 'atlas',
      subtitle: 'Context-Aware Enterprise Memory Layer',
      role: 'Lead AI Engineer',
      company: 'Cognitive Infrastructure Corp',
      timeline: '6 Months (2025)',
      problem: 'Enterprise support portals suffered from high turnaround latency (~12 hours) and inconsistent query response context, loading massive duplicate information sets into token histories.',
      challenge: 'Scaling real-time semantic caching under 200ms while maintaining vector semantic overlap checks across multi-tenant permission layers.',
      solution: 'Orchestrated dynamic cache routing using hierarchical document tree indexing combined with semantic similarity searches in pgvector, cutting down token load speeds.',
      techStack: JSON.stringify(['Next.js', 'Python', 'pgvector', 'Claude API', 'FastAPI']),
      metrics: JSON.stringify([
        { value: '-71%', label: 'First-response latency' },
        { value: '38%', label: 'Autonomous ticket resolution' }
      ]),
      screenshots: JSON.stringify(['/uploads/hero_visual.png']),
      githubUrl: 'https://github.com/dhruv0641/atlas',
      demoUrl: 'https://atlas.dhruv.dev',
      isFeatured: 1,
      isPinned: 1,
      isDraft: 0,
      position: 0
    },
    {
      title: 'Forge',
      slug: 'forge',
      subtitle: 'CI-Integrated Code Quality Evaluator',
      role: 'Core Architect',
      company: 'LogiFlow Solutions',
      timeline: '4 Months (2024)',
      problem: 'Developer code review loops created high release latency; senior engineers spent hours flagging minor syntax, styling, and structural logic bugs.',
      challenge: 'Parsing complex GitHub diff targets under rate limits without missing deep thread concurrency risks or memory allocation bugs.',
      solution: 'Built a multi-agent logic checker using Claude.js API pipelines that evaluates changes relative to local workspace specifications, compiling results in CI logs.',
      techStack: JSON.stringify(['TypeScript', 'Node.js', 'GitHub Actions', 'Claude API', 'Docker']),
      metrics: JSON.stringify([
        { value: '-45%', label: 'Review cycle turnaround' },
        { value: '89%', label: 'PR suggestion acceptance' }
      ]),
      screenshots: JSON.stringify(['/uploads/hero_visual.png']),
      githubUrl: 'https://github.com/dhruv0641/forge',
      demoUrl: 'https://forge.dhruv.dev',
      isFeatured: 1,
      isPinned: 0,
      isDraft: 0,
      position: 1
    }
  ];

  for (const proj of defaultProjects) {
    await db.insert(schema.projects).values(proj);
  }
  console.log('✔ Seeded projects index data');

  // 4. Create Default Blog Posts
  const defaultPosts = [
    {
      title: 'Designing for the Stochastic Era: Interaction Beyond Chat',
      slug: 'designing-stochastic-interaction',
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
      categories: JSON.stringify(['Product', 'Design']),
      tags: JSON.stringify(['UX', 'Product Thinking', 'Agents']),
      readingTime: 6,
      isDraft: 0,
      publishedAt: new Date(),
    },
    {
      title: 'Why Vector Databases are Not Search Engine Substitutes',
      slug: 'vector-databases-are-not-search-engines',
      contentMarkdown: `## Semantic Search is Not Keyword Matching
Many engineers drop vector embeddings (e.g., Cosine Similarity checks on vector databases) into their applications and expect it to act like search. In production, this breaks.

### The Limitations of Cosine Similarity
Vector similarity searches look for global conceptual overlap. If a user queries a specific invoice ID or numeric value, standard vector lookup fails because invoice numbers have little semantic relationship to other texts.

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
      categories: JSON.stringify(['Systems Architecture']),
      tags: JSON.stringify(['Databases', 'RAG', 'Vector Search']),
      readingTime: 5,
      isDraft: 0,
      publishedAt: new Date(),
    }
  ];

  for (const post of defaultPosts) {
    await db.insert(schema.blogPosts).values(post);
  }
  console.log('✔ Seeded engineering blog posts');

  console.log('Database seeding completed successfully.');
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});

