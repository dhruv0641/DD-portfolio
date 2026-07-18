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
      <div className="text-sm lg:text-base text-[var(--text-muted)] font-light leading-relaxed">{label}</div>
    </div>
  );
}

export default function Certifications() {
  const { settings } = useThemeSettings();

  const certData = [
    {
      target: 92,
      suffix: '%',
      label: 'AWS Certified Machine Learning – Specialty. Validated competency in designing, building, and deploying deep learning pipelines on AWS infrastructure.'
    },
    {
      target: 100,
      suffix: '%',
      label: 'Generative AI Developer (DeepLearning.AI). Advanced skills in constructing RAG models, LangGraph agentic frameworks, and fine-tuning.'
    },
    {
      target: 15,
      suffix: '+',
      label: 'Google TensorFlow Developer. Certified proficiency in engineering deep neural networks, computer vision models, and sequence processing.'
    }
  ];

  if (settings.reduceMotion === '1') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
        {certData.map((cert, index) => (
          <div key={index} className="border-t border-[rgba(255,255,255,0.04)] pt-12">
            <div className="text-[clamp(3rem,7vw,6.5rem)] font-light leading-none mb-4 tracking-tighter">
              {cert.target}{cert.suffix}
            </div>
            <div className="text-sm lg:text-base text-[var(--text-muted)] font-light leading-relaxed">
              {cert.label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
      {certData.map((cert, index) => (
        <CounterItem
          key={index}
          target={cert.target}
          suffix={cert.suffix}
          label={cert.label}
        />
      ))}
    </div>
  );
}
