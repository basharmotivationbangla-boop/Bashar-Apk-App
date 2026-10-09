-- ================================================================
-- Supabase Database Schema for Bashar Apk App
-- Project URL: https://sckoyizwlxakphdhhnbw.supabase.co
-- Project ID: sckoyizwlxakphdhhnbw
-- ================================================================

-- 1. Enable UUID Extension (standard in PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Apps Table
CREATE TABLE IF NOT EXISTS public.apps (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    package_name TEXT,
    version TEXT,
    version_code INTEGER,
    category TEXT,
    developer TEXT,
    file_size TEXT,
    icon_url TEXT,
    short_description TEXT,
    full_description TEXT,
    download_url TEXT,
    mirror_url TEXT,
    status TEXT DEFAULT 'published',
    is_featured BOOLEAN DEFAULT false,
    is_popular BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    rating NUMERIC DEFAULT 4.8,
    download_count BIGINT DEFAULT 0,
    tags JSONB DEFAULT '[]'::jsonb,
    screenshots JSONB DEFAULT '[]'::jsonb,
    changelog JSONB DEFAULT '[]'::jsonb,
    sha256 TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Enable RLS and public read/write policies for apps
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to apps" ON public.apps FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update to apps" ON public.apps FOR ALL USING (true);

-- 3. Live Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id BIGSERIAL PRIMARY KEY,
    sender_name TEXT NOT NULL,
    sender_email TEXT,
    text TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    avatar TEXT,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read to chat_messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert to chat_messages" ON public.chat_messages FOR INSERT WITH CHECK (true);

-- 4. Contact & Inquiries Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read to contact_messages" ON public.contact_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert to contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- 5. App Reviews & Ratings Table
CREATE TABLE IF NOT EXISTS public.app_reviews (
    id BIGSERIAL PRIMARY KEY,
    app_id TEXT NOT NULL,
    app_name TEXT,
    user_name TEXT NOT NULL,
    user_email TEXT,
    rating INTEGER DEFAULT 5,
    comment TEXT NOT NULL,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.app_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read to app_reviews" ON public.app_reviews FOR SELECT USING (true);
CREATE POLICY "Allow public insert to app_reviews" ON public.app_reviews FOR INSERT WITH CHECK (true);

-- 6. User App Requests Table
CREATE TABLE IF NOT EXISTS public.app_requests (
    id BIGSERIAL PRIMARY KEY,
    requester_name TEXT NOT NULL,
    requester_email TEXT,
    app_title TEXT NOT NULL,
    category TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.app_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read to app_requests" ON public.app_requests FOR SELECT USING (true);
CREATE POLICY "Allow public insert to app_requests" ON public.app_requests FOR INSERT WITH CHECK (true);

-- 7. Downloads Log Table
CREATE TABLE IF NOT EXISTS public.downloads (
    id BIGSERIAL PRIMARY KEY,
    app_id TEXT NOT NULL,
    app_name TEXT NOT NULL,
    version TEXT,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read to downloads" ON public.downloads FOR SELECT USING (true);
CREATE POLICY "Allow public insert to downloads" ON public.downloads FOR INSERT WITH CHECK (true);

-- 8. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read to categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update to categories" ON public.categories FOR ALL USING (true);

-- 9. Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read to settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update to settings" ON public.settings FOR ALL USING (true);
