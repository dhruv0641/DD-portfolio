'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Category Definitions
interface Category {
  id: string;
  name: string;
  desc: string;
}

const categories: Category[] = [
  { id: 'motion', name: 'Motion Systems', desc: 'Spring physics & timelines' },
  { id: 'physics', name: 'Physics Sandboxes', desc: 'Gravity & collision spaces' },
  { id: 'visual', name: 'Visual Systems', desc: 'Lighting & reflections' },
  { id: 'generative', name: 'Generative Design', desc: 'Procedural wave flow fields' },
  { id: 'interaction', name: 'Interaction Mechanics', desc: 'Deformations & hover loops' },
  { id: 'webgl', name: 'WebGL Matrices', desc: '3D prisms & shaders' },
  { id: 'typography', name: 'Kinetic Typography', desc: 'Weight & variables tracking' },
  { id: 'audiovisual', name: 'Audio Visuals', desc: 'Synthesizer wave frequencies' },
  { id: 'canvas', name: 'Canvas Engines', desc: 'High-performance particle universes' },
  { id: 'experimental', name: 'Experimental UI', desc: 'Draggable viewports & scopes' },
  { id: 'performance', name: 'Performance Lab', desc: 'Lighthouse audits & rendering' },
  { id: 'designsystem', name: 'Design Systems', desc: 'Global token variables' },
];

