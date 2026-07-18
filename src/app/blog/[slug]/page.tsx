import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function renderMarkdown(md: string) {
  // 1. Process custom display headers
  let html = md
    .replace(/^## (.*$)/gim, '<h3 class="text-2xl font-light mt-12 mb-6 text-[var(--text)]">$1</h3>')
    .replace(/^# (.*$)/gim, '<h2 class="text-3xl font-light mt-16 mb-8 text-[var(--text)]">$1</h2>')
    .replace(/^### (.*$)/gim, '<h4 class="text-xl font-light mt-8 mb-4 text-[var(--text)]">$1</h4>');

  // 2. Format inline styling variables
  html = html
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[var(--text)]">$1</strong>')
    .replace(/\*(.*?)\*/g, '<span class="serif-italic text-[var(--text)]">$1</span>');

  // 3. Highlight code snippet wraps
  html = html.replace(/```python([\s\S]*?)```/g, (_, code) => {
    return `<div class="code-display my-10"><div class="code-header"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div><div class="code-file">execution.py</div></div><pre class="code-body bg-[var(--surface)] text-[var(--text)] text-xs p-6 overflow-x-auto"><code>${code.trim()}</code></pre></div>`;
  });
  
  html = html.replace(/```typescript([\s\S]*?)```/g, (_, code) => {
    return `<div class="code-display my-10"><div class="code-header"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div><div class="code-file">execution.ts</div></div><pre class="code-body bg-[var(--surface)] text-[var(--text)] text-xs p-6 overflow-x-auto"><code>${code.trim()}</code></pre></div>`;
  });

  // 4. Wrap line blocks into paragraphs
  html = html.split('\n\n').map(p => {
    const trimmed = p.trim();
    if (trimmed.startsWith('<h') || trimmed.startsWith('<div') || trimmed.startsWith('<ul')) return p;
    return `<p class="text-[var(--text-muted)] leading-[1.8] font-light mb-8 text-base md:text-lg">${p}</p>`;
  }).join('\n');

  return { __html: html };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  // Query individual blog entry
  const posts = await db
    .select()
    .from(schema.blogPosts)
    .where(eq(schema.blogPosts.slug, slug))
    .limit(1);

  const post = posts[0];
  if (!post || post.isDraft === 1) {
    notFound();
  }

  const formattedContent = renderMarkdown(post.contentMarkdown);
  const categories: string[] = JSON.parse(post.categories || '[]');

  return (
    <section className="pt-40 pb-32">
      <div className="max-w-[1400px] mx-auto px-[8%]">
        {/* Navigation breadcrumb */}
        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-12 flex items-center gap-4">
          <Link href="/blog" className="hover:text-[var(--text)]">Journal</Link>
          <span>/</span>
          <span className="text-[var(--text-muted)]">{post.slug}</span>
        </div>

        <div className="max-w-[800px] mx-auto">
          {/* Post Header */}
          <div className="border-b border-[rgba(255,255,255,0.04)] pb-12 mb-16">
            <div className="font-mono text-xs text-[var(--text-dim)] flex gap-6 mb-6">
              <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }) : 'DRAFT'}</span>
              <span>·</span>
              <span>{post.readingTime} MIN READ</span>
            </div>
            
            <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-light text-[var(--text)] leading-tight mb-8 tracking-tight">
              {post.title}
            </h1>

            <div className="flex gap-2">
              {categories.map((c, idx) => (
                <span key={idx} className="font-mono text-[10px] border border-[rgba(255,255,255,0.08)] rounded px-3 py-1 text-[var(--text-dim)] uppercase">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Rendered Markdown Body */}
          <article 
            className="prose prose-invert max-w-none" 
            dangerouslySetInnerHTML={formattedContent}
          />
        </div>
      </div>
    </section>
  );
}
