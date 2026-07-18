'use client';

import React, { useState } from 'react';
import { loginAdmin } from '@/app/actions/login';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await loginAdmin({ username, password });
    if (result.success) {
      router.push('/admin/dashboard');
      router.refresh();
    } else {
      setError(result.error || 'Login failed.');
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-6">
      {/* Background Lines decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="grid-bg">
          <div className="grid-bg-line" />
          <div className="grid-bg-line" />
          <div className="grid-bg-line" />
          <div className="grid-bg-line" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[420px] bg-[var(--surface)] border border-[rgba(255,255,255,0.04)] rounded-xl p-10 shadow-2xl">
        <div className="logo flex items-center gap-2 mb-8 font-medium justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
          <span className="font-mono text-sm tracking-widest text-[var(--text)]">SECURE ADMIN CONSOLE</span>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 relative">
            <input
              type="text"
              id="adminUsername"
              className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            <input
              type="password"
              id="adminPassword"
              className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="font-mono text-[10px] text-red-500 text-center uppercase tracking-wide">
              $ ERROR: {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--accent)] text-white text-xs font-mono uppercase tracking-widest py-3.5 rounded-lg hover:bg-[rgba(var(--accent-rgb),0.8)] focus:outline-none transition-colors duration-300 font-semibold cursor-pointer"
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="font-mono text-[9px] text-[var(--text-dim)] uppercase hover:text-[var(--text)] transition-colors">
            ← RETURN TO CORE PLATFORM
          </Link>
        </div>
      </div>
    </section>
  );
}

// Inline simple Link helper for Next.js routing in Client Components
import Link from 'next/link';
