'use client';

import React, { useEffect, useRef } from 'react';
import { useThemeSettings } from './ThemeProvider';

export default function LightProbe() {
  const { settings } = useThemeSettings();
  const probeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (settings.cursorAura !== '1' || settings.reduceMotion === '1') return;

    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let isTracking = false;
    let frameId: number;

    const tick = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;

      // Stop tracking if we are close enough to the target (prevents continuous reflows when idle)
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        currentX = targetX;
        currentY = targetY;
        if (probeRef.current) {
          probeRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
        }
        isTracking = false;
        return;
      }

      currentX += dx * 0.08;
      currentY += dy * 0.08;

      if (probeRef.current) {
        probeRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }

      frameId = requestAnimationFrame(tick);
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isTracking) {
        isTracking = true;
        frameId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, [settings.cursorAura, settings.reduceMotion]);

  if (settings.cursorAura !== '1' || settings.reduceMotion === '1') return null;

  return (
    <div
      ref={probeRef}
      className="pointer-events-none fixed left-0 top-0 z-[-1] h-[500px] w-[500px] rounded-full mix-blend-screen will-change-transform"
      style={{
        background: `radial-gradient(circle, rgba(var(--accent-rgb), 0.05) 0%, rgba(0, 0, 0, 0) 70%)`,
      }}
    />
  );
}
