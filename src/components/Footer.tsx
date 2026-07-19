'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// ════════════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════════════
const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const WhatsappIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2v3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

// ════════════════════════════════════════════════════════════════════════════
// PREMIUM MINIMAL FOOTER COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export const Footer = memo(function Footer({ name, email }: { name: string; email: string }) {
  const [copied, setCopied] = useState(false);
  const [isPhoneHovered, setIsPhoneHovered] = useState(false);

  const handleBackToTop = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Update browser hash and address without jump
    window.history.pushState(null, '', '/');
  }, []);

  const handleCopyEmail = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [email]);

  return (
    <footer className="w-full border-t border-white/[0.04] bg-[#09090b]/40 backdrop-blur-md relative overflow-hidden py-16 px-[8%] select-none">
      {/* Subtle top border shimmer pulse */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(0,102,255,0.12)] to-transparent opacity-80" />

      {/* Grid container with entrance transitions */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[1.5fr_2fr_1fr] gap-10 md:gap-16 items-start text-xs font-mono"
      >
        {/* LEFT COLUMN: Copyright & Purpose */}
        <div className="flex flex-col gap-2.5 text-center md:text-left">
          <span className="text-white/80 font-medium tracking-wide">
            © {new Date().getFullYear()} {name}
          </span>
          <span className="text-[10px] text-zinc-500 leading-relaxed max-w-[220px] mx-auto md:mx-0">
            Building software with clarity, precision, and purpose.
          </span>
        </div>

        {/* CENTER COLUMN: Social Links */}
        <div className="flex flex-col gap-4 items-center md:items-start">
          <span className="text-[10px] text-zinc-600 uppercase tracking-widest block mb-1">
            Connect
          </span>
          <div className="flex flex-wrap justify-center md:justify-start gap-2.5 max-w-[450px]">
            {/* GitHub */}
            <a
              href="https://github.com/dhruv0641"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/[0.04] bg-white/[0.01] text-zinc-400 hover:text-white hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300 shadow-sm"
              style={{ willChange: 'transform' }}
            >
              <span className="transition-transform duration-300 group-hover:rotate-2 group-hover:scale-105">
                <GithubIcon />
              </span>
              <span className="text-[10px] uppercase tracking-wider">GitHub</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/dhruv-dobariya"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/[0.04] bg-white/[0.01] text-zinc-400 hover:text-[#0066FF] hover:border-[#0066FF]/20 hover:bg-[#0066FF]/5 transition-all duration-300 shadow-sm"
            >
              <span>
                <LinkedinIcon />
              </span>
              <span className="text-[10px] uppercase tracking-wider">LinkedIn</span>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/[0.04] bg-white/[0.01] text-zinc-400 hover:text-[#E1306C] hover:border-[#E1306C]/20 hover:bg-[#E1306C]/5 transition-all duration-300 shadow-sm"
            >
              <span>
                <InstagramIcon />
              </span>
              <span className="text-[10px] uppercase tracking-wider">Instagram</span>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/919925208466"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setIsPhoneHovered(true)}
              onMouseLeave={() => setIsPhoneHovered(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/[0.04] bg-white/[0.01] text-zinc-400 hover:text-[#25D366] hover:border-[#25D366]/20 hover:bg-[#25D366]/5 transition-all duration-300 shadow-sm"
            >
              <span className={isPhoneHovered ? 'animate-bounce' : ''}>
                <WhatsappIcon />
              </span>
              <span className="text-[10px] uppercase tracking-wider">WhatsApp</span>
            </a>

            {/* Email (with hover copy trigger) */}
            <div className="relative flex items-center">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 px-3 py-2 rounded-l-full border border-r-0 border-white/[0.04] bg-white/[0.01] text-zinc-400 hover:text-white hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300"
              >
                <span>
                  <EmailIcon />
                </span>
                <span className="text-[10px] uppercase tracking-wider">Email</span>
              </a>
              <button
                onClick={handleCopyEmail}
                className="flex items-center justify-center p-2.5 rounded-r-full border border-white/[0.04] bg-white/[0.01] text-zinc-500 hover:text-white hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300 cursor-pointer"
                aria-label="Copy email address"
              >
                <CopyIcon />
              </button>

              {/* Copied tooltip feedback */}
              <AnimatePresence>
                {copied && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#0c0c0e]/95 border border-white/[0.06] rounded-md px-2 py-1 text-[9px] text-zinc-400 shadow-xl pointer-events-none whitespace-nowrap z-25"
                  >
                    COPIED
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Quick Actions */}
        <div className="flex flex-col gap-4 items-center md:items-end">
          <span className="text-[10px] text-zinc-600 uppercase tracking-widest block mb-1">
            Actions
          </span>
          <div className="flex flex-col gap-2.5 text-[10px] uppercase tracking-wider items-center md:items-end">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors duration-300"
            >
              <span>Resume</span>
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
                <path d="M1 9L9 1M9 1H3M9 1V7" />
              </svg>
            </a>

            <a
              href="#build"
              className="group flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors duration-300"
            >
              <span>Contact</span>
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" className="transform group-hover:translate-x-0.5 transition-transform duration-200">
                <path d="M1 5h8M9 5L5 1M9 5L5 9" />
              </svg>
            </a>

            <a
              href="#"
              onClick={handleBackToTop}
              className="group flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors duration-300"
            >
              <span>Back to Top</span>
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" className="transform group-hover:-translate-y-0.5 transition-transform duration-200">
                <path d="M5 9V1M5 1L1 5M5 1l4 4" />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
});

export default Footer;
