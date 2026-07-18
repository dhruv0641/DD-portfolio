'use client';

import React, { Suspense, lazy } from 'react';

// Lazy-load the heavy DesignLab component — code-split into its own chunk.
// This prevents the 689-line component with Canvas/Framer Motion from
// blocking the initial page load or being included in the homepage bundle.
const DesignLab = lazy(() => import('@/components/DesignLab'));

function DesignLabFallback() {
  return (
    <div className="w-full bg-[#050506] border border-white/5 rounded-2xl overflow-hidden min-h-[580px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-zinc-600 font-mono text-xs">
        <div className="w-5 h-5 border-2 border-zinc-700 border-t-[var(--accent)] rounded-full animate-spin" />
        <span>LOADING DESIGN LAB...</span>
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
          <span>Explore / Interactive Design Lab</span>
        </div>

        <div className="max-w-[800px] mb-16">
          <h1 className="text-[clamp(2.2rem,5vw,3.8rem)] font-light text-white tracking-tight leading-snug">
            Satellites, interactive canvas grids, <span className="serif-italic text-[var(--text-muted)]">and mechanical flow structures.</span>
          </h1>
          <p className="text-[var(--text-muted)] font-light mt-6 text-sm leading-relaxed max-w-[600px]">
            A dedicated visual lab sandbox designed to demonstrate custom micro-interactions, hardware acceleration, layout dynamics, and high-fidelity physics engines.
          </p>
        </div>

        <Suspense fallback={<DesignLabFallback />}>
          <DesignLab />
        </Suspense>

      </div>
    </section>
  );
}