export default function DesignLab() {
  const [activeCat, setActiveCat] = useState<string>('canvas');
  const [activeExp, setActiveExp] = useState<string>('galaxy');
  const [fullscreen, setFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [fps, setFps] = useState(60);

  // Parameter states
  const [particleCount, setParticleCount] = useState(150);
  const [gravityForce, setGravityForce] = useState(0.2);
  const [blurAmount, setBlurAmount] = useState(20);
  const [borderRadius, setBorderRadius] = useState(16);
  const [springTension, setSpringTension] = useState(120);
  const [fontSize, setFontSize] = useState(24);
  const [fontWeight, setFontWeight] = useState(400);

  // Simulated FPS loop
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(Math.floor(58 + Math.random() * 3));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const playSound = (freq = 800) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.06);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.06);
    } catch (e) {}
  };

  const handleCopyConfig = () => {
    const config = {
      activeCat,
      activeExp,
      particleCount,
      gravityForce,
      blurAmount,
      borderRadius,
      springTension,
      fontSize,
      fontWeight
    };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    playSound(1000);
    alert('Experience configuration variables copied successfully!');
  };

  const handleReset = () => {
    setParticleCount(150);
    setGravityForce(0.2);
    setBlurAmount(20);
    setBorderRadius(16);
    setSpringTension(120);
    setFontSize(24);
    setFontWeight(400);
    playSound(600);
  };

  return (
    <div className="w-full bg-[#050506] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md relative font-sans text-white select-none shadow-2xl">
      
      {/* Top Controls Toolbar */}
      <div className="w-full border-b border-white/5 bg-black/40 py-3 px-6 flex justify-between items-center text-xs font-mono text-[var(--text-dim)] flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <span className="text-white font-semibold flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            DIGITAL_EXPERIENCE_LAB_2.0
          </span>
          <span className="text-zinc-800">|</span>
          <span>FPS: <span className="text-emerald-400">{fps}</span></span>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <button 
            onClick={() => { setSoundEnabled(!soundEnabled); playSound(800); }}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              soundEnabled 
                ? 'border-[var(--accent)] bg-[rgba(var(--accent-rgb),0.05)] text-white' 
                : 'border-white/5 text-zinc-500 hover:text-white'
            }`}
          >
            {soundEnabled ? '🔊 AUDIO: ON' : '🔇 AUDIO: OFF'}
          </button>
          <button 
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/10 text-white bg-white/5 cursor-pointer"
          >
            🔄 RESET
          </button>
          <button 
            onClick={handleCopyConfig}
            className="px-3 py-1.5 rounded-lg border border-[rgba(var(--accent-rgb),0.3)] bg-[rgba(var(--accent-rgb),0.05)] text-[var(--accent)] hover:bg-[rgba(var(--accent-rgb),0.1)] cursor-pointer"
          >
            📤 SHARE STATE
          </button>
          <button 
            onClick={() => setFullscreen(!fullscreen)}
            className="px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/10 text-white bg-white/5 cursor-pointer"
          >
            {fullscreen ? '🗗 ESCAPE' : '🗖 FULLSCREEN'}
          </button>
        </div>
      </div>

      {/* Main Sandbox Layout Grid */}
      <div className={`grid grid-cols-1 ${fullscreen ? 'lg:grid-cols-[1fr]' : 'lg:grid-cols-[260px_1fr_260px]'} min-h-[580px] bg-black/10`}>
        
        {/* LEFT COLUMN: Sidebar Category Explorer */}
        {!fullscreen && (
          <div className="border-r border-white/5 bg-black/20 p-5 flex flex-col gap-6">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">LAB CATEGORIES</span>
            <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[460px] pr-2">
              {categories.map((cat) => {
                const isActive = activeCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCat(cat.id);
                      playSound(500);
                      // Set default experience matching categories
                      if (cat.id === 'canvas') setActiveExp('galaxy');
                      if (cat.id === 'interaction') setActiveExp('fluid');
                      if (cat.id === 'experimental') setActiveExp('canvas-inf');
                      if (cat.id === 'visual') setActiveExp('glass');
                      if (cat.id === 'motion') setActiveExp('easing');
                      if (cat.id === 'generative') setActiveExp('morphing');
                      if (cat.id === 'typography') setActiveExp('typography');
                      if (cat.id === 'webgl') setActiveExp('cube-3d');
                      if (cat.id === 'physics') setActiveExp('balls');
                      if (cat.id === 'designsystem') setActiveExp('button');
                    }}
                    className={`flex flex-col w-full py-2 px-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'border-[rgba(var(--accent-rgb),0.2)] bg-[rgba(var(--accent-rgb),0.06)] text-white shadow-sm'
                        : 'border-transparent text-zinc-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xs font-semibold leading-none">{cat.name}</span>
                    <span className="text-[8px] font-mono text-zinc-600 mt-1 uppercase tracking-wider leading-none">{cat.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CENTER COLUMN: Interactive Sandbox Visualizer Canvas */}
        <div className="p-6 lg:p-10 flex flex-col items-center justify-center min-h-[440px] lg:min-h-0 relative overflow-hidden bg-black/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeExp}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex flex-col items-center justify-center"
            >
              {activeExp === 'galaxy' && <ParticleGalaxy count={particleCount} gravity={gravityForce} />}
              {activeExp === 'fluid' && <FluidCursorSystem />}
              {activeExp === 'canvas-inf' && <InfiniteCanvasEngine />}
              {activeExp === 'glass' && <GlassmorphismBuilder blur={blurAmount} radius={borderRadius} />}
              {activeExp === 'easing' && <MotionPlayground tension={springTension} />}
              {activeExp === 'morphing' && <SVGMorphingStudio />}
              {activeExp === 'typography' && <TypographyLab size={fontSize} weight={fontWeight} />}
              {activeExp === 'cube-3d' && <Glass3DViewer />}
              {activeExp === 'flow' && <FlowFieldGenerator speed={1} />}
              {activeExp === 'button' && <PremiumButtonLab playSound={playSound} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: Parameters Inspector & Diagram */}
        {!fullscreen && (
          <div className="border-l border-white/5 bg-black/20 p-5 flex flex-col gap-6 font-mono text-xs text-[var(--text-dim)]">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] text-white font-semibold tracking-wider uppercase">EXPERIENCE PARAMETERS</span>
              
              {/* Conditional Sliders based on active experience */}
              {activeExp === 'galaxy' && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px]">
                      <span>PARTICLES:</span>
                      <span className="text-white">{particleCount}</span>
                    </div>
                    <input type="range" min="50" max="400" step="10" value={particleCount} onChange={(e) => setParticleCount(parseInt(e.target.value))} className="w-full accent-[var(--accent)]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px]">
                      <span>GRAVITY:</span>
                      <span className="text-white">{gravityForce}</span>
                    </div>
                    <input type="range" min="0.05" max="0.5" step="0.05" value={gravityForce} onChange={(e) => setGravityForce(parseFloat(e.target.value))} className="w-full accent-[var(--accent)]" />
                  </div>
                </div>
              )}

              {activeExp === 'glass' && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px]">
                      <span>BACKDROP BLUR:</span>
                      <span className="text-white">{blurAmount}px</span>
                    </div>
                    <input type="range" min="4" max="40" step="2" value={blurAmount} onChange={(e) => setBlurAmount(parseInt(e.target.value))} className="w-full accent-[var(--accent)]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px]">
                      <span>RADIUS:</span>
                      <span className="text-white">{borderRadius}px</span>
                    </div>
                    <input type="range" min="4" max="32" step="2" value={borderRadius} onChange={(e) => setBorderRadius(parseInt(e.target.value))} className="w-full accent-[var(--accent)]" />
                  </div>
                </div>
              )}

              {activeExp === 'easing' && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px]">
                      <span>SPRING TENSION:</span>
                      <span className="text-white">{springTension}</span>
                    </div>
                    <input type="range" min="40" max="300" step="10" value={springTension} onChange={(e) => setSpringTension(parseInt(e.target.value))} className="w-full accent-[var(--accent)]" />
                  </div>
                </div>
              )}

              {activeExp === 'typography' && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px]">
                      <span>FONT SIZE:</span>
                      <span className="text-white">{fontSize}px</span>
                    </div>
                    <input type="range" min="16" max="48" step="2" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full accent-[var(--accent)]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px]">
                      <span>FONT WEIGHT:</span>
                      <span className="text-white">{fontWeight}</span>
                    </div>
                    <input type="range" min="100" max="800" step="100" value={fontWeight} onChange={(e) => setFontWeight(parseInt(e.target.value))} className="w-full accent-[var(--accent)]" />
                  </div>
                </div>
              )}

              {/* Default metadata parameters */}
              <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">ARCHITECTURE SCHEMAS</span>
                <pre className="text-[8px] leading-relaxed text-zinc-500 bg-black/40 rounded p-2.5 overflow-x-auto whitespace-pre-wrap">
                  {activeExp === 'galaxy' && `UserCursor\n  ↓\nAttract / Repel Mechanics\n  ↓\nVector Gravity Forces\n  ↓\n60FPS requestAnimationFrame Loop`}
                  {activeExp === 'fluid' && `PointerEvents\n  ↓\nPosition Lerps (x, y)\n  ↓\nBezier Curves Path Tracker\n  ↓\nDecay trail loop`}
                  {activeExp === 'glass' && `Glassmorphism Settings\n  ↓\nCSS Backdrop-Filter: blur()\n  ↓\n1px Low-Opacity White Border`}
                  {activeExp === 'easing' && `Spring Stiffness / Tension\n  ↓\nFramer Motion Engine\n  ↓\nGPU-Accelerated Matrix Transforms`}
                  {activeExp === 'typography' && `Variable Font settings\n  ↓\nCSS @font-face triggers\n  ↓\nResponsive letter-spacing`}
                  {activeExp === 'cube-3d' && `CSS Perspective Engine\n  ↓\nRotateY / RotateX offsets\n  ↓\nSmooth Matrix Transform`}
                  {activeExp === 'button' && `Interactive Mouse Target\n  ↓\nMagnetic translation offset\n  ↓\nCSS Glow Keyframe Trigger`}
                </pre>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}

