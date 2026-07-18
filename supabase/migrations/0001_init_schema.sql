-- Supabase PostgreSQL Initialization Migration Schema
-- Phase 2 - Database Architecture and Row Level Security

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SCHEMAS / TABLES

-- PROFILE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    tagline TEXT,
    bio TEXT,
    contact_email TEXT,
    location TEXT,
    resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active'
);

-- SKILL CATEGORIES
CREATE TABLE IF NOT EXISTS public.skill_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active'
);

-- SKILLS
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES public.skill_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    proficiency INTEGER NOT NULL DEFAULT 80, -- 0 to 100 percentage
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active'
);

-- PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    subtitle TEXT,
    role TEXT,
    company TEXT,
    timeline TEXT,
    problem TEXT,
    challenge TEXT,
    solution TEXT,
    tech_stack JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of string tags
    metrics JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of {value, label}
    screenshots JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of image paths/URLs
    github_url TEXT,
    demo_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    is_draft BOOLEAN NOT NULL DEFAULT true,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active'
);

-- EXPERIENCE
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    timeline TEXT NOT NULL,
    description TEXT,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active'
);

-- EDUCATION
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    degree TEXT NOT NULL,
    institution TEXT NOT NULL,
    location TEXT,
    timeline TEXT NOT NULL,
    description TEXT,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active'
);

-- CERTIFICATES
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    timeline TEXT,
    score INTEGER,
    suffix TEXT NOT NULL DEFAULT '%',
    description TEXT,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active'
);

-- BLOGS (Journal Posts)
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content_markdown TEXT NOT NULL,
    categories JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of categories
    tags JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of tags
    reading_time INTEGER NOT NULL DEFAULT 5,
    is_draft BOOLEAN NOT NULL DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active'
);

-- TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    client_role TEXT,
    client_company TEXT,
    text TEXT NOT NULL,
    avatar_url TEXT,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active'
);

-- SERVICES
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active'
);

-- SEO METADATA
CREATE TABLE IF NOT EXISTS public.seo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meta_description TEXT NOT NULL,
    og_image TEXT,
    twitter_card TEXT DEFAULT 'summary_large_image',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active'
);

-- SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL, -- 'hero' | 'theme' | 'seo' | 'animations'
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active'
);

-- MESSAGES (Leads Inbox)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    objective TEXT,
    details TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread', -- 'unread' | 'read' | 'archived' | 'spam'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ANALYTICS EVENTS
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL, -- 'visit' | 'cta_click' | 'download'
    path TEXT NOT NULL,
    referrer TEXT,
    device TEXT,
    country TEXT,
    browser TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 3. INDEXES FOR PERFORMANCE OPTIMIZATION
CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_position ON public.projects(position) WHERE is_draft = false;
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON public.blogs(created_at DESC) WHERE is_draft = false;
CREATE INDEX IF NOT EXISTS idx_experience_position ON public.experience(position);
CREATE INDEX IF NOT EXISTS idx_education_position ON public.education(position);
CREATE INDEX IF NOT EXISTS idx_certificates_position ON public.certificates(position);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(key);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);


-- 4. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- 4.1 Profiles policies
CREATE POLICY "Allow public read on profiles" ON public.profiles
    FOR SELECT USING (status = 'active');
CREATE POLICY "Allow admin full access on profiles" ON public.profiles
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4.2 Skill Categories policies
CREATE POLICY "Allow public read on skill_categories" ON public.skill_categories
    FOR SELECT USING (status = 'active');
CREATE POLICY "Allow admin full access on skill_categories" ON public.skill_categories
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4.3 Skills policies
CREATE POLICY "Allow public read on skills" ON public.skills
    FOR SELECT USING (status = 'active');
CREATE POLICY "Allow admin full access on skills" ON public.skills
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4.4 Projects policies
CREATE POLICY "Allow public read on published projects" ON public.projects
    FOR SELECT USING (is_draft = false AND status = 'active');
CREATE POLICY "Allow admin full access on projects" ON public.projects
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4.5 Experience policies
CREATE POLICY "Allow public read on experience" ON public.experience
    FOR SELECT USING (status = 'active');
CREATE POLICY "Allow admin full access on experience" ON public.experience
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4.6 Education policies
CREATE POLICY "Allow public read on education" ON public.education
    FOR SELECT USING (status = 'active');
CREATE POLICY "Allow admin full access on education" ON public.education
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4.7 Certificates policies
CREATE POLICY "Allow public read on certificates" ON public.certificates
    FOR SELECT USING (status = 'active');
CREATE POLICY "Allow admin full access on certificates" ON public.certificates
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4.8 Blogs policies
CREATE POLICY "Allow public read on published blogs" ON public.blogs
    FOR SELECT USING (is_draft = false AND status = 'active');
CREATE POLICY "Allow admin full access on blogs" ON public.blogs
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4.9 Testimonials policies
CREATE POLICY "Allow public read on testimonials" ON public.testimonials
    FOR SELECT USING (status = 'active');
CREATE POLICY "Allow admin full access on testimonials" ON public.testimonials
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4.10 Services policies
CREATE POLICY "Allow public read on services" ON public.services
    FOR SELECT USING (status = 'active');
CREATE POLICY "Allow admin full access on services" ON public.services
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4.11 SEO policies
CREATE POLICY "Allow public read on seo" ON public.seo
    FOR SELECT USING (status = 'active');
CREATE POLICY "Allow admin full access on seo" ON public.seo
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4.12 Site Settings policies
CREATE POLICY "Allow public read on site_settings" ON public.site_settings
    FOR SELECT USING (status = 'active');
CREATE POLICY "Allow admin full access on site_settings" ON public.site_settings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4.13 Messages policies (Contact Leads)
CREATE POLICY "Allow anonymous inserts on messages" ON public.messages
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin full access on messages" ON public.messages
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4.14 Analytics events policies
CREATE POLICY "Allow anonymous inserts on analytics_events" ON public.analytics_events
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read access on analytics_events" ON public.analytics_events
    FOR SELECT TO authenticated USING (true);


-- 5. STORAGE BUCKETS SETUP & POLICIES
-- Supabase Storage stores buckets in storage.buckets, files in storage.objects

-- We can seed buckets dynamically (ignores duplicates)
INSERT INTO storage.buckets (id, name, public) VALUES 
('profile-images', 'profile-images', true),
('hero-images', 'hero-images', true),
('projects', 'projects', true),
('gallery', 'gallery', true),
('blog-images', 'blog-images', true),
('certificates', 'certificates', true),
('resume', 'resume', true),
('documents', 'documents', false),
('site-assets', 'site-assets', true),
('logos', 'logos', true),
('icons', 'icons', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage.objects
-- Allow public read access to public buckets
CREATE POLICY "Allow public read on public buckets" ON storage.objects
    FOR SELECT USING (bucket_id IN (
        'profile-images', 'hero-images', 'projects', 'gallery', 
        'blog-images', 'certificates', 'resume', 'site-assets', 'logos', 'icons'
    ));

-- Allow authenticated admin full access on all objects
CREATE POLICY "Allow admin full access on storage objects" ON storage.objects
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
