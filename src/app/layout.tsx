import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import ThemeProvider from '@/components/ThemeProvider';
import { ThemeConfig } from '@/types';
import LenisProvider from '@/components/LenisProvider';
import LightProbe from '@/components/LightProbe';
import Link from 'next/link';
import { settingsService } from '@/services/settingsService';
import BackgroundLayer from '@/components/BackgroundLayer';
import './globals.css';

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
});

const fontSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400'],
  style: ['normal', 'italic'],
});

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
});

export async function generateMetadata(): Promise<Metadata> {
  // Query SEO parameters from database dynamically
  const settings = await settingsService.getSettings();
  
  const title = settings.name || 'Dhruv Dobariya';
  const titleSuffix = settings.title || 'Applied AI Engineer';
  const description = settings.metaDescription || 'Applied AI Systems Portfolio';

  return {
    title: `${title} — ${titleSuffix}`,
    description,
    metadataBase: new URL('https://vance.engineering'),
    openGraph: {
      title: `${title} — ${titleSuffix}`,
      description,
      type: 'website',
      images: ['/uploads/hero_visual.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${titleSuffix}`,
      description,
      images: ['/uploads/hero_visual.png'],
    },
    icons: {
      icon: [
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon.ico', sizes: 'any' }
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
      ],
      other: [
        { rel: 'icon', url: '/favicon.ico' }
      ]
    },
    manifest: '/site.webmanifest',
  };
}

export const viewport = {
  themeColor: '#090909',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Fetch Dynamic Configuration Settings
  const initialSettings = await settingsService.getSettings();
  
  const defaultThemeConfig = {
    themeMode: 'dark',
    colorBg: '#090909',
    colorSurface: '#111111',
    colorText: '#F5F5F5',
    colorTextMuted: '#A1A1AA',
    colorAccent: '#0066FF',
    colorAccentRgb: '0, 102, 255',
    radius: '8px',
    showNoise: '1',
    reduceMotion: '0',
    cursorAura: '1',
    thoughtWave: '1',
  };

  const mergedSettings = { ...defaultThemeConfig, ...initialSettings } as unknown as ThemeConfig & { name?: string; contactEmail?: string };

  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} scroll-smooth`}
    >
      <body className="bg-[var(--bg)] text-[var(--text)] font-sans antialiased overflow-x-hidden relative min-h-screen">
        <ThemeProvider initialSettings={mergedSettings}>
          <LenisProvider>
            <BackgroundLayer />

            {/* Platform Main Header */}
            <header className="fixed top-0 left-0 w-full z-50 px-[8%] py-10 flex justify-between items-center pointer-events-none">
              <div className="logo pointer-events-auto select-none flex items-center gap-2 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--text)]" />
                <Link href="/">{mergedSettings.name || 'Dhruv Dobariya'}</Link>
              </div>
              <nav className="pointer-events-auto flex gap-12 text-xs">
                <Link href="/#identity" className="nav-link">Identity</Link>
                <Link href="/#work" className="nav-link">Work</Link>
                <Link href="/#case" className="nav-link">Case Study</Link>
                <Link href="/#thinking" className="nav-link">Thinking</Link>
                <Link href="/blog" className="nav-link">Writing</Link>
                <Link href="/#build" className="nav-link">Build</Link>
              </nav>
            </header>

            {/* Central Children Page Wrapper */}
            <main className="w-full relative z-10">{children}</main>

            {/* Platform Main Footer */}
            <footer className="w-full px-[8%] py-20 flex justify-between items-center border-t border-[rgba(255,255,255,0.04)] font-mono text-[10px] text-[var(--text-dim)]">
              <div>© 2026 {mergedSettings.name?.toUpperCase() || 'DHRUV DOBARIYA'}. ALL RIGHTS RESERVED.</div>
              <div className="flex gap-6">
                <a href="https://github.com/dhruv0641" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text)] transition-colors duration-300">GITHUB</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text)] transition-colors duration-300">TWITTER</a>
                <Link href="/admin/login" className="hover:text-[var(--text)] transition-colors duration-300">ADMIN</Link>
              </div>
            </footer>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
