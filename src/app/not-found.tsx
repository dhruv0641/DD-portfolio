'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-[#030303] px-6 relative overflow-hidden">
      {/* Background decoration lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="max-w-[1400px] mx-auto h-full px-[8%] grid grid-cols-4 gap-4">
          <div className="border-r border-[rgba(255,255,255,0.03)] h-full border-l" />
          <div className="border-r border-[rgba(255,255,255,0.03)] h-full" />
          <div className="border-r border-[rgba(255,255,255,0.03)] h-full" />
          <div className="border-r border-[rgba(255,255,255,0.03)] h-full" />
        </div>
      </div>

      <div className="relative z-10 text-center flex flex-col items-center gap-6 max-w-[500px]">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)] bg-[rgba(var(--accent-rgb),0.05)] px-3 py-1.5 rounded-full border border-[rgba(var(--accent-rgb),0.1)]">
          Error 404
        </div>
        <h1 className="text-4xl md:text-5xl font-light text-[#fafafa] tracking-tight leading-tight">
          Route <span className="serif-italic">does not exist.</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)] font-light leading-relaxed">
          The page you are looking for has either been moved, deleted, or does not exist in this domain namespace.
        </p>
        <Link 
          href="/" 
          className="mt-4 bg-white text-black text-xs font-mono uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
        >
          Return to Console
        </Link>
      </div>
    </section>
  );
}
