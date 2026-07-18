'use client';

import React, { useEffect, useRef, useState } from 'react';
import { defaultBackgroundConfig, BackgroundConfig } from '@/lib/backgroundConfig';

export default function BackgroundLayer({ config = defaultBackgroundConfig }: { config?: BackgroundConfig }) {
  const [mounted, setMounted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Position references for cursor tracking
  const mousePos = useRef({ x: 0, y: 0 });
  const glowPos = useRef({ x: 0, y: 0 });
  const glowRef = useRef<HTMLDivElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);

    // 1. Detect Touch Device to fallback on static lights
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window || navigator.maxTouchPoints > 0
      );
    };
    checkTouch();

    // 2. Detect prefers-reduced-motion settings
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleQueryChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleQueryChange);

    // 3. Pointer move listener
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    if (!isTouchDevice && !mediaQuery.matches) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // 4. Render loop using requestAnimationFrame (interpolated transition)
    const updateGlowPosition = () => {
      // Lerp logic: target = current + (target - current) * factor
      const easeFactor = 0.08;
      const dx = mousePos.current.x - glowPos.current.x;
      const dy = mousePos.current.y - glowPos.current.y;

      glowPos.current.x += dx * easeFactor;
      glowPos.current.y += dy * easeFactor;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowPos.current.x - config.glow.radius / 2}px, ${glowPos.current.y - config.glow.radius / 2}px, 0)`;
      }

      animationFrameId.current = requestAnimationFrame(updateGlowPosition);
    };

    if (!isTouchDevice && !mediaQuery.matches) {
      animationFrameId.current = requestAnimationFrame(updateGlowPosition);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      mediaQuery.removeEventListener('change', handleQueryChange);
    };
  }, [isTouchDevice, prefersReducedMotion, config.glow.radius]);

  if (!mounted) return null;

  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#030303]" 
      style={{ isolation: 'isolate' }}
    >
      {/* LAYER 6: AMBIENT LIGHTING BLOBS */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {config.ambient.blobs.map((blob, idx) => (
          <div
            key={idx}
            className="absolute rounded-full filter blur-[100px] mix-blend-screen transition-opacity duration-1000"
            style={{
              backgroundColor: blob.color,
              width: blob.width,
              height: blob.height,
              top: blob.top,
              left: blob.left,
              opacity: blob.opacity,
            }}
          />
        ))}
      </div>

      {/* LAYER 2: INFINITE ENGINEERING GRID */}
      <div 
        className="absolute inset-0 z-10" 
        style={{
          backgroundImage: `
            linear-gradient(to right, ${config.grid.color} 1px, transparent 1px),
            linear-gradient(to bottom, ${config.grid.color} 1px, transparent 1px)
          `,
          backgroundSize: `${config.grid.size}px ${config.grid.size}px`,
          opacity: config.grid.opacity,
        }}
      />

      {/* LAYER 3: POINTER GLOW (HIDDEN ON TOUCH / REDUCED MOTION) */}
      {!isTouchDevice && !prefersReducedMotion && (
        <div
          ref={glowRef}
          className="absolute top-0 left-0 z-20 rounded-full mix-blend-screen pointer-events-none will-change-transform filter blur-[60px]"
          style={{
            width: `${config.glow.radius}px`,
            height: `${config.glow.radius}px`,
            background: `radial-gradient(circle, ${config.glow.color} 0%, transparent 70%)`,
            opacity: config.glow.opacity,
            transform: 'translate3d(-9999px, -9999px, 0)',
          }}
        />
      )}

      {/* LAYER 4: MICRO GRAIN NOISE TEXTURE */}
      <div 
        className="absolute inset-0 z-30 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* LAYER 5: VIGNETTE OVERLAY SHADOW */}
      <div 
        className="absolute inset-0 z-40 pointer-events-none"
        style={{
          background: `radial-gradient(circle, transparent 30%, rgba(3, 3, 3, ${config.vignette.strength}) 100%)`,
        }}
      />
    </div>
  );
}
