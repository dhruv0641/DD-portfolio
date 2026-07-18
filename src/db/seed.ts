import { db } from './index';
import * as schema from './schema';
import { hashPassword } from '../lib/auth';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('Seeding SQLite database...');

  // 1. Create Default Admin User
  const existingUser = await db.select().from(schema.users).where(eq(schema.users.username, 'admin'));
  if (existingUser.length === 0) {
    const passwordHash = await hashPassword('password');
    await db.insert(schema.users).values({
      username: 'admin',
      passwordHash,
      email: 'admin@vance.engineering',
    });
    console.log('✔ Created default admin user (admin / password)');
  }

  // 2. Initialize Dynamic Layout & Visual Settings
  const defaultSettings = [
    // Category: Hero
    { category: 'hero', key: 'name', value: 'Arthur Vance' },
    { category: 'hero', key: 'title', value: 'Applied AI Engineer' },
    { category: 'hero', key: 'tagline', value: 'I build intelligent systems that feel human.' },
    { category: 'hero', key: 'bio', value: 'An Applied AI Engineer designing the orchestration structures, state guardrails, and pipelines that transform stochastic model outputs into robust, deterministic systems.' },
    { category: 'hero', key: 'ctaText', value: 'Explore Selected Work' },
    
    // Category: Theme Options
    { category: 'theme', key: 'themeMode', value: 'dark' },
    { category: 'theme', key: 'colorBg', value: '#090909' },
    { category: 'theme', key: 'colorSurface', value: '#111111' },
    { category: 'theme', key: 'colorText', value: '#F5F5F5' },
    { category: 'theme', key: 'colorTextMuted', value: '#A1A1AA' },
    { category: 'theme', key: 'colorAccent', value: '#0066FF' }, // Electric Blue
    { category: 'theme', key: 'colorAccentRgb', value: '0, 102, 255' },
    { category: 'theme', key: 'radius', value: '8px' },
    { category: 'theme', key: 'showNoise', value: '1' }, // 1 = true
    
    // Category: Animations
    { category: 'animations', key: 'reduceMotion', value: '0' },
    { category: 'animations', key: 'cursorAura', value: '1' },
    { category: 'animations', key: 'thoughtWave', value: '1' },
    { category: 'animations', key: 'scrollSpeed', value: '1' },

    // Category: SEO / Metadata
    { category: 'seo', key: 'metaDescription', value: 'Portfolio of Arthur Vance, an Applied AI Engineer building robust, deterministic agentic products.' },
    { category: 'seo', key: 'ogImage', value: '/uploads/hero_visual.png' },
  ];

  for (const set of defaultSettings) {
    const existing = await db.select().from(schema.settings).where(eq(schema.settings.key, set.key));
    if (existing.length === 0) {
      await db.insert(schema.settings).values(set);
    }
  }
  console.log('✔ Initialized layout and theme settings');

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
      solution: 'Orchestrated dynamic cache routing using hierarchical document tree index indexing combined with semantic similarity searches in pgvector, cutting down token load speeds.',
      techStack: JSON.stringify(['Next.js', 'Python', 'pgvector', 'Claude API', 'FastAPI']),
      metrics: JSON.stringify([
        { value: '-71%', label: 'First-response latency' },
        { value: '38%', label: 'Autonomous ticket resolution' }
      ]),
      screenshots: JSON.stringify(['/uploads/hero_visual.png']),
      githubUrl: 'https://github.com/vance/atlas',
      demoUrl: 'https://atlas.vance.engineering',
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
      githubUrl: 'https://github.com/vance/forge',
      demoUrl: 'https://forge.vance.engineering',
      isFeatured: 1,
      isPinned: 0,
      isDraft: 0,
      position: 1
    }
  ];

  for (const proj of defaultProjects) {
    const existing = await db.select().from(schema.projects).where(eq(schema.projects.slug, proj.slug));
    if (existing.length === 0) {
      await db.insert(schema.projects).values(proj);
    }
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
    const existing = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.slug, post.slug));
    if (existing.length === 0) {
      await db.insert(schema.blogPosts).values(post);
    }
  }
  console.log('✔ Seeded engineering blog posts');

  console.log('Database seeding completed successfully.');
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
