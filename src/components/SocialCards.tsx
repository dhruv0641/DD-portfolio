'use client';

import React, { useRef, useCallback, useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════
interface SocialCardProps {
  href: string;
  label: string;
  tooltip: string;
  icon: React.ReactNode;
  ariaLabel: string;
}

// ════════════════════════════════════════════════════════════════════════════
// SOCIAL CARD COMPONENT
// ════════════════════════════════════════════════════════════════════════════
const SocialCard = memo(function SocialCard({
  href,
  label,
  tooltip,
  icon,
  ariaLabel,
}: SocialCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const isTouchDevice = useRef(false);

  // Detect touch devices on mount
  useEffect(() => {
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // ── Magnetic cursor effect (GPU-only, no React re-renders) ──
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isTouchDevice.current || !iconRef.current || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    // Magnetic pull — limited to 5px
    const maxPull = 5;
    const pullX = Math.min(Math.max(dx * 0.12, -maxPull), maxPull);
    const pullY = Math.min(Math.max(dy * 0.12, -maxPull), maxPull);

    iconRef.current.style.transform = `translate3d(${pullX}px, ${pullY}px, 0) scale(1.05)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (iconRef.current) {
      iconRef.current.style.transform = 'translate3d(0, 0, 0) scale(1)';
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  // ── Click with ripple and brief status flash ──
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();

    // Spawn ripple at click position
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      id: Date.now(),
    });

    setIsPressed(true);
    setShowStatus(true);

    // Open link after brief animation (150ms — imperceptible delay)
    setTimeout(() => {
      window.open(href, '_blank', 'noopener,noreferrer');
    }, 150);

    // Reset states
    setTimeout(() => setIsPressed(false), 200);
    setTimeout(() => setShowStatus(false), 1200);
    setTimeout(() => setRipple(null), 600);
  }, [href]);

  return (
    <a
      ref={cardRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex items-center gap-3.5 px-4 py-3.5 rounded-xl border transition-all duration-300 outline-none cursor-pointer select-none overflow-hidden"
      style={{
        background: isHovered
          ? 'rgba(255, 255, 255, 0.02)'
          : 'transparent',
        borderColor: isHovered
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(255, 255, 255, 0.04)',
        boxShadow: isHovered
          ? '0 0 20px rgba(var(--accent-rgb), 0.06), 0 4px 16px rgba(0, 0, 0, 0.2)'
          : 'none',
        transform: isPressed ? 'scale(0.97)' : 'scale(1)',
      }}
      aria-label={ariaLabel}
    >
      {/* Glass reflection sweep — plays on hover */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
        style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease' }}
      >
        <div
          className="absolute top-0 -left-[100%] w-[60%] h-full skew-x-[-20deg]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
            animation: isHovered ? 'sheenSweep 1.5s ease forwards' : 'none',
          }}
        />
      </div>

      {/* Ripple effect */}
      <AnimatePresence>
        {ripple && (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.3 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x - 20,
              top: ripple.y - 20,
              width: 40,
              height: 40,
              background: 'rgba(var(--accent-rgb), 0.15)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Icon container with magnetic movement */}
      <div
        ref={iconRef}
        className="relative z-10 flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-300"
        style={{
          borderColor: isHovered
            ? 'rgba(var(--accent-rgb), 0.2)'
            : 'rgba(255, 255, 255, 0.06)',
          background: isHovered
            ? 'rgba(var(--accent-rgb), 0.06)'
            : 'rgba(255, 255, 255, 0.02)',
          boxShadow: isHovered
            ? '0 0 12px rgba(var(--accent-rgb), 0.1)'
            : 'none',
          willChange: 'transform',
          transition: 'border-color 0.3s, background 0.3s, box-shadow 0.3s, transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        <div
          className="transition-all duration-300"
          style={{
            color: isHovered ? 'rgba(var(--accent-rgb), 1)' : 'rgba(255, 255, 255, 0.5)',
            filter: isHovered ? 'drop-shadow(0 0 4px rgba(var(--accent-rgb), 0.3))' : 'none',
          }}
        >
          {icon}
        </div>
      </div>

      {/* Label */}
      <div className="relative z-10 flex flex-col gap-0.5">
        <span
          className="font-mono text-[11px] uppercase tracking-wider font-medium transition-colors duration-300"
          style={{ color: isHovered ? '#fafafa' : 'rgba(255, 255, 255, 0.4)' }}
        >
          {label}
        </span>

        {/* Status flash on click */}
        <AnimatePresence>
          {showStatus && (
            <motion.span
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.15 }}
              className="font-mono text-[9px] text-[var(--accent)] tracking-wider"
            >
              ↗ Opening {label}...
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* External arrow indicator */}
      <div
        className="ml-auto relative z-10 transition-all duration-300"
        style={{
          opacity: isHovered ? 0.6 : 0,
          transform: isHovered ? 'translate3d(0, 0, 0)' : 'translate3d(-4px, 4px, 0)',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M1 9L9 1M9 1H3M9 1V7" />
        </svg>
      </div>

      {/* Premium tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15, delay: 0.4 }}
            className="absolute -top-11 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg border border-white/[0.06] font-mono text-[9px] text-zinc-400 whitespace-nowrap shadow-xl pointer-events-none z-30"
            style={{
              background: 'rgba(10, 10, 14, 0.92)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {tooltip}
            {/* Tooltip arrow */}
            <div
              className="absolute -bottom-[4px] left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b border-white/[0.06]"
              style={{ background: 'rgba(10, 10, 14, 0.92)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Focus ring for keyboard navigation */}
      <style>{`
        a:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px rgba(var(--accent-rgb), 0.4), 0 0 16px rgba(var(--accent-rgb), 0.1) !important;
          border-color: rgba(var(--accent-rgb), 0.3) !important;
        }
        @keyframes sheenSweep {
          0% { transform: translateX(0) skewX(-20deg); }
          100% { transform: translateX(350%) skewX(-20deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          a, a * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
        }
      `}</style>
    </a>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// GITHUB ICON
// ════════════════════════════════════════════════════════════════════════════
const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

// ════════════════════════════════════════════════════════════════════════════
// LINKEDIN ICON
// ════════════════════════════════════════════════════════════════════════════
const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// ════════════════════════════════════════════════════════════════════════════
// SOCIAL CARDS GROUP — exported for use in page.tsx
// ════════════════════════════════════════════════════════════════════════════
export default function SocialCards() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-6 border-t border-[var(--grid-line)]">
      <SocialCard
        href="https://github.com/dhruv0641"
        label="GitHub"
        tooltip="View source code & open-source work"
        icon={<GitHubIcon />}
        ariaLabel="GitHub Profile — View source code and open-source work"
      />
      <SocialCard
        href="https://linkedin.com/in/dhruv-dobariya"
        label="LinkedIn"
        tooltip="Professional profile & experience"
        icon={<LinkedInIcon />}
        ariaLabel="LinkedIn Profile — Professional profile and experience"
      />
    </div>
  );
}