/* ==========================================================================
   1. PARTICLE GALAXY
   ========================================================================== */
function ParticleGalaxy({ count, gravity }: { count: number; gravity: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouse = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles = Array.from({ length: count }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      color: `rgba(0, 102, 255, ${0.3 + Math.random() * 0.5})`
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        if (mouse.current.active) {
          const dx = mouse.current.x - p.x;
          const dy = mouse.current.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 100) {
            p.x += dx * gravity * 0.2;
            p.y += dy * gravity * 0.2;
          }
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [count, gravity]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <span className="text-xs font-mono text-zinc-500 uppercase">Interactive Particle Galaxy</span>
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={220}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
        }}
        onMouseLeave={() => { mouse.current.active = false; }}
        className="border border-white/5 bg-black/40 rounded-xl w-full max-w-[400px] h-auto cursor-crosshair"
      />
    </div>
  );
}

/* ==========================================================================
   2. FLUID CURSOR SYSTEM
   ========================================================================== */
function FluidCursorSystem() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const trail = useRef<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (trail.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trail.current[0].x, trail.current[0].y);
        for (let i = 1; i < trail.current.length; i++) {
          ctx.lineTo(trail.current[i].x, trail.current[i].y);
        }
        ctx.strokeStyle = 'rgba(0, 102, 255, 0.5)';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      if (trail.current.length > 0) {
        trail.current = trail.current.slice(1);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <span className="text-xs font-mono text-zinc-500 uppercase">Magnetic Fluid Cursor Trail</span>
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={220}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          trail.current.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          if (trail.current.length > 30) trail.current.shift();
        }}
        className="border border-white/5 bg-black/40 rounded-xl w-full max-w-[400px] h-auto cursor-none"
      />
    </div>
  );
}

