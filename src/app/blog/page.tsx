import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';

export default async function BlogIndex() {
  const dbPosts = await db
    .select()
    .from(schema.blogPosts)
    .where(eq(schema.blogPosts.isDraft, 0))
    .orderBy(desc(schema.blogPosts.createdAt));

  return (
    <section className="pt-40 pb-20 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-[8%]">
        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-16 flex items-center gap-2">
          <span>Engineering Journal</span>
          <div className="flex-1 h-[1px] bg-[rgba(255,255,255,0.04)]" />
        </div>
        
        <div className="max-w-[800px] mb-20">
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-light text-[var(--text)] tracking-tight leading-snug">
            Essays, research logs, and architectural notes <span className="serif-italic">on applied intelligence.</span>
          </h1>
        </div>

        <div className="flex flex-col">
          {dbPosts.length === 0 ? (
            <div className="text-sm font-mono text-[var(--text-muted)] py-12 border-t border-[rgba(255,255,255,0.04)]">
              $ JOURNAL EMPTY — DRAFTS RETRIEVED: 0
            </div>
          ) : (
            dbPosts.map((post) => {
              const categories: string[] = JSON.parse(post.categories || '[]');
              return (
                <Link 
                  href={`/blog/${post.slug}`} 
                  key={post.id}
                  className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] gap-6 items-start md:items-center py-12 border-t border-[rgba(255,255,255,0.04)] hover:pl-5 group transition-all duration-300 ease-out last:border-b"
                >
                  <div className="font-mono text-xs text-[var(--text-dim)]">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() : 'DRAFT'}
                  </div>
                  <div className="text-xl md:text-2xl text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-300 font-light">
                    {post.title}
                  </div>
                  <div className="font-mono text-xs text-[var(--text-dim)] md:text-right">
                    {categories.join(' / ').toUpperCase()}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
