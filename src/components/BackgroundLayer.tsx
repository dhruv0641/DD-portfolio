'use client';

import React, { useEffect, useRef, useState } from 'react';

// ════════════════════════════════════════════════════════════════════════════
// GLOBAL BACKGROUND SYSTEM — Single Unified Architectural Mounting
// ════════════════════════════════════════════════════════════════════════════
// Layer 1: Dark Surface Base (#090909)
// Layer 2: Global Editorial Vertical Grid (4-col desktop / 2-col tablet / 1-col mobile)
// Layer 3: Film Grain Cinematic Texture
// Layer 4: Cursor Ambient Blue Light Aura (Lerped Interpolation)
// ════════════════════════════════════════════════════════════════════════════

export default function BackgroundLayer() {
  const glowRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleQueryChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleQueryChange);

    let rafId: number | null = null;
    let mx = -9999;
    let my = -9999;

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          if (glowRef.current) {
            glowRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
          }
          rafId = null;
        });
      }
    };

    if (!isTouchDevice && !mediaQuery.matches) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      mediaQuery.removeEventListener('change', handleQueryChange);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isTouchDevice, prefersReducedMotion]);

  return (
    <div className="global-background-shell fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Layer 1: Dark Surface Base */}
      <div className="absolute inset-0 bg-[#090909] z-[1]" />

      {/* Layer 2: Global Editorial Grid Lines */}
      <div 
        className="grid-bg-container absolute inset-0 max-w-[1600px] mx-auto px-[8%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 pointer-events-none z-[2]"
        style={{
          willChange: 'transform',
          transform: 'translate3d(0,0,0)',
        }}
      >
        <div className="border-r border-[rgba(255,255,255,0.035)] border-l h-full" />
        <div className="border-r border-[rgba(255,255,255,0.035)] h-full hidden md:block" />
        <div className="border-r border-[rgba(255,255,255,0.035)] h-full hidden lg:block" />
        <div className="border-r border-[rgba(255,255,255,0.035)] h-full hidden lg:block" />
      </div>

      {/* Layer 3: Cinematic Film Grain Texture */}
      <div 
        className="grain absolute inset-0 w-full h-full pointer-events-none opacity-[0.018] z-[3]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          willChange: 'transform',
          transform: 'translate3d(0,0,0)',
        }}
      />

      {/* Layer 4: Cursor Ambient Light Aura */}
      {mounted && !isTouchDevice && !prefersReducedMotion && (
        <div
          ref={glowRef}
          className="light-probe absolute top-0 left-0 w-[550px] h-[550px] rounded-full pointer-events-none mix-blend-screen will-change-transform z-[4]"
          style={{
            background: 'radial-gradient(circle, rgba(0, 102, 255, 0.06) 0%, rgba(0, 0, 0, 0) 70%)',
            transform: 'translate3d(-9999px, -9999px, 0) translate(-50%, -50%)',
          }}
        />
      )}
    </div>
  );
}
