-- Migration to add activity logs for Admin CMS audit trailing
-- Phase 3 - Admin CMS Architecture

CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name TEXT NOT NULL,
    action TEXT NOT NULL, -- 'LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'UPLOAD', 'SETTINGS_CHANGE'
    entity TEXT, -- 'PROJECT', 'BLOG', 'PROFILE', 'SKILLS', etc.
    details TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow only authenticated admins to SELECT activity logs
CREATE POLICY "Allow authenticated SELECT on activity_logs" ON public.activity_logs
    FOR SELECT TO authenticated USING (true);

-- Allow both anonymous and authenticated inserts (so anonymous login failures can be logged too)
CREATE POLICY "Allow anonymous and authenticated INSERT on activity_logs" ON public.activity_logs
    FOR INSERT WITH CHECK (true);

-- Create performance index
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
