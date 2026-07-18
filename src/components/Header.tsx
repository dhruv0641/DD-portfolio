'use client';

import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

// ────────────────────────────────────────────────────────────────────────────
// Navigation Items — single source of truth
// ────────────────────────────────────────────────────────────────────────────
interface NavItem {
  name: string;
  href: string;
  sectionId: string | null;
  isPage: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Identity',   href: '/#identity', sectionId: 'identity', isPage: false },
  { name: 'Work',       href: '/#work',     sectionId: 'work',     isPage: false },
  { name: 'Case Study', href: '/#case',     sectionId: 'case',     isPage: false },
  { name: 'Thinking',   href: '/#thinking', sectionId: 'thinking', isPage: false },
  { name: 'Build',      href: '/#build',    sectionId: 'build',    isPage: false },
  { name: 'Playground', href: '/playground', sectionId: null,       isPage: true  },
];

const SECTION_IDS = ['identity', 'work', 'case', 'thinking', 'build'];

// ────────────────────────────────────────────────────────────────────────────
// 1. MagneticEffect — GPU-only, zero React re-renders
// ────────────────────────────────────────────────────────────────────────────
const MagneticEffect = memo(function MagneticEffect({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    const maxLimit = 6;
    const bx = Math.min(Math.max(x * 0.2, -maxLimit), maxLimit);
    const by = Math.min(Math.max(y * 0.2, -maxLimit), maxLimit);
    ref.current.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = 'translate3d(0, 0, 0)';
    }
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center animate-gpu"
      style={{ transition: 'transform 0.25s cubic-bezier(0.23, 1, 0.32, 1)', willChange: 'transform' }}
    >
      {children}
    </div>
  );
});

// ────────────────────────────────────────────────────────────────────────────
// 2. CursorGlow — GPU-accelerated, passive listener, zero re-renders
// ────────────────────────────────────────────────────────────────────────────
const CursorGlow = memo(function CursorGlow() {
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let rafId: number | null = null;
    let mx = -9999, my = -9999;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          if (glowRef.current) {
            const parent = glowRef.current.parentElement;
            if (parent) {
              const rect = parent.getBoundingClientRect();
              const x = mx - rect.left;
              const y = my - rect.top;
              glowRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
            }
          }
          rafId = null;
        });
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="absolute top-0 left-0 w-40 h-40 rounded-full pointer-events-none mix-blend-screen opacity-20 z-0"
      style={{
        background: 'radial-gradient(circle, rgba(0,102,255,0.12) 0%, transparent 70%)',
        transform: 'translate3d(-9999px, -9999px, 0)',
        willChange: 'transform',
      }}
    />
  );
});

