'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { useThemeSettings } from './ThemeProvider';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useThemeSettings();

  useEffect(() => {
    // If animations/motion should be reduced, bypass Lenis smooth scroll
    if (settings.reduceMotion === '1') return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like soft easing
      smoothWheel: true,
      syncTouch: false,
    });

    let rafId: number;
    
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [settings.reduceMotion]);

  return <>{children}</>;
}
