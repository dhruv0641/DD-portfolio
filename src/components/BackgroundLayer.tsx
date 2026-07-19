'use client';

import React, { useEffect, useRef, useState } from 'react';
import { defaultBackgroundConfig, BackgroundConfig } from '@/lib/backgroundConfig';

// 1. GridLayer: Editorial columns grid lines
export function GridLayer({ config = defaultBackgroundConfig }: { config?: BackgroundConfig }) {
  return (
    <div 
      className="grid-bg-container fixed inset-0 pointer-events-none z-[-2]"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${config.grid.columns}, 1fr)`,
        padding: '0 8%',
        maxWidth: config.grid.maxWidth,
        margin: '0 auto',
        willChange: 'transform',
        transform: 'translate3d(0,0,0)',
      }}
    >
      {Array.from({ length: config.grid.columns }).map((_, idx) => (
        <div 
          key={idx} 
          className="grid-bg-line h-full"
          style={{
            borderRight: `1px solid ${config.grid.color}`,
            borderLeft: idx === 0 ? `1px solid ${config.grid.color}` : 'none',
          }}
        />
      ))}
    </div>
  );
}

// 2. PointerGlowLayer: Soft ambient light aura following cursor
export function PointerGlowLayer({ config = defaultBackgroundConfig }: { config?: BackgroundConfig }) {
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

    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    if (!isTouchDevice && !mediaQuery.matches) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      mediaQuery.removeEventListener('change', handleQueryChange);
    };
  }, [isTouchDevice, prefersReducedMotion]);

  if (!mounted || isTouchDevice || prefersReducedMotion) return null;

  return (
    <div
      ref={glowRef}
      className="light-probe fixed top-0 left-0 rounded-full pointer-events-none mix-blend-screen will-change-transform z-[-1]"
      style={{
        width: `${config.glow.radius}px`,
        height: `${config.glow.radius}px`,
        background: `radial-gradient(circle, ${config.glow.color} 0%, rgba(0, 0, 0, 0) 70%)`,
        opacity: config.glow.opacity,
        transform: 'translate3d(-9999px, -9999px, 0) translate(-50%, -50%)',
      }}
    />
  );
}

// 3. NoiseLayer: Cinematic film grain overlay
export function NoiseLayer({ config = defaultBackgroundConfig }: { config?: BackgroundConfig }) {
  return (
    <div 
      className="grain fixed inset-0 w-screen h-screen pointer-events-none z-[9999]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${config.noise.frequency}' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='${config.noise.opacity}'/%3E%3C/svg%3E")`,
        willChange: 'transform',
        transform: 'translate3d(0,0,0)',
      }}
    />
  );
}

// 4. VignetteLayer: Dark edges shadow overlay
export function VignetteLayer({ config = defaultBackgroundConfig }: { config?: BackgroundConfig }) {
  return (
    <div 
      className="vignette fixed inset-0 pointer-events-none z-[-1]"
      style={{
        background: `radial-gradient(circle, transparent 40%, rgba(9, 9, 9, ${config.vignette.strength}) 100%)`,
        willChange: 'transform',
        transform: 'translate3d(0,0,0)',
      }}
    />
  );
}

// 5. AmbientLayer: Base dark ambient background
export function AmbientLayer({ config = defaultBackgroundConfig }: { config?: BackgroundConfig }) {
  return (
    <div 
      className="fixed inset-0 z-[-3] pointer-events-none bg-[#090909]"
      style={{
        backgroundColor: config.ambient.color,
      }}
    />
  );
}

// 6. BackgroundLayer: Composite layout controller
export default function BackgroundLayer({ config = defaultBackgroundConfig }: { config?: BackgroundConfig }) {
  return (
    <>
      <AmbientLayer config={config} />
      <GridLayer config={config} />
      <PointerGlowLayer config={config} />
      <NoiseLayer config={config} />
      <VignetteLayer config={config} />
    </>
  );
}
