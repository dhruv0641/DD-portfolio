import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Admin users schema
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  email: text('email').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Dynamic settings store (Key-Value)
export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  category: text('category').notNull(), // 'hero' | 'theme' | 'seo' | 'animations'
  key: text('key').notNull().unique(),
  value: text('value').notNull(), // Holds JSON or strings
});

// Projects / Case Studies schema
export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  subtitle: text('subtitle'),
  role: text('role'),
  company: text('company'),
  timeline: text('timeline'),
  problem: text('problem'),
  challenge: text('challenge'),
  solution: text('solution'),
  architectureSvg: text('architecture_svg'),
  techStack: text('tech_stack').notNull(), // JSON list of string tags
  metrics: text('metrics'), // JSON list of { value, label }
  screenshots: text('screenshots'), // JSON list of image paths
  githubUrl: text('github_url'),
  demoUrl: text('demo_url'),
  isFeatured: integer('is_featured').notNull().default(0), // 0=false, 1=true
  isPinned: integer('is_pinned').notNull().default(0),
  isDraft: integer('is_draft').notNull().default(1), // Starts as draft
  position: integer('position').notNull().default(0), // For drag-and-drop ordering
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Blog / Engineering Journal posts
export const blogPosts = sqliteTable('blog_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  contentMarkdown: text('content_markdown').notNull(),
  categories: text('categories'), // JSON list of string categories
  tags: text('tags'), // JSON list of string tags
  readingTime: integer('reading_time').notNull().default(5),
  isDraft: integer('is_draft').notNull().default(1),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Inbound contact form submissions
export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  objective: text('objective'), // project type, hire, general, etc
  details: text('details').notNull(),
  status: text('status').notNull().default('unread'), // 'unread' | 'read' | 'archived' | 'spam'
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Simple page / link interaction analytics tracker
export const analyticsEvents = sqliteTable('analytics_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  eventType: text('event_type').notNull(), // 'visit' | 'cta_click' | 'download'
  path: text('path').notNull(),
  referrer: text('referrer'),
  device: text('device'),
  country: text('country'),
  browser: text('browser'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