// ────────────────────────────────────────────────────────────────────────────
// 3. CommandPalette — lazy-rendered, keyboard-driven
// ────────────────────────────────────────────────────────────────────────────
const CommandPalette = memo(function CommandPalette({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (item: NavItem) => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const allItems: NavItem[] = [
    { name: 'Home', href: '/', sectionId: 'intro', isPage: false },
    ...NAV_ITEMS,
  ];

  const filtered = allItems.filter((l) =>
    l.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => { setSelectedIndex(0); }, [query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((p) => (p + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((p) => (p - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          onNavigate(filtered[selectedIndex]);
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, selectedIndex, filtered, onClose, onNavigate]);

  if (!open) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[998]"
      />
      <div className="fixed inset-0 flex items-start justify-center pt-[20vh] z-[999] p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-[480px] bg-[#0a0a0c] border border-white/[0.06] rounded-2xl p-3 flex flex-col gap-2 shadow-2xl font-mono text-xs pointer-events-auto"
        >
          <div className="flex justify-between items-center text-[10px] text-zinc-600 px-1">
            <span>NAVIGATE</span>
            <kbd className="text-zinc-700 bg-white/[0.03] border border-white/[0.04] rounded px-1.5 py-0.5 text-[9px]">ESC</kbd>
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Where to?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-white/[0.03] border border-white/[0.04] rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/[0.08] w-full"
          />
          <div className="flex flex-col gap-0.5 max-h-[240px] overflow-y-auto">
            {filtered.map((item, idx) => (
              <button
                key={item.href}
                onClick={() => { onNavigate(item); onClose(); }}
                className={`w-full text-left py-2.5 px-3 rounded-lg transition-colors duration-100 cursor-pointer flex items-center justify-between ${
                  idx === selectedIndex
                    ? 'bg-white/[0.04] text-white'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
                }`}
              >
                <span>{item.name}</span>
                {idx === selectedIndex && (
                  <kbd className="text-[9px] text-zinc-600 bg-white/[0.03] border border-white/[0.04] rounded px-1.5 py-0.5">↵</kbd>
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-zinc-600 text-center py-4">No results</div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
});

// ────────────────────────────────────────────────────────────────────────────
// 4. Main Header Component
// ────────────────────────────────────────────────────────────────────────────
export default function Header({ name }: { name: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [cmdOpen, setCmdOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const pendingScrollRef = useRef<string | null>(null);

  // ── Ctrl+K ──
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setCmdOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // ── Close mobile menu on route change ──
  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  // ── Scroll position listener (for backdrop blur changes only) ──
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── IntersectionObserver for active section tracking on Home Page ──
  useEffect(() => {
    if (pathname !== '/') return;

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px', // Sweet spot in the middle of the viewport
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  // ── Active state synchronization for standalone routes ──
  useEffect(() => {
    if (pathname === '/playground') {
      setActiveSection('playground');
    } else if (pathname.startsWith('/blog')) {
      setActiveSection('blog');
    } else if (pathname === '/') {
      // Handled dynamically by IntersectionObserver
    } else {
      setActiveSection('');
    }
  }, [pathname]);

  // ── After SPA navigation to '/', scroll to pending target ──
  useEffect(() => {
    if (pathname === '/' && pendingScrollRef.current) {
      const targetId = pendingScrollRef.current;
      pendingScrollRef.current = null;

      const attemptScroll = () => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          // Note: IntersectionObserver will automatically update activeSection as it scrolls into view
        }
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(attemptScroll);
      });
    }
  }, [pathname]);

  // ── Core navigation handler ──
  const navigateTo = useCallback((item: NavItem) => {
    setMobileMenuOpen(false);

    // Standalone page routes
    if (item.isPage) {
      router.push(item.href);
      return;
    }

    // Hash sections on the homepage
    const sectionId = item.sectionId;
    if (!sectionId) return;

    if (pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `/#${sectionId}`);
      }
    } else {
      pendingScrollRef.current = sectionId;
      router.push('/');
    }
  }, [pathname, router]);

  const handleNavClick = useCallback((e: React.MouseEvent, item: NavItem) => {
    e.preventDefault();
    navigateTo(item);
  }, [navigateTo]);

  const getIsActive = useCallback((item: NavItem): boolean => {
    if (item.isPage) {
      if (item.href === '/blog') return pathname.startsWith('/blog');
      if (item.href === '/playground') return pathname === '/playground';
      return pathname === item.href;
    }
    return activeSection === item.sectionId;
  }, [activeSection, pathname]);

  return (
    <>
      <header
        className="fixed top-6 left-0 right-0 w-full z-50 flex justify-center px-[8%] pointer-events-none"
        role="banner"
      >
        <div
          className="w-full max-w-[1400px] flex justify-between items-center py-4 px-8 pointer-events-auto relative overflow-hidden"
          style={{
            background: isScrolled ? 'rgba(9, 9, 9, 0.45)' : 'rgba(9, 9, 9, 0.2)',
            backdropFilter: isScrolled ? 'blur(24px)' : 'blur(16px)',
            WebkitBackdropFilter: isScrolled ? 'blur(24px)' : 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            boxShadow: isScrolled
              ? '0 10px 30px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              : '0 4px 20px -10px rgba(0, 0, 0, 0.3)',
            transition: 'background 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease',
          }}
        >
          <CursorGlow />

          {/* Logo */}
          <MagneticEffect>
            <div className="logo select-none flex items-center gap-2 font-medium z-10 cursor-pointer">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--text)] transition-transform duration-300 hover:rotate-180 hover:scale-110" />
              <Link href="/" prefetch={true} aria-label="Home">{name}</Link>
            </div>
          </MagneticEffect>

          {/* ── Desktop Navigation ── */}
          <LayoutGroup>
            <nav
              className="hidden lg:flex gap-6 text-xs font-mono items-center z-10 relative"
              role="navigation"
              aria-label="Main navigation"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = getIsActive(item);
                const isPlayground = item.href === '/playground';

                return (
                  <MagneticEffect key={item.href}>
                    {item.isPage ? (
                      <Link
                        href={item.href}
                        prefetch={true}
                        onClick={(e) => handleNavClick(e, item)}
                        className={`relative py-1 px-3 rounded-full flex items-center transition-colors duration-150 ${
                          isActive ? 'text-white' : 'text-zinc-500 hover:text-white'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {item.name}
                        {isActive && (
                          <motion.div
                            layoutId="nav-active-pill"
                            className="absolute inset-0 bg-white/[0.05] border border-white/[0.08] rounded-full z-[-1]"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                        {isPlayground && (
                          <span className="relative flex h-1.5 w-1.5 ml-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--accent)]" />
                          </span>
                        )}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item)}
                        className={`relative py-1 px-3 rounded-full flex items-center transition-colors duration-150 ${
                          isActive ? 'text-white' : 'text-zinc-500 hover:text-white'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {item.name}
                        {isActive && (
                          <motion.div
                            layoutId="nav-active-pill"
                            className="absolute inset-0 bg-white/[0.05] border border-white/[0.08] rounded-full z-[-1]"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                      </a>
                    )}
                  </MagneticEffect>
                );
              })}
            </nav>
          </LayoutGroup>

          {/* ── Mobile Menu Button ── */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex flex-col gap-1.5 justify-center items-center w-8 h-8 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 z-20 cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span className={`block w-4 h-0.5 bg-white transition-all duration-200 origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
            <span className={`block w-4 h-0.5 bg-white transition-all duration-200 origin-center ${mobileMenuOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
          </button>
        </div>
      </header>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-[39] lg:hidden"
            />
            <motion.nav
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="fixed top-28 left-6 right-6 z-40 bg-[#0a0a0c] border border-white/[0.06] rounded-2xl p-5 shadow-2xl flex flex-col gap-2 font-mono text-sm lg:hidden"
              role="navigation"
              aria-label="Mobile navigation"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = getIsActive(item);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`block py-2.5 px-3 rounded-xl transition-colors duration-100 ${
                      isActive
                        ? 'text-white bg-white/[0.04] border border-white/[0.06]'
                        : 'text-zinc-500 hover:text-white border border-transparent'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.name}
                  </a>
                );
              })}
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* ── Command Palette ── */}
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onNavigate={navigateTo}
      />
    </>
  );
}
