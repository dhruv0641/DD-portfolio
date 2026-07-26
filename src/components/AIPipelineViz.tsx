'use client';

import React, { useState, useEffect, useRef, memo, useCallback } from 'react';

// ════════════════════════════════════════════════════════════════════════════
// SIX STAGES — the complete AI request lifecycle, simplified
// ════════════════════════════════════════════════════════════════════════════
interface Stage {
  id: string;
  label: string;
  icon: string;
  tooltip: string;
}

const STAGES: Stage[] = [
  { id: 'query',         label: 'Query',         icon: '›_',  tooltip: 'Receives and validates the user\'s natural language input.' },
  { id: 'understanding', label: 'Understanding',  icon: '◎',   tooltip: 'Classifies intent and extracts semantic meaning from the prompt.' },
  { id: 'knowledge',     label: 'Knowledge',      icon: '⬡',   tooltip: 'Retrieves relevant context from memory and vector databases.' },
  { id: 'thinking',      label: 'Thinking',       icon: '◈',   tooltip: 'Decomposes the problem through chain-of-thought reasoning.' },
  { id: 'tools',         label: 'Tools',          icon: '⚙',   tooltip: 'Executes function calls and external API integrations.' },
  { id: 'response',      label: 'Response',       icon: '▸',   tooltip: 'Streams the verified output token by token to the user.' },
];

type NodeState = 'idle' | 'active' | 'done';

// Sample streaming outputs
const SAMPLE_QUERIES = [
  { q: 'How can I build a production AI assistant?', r: 'To build a production AI assistant, start with a retrieval-augmented generation pipeline. First, index your knowledge base into vector embeddings, then implement semantic search with reranking. Wrap the LLM in structured output schemas and add deterministic guardrails for reliability.' },
  { q: 'Explain transformer attention mechanisms.', r: 'Attention lets a model weigh every token against every other token in the sequence. The query, key, and value projections create a similarity matrix, allowing the network to focus on contextually relevant parts of the input regardless of position.' },
  { q: 'What makes RAG better than fine-tuning?', r: 'RAG keeps the model general while injecting up-to-date knowledge at inference time. Fine-tuning bakes information into weights, which can be expensive to update and risks catastrophic forgetting. RAG offers dynamic, verifiable retrieval without retraining.' },
];

