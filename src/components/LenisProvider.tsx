'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useThemeSettings } from './ThemeProvider';

/**
 * LenisProvider — smooth scroll engine.
 *
 * IMPORTANT: Lenis is created ONCE and persists across route changes.
 * The previous implementation destroyed and recreated Lenis on every
 * pathname change, causing scroll jank during navigation transitions.
 */
export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useThemeSettings();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (settings.reduceMotion === '1') return;

    const lenis = new Lenis({
      duration: 1.2, // Slightly faster than 1.4 for snappier feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    lenisRef.current = lenis;

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [settings.reduceMotion]); // Only depends on reduceMotion — NOT pathname

  return <>{children}</>;
}
