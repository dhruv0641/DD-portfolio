// Centralized System Constants

export const PUBLIC_NAV_LINKS = [
  { href: '/#identity', label: 'Identity' },
  { href: '/#work', label: 'Work' },
  { href: '/#case', label: 'Case Study' },
  { href: '/#thinking', label: 'Thinking' },
  { href: '/blog', label: 'Writing' },
  { href: '/#build', label: 'Build' },
] as const;

export const ADMIN_NAV_LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/projects', label: 'Projects CMS' },
  { href: '/admin/blog', label: 'Writing CMS' },
  { href: '/admin/messages', label: 'Leads & Messages' },
  { href: '/admin/settings', label: 'System Settings' },
] as const;

export const DEFAULT_THEME_CONFIG = {
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
} as const;

export const FALLBACK_EMAIL = 'dhruv.dobariya0641@gmail.com';
export const SESSION_COOKIE_NAME = 'dhruv_session';
