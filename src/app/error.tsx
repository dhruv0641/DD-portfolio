'use client';

import React, { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Runtime system crash caught by boundary:', error);
  }, [error]);

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
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-red-500 bg-[rgba(239,68,68,0.05)] px-3 py-1.5 rounded-full border border-[rgba(239,68,68,0.1)]">
          System Exception
        </div>
        <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight leading-tight">
          Pipeline <span className="serif-italic">encountered an error.</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)] font-light leading-relaxed">
          An unexpected exception interrupted the execution loop. The event was logged and our engineers are resolving it.
        </p>
        
        {error.message && (
          <div className="w-full text-left font-mono text-[10px] text-gray-500 bg-[#0a0a0c] border border-[rgba(255,255,255,0.04)] rounded-lg p-4 overflow-x-auto max-h-[120px]">
            {error.message}
          </div>
        )}

        <button 
          onClick={() => reset()}
          className="mt-4 bg-white text-black text-xs font-mono uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold cursor-pointer"
        >
          Reset Application Loop
        </button>
      </div>
    </section>
  );
}
