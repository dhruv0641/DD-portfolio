'use client';

import React, { Suspense, lazy } from 'react';

// Lazy-load the heavy AIPlayground component — code-split into its own chunk.
const AIPlayground = lazy(() => import('@/components/AIPlayground'));

function PlaygroundFallback() {
  return (
    <div className="w-full bg-[#050506] border border-white/5 rounded-2xl overflow-hidden min-h-[580px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-zinc-600 font-mono text-xs">
        <div className="w-5 h-5 border-2 border-zinc-700 border-t-[var(--accent)] rounded-full animate-spin" />
        <span>LOADING AI PLAYGROUND...</span>
      </div>
    </div>
  );
}

export default function PlaygroundPage() {
  return (
    <section className="pt-40 pb-32 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-[8%]">

        {/* Navigation Breadcrumb */}
        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] mb-12">
          <span>Explore / Interactive AI Playground</span>
        </div>

        <div className="max-w-[800px] mb-16">
          <h1 className="text-[clamp(2.2rem,5vw,3.8rem)] font-light text-white tracking-tight leading-snug">
            Real LLM integrations, streaming completions, <span className="serif-italic text-[var(--text-muted)]">and secure proxy pipelines.</span>
          </h1>
          <p className="text-[var(--text-muted)] font-light mt-6 text-sm leading-relaxed max-w-[600px]">
            A secure client-server engineering playground sandbox designed to test live inference parameters, deconstruct SQL structures, and audit prompt libraries across Google Gemini and Groq models.
          </p>
        </div>

        <Suspense fallback={<PlaygroundFallback />}>
          <AIPlayground />
        </Suspense>

      </div>
    </section>
  );
}