/* ==========================================================================
   3. INFINITE CANVAS ENGINE
   ========================================================================== */
function InfiniteCanvasEngine() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <span className="text-xs font-mono text-zinc-500 uppercase">Infinite Draggable Viewport</span>
      <div 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        className="w-full max-w-[400px] h-52 border border-white/5 rounded-xl bg-black/40 relative overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <div 
          className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-25"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="border border-dashed border-white/10 flex items-center justify-center text-[7px] font-mono text-zinc-700">
              CELL_0{i+1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   4. GLASSMORPHISM BUILDER
   ========================================================================== */
function GlassmorphismBuilder({ blur, radius }: { blur: number; radius: number }) {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <span className="text-xs font-mono text-zinc-500 uppercase">Dynamic Glassmorphism Sandbox</span>
      <div 
        className="w-full max-w-[320px] py-10 px-6 border border-white/10 bg-white/5 flex flex-col justify-between shadow-2xl transition-all"
        style={{
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          borderRadius: `${radius}px`,
        }}
      >
        <div className="flex justify-between items-start">
          <div className="w-8 h-8 rounded bg-white/10 border border-white/20 flex items-center justify-center text-xs font-semibold">G</div>
          <span className="text-[9px] font-mono text-zinc-400">GLASS_WIDGET</span>
        </div>
        <p className="text-[10px] text-zinc-400 leading-relaxed font-light mt-6">
          Backend layouts rendered on dynamic glass tokens matching blur={blur}px and radius={radius}px bounds.
        </p>
      </div>
    </div>
  );
}

/* ==========================================================================
   5. MOTION PLAYGROUND
   ========================================================================== */
