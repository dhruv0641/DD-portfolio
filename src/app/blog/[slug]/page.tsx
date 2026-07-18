import React from 'react';
import { blogService } from '@/services/blogService';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function renderMarkdown(md: string) {
  let html = md
    .replace(/^## (.*$)/gim, '<h3 class="text-2xl font-light mt-12 mb-6 text-white tracking-tight">$1</h3>')
    .replace(/^# (.*$)/gim, '<h2 class="text-3xl font-light mt-16 mb-8 text-white tracking-tight">$1</h2>')
    .replace(/^### (.*$)/gim, '<h4 class="text-xl font-medium mt-8 mb-4 text-white">$1</h4>');

  html = html
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<span class="serif-italic text-white">$1</span>');

  html = html.replace(/```python([\s\S]*?)```/g, (_, code) => {
    return `<div class="code-display my-8 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.05)] bg-[#0d0d10]"><div class="code-header flex gap-1.5 px-4 py-3 border-b border-[rgba(255,255,255,0.05)] items-center"><div class="w-2 h-2 rounded-full bg-[#ff5f56]"></div><div class="w-2 h-2 rounded-full bg-[#ffbd2e]"></div><div class="w-2 h-2 rounded-full bg-[#27c93f]"></div><div class="ml-4 font-mono text-[10px] text-gray-500">execution.py</div></div><pre class="p-6 text-xs text-gray-300 overflow-x-auto font-mono"><code>${code.trim()}</code></pre></div>`;
  });
  
  html = html.replace(/```typescript([\s\S]*?)```/g, (_, code) => {
    return `<div class="code-display my-8 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.05)] bg-[#0d0d10]"><div class="code-header flex gap-1.5 px-4 py-3 border-b border-[rgba(255,255,255,0.05)] items-center"><div class="w-2 h-2 rounded-full bg-[#ff5f56]"></div><div class="w-2 h-2 rounded-full bg-[#ffbd2e]"></div><div class="w-2 h-2 rounded-full bg-[#27c93f]"></div><div class="ml-4 font-mono text-[10px] text-gray-500">execution.ts</div></div><pre class="p-6 text-xs text-gray-300 overflow-x-auto font-mono"><code>${code.trim()}</code></pre></div>`;
  });

  html = html.split('\n\n').map(p => {
    const trimmed = p.trim();
    if (trimmed.startsWith('<h') || trimmed.startsWith('<div') || trimmed.startsWith('<ul')) return p;
    return `<p class="text-[var(--text-muted)] leading-[1.8] font-light mb-8 text-base md:text-lg">${p}</p>`;
  }).join('\n');

  return { __html: html };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  // Query individual blog entry via Supabase
  const post = await blogService.getPostBySlug(slug);
  if (!post || post.isDraft === 1) {
    notFound();
  }

  const formattedContent = renderMarkdown(post.contentMarkdown);
  const categories: string[] = typeof post.categories === 'string' ? JSON.parse(post.categories || '[]') : (post.categories || []);

  return (
    <section className="pt-40 pb-32 min-h-screen bg-[#030303]">
      <div className="max-w-[1400px] mx-auto px-[8%]">
        
        {/* Navigation Breadcrumb */}
        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-12 flex items-center gap-4">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-white transition-colors">Journal</Link>
          <span>/</span>
          <span className="text-white">{post.slug}</span>
        </div>

        <div className="max-w-[760px] mx-auto">
          {/* Post Header */}
          <div className="border-b border-[var(--grid-line)] pb-12 mb-16">
            <div className="font-mono text-[10px] text-[var(--text-dim)] flex gap-4 mb-6 uppercase">
              <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }) : 'DRAFT'}</span>
              <span>•</span>
              <span>{post.readingTime} MIN READ</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-light text-white leading-tight mb-8 tracking-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-2">
              {categories.map((c, idx) => (
                <span key={idx} className="font-mono text-[9px] border border-[rgba(255,255,255,0.06)] rounded bg-[#09090b] px-3 py-1 text-[var(--text-muted)] uppercase tracking-wider">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Rendered Markdown Body */}
          <article 
            className="prose prose-invert max-w-none text-[var(--text-muted)]" 
            dangerouslySetInnerHTML={formattedContent}
          />
        </div>
      </div>
    </section>
  );
}
