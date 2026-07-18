'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface ThemeConfig {
  themeMode: string;
  colorBg: string;
  colorSurface: string;
  colorText: string;
  colorTextMuted: string;
  colorAccent: string;
  colorAccentRgb: string;
  radius: string;
  showNoise: string;
  reduceMotion: string;
  cursorAura: string;
  thoughtWave: string;
}

const ThemeContext = createContext<{
  settings: ThemeConfig;
  updateSettings: (newSettings: Partial<ThemeConfig>) => void;
}>({
  settings: {} as ThemeConfig,
  updateSettings: () => {},
});

export const useThemeSettings = () => useContext(ThemeContext);

export default function ThemeProvider({
  initialSettings,
  children,
}: {
  initialSettings: ThemeConfig;
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<ThemeConfig>(initialSettings);

  const updateSettings = (newSettings: Partial<ThemeConfig>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  useEffect(() => {
    const root = document.documentElement;
    
    // Inject CSS variables dynamically from database state
    root.style.setProperty('--bg', settings.colorBg);
    root.style.setProperty('--surface', settings.colorSurface);
    root.style.setProperty('--text', settings.colorText);
    root.style.setProperty('--text-muted', settings.colorTextMuted);
    root.style.setProperty('--accent', settings.colorAccent);
    root.style.setProperty('--accent-rgb', settings.colorAccentRgb);
    root.style.setProperty('--radius', settings.radius);
    
    // Apply visual effects conditions
    if (settings.reduceMotion === '1') {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    if (settings.themeMode === 'light') {
      root.classList.add('light-mode');
    } else {
      root.classList.remove('light-mode');
    }
  }, [settings]);

  return (
    <ThemeContext.Provider value={{ settings, updateSettings }}>
      {children}
      {settings.showNoise === '1' && (
        <div 
          className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        />
      )}
    </ThemeContext.Provider>
  );
}
