'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Tab configuration definitions
interface TabItem {
  id: string;
  name: string;
  category: string;
  icon: string;
}

const labs: TabItem[] = [
  { id: 'agent', name: 'Multi-Agent Studio', category: 'Orchestration', icon: '🤖' },
  { id: 'rag', name: 'RAG Retriever', category: 'Information', icon: '🔍' },
  { id: 'prompt', name: 'Prompt Developer', category: 'Core', icon: '📝' },
  { id: 'vector', name: 'Vector Database Vectorizer', category: 'Storage', icon: '📊' },
  { id: 'reasoning', name: 'Logical Reasoning Graph', category: 'Core', icon: '🧠' },
  { id: 'memory', name: 'Synaptic Memory Stack', category: 'Storage', icon: '💾' },
  { id: 'tool', name: 'API Tool Dispatcher', category: 'Orchestration', icon: '⚙️' },
  { id: 'monitor', name: 'DevOps System Monitor', category: 'Storage', icon: '📈' },
];

export default function AIPlayground() {
  const [activeTab, setActiveTab] = useState<string>('agent');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [zoom, setZoom] = useState(1.0);
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] AI Research Lab v1.0.0 initialized successfully.']);
  const [metrics, setMetrics] = useState({
    status: 'STANDBY',
    latency: '0ms',
    executionTime: '0.0s',
    confidence: '100%',
    tokens: '0',
    memory: '0.0MB',
    cost: '$0.0000',
    depth: '0'
  });
  const [showCmdPalette, setShowCmdPalette] = useState(false);
  const [cmdSearch, setCmdSearch] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);

  // Add a log entry helper
  const addLog = (msg: string) => {
    setLogs((prev) => [...prev.slice(-49), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Listen for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCmdPalette((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const resetAll = () => {
    setIsPlaying(false);
    setLogs(['[SYSTEM] Lab parameter matrix state reset successfully.']);
    setMetrics({
      status: 'STANDBY',
      latency: '0ms',
      executionTime: '0.0s',
      confidence: '100%',
      tokens: '0',
      memory: '0.0MB',
      cost: '$0.0000',
      depth: '0'
    });
    addLog('Simulation reset.');
  };

  const handleExport = () => {
    const stateString = JSON.stringify({ activeTab, speed, zoom, metrics }, null, 2);
    navigator.clipboard.writeText(stateString);
    addLog('JSON state parameters copied to clipboard!');
    alert('JSON Configuration parameters copied to clipboard successfully!');
  };

  return (
    <div className="w-full bg-[#050506]/40 border border-[var(--grid-line)] rounded-2xl overflow-hidden backdrop-blur-md relative font-sans text-white select-none">
      
      {/* Top Main Controls Toolbar */}
      <div className="w-full border-b border-[var(--grid-line)] bg-black/30 py-3 px-6 flex flex-wrap justify-between items-center gap-4 text-xs font-mono text-[var(--text-dim)]">
        <div className="flex items-center gap-4">
          <span className="text-white font-semibold flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AI_RESEARCH_LAB
          </span>
          <span className="text-zinc-600">|</span>
          <button 
            onClick={() => { setIsPlaying(!isPlaying); addLog(isPlaying ? 'Simulation paused.' : 'Simulation started.'); }}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              isPlaying 
                ? 'border-amber-500/30 bg-amber-500/5 text-amber-500' 
                : 'border-white/10 hover:border-white/20 text-white bg-white/5'
            }`}
          >
            {isPlaying ? '⏸️ PAUSE' : '▶️ RUN'}
          </button>
          <button 
            onClick={resetAll}
            className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-white bg-white/5 cursor-pointer"
          >
            🔄 RESET
          </button>
        </div>

        {/* Global modifiers: Speed, Zoom, Export, Fullscreen */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Speed settings */}
          <div className="flex items-center gap-1 border border-white/5 rounded-lg bg-black/40 p-0.5">
            {[1, 2, 4].map((s) => (
              <button 
                key={s} 
                onClick={() => { setSpeed(s); addLog(`Simulation speed multiplier changed to: x${s}`); }}
                className={`px-2 py-1 rounded text-[10px] cursor-pointer ${
                  speed === s ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <span className="text-zinc-800">|</span>

          {/* Zoom settings */}
          <div className="flex items-center gap-1.5 text-zinc-500">
            <button onClick={() => setZoom(Math.max(0.7, zoom - 0.1))} className="hover:text-white cursor-pointer">🔍-</button>
            <span className="text-[10px] text-white min-w-[36px] text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.min(1.3, zoom + 0.1))} className="hover:text-white cursor-pointer">🔍+</button>
          </div>

          <span className="text-zinc-800">|</span>

          {/* Tutorial & Export Buttons */}
          <button 
            onClick={() => setShowTutorial(true)}
            className="px-2.5 py-1.5 rounded border border-white/5 hover:border-white/15 text-zinc-400 hover:text-white cursor-pointer"
          >
            ❓ TUTORIAL
          </button>
          <button 
            onClick={handleExport}
            className="px-2.5 py-1.5 rounded border border-[rgba(var(--accent-rgb),0.3)] bg-[rgba(var(--accent-rgb),0.05)] text-[var(--accent)] hover:bg-[rgba(var(--accent-rgb),0.1)] cursor-pointer"
          >
            📤 EXPORT CONFIG
          </button>
          <button 
            onClick={() => setShowCmdPalette(true)}
            className="px-2.5 py-1.5 rounded border border-white/5 hover:border-white/15 text-zinc-500 hover:text-white cursor-pointer hidden md:block"
          >
            ⌨️ Ctrl+K
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] min-h-[580px] bg-black/10">
        
        {/* LEFT COLUMN: Sidebar Navigation Explorer */}
        <div className="border-r border-[var(--grid-line)] bg-black/20 p-5 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-wider">LABORATORY EXPERIMENTS</span>
            <div className="flex flex-col gap-1 mt-1">
              {labs.map((lab) => {
                const isActive = activeTab === lab.id;
                return (
                  <button
                    key={lab.id}
                    onClick={() => { setActiveTab(lab.id); addLog(`Switched experiment context window target to: ${lab.name}`); }}
                    className={`flex items-center gap-3 w-full py-2.5 px-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'border-[rgba(var(--accent-rgb),0.2)] bg-[rgba(var(--accent-rgb),0.06)] text-white shadow-sm'
                        : 'border-transparent text-zinc-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-base">{lab.icon}</span>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono text-[var(--text-dim)] uppercase tracking-wider leading-none">{lab.category}</span>
                      <span className="text-xs font-medium mt-1 leading-none">{lab.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-col gap-2 mt-auto border-t border-white/5 pt-4">
            <span className="text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-wider">SIMULATION PRESETS</span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <button 
                onClick={() => { setActiveTab('rag'); setLogs(['[SYSTEM] RAG Preset loaded: High Density.']); addLog('RAG High-Density preset loaded.'); }}
                className="py-1.5 px-2 rounded border border-white/5 bg-white/5 hover:border-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                High RAG
              </button>
              <button 
                onClick={() => { setActiveTab('agent'); setLogs(['[SYSTEM] Agent Preset loaded: Critic Loop.']); addLog('Agent Critic Loop preset loaded.'); }}
                className="py-1.5 px-2 rounded border border-white/5 bg-white/5 hover:border-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                Critic Loop
              </button>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Visualization Canvas */}
        <div className="flex flex-col justify-between overflow-hidden relative min-h-[440px] lg:min-h-0 border-r lg:border-r-0 border-[var(--grid-line)]">
          <div 
            className="flex-1 p-6 lg:p-10 flex flex-col justify-center transition-all duration-300"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="w-full h-full flex flex-col"
              >
                {activeTab === 'agent' && <MultiAgentLab isPlaying={isPlaying} speed={speed} addLog={addLog} setMetrics={setMetrics} />}
                {activeTab === 'rag' && <RAGLab isPlaying={isPlaying} speed={speed} addLog={addLog} setMetrics={setMetrics} />}
                {activeTab === 'prompt' && <PromptLab isPlaying={isPlaying} speed={speed} addLog={addLog} setMetrics={setMetrics} />}
                {activeTab === 'memory' && <MemoryLab isPlaying={isPlaying} speed={speed} addLog={addLog} setMetrics={setMetrics} />}
                {activeTab === 'vector' && <VectorDatabaseLab isPlaying={isPlaying} speed={speed} addLog={addLog} setMetrics={setMetrics} />}
                {activeTab === 'reasoning' && <ReasoningLab isPlaying={isPlaying} speed={speed} addLog={addLog} setMetrics={setMetrics} />}
                {activeTab === 'tool' && <ToolCallingLab isPlaying={isPlaying} speed={speed} addLog={addLog} setMetrics={setMetrics} />}
                {activeTab === 'monitor' && <MonitoringDashboard isPlaying={isPlaying} speed={speed} addLog={addLog} setMetrics={setMetrics} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Collapsible Terminal console logs */}
          <div className="border-t border-[var(--grid-line)] bg-black/40 flex flex-col relative z-20">
            <button 
              onClick={() => setConsoleOpen(!consoleOpen)}
              className="w-full py-2 px-6 flex justify-between items-center text-[10px] font-mono text-zinc-500 hover:text-white border-b border-white/5 cursor-pointer"
            >
              <span>AI CONSOLE TERMINAL</span>
              <span>{consoleOpen ? '▼ COLLAPSE' : '▲ EXPAND'}</span>
            </button>
            <AnimatePresence>
              {consoleOpen && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: 120 }}
                  exit={{ height: 0 }}
                  className="w-full bg-[#030304] overflow-y-auto p-4 font-mono text-[10px] text-zinc-400 flex flex-col gap-1 border-b border-white/5"
                >
                  {logs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed whitespace-pre-wrap">
                      <span className="text-zinc-600">&gt;</span> {log}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Inspector Metrics */}
        <div className="border-l border-[var(--grid-line)] bg-black/20 p-5 flex flex-col gap-6 font-mono text-xs text-[var(--text-dim)]">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] text-white font-semibold tracking-wider">LIVE INSPECTOR METRICS</span>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>STATUS:</span>
                <span className={`font-semibold ${metrics.status === 'RUNNING' ? 'text-[var(--accent)]' : 'text-zinc-500'}`}>{metrics.status}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>LATENCY:</span>
                <span className="text-white">{metrics.latency}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>EXEC TIME:</span>
                <span className="text-white">{metrics.executionTime}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>CONFIDENCE:</span>
                <span className="text-white">{metrics.confidence}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>TOKENS:</span>
                <span className="text-white">{metrics.tokens}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>MEM ALLOC:</span>
                <span className="text-white">{metrics.memory}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>RUN COST:</span>
                <span className="text-white">{metrics.cost}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>REASON DEPTH:</span>
                <span className="text-white">{metrics.depth}</span>
              </div>
            </div>
          </div>

          {/* Quick interactive hints explanation cards */}
          <div className="border border-white/5 bg-white/5 rounded-xl p-4 mt-auto">
            <div className="text-[9px] text-white font-semibold uppercase tracking-wider mb-2">
              💡 CORE LEARNING DETAILS
            </div>
            <p className="text-[10px] text-zinc-400 font-light leading-relaxed">
              {activeTab === 'agent' && 'Multi-Agent flows coordinate task plans sequentially. Critical loops confirm logical compliance to mitigate model bias.'}
              {activeTab === 'rag' && 'Retrieval-Augmented Generation embeds text inputs and indexes similar keys, bypassing dynamic LLM context limits.'}
              {activeTab === 'prompt' && 'Prompt engineering adjusts formatting frameworks and context window dimensions, altering output tokens.'}
              {activeTab === 'memory' && 'Synaptic memory systems decay text layers over time, representing working and long-term cache memories.'}
              {activeTab === 'vector' && 'Vector databases plot high-dimensional weights to cluster semantic coordinates, calculating similarities.'}
              {activeTab === 'reasoning' && 'Logical reasoning structures plan code sub-tasks and reflection loops to construct exact solutions.'}
              {activeTab === 'tool' && 'API Tool calling parses questions to select tool JSON payloads, returning live weather and calculation logs.'}
              {activeTab === 'monitor' && 'DevOps systems track live GPU workloads, memory pools, and inference queues to resolve model spikes.'}
            </p>
          </div>
        </div>

      </div>

      {/* COMMAND PALETTE POPUP MODAL (CTRL+K) */}
      <AnimatePresence>
        {showCmdPalette && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-[500px] bg-[#0c0c0e] border border-[var(--grid-line)] rounded-xl p-4 flex flex-col gap-3 shadow-2xl"
            >
              <div className="flex justify-between items-center text-xs font-mono text-[var(--text-dim)] border-b border-white/5 pb-2">
                <span>COMMAND PALETTE SEARCH</span>
                <button onClick={() => setShowCmdPalette(false)} className="hover:text-white cursor-pointer">✕ CLOSE</button>
              </div>
              <input 
                type="text" 
                placeholder="Search experiments, tools, models..." 
                value={cmdSearch}
                onChange={(e) => setCmdSearch(e.target.value)}
                className="bg-black/50 border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-zinc-700 w-full"
                autoFocus
              />
              <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto">
                {labs
                  .filter(lab => lab.name.toLowerCase().includes(cmdSearch.toLowerCase()))
                  .map(lab => (
                    <button
                      key={lab.id}
                      onClick={() => { setActiveTab(lab.id); setShowCmdPalette(false); addLog(`Switched experiment to: ${lab.name}`); }}
                      className="w-full text-left py-2 px-3 hover:bg-white/5 rounded text-xs text-zinc-400 hover:text-white cursor-pointer flex justify-between"
                    >
                      <span>{lab.icon} {lab.name}</span>
                      <span className="text-[9px] font-mono opacity-50 uppercase">{lab.category}</span>
                    </button>
                  ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TUTORIAL ONBOARDING OVERLAY */}
      <AnimatePresence>
        {showTutorial && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-[450px] bg-[#0c0c0e] border border-[var(--grid-line)] rounded-2xl p-6 flex flex-col gap-4 shadow-2xl"
            >
              <div className="flex justify-between items-center text-xs font-mono text-[var(--text-dim)] border-b border-white/5 pb-2">
                <span>LAB ONBOARDING TUTORIAL</span>
                <button onClick={() => setShowTutorial(false)} className="hover:text-white cursor-pointer">✕ CLOSE</button>
              </div>
              <div className="flex flex-col gap-3 text-xs leading-relaxed text-zinc-300">
                <p>Welcome to the **AI Systems Research Lab**! Here is how to navigate the developer tools:</p>
                <ul className="list-disc pl-5 flex flex-col gap-1.5 font-light">
                  <li>**Sidebar Navigation**: Explorer on the left selects between 8 real-time simulation targets.</li>
                  <li>**Command Palette**: Press **Ctrl+K** or click the button to trigger search filters.</li>
                  <li>**Interactive controls**: Center canvas parameters let you customize chunk indices, temperatures, weights, and run cycles.</li>
                  <li>**Terminal console**: Collapsible pane logs debug operations and JSON payloads.</li>
                </ul>
              </div>
              <button 
                onClick={() => setShowTutorial(false)}
                className="w-full py-2.5 rounded-lg text-xs font-mono uppercase bg-white text-black font-semibold hover:bg-gray-200 transition-colors mt-4 cursor-pointer"
              >
                Get Started
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

/* ==========================================================================
   LAB WIDGETS
   ========================================================================== */

// 1. MULTI-AGENT LAB
function MultiAgentLab({ isPlaying, speed, addLog, setMetrics }: { isPlaying: boolean; speed: number; addLog: (m: string) => void; setMetrics: any }) {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Planner', 'Retriever', 'Memory', 'Coder', 'Critic', 'Response'];

  useEffect(() => {
    if (!isPlaying) {
      setMetrics((prev: any) => ({ ...prev, status: 'STANDBY' }));
      return;
    }
    setMetrics((prev: any) => ({ ...prev, status: 'RUNNING' }));

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % steps.length;
        addLog(`Agent [${steps[next]}] initialized task process.`);
        setMetrics({
          status: 'RUNNING',
          latency: `${Math.floor(12 + Math.random() * 45)}ms`,
          executionTime: `${(0.4 + Math.random() * 1.5).toFixed(1)}s`,
          confidence: `${Math.floor(92 + Math.random() * 7)}%`,
          tokens: `${Math.floor(250 + Math.random() * 400)}`,
          memory: `${(4.1 + Math.random() * 2).toFixed(1)}MB`,
          cost: `$0.00${Math.floor(10 + Math.random() * 15)}`,
          depth: `${Math.floor(3 + Math.random() * 4)}`
        });
        return next;
      });
    }, 1600 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Multi-Agent Workflow Simulation</h4>
        <span className="text-[10px] font-mono text-[var(--accent)] uppercase">Status: {isPlaying ? 'ACTIVE' : 'IDLE'}</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-8 relative">
        {steps.map((step, idx) => {
          const isActive = idx === activeStep && isPlaying;
          return (
            <div key={idx} className="flex flex-col items-center gap-2 w-full md:w-auto relative z-10">
              <div 
                className={`py-3 px-4 rounded-xl border text-center transition-all min-w-[90px] ${
                  isActive 
                    ? 'border-[var(--accent)] bg-[rgba(var(--accent-rgb),0.08)] text-white shadow-lg' 
                    : 'border-white/5 bg-[#09090b]'
                }`}
              >
                <div className="text-[8px] font-mono text-zinc-500">0{idx+1}</div>
                <div className="text-xs font-medium mt-1">{step}</div>
              </div>
            </div>
          );
        })}

        {/* Connections Line */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/5 z-0 hidden md:block" />
      </div>
    </div>
  );
}

// 2. RAG LAB
function RAGLab({ isPlaying, speed, addLog, setMetrics }: { isPlaying: boolean; speed: number; addLog: (m: string) => void; setMetrics: any }) {
  const [topK, setTopK] = useState(3);
  const [chunkSize, setChunkSize] = useState(256);
  const [threshold, setThreshold] = useState(0.7);

  const simulateSearch = () => {
    addLog(`Searching indices with topK=${topK}, chunkSize=${chunkSize}, threshold=${threshold}`);
    setMetrics({
      status: 'RUNNING',
      latency: `${Math.floor(10 + Math.random() * 30)}ms`,
      executionTime: '0.6s',
      confidence: '97%',
      tokens: `${topK * chunkSize}`,
      memory: '8.4MB',
      cost: `$0.000${topK * 2}`,
      depth: '2'
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-sm font-semibold text-white uppercase tracking-wider">RAG Vector Retrieval Index</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4 font-mono text-xs">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span>TOP-K MATCHES:</span>
              <span className="text-white">{topK}</span>
            </div>
            <input type="range" min="1" max="8" value={topK} onChange={(e) => setTopK(parseInt(e.target.value))} className="w-full accent-[var(--accent)]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span>CHUNK SIZE (WORDS):</span>
              <span className="text-white">{chunkSize}</span>
            </div>
            <input type="range" min="128" max="512" step="64" value={chunkSize} onChange={(e) => setChunkSize(parseInt(e.target.value))} className="w-full accent-[var(--accent)]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span>SIMILARITY THRESHOLD:</span>
              <span className="text-white">{threshold}</span>
            </div>
            <input type="range" min="0.5" max="0.9" step="0.05" value={threshold} onChange={(e) => setThreshold(parseFloat(e.target.value))} className="w-full accent-[var(--accent)]" />
          </div>
        </div>

        <div className="border border-white/5 rounded-xl p-4 bg-black/40 flex flex-col justify-between">
          <div className="text-[10px] font-mono text-zinc-500">RETRIEVED VECTOR LOGS</div>
          <div className="text-[10px] font-mono text-zinc-400 mt-2">
            &gt; Query weights loaded.<br />
            &gt; Similarity threshold match resolved: {threshold}.<br />
            &gt; Extracted {topK} matching chunks of size {chunkSize}.
          </div>
          <button onClick={simulateSearch} className="w-full py-2 bg-white text-black font-semibold rounded-lg mt-4 text-xs font-mono cursor-pointer">
            QUERY RETRIEVER
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. PROMPT LAB
function PromptLab({ isPlaying, speed, addLog, setMetrics }: { isPlaying: boolean; speed: number; addLog: (m: string) => void; setMetrics: any }) {
  const [temp, setTemp] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [systemPrompt, setSystemPrompt] = useState('Write an optimized binary search tree in TypeScript.');
  const [simRes, setSimRes] = useState('');

  const simulateRun = () => {
    addLog(`Running prompt compile with Temp=${temp}, TopP=${topP}`);
    setSimRes('RESOLVING CHIP TARGETS...');
    setTimeout(() => {
      setSimRes(`class TreeNode {\n  value: number;\n  left: TreeNode | null = null;\n  right: TreeNode | null = null;\n  constructor(value: number) {\n    this.value = value;\n  }\n}`);
      setMetrics({
        status: 'SUCCESS',
        latency: '82ms',
        executionTime: '0.4s',
        confidence: '99%',
        tokens: '128',
        memory: '2.5MB',
        cost: '$0.0003',
        depth: '1'
      });
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Prompt Developer Console</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4 font-mono text-xs">
          <div className="flex flex-col gap-1">
            <span>SYSTEM CONSTRAINTS:</span>
            <input type="text" value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} className="bg-black/50 border border-white/5 rounded-lg p-2.5 text-xs text-white" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span>TEMPERATURE:</span>
              <span className="text-white">{temp}</span>
            </div>
            <input type="range" min="0.1" max="1.0" step="0.1" value={temp} onChange={(e) => setTemp(parseFloat(e.target.value))} className="w-full accent-[var(--accent)]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span>TOP-P:</span>
              <span className="text-white">{topP}</span>
            </div>
            <input type="range" min="0.1" max="1.0" step="0.1" value={topP} onChange={(e) => setTopP(parseFloat(e.target.value))} className="w-full accent-[var(--accent)]" />
          </div>
        </div>

        <div className="border border-white/5 rounded-xl p-4 bg-black/40 flex flex-col justify-between">
          <div className="text-[10px] font-mono text-zinc-500">SIMULATED RESPONSE OUTPUT</div>
          <pre className="text-[10px] font-mono text-gray-300 overflow-x-auto mt-2 max-h-[120px] overflow-y-auto whitespace-pre-wrap">
            {simRes || '> Set coefficients and run compilation.'}
          </pre>
          <button onClick={simulateRun} className="w-full py-2 bg-white text-black font-semibold rounded-lg mt-4 text-xs font-mono cursor-pointer">
            RUN GENERATOR
          </button>
        </div>
      </div>
    </div>
  );
}

// 4. SYNAPTIC MEMORY LAB
function MemoryLab({ isPlaying, speed, addLog, setMetrics }: { isPlaying: boolean; speed: number; addLog: (m: string) => void; setMetrics: any }) {
  const [memories, setMemories] = useState(['Configuration logs cached', 'Embedding indexes mapped', 'User profile parameters saved']);
  const [newMem, setNewMem] = useState('');

  const insertMemory = () => {
    if (!newMem.trim()) return;
    setMemories([newMem, ...memories]);
    addLog(`Memory saved to stack: "${newMem}"`);
    setNewMem('');
    setMetrics((prev: any) => ({ ...prev, depth: `${memories.length + 1}` }));
  };

  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Memory Allocation Stacks</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3 max-h-[180px] overflow-y-auto border border-white/5 p-4 rounded-xl bg-black/30">
          {memories.map((m, idx) => (
            <div key={idx} className="flex justify-between items-center py-2 px-3 border border-white/5 rounded bg-black/50 text-xs">
              <span className="font-mono">{m}</span>
              <span className="text-[8px] font-mono text-[var(--accent)]">ACTIVE</span>
            </div>
          ))}
        </div>

        <div className="border border-white/5 rounded-xl p-4 bg-black/40 flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono text-zinc-500">INSERT KEY-VALUE</span>
            <input type="text" value={newMem} onChange={(e) => setNewMem(e.target.value)} placeholder="e.g. Server connection established" className="bg-black/50 border border-white/5 rounded-lg p-2 text-xs text-white" />
          </div>
          <button onClick={insertMemory} className="w-full py-2 bg-white text-black font-semibold rounded-lg mt-4 text-xs font-mono cursor-pointer">
            COMMIT TO STACK
          </button>
        </div>
      </div>
    </div>
  );
}

// 5. VECTOR DATABASE LAB
function VectorDatabaseLab({ isPlaying, speed, addLog, setMetrics }: { isPlaying: boolean; speed: number; addLog: (m: string) => void; setMetrics: any }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const points = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';

      // Draw connection bounds
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx * speed;
        p.y += p.vy * speed;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,102,255,0.6)';
        ctx.fill();

        for (let j = i + 1; j < points.length; j++) {
          const p2 = points[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 40) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-sm font-semibold text-white uppercase tracking-wider">High-Dimensional Vector Clusters</h4>
      <div className="border border-white/5 rounded-xl bg-black/40 p-4 flex justify-center items-center">
        <canvas ref={canvasRef} width={450} height={200} className="w-full max-w-[450px] h-auto" />
      </div>
    </div>
  );
}

// 6. REASONING LAB
function ReasoningLab({ isPlaying, speed, addLog, setMetrics }: { isPlaying: boolean; speed: number; addLog: (m: string) => void; setMetrics: any }) {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Planning targets', 'Evaluate sub-tasks', 'Logic reflection', 'Verification checks'];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % steps.length;
        addLog(`Reasoning: executed constraint step [${steps[next]}]`);
        setMetrics((prevMetrics: any) => ({
          ...prevMetrics,
          latency: `${Math.floor(20 + Math.random() * 30)}ms`,
          confidence: `${Math.floor(94 + Math.random() * 5)}%`,
          depth: `${next + 1}`
        }));
        return next;
      });
    }, 1500 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Multi-Step Logical Reflection Graph</h4>
      <div className="flex flex-col gap-3 pl-4 border-l border-white/5">
        {steps.map((step, idx) => {
          const isActive = idx === activeStep && isPlaying;
          return (
            <div key={idx} className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full border ${isActive ? 'border-[var(--accent)] bg-black animate-pulse' : 'border-zinc-800 bg-zinc-950'}`} />
              <span className={`text-xs font-mono ${isActive ? 'text-white' : 'text-zinc-500'}`}>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 7. TOOL CALLING LAB
function ToolCallingLab({ isPlaying, speed, addLog, setMetrics }: { isPlaying: boolean; speed: number; addLog: (m: string) => void; setMetrics: any }) {
  const [activeNode, setActiveNode] = useState(0);
  const nodes = ['Planner', 'Database API', 'Calculator', 'Weather API', 'Response'];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveNode((prev) => {
        const next = (prev + 1) % nodes.length;
        addLog(`Dispatched parameters to tool: [${nodes[next]}]`);
        setMetrics((prevMetrics: any) => ({
          ...prevMetrics,
          latency: `${Math.floor(15 + Math.random() * 40)}ms`,
          tokens: `${Math.floor(100 + Math.random() * 200)}`
        }));
        return next;
      });
    }, 1400 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Parallel Tool Calling Execution</h4>
      <div className="flex justify-between items-center gap-2 py-4 border border-white/5 rounded-xl p-4 bg-black/20">
        {nodes.map((node, idx) => {
          const isActive = idx === activeNode && isPlaying;
          return (
            <span key={idx} className={`py-1.5 px-3 rounded text-[10px] font-mono border ${isActive ? 'border-[var(--accent)] bg-[rgba(var(--accent-rgb),0.05)] text-white' : 'border-white/5 text-zinc-500'}`}>
              {node}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// 8. MONITORING DASHBOARD
function MonitoringDashboard({ isPlaying, speed, addLog, setMetrics }: { isPlaying: boolean; speed: number; addLog: (m: string) => void; setMetrics: any }) {
  const [vals, setVals] = useState({ gpu: '0%', vram: '0.0GB', queue: '0' });

  useEffect(() => {
    if (!isPlaying) {
      setVals({ gpu: '0%', vram: '0.0GB', queue: '0' });
      return;
    }

    const interval = setInterval(() => {
      const gpu = `${Math.floor(40 + Math.random() * 45)}%`;
      const vram = `${(8.4 + Math.random() * 4).toFixed(1)}GB`;
      const queue = `${Math.floor(Math.random() * 5)}`;
      setVals({ gpu, vram, queue });

      setMetrics((prev: any) => ({
        ...prev,
        latency: `${Math.floor(12 + Math.random() * 15)}ms`,
        memory: vram
      }));
    }, 1200 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-sm font-semibold text-white uppercase tracking-wider">DevOps Systems Dashboard</h4>
      <div className="grid grid-cols-3 gap-4 font-mono text-center">
        <div className="border border-white/5 rounded-xl p-4 bg-black/40">
          <div className="text-[8px] text-zinc-500 uppercase">GPU Load</div>
          <div className="text-xl text-white font-semibold mt-1">{vals.gpu}</div>
        </div>
        <div className="border border-white/5 rounded-xl p-4 bg-black/40">
          <div className="text-[8px] text-zinc-500 uppercase">VRAM Alloc</div>
          <div className="text-xl text-white font-semibold mt-1">{vals.vram}</div>
        </div>
        <div className="border border-white/5 rounded-xl p-4 bg-black/40">
          <div className="text-[8px] text-zinc-500 uppercase">Embedding Queue</div>
          <div className="text-xl text-white font-semibold mt-1">{vals.queue}</div>
        </div>
      </div>
    </div>
  );
}
