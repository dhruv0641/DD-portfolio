'use client';

import React, { useState } from 'react';
import { saveSettings } from '@/app/actions/settings';
import { useRouter } from 'next/navigation';

export default function SettingsCMS({ initialSettings }: { initialSettings: any[] }) {
  const [settings, setSettings] = useState(
    initialSettings.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {} as Record<string, string>)
  );
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setSettings((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setSettings((prev: any) => ({ ...prev, [id]: checked ? '1' : '0' }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    // Format theme accent rgb helper if accent color changes
    const finalSettings = { ...settings };
    if (settings.colorAccent) {
      // Basic hex converter to populate --accent-rgb automatically (e.g. #0066FF -> 0, 102, 255)
      const hex = settings.colorAccent.replace('#', '');
      if (hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        finalSettings.colorAccentRgb = `${r}, ${g}, ${b}`;
      }
    }

    // Convert keys object to update payload array
    const payload = Object.keys(finalSettings).map((key) => ({
      key,
      value: finalSettings[key],
    }));

    const result = await saveSettings(payload);
    if (result.success) {
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || 'Failed to save settings.');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-light tracking-tight mb-2">System Settings</h1>
        <p className="text-sm text-gray-400">Configure global layout texts, color variables, and micro-interaction parameters.</p>
      </div>

      {success && (
        <div className="bg-green-950/20 border border-green-500/20 text-green-400 text-xs font-mono p-4 rounded-lg">
          $ TRANSACTION SUCCESSFUL: Static cache revalidated.
        </div>
      )}

      {error && (
        <div className="bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-mono p-4 rounded-lg">
          $ TRANSACTION FAIL: {error}
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-8">
        
        {/* 1. HERO COPY PANEL */}
        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-8 flex flex-col gap-6">
          <h3 className="text-sm font-semibold tracking-wide border-b border-[#1a1a22] pb-4">
            Hero &amp; Profile Copy
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gray-400 uppercase">Operator Name</label>
              <input 
                type="text" 
                id="name" 
                required
                className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm"
                value={settings.name || ''} 
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gray-400 uppercase">Contact Email Address</label>
              <input 
                type="email" 
                id="contactEmail" 
                required
                className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm"
                value={settings.contactEmail || 'dhruv.dobariya0641@gmail.com'} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-gray-400 uppercase">Professional Title</label>
            <input 
              type="text" 
              id="title" 
              required
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm"
              value={settings.title || ''} 
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-gray-400 uppercase">Primary Tagline</label>
            <input 
              type="text" 
              id="tagline" 
              required
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm"
              value={settings.tagline || ''} 
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-gray-400 uppercase">Biography narrative</label>
            <textarea 
              id="bio" 
              rows={4}
              required
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg p-4 text-sm"
              value={settings.bio || ''} 
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* 2. THEME AND PALETTE CONFIGS */}
        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-8 flex flex-col gap-6">
          <h3 className="text-sm font-semibold tracking-wide border-b border-[#1a1a22] pb-4">
            Visual &amp; Color System
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gray-400 uppercase">Background Color</label>
              <input 
                type="color" 
                id="colorBg" 
                className="bg-transparent border-0 rounded h-10 w-full cursor-pointer"
                value={settings.colorBg || '#090909'} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gray-400 uppercase">Surface Color</label>
              <input 
                type="color" 
                id="colorSurface" 
                className="bg-transparent border-0 rounded h-10 w-full cursor-pointer"
                value={settings.colorSurface || '#111111'} 
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gray-400 uppercase">Accent Color</label>
              <input 
                type="color" 
                id="colorAccent" 
                className="bg-transparent border-0 rounded h-10 w-full cursor-pointer"
                value={settings.colorAccent || '#0066FF'} 
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gray-400 uppercase">Text Color</label>
              <input 
                type="color" 
                id="colorText" 
                className="bg-transparent border-0 rounded h-10 w-full cursor-pointer"
                value={settings.colorText || '#F5F5F5'} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#1a1a22]/60">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gray-400 uppercase">Border Radius (px or rem)</label>
              <input 
                type="text" 
                id="radius" 
                className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm"
                value={settings.radius || '8px'} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  id="showNoise" 
                  checked={settings.showNoise === '1'} 
                  onChange={handleCheckboxChange}
                />
                <span className="text-xs font-mono uppercase text-gray-400">Show Cinematic Film Grain Overlay</span>
              </label>
            </div>
          </div>
        </div>

        {/* 3. ANIMATION CONTROLS */}
        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-8 flex flex-col gap-6">
          <h3 className="text-sm font-semibold tracking-wide border-b border-[#1a1a22] pb-4">
            Motion Settings
          </h3>
          
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                id="reduceMotion" 
                checked={settings.reduceMotion === '1'} 
                onChange={handleCheckboxChange}
              />
              <span className="text-xs font-mono uppercase text-gray-400">Enforce Reduced Motion (Bypasses smooth scrolls and complex canvas runs)</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                id="cursorAura" 
                checked={settings.cursorAura === '1'} 
                onChange={handleCheckboxChange}
              />
              <span className="text-xs font-mono uppercase text-gray-400">Activate Spotlight Cursor Probe Aura</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                id="thoughtWave" 
                checked={settings.thoughtWave === '1'} 
                onChange={handleCheckboxChange}
              />
              <span className="text-xs font-mono uppercase text-gray-400">Render Dynamic Thought wave canvas background in Hero</span>
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="bg-[var(--accent)] text-white text-xs font-mono uppercase tracking-wider py-4 rounded-lg hover:bg-[rgba(var(--accent-rgb),0.8)] focus:outline-none transition-colors duration-300 font-semibold cursor-pointer max-w-[200px]"
        >
          {loading ? 'SAVING...' : 'SAVE SYSTEM CONFIG'}
        </button>
      </form>
    </div>
  );
}
