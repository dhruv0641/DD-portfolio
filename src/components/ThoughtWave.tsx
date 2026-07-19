'use client';

import React, { useEffect, useRef } from 'react';
import { useThemeSettings } from './ThemeProvider';

export default function ThoughtWave() {
  const { settings } = useThemeSettings();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (settings.thoughtWave !== '1' || settings.reduceMotion === '1') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let isVisible = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();

    let step = 0;

    const render = () => {
      if (!isVisible) return;

      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      ctx.clearRect(0, 0, w, h);

      // Draw primary neural wave (adapting color variables)
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = settings.themeMode === 'light' ? 'rgba(15, 15, 15, 0.08)' : 'rgba(245, 245, 245, 0.12)';
      ctx.beginPath();
      for (let i = 0; i <= w; i++) {
        const x = i;
        const y = h / 2 + Math.sin(i * 0.007 + step) * 45 * Math.sin(i * 0.002 + step * 0.5);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw secondary deterministic accent wave (Electric Blue / Accent target color)
      ctx.beginPath();
      ctx.strokeStyle = `rgba(var(--accent-rgb), 0.22)`;
      ctx.lineWidth = 0.8;
      for (let i = 0; i <= w; i++) {
        const x = i;
        const y = h / 2.2 + Math.sin(i * 0.009 - step * 0.8) * 30 * Math.cos(i * 0.003 + step * 0.4);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      step += 0.004;
      animFrameId = requestAnimationFrame(render);
    };

    // Use IntersectionObserver to pause the animation loop when scrolled offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          // Restart loop
          animFrameId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);

    // Initial loop launch if visible
    if (isVisible) {
      animFrameId = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener('resize', resize);
      observer.disconnect();
      cancelAnimationFrame(animFrameId);
    };
  }, [settings.thoughtWave, settings.reduceMotion, settings.themeMode]);

  if (settings.thoughtWave !== '1' || settings.reduceMotion === '1') return null;

  return (
    <canvas
      ref={canvasRef}
      id="waveCanvas"
      className="absolute right-0 top-[50%] h-[70%] w-[50%] -translate-y-[50%] pointer-events-none opacity-65"
    />
  );
}
