// Centralized Type Definitions

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

export interface BlogPostData {
  id?: string | number;
  title: string;
  slug: string;
  contentMarkdown: string;
  categories: string | string[];
  tags: string | string[];
  isDraft: number | boolean;
  publishedAt?: string | null;
  readingTime?: number;
  excerpt?: string;
}

export interface ProjectData {
  id?: string | number;
  title: string;
  slug: string;
  subtitle?: string;
  role?: string;
  company?: string;
  timeline?: string;
  problem?: string;
  challenge?: string;
  solution?: string;
  techStack: string | string[];
  metrics: string | { value: string; label: string }[];
  screenshots: string | string[];
  githubUrl?: string;
  demoUrl?: string;
  isFeatured: number | boolean;
  isPinned: number | boolean;
  isDraft: number | boolean;
  position: number | string;
}

export interface UserSession {
  userId: number | string;
  username: string;
}

export interface ContactInput {
  name: string;
  email: string;
  objective: string;
  details: string;
  website?: string;
}

export interface SettingUpdateItem {
  key: string;
  value: string;
}