function MotionPlayground({ tension }: { tension: number }) {
  const [toggle, setToggle] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <span className="text-xs font-mono text-zinc-500 uppercase">Framer Motion Spring Dynamics</span>
      <div className="w-full max-w-[300px] flex flex-col gap-4 items-center">
        <motion.div 
          animate={{ x: toggle ? 100 : -100 }}
          transition={{ type: 'spring', stiffness: tension, damping: 10 }}
          className="w-10 h-10 rounded-xl bg-[var(--accent)]"
        />
        <button 
          onClick={() => setToggle(!toggle)}
          className="py-2 px-4 rounded bg-white text-black font-semibold text-xs font-mono transition-colors hover:bg-gray-200 mt-4 cursor-pointer"
        >
          TRIGGER SPRING
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   6. SVG MORPHING STUDIO
   ========================================================================== */
function SVGMorphingStudio() {
  const [morph, setMorph] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <span className="text-xs font-mono text-zinc-500 uppercase">SVG Path Morphing Studio</span>
      <div className="flex flex-col items-center gap-4">
        <svg width="120" height="120" viewBox="0 0 100 100" className="overflow-visible">
          <motion.path 
            d={morph ? 'M 10 10 L 90 10 L 90 90 L 10 90 Z' : 'M 50 10 L 90 50 L 50 90 L 10 50 Z'}
            animate={{ d: morph ? 'M 10 10 L 90 10 L 90 90 L 10 90 Z' : 'M 50 10 L 90 50 L 50 90 L 10 50 Z' }}
            transition={{ type: 'spring', stiffness: 100, damping: 12 }}
            fill="none"
            stroke="#0066FF"
            strokeWidth="3"
          />
        </svg>
        <button 
          onClick={() => setMorph(!morph)}
          className="py-2 px-4 rounded bg-white text-black font-semibold text-xs font-mono transition-colors hover:bg-gray-200 cursor-pointer"
        >
          MORPH SHAPE
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   7. TYPOGRAPHY LAB
   ========================================================================== */
function TypographyLab({ size, weight }: { size: number; weight: number }) {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <span className="text-xs font-mono text-zinc-500 uppercase">Kinetic Typography Laboratory</span>
      <div className="w-full text-center">
        <span 
          className="text-white transition-all duration-300 tracking-tight leading-snug"
          style={{ fontSize: `${size}px`, fontWeight: weight }}
        >
          Dhruvkumar Dobariya
        </span>
      </div>
    </div>
  );
}

/* ==========================================================================
   8. 3D GLASS PRISM
   ========================================================================== */
function Glass3DViewer() {
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setRotate((r) => (r + 1) % 360), 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <span className="text-xs font-mono text-zinc-500 uppercase">Interactive CSS 3D Matrix</span>
      <div className="w-48 h-48 flex items-center justify-center">
        <div 
          className="w-20 h-20 border border-white/20 bg-white/5 backdrop-blur-md rounded-xl transition-all"
          style={{ transform: `rotateY(${rotate}deg) rotateX(${rotate/2}deg)` }}
        />
      </div>
    </div>
  );
}

/* ==========================================================================
   9. FLOW FIELD GENERATOR
   ========================================================================== */
function FlowFieldGenerator({ speed }: { speed: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(0, 102, 255, 0.4)';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      for (let x = 10; x < canvas.width - 10; x += 15) {
        const y = 110 + Math.sin(x * 0.02 + time) * 40;
        if (x === 10) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      time += 0.05;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <span className="text-xs font-mono text-zinc-500 uppercase">Procedural Flow Fields</span>
      <canvas ref={canvasRef} width={400} height={220} className="border border-white/5 bg-black/40 rounded-xl w-full max-w-[400px] h-auto" />
    </div>
  );
}

/* ==========================================================================
   10. PREMIUM BUTTON LAB
   ========================================================================== */
function PremiumButtonLab({ playSound }: { playSound: (f: number) => void }) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    playSound(900);
    setTimeout(() => {
      setLoading(false);
      playSound(1200);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <span className="text-xs font-mono text-zinc-500 uppercase">Micro-Interaction Button Builder</span>
      <div className="flex flex-col items-center justify-center p-6 border border-white/5 rounded-xl bg-black/40 w-full max-w-[260px]">
        <button 
          onClick={handleClick}
          disabled={loading}
          className="relative px-6 py-3 border border-[rgba(var(--accent-rgb),0.3)] bg-[rgba(var(--accent-rgb),0.05)] text-[var(--accent)] hover:bg-[rgba(var(--accent-rgb),0.1)] rounded-lg font-mono text-xs uppercase tracking-wider font-semibold cursor-pointer transition-all shadow-[0_0_20px_rgba(0,102,255,0.1)] hover:shadow-[0_0_30px_rgba(0,102,255,0.2)]"
        >
          {loading ? 'COMPILE_THREAD...' : 'DISPATCH_EVENT'}
        </button>
      </div>
    </div>
  );
}
