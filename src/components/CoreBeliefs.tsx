'use client';

import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface BeliefItem {
  num: string;
  title: string;
  desc: string;
}

const beliefs: BeliefItem[] = [
  {
    num: '01',
    title: 'Human first, model second',
    desc: 'AI should elevate and extend human capability, not replace or simulate it. We construct software to empower human intent, not to create automated noise.'
  },
  {
    num: '02',
    title: 'Deterministic guardrails',
    desc: 'Stochastic models produce unpredictable results. We wrap intelligence in mathematical guardrails, ensuring reliability in high-stakes environments.'
  },
  {
    num: '03',
    title: 'Performance is respect',
    desc: 'Lag is cognitive drag. Orchestration, retrieval, and interface rendering are optimized for zero latency, respecting the flow state of the operator.'
  }
];

// Component representing the entire beliefs container
export default function CoreBeliefs() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-32 relative z-10 w-full"
    >
      {beliefs.map((belief, idx) => (
        <BeliefCard
          key={belief.num}
          num={belief.num}
          title={belief.title}
          desc={belief.desc}
          index={idx}
          visible={visible}
          isHovered={hoveredIdx === idx}
          isAnyHovered={hoveredIdx !== null}
          onHoverStart={() => setHoveredIdx(idx)}
          onHoverEnd={() => setHoveredIdx(null)}
        />
      ))}
    </div>
  );
}

interface CardProps {
  num: string;
  title: string;
  desc: string;
  index: number;
  visible: boolean;
  isHovered: boolean;
  isAnyHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

// Optimized individual card with 3D Parallax & Cursor light tracking
const BeliefCard = memo(function BeliefCard({
  num,
  title,
  desc,
  index,
  visible,
  isHovered,
  isAnyHovered,
  onHoverStart,
  onHoverEnd
}: CardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (shouldReduceMotion || !cardRef.current || !glowRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Cursor gradient light follow
    glowRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

    // 3D Parallax rotation calculations (limited to 5 degrees max)
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const rotateX = Math.min(Math.max((yc - y) / 15, -5), 5);
    const rotateY = Math.min(Math.max((x - xc) / 15, -5), 5);

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(0, -6px, 0) scale3d(1.01, 1.01, 1.01)`;
  }, [shouldReduceMotion]);

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0) scale3d(1, 1, 1)';
    }
    onHoverEnd();
  }, [onHoverEnd]);

  // Staggered entrance animation config
  const variants: any = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.5, delay: index * 0.15, ease: [0.25, 1, 0.5, 1] }
    }
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={visible ? 'show' : 'hidden'}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={onHoverStart}
      onMouseLeave={handleMouseLeave}
      className={`relative bg-[#070709]/60 border border-white/5 rounded-2xl p-8 flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-md cursor-pointer transition-all duration-300 ${
        isAnyHovered && !isHovered ? 'opacity-40 scale-[0.98]' : 'opacity-100'
      }`}
      style={{
        transition: 'opacity 0.4s ease, transform 0.25s cubic-bezier(0.23, 1, 0.32, 1), scale 0.4s ease',
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity'
      }}
    >
      {/* Dynamic Cursor Highlight Glow */}
      <div
        ref={glowRef}
        className="absolute w-48 h-48 rounded-full pointer-events-none opacity-0 transition-opacity duration-300 mix-blend-screen z-0"
        style={{
          background: 'radial-gradient(circle, rgba(0, 102, 255, 0.12) 0%, transparent 70%)',
          opacity: isHovered ? 1 : 0,
          transform: 'translate3d(-999px, -999px, 0)',
          willChange: 'transform'
        }}
      />

      {/* Blueprint Corner Accents */}
      <div className="absolute top-3 left-3 w-1.5 h-1.5 border-t border-l border-white/20" />
      <div className="absolute top-3 right-3 w-1.5 h-1.5 border-t border-r border-white/20" />
      <div className="absolute bottom-3 left-3 w-1.5 h-1.5 border-b border-l border-white/20" />
      <div className="absolute bottom-3 right-3 w-1.5 h-1.5 border-b border-r border-white/20" />

      {/* Top Number Label */}
      <div className="flex justify-between items-center z-10 mb-8 select-none">
        <span className="font-mono text-[10px] text-[var(--accent)] tracking-widest bg-[rgba(var(--accent-rgb),0.06)] border border-[rgba(var(--accent-rgb),0.15)] rounded-md px-2 py-0.5 shadow-[0_0_15px_rgba(0,102,255,0.05)]">
          // {num}
        </span>
        <div className="w-16 h-[1px] bg-gradient-to-r from-[rgba(255,255,255,0.05)] to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 z-10">
        <h3 className="text-lg font-semibold tracking-tight text-white transition-colors duration-300 hover:text-[var(--accent)]">
          {title}
        </h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed font-light font-sans max-w-[340px]">
          {desc}
        </p>
      </div>

      {/* Subtle Bottom Accent Indicator */}
      <div className="w-full mt-8 flex items-center justify-between z-10 select-none">
        <span className="text-[8px] font-mono text-zinc-700 tracking-wider">PRINCIPLE_METRIC</span>
        <div 
          className="w-1.5 h-1.5 rounded-full transition-all duration-500"
          style={{
            backgroundColor: isHovered ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
            boxShadow: isHovered ? '0 0 10px var(--accent)' : 'none'
          }}
        />
      </div>
    </motion.div>
  );
});
