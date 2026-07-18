'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useThemeSettings } from './ThemeProvider';

interface CounterProps {
  target: number;
  label: string;
  suffix: string;
  isFloat?: boolean;
}

function CounterItem({ target, label, suffix, isFloat }: CounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const duration = 1500;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [hasStarted, target]);

  return (
    <div ref={elementRef} className="border-t border-[rgba(255,255,255,0.04)] pt-12">
      <div className="text-[clamp(3rem,7vw,6.5rem)] font-light leading-none mb-4 tracking-tighter">
        {isFloat ? count.toFixed(1) : Math.floor(count)}
        {suffix}
      </div>
      <div className="text-lg text-[var(--text-muted)] font-light">{label}</div>
    </div>
  );
}

export default function ImpactCounters() {
  const { settings } = useThemeSettings();

  if (settings.reduceMotion === '1') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
        <div className="border-t border-[rgba(255,255,255,0.04)] pt-12">
          <div className="text-[clamp(3rem,7vw,6.5rem)] font-light leading-none mb-4 tracking-tighter">12M+</div>
          <div className="text-lg text-[var(--text-muted)] font-light">Million tokens processed in active production pipelines.</div>
        </div>
        <div className="border-t border-[rgba(255,255,255,0.04)] pt-12">
          <div className="text-[clamp(3rem,7vw,6.5rem)] font-light leading-none mb-4 tracking-tighter">99.9%</div>
          <div className="text-lg text-[var(--text-muted)] font-light">Orchestration engine uptime maintained over high-traffic quarters.</div>
        </div>
        <div className="border-t border-[rgba(255,255,255,0.04)] pt-12">
          <div className="text-[clamp(3rem,7vw,6.5rem)] font-light leading-none mb-4 tracking-tighter">4.2x</div>
          <div className="text-lg text-[var(--text-muted)] font-light">Average performance acceleration achieved across operator teams.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
      <CounterItem target={12} suffix="M+" label="Million tokens processed in active production pipelines." />
      <CounterItem target={99.9} suffix="%" label="Orchestration engine uptime maintained over high-traffic quarters." isFloat />
      <CounterItem target={4.2} suffix="x" label="Average performance acceleration achieved across operator teams." isFloat />
    </div>
  );
}
