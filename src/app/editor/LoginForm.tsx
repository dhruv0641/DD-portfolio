'use client';

import React, { useState, useTransition } from 'react';
import { loginAction } from './actions';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await loginAction(username, password);
      if (res.success) {
        window.location.reload();
      } else {
        setError(res.error || 'Invalid credentials.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#090909] text-[#F5F5F5] font-sans flex items-center justify-center relative overflow-hidden">
      {/* Background radial highlight */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-20 z-0"
        style={{
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none max-w-[1600px] mx-auto px-[8%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 z-0 opacity-10">
        <div className="border-r border-white/5 border-l h-full" />
        <div className="border-r border-white/5 h-full hidden md:block" />
        <div className="border-r border-white/5 h-full hidden lg:block" />
        <div className="border-r border-white/5 h-full hidden lg:block" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-[#111115]/80 border border-white/5 shadow-2xl rounded-2xl p-8 backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[rgba(var(--accent-rgb),0.85)] mb-2">
              🛡️ SECURITY GATE
            </div>
            <h2 className="text-2xl font-light tracking-tight text-white">
              Admin Workspace Login
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-zinc-700 transition-colors"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#09090b] border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-zinc-700 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-950/20 border border-red-500/20 rounded-lg p-3 text-center">
                <span className="font-mono text-[10px] text-red-400">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-white text-black font-mono text-[10px] uppercase tracking-widest py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isPending ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
