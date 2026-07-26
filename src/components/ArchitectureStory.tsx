'use client';

import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ════════════════════════════════════════════════════════════════════════════
// TYPES & DATA DEFINITIONS
// ════════════════════════════════════════════════════════════════════════════
export interface Stage {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

export const STAGES: Stage[] = [
  { id: 'input',         label: 'Input',         icon: '📥', desc: 'Ingestion of raw multi-format files & metadata.' },
  { id: 'understanding', label: 'Understanding',  icon: '🔍', desc: 'Intent classification & schema extraction.' },
  { id: 'reasoning',     label: 'Reasoning',      icon: '🧠', desc: 'LangGraph multi-agent decision orchestration.' },
  { id: 'validation',    label: 'Validation',    icon: '🛡️', desc: 'Deterministic structural schema constraints validation.' },
  { id: 'deployment',    label: 'Deployment',    icon: '🚀', desc: 'AWS ECS container deployment & REST API triggers.' },
];

// ════════════════════════════════════════════════════════════════════════════
// METRIC COUNTER COMPONENT (Subtle animate-in / count-up)
// ════════════════════════════════════════════════════════════════════════════
export const MetricCounter = memo(function MetricCounter({
  target,
  duration = 2000,
  suffix = '',
  prefix = '',
}: {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return (
    <span className="tabular-nums">
      {prefix}
      {value}
      {suffix}
    </span>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// PIPELINE NODE COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export const PipelineNode = memo(function PipelineNode({
  stage,
  state,
  isHovered,
  onHover,
}: {
  stage: Stage;
  state: 'idle' | 'processing' | 'completed';
  isHovered: boolean;
  onHover: (id: string | null) => void;
}) {
  return (
    <div
      onMouseEnter={() => onHover(stage.id)}
      onMouseLeave={() => onHover(null)}
      className="relative flex flex-col items-center justify-center flex-1"
    >
      <div
        className="w-full min-w-[80px] max-w-[110px] lg:max-w-[125px] border rounded-xl py-4 px-3 flex flex-col items-center justify-center transition-all duration-500 relative cursor-default overflow-hidden select-none"
        style={{
          background:
            state === 'processing'
              ? 'rgba(0, 102, 255, 0.05)'
              : 'rgba(255, 255, 255, 0.01)',
          borderColor:
            state === 'processing'
              ? 'rgba(0, 102, 255, 0.25)'
              : state === 'completed'
              ? 'rgba(0, 220, 130, 0.15)'
              : 'rgba(255, 255, 255, 0.04)',
          boxShadow:
            state === 'processing'
              ? '0 0 25px rgba(0, 102, 255, 0.06)'
              : 'none',
        }}
      >
        {/* Glow behind processing */}
        {state === 'processing' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,102,255,0.03)] to-transparent pointer-events-none" />
        )}

        {/* Icon / Status indicator */}
        <span className="text-xl mb-2 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          {state === 'completed' ? '✓' : stage.icon}
        </span>

        {/* Node Title */}
        <span className="text-[10px] font-mono text-white/80 font-medium tracking-wide uppercase">
          {stage.label}
        </span>

        {/* Status Dot indicator */}
        <div
          className="w-1.5 h-1.5 rounded-full mt-3 transition-all duration-300"
          style={{
            backgroundColor:
              state === 'processing'
                ? 'var(--accent)'
                : state === 'completed'
                ? '#00dc82'
                : 'rgba(255, 255, 255, 0.15)',
            boxShadow:
              state === 'processing'
                ? '0 0 8px var(--accent)'
                : 'none',
          }}
        />
      </div>

      {/* Elegant Hover Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-[#0a0a0d]/95 border border-white/[0.06] rounded-lg px-3 py-2 text-[9px] font-mono text-zinc-400 text-center shadow-xl z-20 min-w-[150px] pointer-events-none"
          >
            {stage.desc}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// SIGNAL COMPONENT (Moving connection signal line)
// ════════════════════════════════════════════════════════════════════════════
export const Signal = memo(function Signal({
  active,
  vertical,
}: {
  active: boolean;
  vertical?: boolean;
}) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${
        vertical ? 'h-6 w-[1px]' : 'flex-grow min-w-[8px] max-w-[32px] h-[1px]'
      }`}
      style={{ alignSelf: 'center' }}
    >
      {/* Connector line */}
      <div
        className={`absolute ${vertical ? 'w-[1px] h-full' : 'h-[1px] w-full'}`}
        style={{
          background: active
            ? 'rgba(0, 102, 255, 0.4)'
            : 'rgba(255, 255, 255, 0.05)',
          transition: 'background 0.4s ease',
        }}
      />
      {/* Glowing pulse dot */}
      {active && (
        <div
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: 'var(--accent)',
            boxShadow: '0 0 8px var(--accent)',
            animation: vertical
              ? 'pulseDown 1.2s ease-in-out infinite'
              : 'pulseRight 1.2s ease-in-out infinite',
          }}
        />
      )}
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// RESULT PANEL COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export const ResultPanel = memo(function ResultPanel({
  phase,
}: {
  phase: 'idle' | 'processing' | 'completed';
}) {
  return (
    <div className="bg-[#09090c]/40 border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between min-h-[190px] backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-emerald-500/10 to-transparent" />

      <div>
        <span className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase block mb-1">
          SYSTEM_METRICS
        </span>
        <h4 className="text-white font-medium text-xs tracking-tight">
          Execution Profile
        </h4>
      </div>

      {/* Dynamic phase display */}
      <div className="flex flex-col gap-2.5 my-3">
        {phase === 'processing' ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span>PROFILING...</span>
              <span className="text-[var(--accent)] animate-pulse">ACTIVE</span>
            </div>
            {/* Visual loader bar */}
            <div className="w-full bg-white/[0.02] border border-white/[0.03] h-1 rounded-full overflow-hidden relative">
              <div className="h-full bg-[var(--accent)] animate-pulse w-2/3 rounded-full" />
            </div>
          </div>
        ) : phase === 'completed' ? (
          <div className="flex flex-col gap-2 animate-fadeIn">
            <div className="flex items-center justify-between text-[10px] font-mono border-b border-white/[0.02] pb-1.5">
              <span className="text-zinc-500">ACCURACY</span>
              <span className="text-emerald-400 font-semibold">
                ✓ <MetricCounter target={98} suffix=".7%" />
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono border-b border-white/[0.02] pb-1.5">
              <span className="text-zinc-500">SPEEDUP</span>
              <span className="text-emerald-400 font-semibold">
                ✓ <MetricCounter target={84} suffix="% Faster" />
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-zinc-500">SCHEMAS</span>
              <span className="text-emerald-400 font-semibold">✓ ZERO ERRORS</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1 text-[10px] font-mono text-zinc-600">
            <span>AWAITING TRIGGER...</span>
          </div>
        )}
      </div>

      {/* Bottom status badge */}
      <div className="flex items-center justify-between text-[9px] font-mono">
        <span className="text-zinc-600 uppercase">STATUS</span>
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor:
                phase === 'processing'
                  ? 'var(--accent)'
                  : phase === 'completed'
                  ? '#00dc82'
                  : 'rgba(255,255,255,0.1)',
            }}
          />
          <span className="text-zinc-400">
            {phase === 'processing'
              ? 'RUNNING'
              : phase === 'completed'
              ? 'STABLE'
              : 'IDLE'}
          </span>
        </div>
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// COMPARISON CARD COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export const ComparisonCard = memo(function ComparisonCard({
  completed,
}: {
  completed: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[900px] mx-auto w-full">
      {/* Before */}
      <div className="bg-[#09090b]/30 border border-red-500/10 rounded-2xl p-5 flex gap-4 backdrop-blur-sm relative overflow-hidden">
        <div className="w-10 h-10 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-500 text-sm font-mono shrink-0">
          ✕
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <span className="text-[8px] font-mono text-zinc-600 tracking-widest uppercase mb-0.5">
            Legacy Pipeline
          </span>
          <h5 className="text-xs text-white/80 font-medium mb-1">
            Manual Document Audit
          </h5>
          <div className="flex gap-3 text-[10px] font-mono text-zinc-500">
            <span>Time: 12 Hours</span>
            <span>•</span>
            <span>Unstructured</span>
          </div>
        </div>
      </div>

      {/* After */}
      <div
        className="bg-[#09090b]/40 border rounded-2xl p-5 flex gap-4 backdrop-blur-sm relative overflow-hidden transition-colors duration-500 shadow-lg"
        style={{
          borderColor: completed ? 'rgba(0, 102, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
        }}
      >
        {completed && (
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,102,255,0.02)] to-transparent pointer-events-none" />
        )}
        <div className="w-10 h-10 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-500 text-sm font-mono shrink-0">
          ✓
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <span className="text-[8px] font-mono text-[var(--accent)] tracking-widest uppercase mb-0.5">
            AI workflow
          </span>
          <h5 className="text-xs text-white/95 font-semibold mb-1">
            Autonomous State Machine
          </h5>
          <div className="flex gap-3 text-[10px] font-mono text-zinc-400">
            <span className="text-emerald-400">
              Time: {completed ? <MetricCounter target={4} duration={1200} suffix=" Minutes" /> : '---'}
            </span>
            <span>•</span>
            <span className="text-emerald-400">Schema Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// MAIN ARCHITECTURESTORY COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export const ArchitectureStory = memo(function ArchitectureStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const loopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(true);

  // ── Visibility Observer ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Pipeline simulation loop ──
  const startSimulation = useCallback(() => {
    if (!isMounted.current) return;

    setActiveIdx(-1);

    const runNode = (idx: number) => {
      if (!isMounted.current) return;

      if (idx >= STAGES.length) {
        // Complete execution state
        setActiveIdx(STAGES.length);
        loopRef.current = setTimeout(() => {
          startSimulation();
        }, 4000); // Hold results for 4 seconds, then loop
        return;
      }

      setActiveIdx(idx);

      // Processing delays per step
      const stepDelay = idx === 2 ? 1500 : idx === 3 ? 1000 : 600;

      loopRef.current = setTimeout(() => {
        runNode(idx + 1);
      }, stepDelay);
    };

    loopRef.current = setTimeout(() => {
      runNode(0);
    }, 400);
  }, []);

  useEffect(() => {
    isMounted.current = true;
    if (isVisible) {
      startSimulation();
    }
    return () => {
      isMounted.current = false;
      if (loopRef.current) clearTimeout(loopRef.current);
    };
  }, [isVisible, startSimulation]);

  // Determine current component phase
  const currentPhase: 'idle' | 'processing' | 'completed' =
    activeIdx < 0 ? 'idle' :
    activeIdx >= STAGES.length ? 'completed' :
    'processing';

  const getNodeState = (idx: number) => {
    if (activeIdx < 0) return 'idle';
    if (idx < activeIdx) return 'completed';
    if (idx === activeIdx) return 'processing';
    return 'idle';
  };

  return (
    <div
      ref={containerRef}
      className="w-full relative select-none font-sans"
    >
      {/* Keyframe animations for signal pulse lines */}
      <style>{`
        @keyframes pulseRight {
          0% { transform: translateX(-15px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(15px); opacity: 0; }
        }
        @keyframes pulseDown {
          0% { transform: translateY(-10px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(10px); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>

      {/* Main Grid Wrapper */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_auto_4.2fr_auto_1.3fr] gap-6 items-stretch justify-center mb-8 w-full">

        {/* ── STEP 1: PROBLEM CARD ── */}
        <div className="flex flex-col justify-center">
          <div className="bg-[#09090c]/40 border border-red-500/10 rounded-2xl p-5 flex flex-col justify-between min-h-[190px] backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-red-500/10 to-transparent" />
            <div>
              <span className="font-mono text-[9px] text-red-400 tracking-widest uppercase block mb-1">
                01 / The Problem
              </span>
              <h4 className="text-white font-medium text-xs tracking-tight">
                Manual Audit Review
              </h4>
            </div>
            <p className="text-[10px] text-[var(--text-dim)] leading-relaxed font-light font-mono">
              Unstructured tables, emails, and invoices create human bottlenecks with high turnaround times and variance errors.
            </p>
            <div className="flex items-center justify-between text-[9px] font-mono">
              <span className="text-red-500/60 font-semibold uppercase">12h latency</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500/70 animate-ping" />
            </div>
          </div>
        </div>

        {/* Dynamic Connect Arrow 1 */}
        <div className="hidden xl:flex items-center justify-center py-4">
          <Signal active={activeIdx >= 0} />
        </div>

        {/* ── STEP 2: CENTRAL PIPELINE CONTAINER ── */}
        <div className="bg-[#08080a]/60 border border-white/[0.04] rounded-2xl p-6 md:p-8 flex flex-col justify-between min-h-[190px] backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[rgba(0,102,255,0.15)] to-transparent" />
          
          <div className="flex justify-between items-center mb-6">
            <span className="font-mono text-[9px] text-[var(--accent)] tracking-widest uppercase">
              02 / Orchestrated AI Pipeline
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          </div>

          {/* ── DESKTOP/TABLET: Horizontal node list ── */}
          <div className="hidden md:flex items-center justify-between gap-0 w-full">
            {STAGES.map((stage, idx) => (
              <React.Fragment key={stage.id}>
                <PipelineNode
                  stage={stage}
                  state={getNodeState(idx)}
                  isHovered={hoveredId === stage.id}
                  onHover={setHoveredId}
                />
                {idx < STAGES.length - 1 && (
                  <Signal active={activeIdx > idx} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* ── MOBILE: Vertical node list ── */}
          <div className="md:hidden flex flex-col items-center gap-0 w-full">
            {STAGES.map((stage, idx) => (
              <React.Fragment key={stage.id}>
                <PipelineNode
                  stage={stage}
                  state={getNodeState(idx)}
                  isHovered={hoveredId === stage.id}
                  onHover={setHoveredId}
                />
                {idx < STAGES.length - 1 && (
                  <Signal active={activeIdx > idx} vertical />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Horizontal Progress Timeline Indicator */}
          <div className="mt-8 bg-white/[0.02] border border-white/[0.03] h-1.5 rounded-full overflow-hidden w-full relative">
            <div
              className="bg-gradient-to-r from-[var(--accent)] to-[#00dc82] h-full transition-all duration-500 ease-out rounded-full"
              style={{
                width: activeIdx < 0 ? '0%' : `${Math.min(((activeIdx + 1) / STAGES.length) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Dynamic Connect Arrow 2 */}
        <div className="hidden xl:flex items-center justify-center py-4">
          <Signal active={activeIdx >= STAGES.length} />
        </div>

        {/* ── STEP 3: OUTCOME RESULTS PANEL ── */}
        <div className="flex flex-col justify-center">
          <ResultPanel phase={currentPhase} />
        </div>

      </div>

      {/* ── COMPARATIVE OVERVIEW CARDS ── */}
      <ComparisonCard completed={activeIdx >= STAGES.length} />
    </div>
  );
});

export default ArchitectureStory;