// ════════════════════════════════════════════════════════════════════════════
// SINGLE NODE — minimal glass card
// ════════════════════════════════════════════════════════════════════════════
const FlowNode = memo(function FlowNode({
  stage,
  state,
  onHover,
  isHovered,
}: {
  stage: Stage;
  state: NodeState;
  onHover: (id: string | null) => void;
  isHovered: boolean;
}) {
  const dotColor =
    state === 'active' ? 'var(--accent)' :
    state === 'done' ? '#00dc82' :
    'rgba(255,255,255,0.15)';

  return (
    <div
      className="relative group flex flex-col items-center gap-3"
      onMouseEnter={() => onHover(stage.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Glass card */}
      <div
        className="relative flex flex-col items-center justify-center w-[100px] h-[100px] md:w-[110px] md:h-[110px] rounded-2xl border cursor-default select-none"
        style={{
          background: state === 'active'
            ? 'rgba(0, 102, 255, 0.06)'
            : 'rgba(255, 255, 255, 0.02)',
          borderColor: state === 'active'
            ? 'rgba(0, 102, 255, 0.3)'
            : state === 'done'
            ? 'rgba(0, 220, 130, 0.15)'
            : 'rgba(255, 255, 255, 0.05)',
          boxShadow: state === 'active'
            ? '0 0 30px rgba(0, 102, 255, 0.08), inset 0 1px 0 rgba(255,255,255,0.04)'
            : 'inset 0 1px 0 rgba(255,255,255,0.02)',
          transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
          transform: state === 'active' ? 'translateY(-4px)' : 'translateY(0)',
        }}
        role="listitem"
        aria-label={`${stage.label}: ${state}`}
      >
        {/* Icon */}
        <span
          className="text-lg mb-1 font-mono"
          style={{
            color: state === 'active' ? 'var(--accent)' : 'rgba(255,255,255,0.25)',
            transition: 'color 0.4s ease',
          }}
        >
          {state === 'done' ? '✓' : stage.icon}
        </span>

        {/* Label */}
        <span
          className="text-[10px] font-mono tracking-wide"
          style={{
            color: state === 'active' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
            transition: 'color 0.4s ease',
          }}
        >
          {stage.label}
        </span>

        {/* Status dot */}
        <div
          className="absolute -bottom-1.5 w-2 h-2 rounded-full"
          style={{
            background: dotColor,
            boxShadow: state === 'active' ? `0 0 8px ${dotColor}` : 'none',
            transition: 'all 0.4s ease',
          }}
        />
      </div>

      {/* Hover tooltip */}
      <div
        className="absolute -bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0a0a0c]/95 border border-white/[0.06] rounded-lg px-3 py-2 text-[9px] text-white/50 font-mono pointer-events-none z-30 max-w-[220px] text-center"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-4px)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          whiteSpace: 'normal',
        }}
      >
        {stage.tooltip}
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// CONNECTION LINE — animated between nodes
// ════════════════════════════════════════════════════════════════════════════
function ConnectionLine({ active, vertical }: { active: boolean; vertical?: boolean }) {
  return (
    <div
      className={`relative flex items-center justify-center ${vertical ? 'h-8 w-[1px]' : 'w-10 md:w-14 h-[1px]'}`}
      style={{ alignSelf: 'center' }}
    >
      {/* Base line */}
      <div
        className={`absolute ${vertical ? 'w-[1px] h-full' : 'h-[1px] w-full'}`}
        style={{
          background: active
            ? 'rgba(0, 102, 255, 0.4)'
            : 'rgba(255, 255, 255, 0.06)',
          transition: 'background 0.5s ease',
        }}
      />
      {/* Traveling pulse */}
      {active && (
        <div
          className={`absolute rounded-full ${vertical ? 'w-1 h-1' : 'w-1 h-1'}`}
          style={{
            background: 'var(--accent)',
            boxShadow: '0 0 6px var(--accent)',
            animation: vertical
              ? 'pulseDown 1s ease-in-out infinite'
              : 'pulseRight 1s ease-in-out infinite',
          }}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN: AIPipelineViz
// ════════════════════════════════════════════════════════════════════════════
export default function AIPipelineViz() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [requestIdx, setRequestIdx] = useState(0);
  const [streamText, setStreamText] = useState('');
  const [phase, setPhase] = useState<'idle' | 'running' | 'streaming' | 'done'>('idle');

  const mountedRef = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Visibility observer ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Cleanup ──
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (streamRef.current) clearInterval(streamRef.current);
    };
  }, []);

  // ── Run a single pipeline cycle ──
  const runCycle = useCallback((reqIdx: number) => {
    if (!mountedRef.current) return;

    setPhase('running');
    setStreamText('');
    setActiveIdx(-1);

    const advanceNode = (idx: number) => {
      if (!mountedRef.current) return;

      if (idx >= STAGES.length) {
        // All nodes done → stream response
        setPhase('streaming');
        const sample = SAMPLE_QUERIES[reqIdx % SAMPLE_QUERIES.length];
        let charIdx = 0;

        streamRef.current = setInterval(() => {
          if (!mountedRef.current) {
            if (streamRef.current) clearInterval(streamRef.current);
            return;
          }
          const chunk = Math.floor(Math.random() * 3) + 1;
          charIdx = Math.min(charIdx + chunk, sample.r.length);
          setStreamText(sample.r.slice(0, charIdx));

          if (charIdx >= sample.r.length) {
            if (streamRef.current) clearInterval(streamRef.current);
            setPhase('done');

            // Pause, then restart
            timeoutRef.current = setTimeout(() => {
              if (!mountedRef.current) return;
              setActiveIdx(-1);
              setPhase('idle');
              setStreamText('');
              setRequestIdx((prev) => prev + 1);
            }, 3000);
          }
        }, 25);
        return;
      }

      setActiveIdx(idx);

      // Time each stage takes
      const duration = idx === 3 ? 1200 : // Thinking takes longer
                       idx === 4 ? 800 :  // Tools
                       500;

      timeoutRef.current = setTimeout(() => advanceNode(idx + 1), duration);
    };

    // Start after brief delay
    timeoutRef.current = setTimeout(() => advanceNode(0), 300);
  }, []);

  // ── Trigger cycle when visible and requestIdx changes ──
  useEffect(() => {
    if (!isVisible) return;

    runCycle(requestIdx);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (streamRef.current) clearInterval(streamRef.current);
    };
  }, [requestIdx, isVisible, runCycle]);

  // ── Pause when scrolled away ──
  useEffect(() => {
    if (!isVisible) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (streamRef.current) clearInterval(streamRef.current);
    }
  }, [isVisible]);

  // ── Derive node states ──
  const getNodeState = (idx: number): NodeState => {
    if (activeIdx < 0) return 'idle';
    if (idx < activeIdx) return 'done';
    if (idx === activeIdx) return 'active';
    return 'idle';
  };

  const currentQuery = SAMPLE_QUERIES[requestIdx % SAMPLE_QUERIES.length];

  // Status text for the output panel
  const statusText =
    phase === 'idle' ? '' :
    phase === 'running' && activeIdx >= 0 ? (
      activeIdx === 0 ? 'Parsing query...' :
      activeIdx === 1 ? 'Understanding intent...' :
      activeIdx === 2 ? 'Searching knowledge...' :
      activeIdx === 3 ? 'Reasoning...' :
      activeIdx === 4 ? 'Executing tools...' :
      'Preparing response...'
    ) :
    phase === 'streaming' ? '' :
    '';

  return (
    <div ref={containerRef} className="w-full relative" role="region" aria-label="AI Pipeline Flow">
      {/* Keyframe animations */}
      <style>{`
        @keyframes pulseRight {
          0% { transform: translateX(-20px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(20px); opacity: 0; }
        }
        @keyframes pulseDown {
          0% { transform: translateY(-12px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }
      `}</style>

      {/* ── DESKTOP/TABLET: Horizontal flow ── */}
      <div className="hidden md:flex items-center justify-center gap-0 mb-16">
        {STAGES.map((stage, idx) => (
          <React.Fragment key={stage.id}>
            <FlowNode
              stage={stage}
              state={getNodeState(idx)}
              onHover={setHoveredId}
              isHovered={hoveredId === stage.id}
            />
            {idx < STAGES.length - 1 && (
              <ConnectionLine active={activeIdx > idx} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── MOBILE: Vertical flow ── */}
      <div className="md:hidden flex flex-col items-center gap-0 mb-12">
        {STAGES.map((stage, idx) => (
          <React.Fragment key={stage.id}>
            <FlowNode
              stage={stage}
              state={getNodeState(idx)}
              onHover={setHoveredId}
              isHovered={hoveredId === stage.id}
            />
            {idx < STAGES.length - 1 && (
              <ConnectionLine active={activeIdx > idx} vertical />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── Output Panel ── */}
      <div className="max-w-[680px] mx-auto">
        <div
          className="border rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(9, 9, 12, 0.6)',
            borderColor: phase === 'streaming' ? 'rgba(0, 102, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
            transition: 'border-color 0.5s ease',
          }}
        >
          {/* Query bar */}
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/[0.04]">
            <span className="text-[var(--accent)] text-xs font-mono">›</span>
            <span className="text-white/50 text-xs font-mono">{currentQuery.q}</span>
          </div>

          {/* Response area */}
          <div className="px-5 py-4 min-h-[100px] font-mono text-[11px] leading-relaxed">
            {/* Status indicator */}
            {statusText && (
              <div className="flex items-center gap-2 text-white/25 text-[10px] mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                <span>{statusText}</span>
              </div>
            )}

            {/* Streamed output */}
            {streamText && (
              <p className="text-white/60 leading-relaxed">
                {streamText}
                {phase === 'streaming' && (
                  <span className="inline-block w-[2px] h-3.5 bg-[var(--accent)] ml-0.5 animate-pulse align-middle" />
                )}
              </p>
            )}

            {/* Idle state */}
            {phase === 'idle' && !streamText && (
              <div className="flex items-center gap-2 text-white/15 text-[10px]">
                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                <span>Awaiting next request...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
