-- ============================================================================
-- HAMED HUSSEIN — FULL DATABASE SETUP (single paste)
-- Target: Supabase project yawrixelaguczogjgxmv
-- How to run: Supabase Dashboard > SQL Editor > paste this WHOLE file > Run.
-- Idempotent: every statement is IF NOT EXISTS / OR REPLACE / DROP ... IF EXISTS,
-- so it is safe to re-run against an existing database.
-- ============================================================================

-- ════════════════════════════════════════════════════════════════════════════
-- PART A — BASE SCHEMA (tables, RLS, triggers, auth hooks)
-- ════════════════════════════════════════════════════════════════════════════
-- Enable UUID and pgcrypto
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'visitor' CHECK (role IN ('admin', 'editor', 'visitor')),
  bio TEXT,
  website TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  location TEXT,
  headline TEXT,
  interests TEXT[] DEFAULT '{}',
  referred_by UUID REFERENCES profiles(id),
  xp_points INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_activity_date DATE,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  tech_stack TEXT[] DEFAULT '{}',
  image_url TEXT,
  screenshots JSONB DEFAULT '[]',
  demo_url TEXT,
  github_url TEXT,
  client TEXT,
  year TEXT,
  status TEXT,
  role TEXT,
  featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  image_url TEXT,
  youtube_url TEXT,
  category TEXT,
  type TEXT DEFAULT 'free',
  level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration TEXT,
  price TEXT,
  enrolled INT DEFAULT 0,
  rating NUMERIC(2,1) DEFAULT 0,
  tags JSONB DEFAULT '[]',
  prerequisites JSONB DEFAULT '[]',
  outcomes JSONB DEFAULT '[]',
  featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  duration TEXT,
  type TEXT DEFAULT 'text',
  quiz JSONB DEFAULT '[]',
  resources JSONB DEFAULT '[]',
  is_free BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, slug)
);

-- Lesson comments (community)
CREATE TABLE IF NOT EXISTS lesson_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'visible' CHECK (status IN ('visible', 'pending', 'hidden')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- XP events (gamification / learning activity log)
CREATE TABLE IF NOT EXISTS user_xp_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  points INT NOT NULL DEFAULT 0,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  image_url TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  author TEXT,
  is_published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  read_time INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company TEXT,
  location TEXT,
  description TEXT,
  requirements TEXT,
  salary_range TEXT,
  job_type TEXT CHECK (job_type IN ('full-time', 'part-time', 'contract', 'freelance', 'internship')),
  category TEXT,
  application_url TEXT,
  featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT,
  category TEXT,
  color TEXT DEFAULT '#3B82F6',
  proficiency INT DEFAULT 0 CHECK (proficiency >= 0 AND proficiency <= 100),
  is_published BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  issuer TEXT,
  date DATE,
  image_url TEXT,
  certificate_url TEXT,
  category TEXT,
  is_published BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  role TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  category TEXT,
  is_hiring BOOLEAN DEFAULT false,
  tech_stack TEXT[] DEFAULT '{}',
  team_roles INT DEFAULT 0,
  team_size TEXT,
  location TEXT,
  is_published BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  content TEXT NOT NULL,
  avatar_url TEXT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  is_published BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contacts
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT,
  tagline TEXT,
  description TEXT,
  keywords TEXT,
  logo TEXT,
  favicon TEXT,
  og_image TEXT,
  profile_photo TEXT,
  hero_name TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  location TEXT,
  maintenance_mode BOOLEAN DEFAULT false,
  allow_registration BOOLEAN DEFAULT true,
  social_links JSONB DEFAULT '{}',
  email_notifications JSONB DEFAULT '{}',
  seo_defaults JSONB DEFAULT '{}',
  integrations JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Stats
CREATE TABLE IF NOT EXISTS site_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  suffix TEXT DEFAULT '',
  icon TEXT,
  is_published BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page TEXT,
  event TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_projects_search ON projects USING gin(to_tsvector('english', title || ' ' || coalesce(description, '')));
CREATE INDEX IF NOT EXISTS idx_blog_posts_search ON blog_posts USING gin(to_tsvector('english', title || ' ' || coalesce(excerpt, '')));
CREATE INDEX IF NOT EXISTS idx_courses_search ON courses USING gin(to_tsvector('english', title || ' ' || coalesce(description, '')));
CREATE INDEX IF NOT EXISTS idx_jobs_search ON jobs USING gin(to_tsvector('english', title || ' ' || coalesce(description, '')));

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS update_lessons_updated_at ON lessons;
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Anonymous read access for published content
DROP POLICY IF EXISTS "Anyone can view published projects" ON projects;
CREATE POLICY "Anyone can view published projects" ON projects FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Anyone can view published courses" ON courses;
CREATE POLICY "Anyone can view published courses" ON courses FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Anyone can view published lessons" ON lessons;
CREATE POLICY "Anyone can view published lessons" ON lessons FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;
CREATE POLICY "Anyone can view published blog posts" ON blog_posts FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Anyone can view published jobs" ON jobs;
CREATE POLICY "Anyone can view published jobs" ON jobs FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Anyone can view published skills" ON skills;
CREATE POLICY "Anyone can view published skills" ON skills FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Anyone can view published achievements" ON achievements;
CREATE POLICY "Anyone can view published achievements" ON achievements FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Anyone can view published organizations" ON organizations;
CREATE POLICY "Anyone can view published organizations" ON organizations FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Anyone can view published testimonials" ON testimonials;
CREATE POLICY "Anyone can view published testimonials" ON testimonials FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Anyone can view published stats" ON site_stats;
CREATE POLICY "Anyone can view published stats" ON site_stats FOR SELECT USING (is_published = true);

-- Profile access: users can read their own, admins can read all
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Admin full access
DROP POLICY IF EXISTS "Admins can do everything on projects" ON projects;
CREATE POLICY "Admins can do everything on projects" ON projects FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
DROP POLICY IF EXISTS "Admins can do everything on courses" ON courses;
CREATE POLICY "Admins can do everything on courses" ON courses FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
DROP POLICY IF EXISTS "Admins can do everything on lessons" ON lessons;
CREATE POLICY "Admins can do everything on lessons" ON lessons FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
DROP POLICY IF EXISTS "Admins can do everything on blog_posts" ON blog_posts;
CREATE POLICY "Admins can do everything on blog_posts" ON blog_posts FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
DROP POLICY IF EXISTS "Admins can do everything on jobs" ON jobs;
CREATE POLICY "Admins can do everything on jobs" ON jobs FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
DROP POLICY IF EXISTS "Admins can do everything on skills" ON skills;
CREATE POLICY "Admins can do everything on skills" ON skills FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
DROP POLICY IF EXISTS "Admins can do everything on achievements" ON achievements;
CREATE POLICY "Admins can do everything on achievements" ON achievements FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
DROP POLICY IF EXISTS "Admins can do everything on organizations" ON organizations;
CREATE POLICY "Admins can do everything on organizations" ON organizations FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
DROP POLICY IF EXISTS "Admins can do everything on testimonials" ON testimonials;
CREATE POLICY "Admins can do everything on testimonials" ON testimonials FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
DROP POLICY IF EXISTS "Admins can do everything on settings" ON settings;
CREATE POLICY "Admins can do everything on settings" ON settings FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
DROP POLICY IF EXISTS "Admins can do everything on site_stats" ON site_stats;
CREATE POLICY "Admins can do everything on site_stats" ON site_stats FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
DROP POLICY IF EXISTS "Admins can do everything on contacts" ON contacts;
CREATE POLICY "Admins can do everything on contacts" ON contacts FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
DROP POLICY IF EXISTS "Admins can do everything on newsletter_subscribers" ON newsletter_subscribers;
CREATE POLICY "Admins can do everything on newsletter_subscribers" ON newsletter_subscribers FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
DROP POLICY IF EXISTS "Admins can do everything on analytics" ON analytics;
CREATE POLICY "Admins can do everything on analytics" ON analytics FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Insert handler: auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, avatar_url, role, referred_by)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url',
    'visitor',
    NULLIF(NEW.raw_user_meta_data ->> 'referred_by', '')::uuid
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Auto-set admin role for specified emails
CREATE OR REPLACE FUNCTION set_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email IN ('hamedpro.work@gmail.com', 'hamussein01@gmail.com') THEN
    UPDATE profiles SET role = 'admin' WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION set_admin_role();

-- Lesson comments RLS: anyone can read visible comments, users manage their own.
ALTER TABLE lesson_comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read lesson comments" ON lesson_comments;
CREATE POLICY "Anyone can read lesson comments" ON lesson_comments FOR SELECT USING (status = 'visible');
DROP POLICY IF EXISTS "Users can insert lesson comments" ON lesson_comments;
CREATE POLICY "Users can insert lesson comments" ON lesson_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own comments" ON lesson_comments;
CREATE POLICY "Users can delete own comments" ON lesson_comments FOR DELETE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can do everything on lesson_comments" ON lesson_comments;
CREATE POLICY "Admins can do everything on lesson_comments" ON lesson_comments FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- XP events RLS
ALTER TABLE user_xp_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own xp events" ON user_xp_events;
CREATE POLICY "Users can read own xp events" ON user_xp_events FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can do everything on user_xp_events" ON user_xp_events;
CREATE POLICY "Admins can do everything on user_xp_events" ON user_xp_events FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE INDEX IF NOT EXISTS idx_xp_events_user ON user_xp_events(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_lesson_comments_lesson ON lesson_comments(lesson_id, created_at);

-- add_xp(uid, amount) — atomic XP increment helper for gamification.
CREATE OR REPLACE FUNCTION add_xp(uid uuid, amount int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles SET xp_points = COALESCE(xp_points, 0) + amount WHERE id = uid;
END;
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- PART B — LEARNING & CERTIFICATES MIGRATION (enrollments, progress, certs,
--           gamification, referrals, project detail fields, final quiz)
-- ════════════════════════════════════════════════════════════════════════════
-- ============================================================================
-- HAMED HUSSEIN — DATABASE MIGRATION PROPOSAL
-- File: supabase/plan/2026-09-08_learning_and_fixes.sql
-- ============================================================================
-- STATUS: PROPOSAL ONLY — NOT applied to any database.
-- Review, then run in Supabase Dashboard > SQL Editor. Idempotent (safe to re-run).
-- Target: Supabase (Postgres), project yawrixelaguczogjgxmv
-- ============================================================================

BEGIN;

-- ============================================================================
-- PART 1 — SCHEMA FIXES
-- ============================================================================

-- 1.1 Standardize blog_posts.tags as JSONB (schema.sql says TEXT[], the admin form
--     and fix-missing-columns.sql expect JSONB). Converts existing text arrays.
ALTER TABLE blog_posts
  ALTER COLUMN tags TYPE JSONB USING to_jsonb(COALESCE(tags, ARRAY[]::TEXT[]));
ALTER TABLE blog_posts ALTER COLUMN tags SET DEFAULT '[]'::jsonb;

-- 1.2 Add missing updated_at column + trigger where the CMS edits rows.
ALTER TABLE skills      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE site_stats  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

DROP TRIGGER IF EXISTS update_skills_updated_at      ON skills;
DROP TRIGGER IF EXISTS update_achievements_updated_at ON achievements;
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
DROP TRIGGER IF EXISTS update_site_stats_updated_at   ON site_stats;

CREATE TRIGGER update_skills_updated_at      BEFORE UPDATE ON skills      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_site_stats_updated_at   BEFORE UPDATE ON site_stats  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 1.3 is_admin() helper — single source of truth for admin checks.
--     Fixes the mismatch: RLS checked app_metadata.role but the trigger set
--     profiles.role. Now both RLS and the API can use profiles.role.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 1.4 Rewrite admin RLS policies to use is_admin() instead of app_metadata.role.
--     (Content tables + system tables.)
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'projects','courses','lessons','blog_posts','jobs','skills','achievements',
    'organizations','testimonials','contacts','newsletter_subscribers',
    'settings','site_stats','analytics'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Admins can do everything on %I" ON %I;', t, t);
    EXECUTE format(
      'CREATE POLICY "Admins can do everything on %I" ON %I FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());',
      t, t);
  END LOOP;
END $$;

-- 1.5 Public surface — make RLS govern what is currently only reachable via the
--     service-role client. Anonymous can read settings and write contact/newsletter/
--     analytics rows.

-- settings: public read (site name, tagline, hero, socials)
DROP POLICY IF EXISTS "Anyone can read site settings" ON settings;
CREATE POLICY "Anyone can read site settings" ON settings FOR SELECT USING (true);

-- contacts: public insert
DROP POLICY IF EXISTS "Anyone can submit a contact message" ON contacts;
CREATE POLICY "Anyone can submit a contact message" ON contacts
  FOR INSERT WITH CHECK (true);

-- newsletter_subscribers: public insert
DROP POLICY IF EXISTS "Anyone can subscribe to the newsletter" ON newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to the newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- analytics: public insert (page views)
DROP POLICY IF EXISTS "Anyone can record analytics" ON analytics;
CREATE POLICY "Anyone can record analytics" ON analytics
  FOR INSERT WITH CHECK (true);

-- 1.6 Self-serve profile editing (users update their own profile).
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 1.7 set_admin_role() — also stamp app_metadata.role so JWT-based checks work too.
CREATE OR REPLACE FUNCTION set_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email IN ('hamedpro.work@gmail.com', 'hamussein01@gmail.com') THEN
    UPDATE profiles SET role = 'admin' WHERE id = NEW.id;
    UPDATE auth.users
      SET raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
      WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1.8 handle_new_user() — fail loudly instead of swallowing errors.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url',
    'visitor'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1.8b Project detail fields (client, year, status, role, screenshot gallery).
ALTER TABLE projects ADD COLUMN IF NOT EXISTS screenshots JSONB DEFAULT '[]';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS year TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS role TEXT;

-- 1.9 Student profile fields: interests (tags) + referral tracking.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES profiles(id);

-- 1.10 Course-level final assessment (gates certificate issuance).
ALTER TABLE courses ADD COLUMN IF NOT EXISTS final_quiz JSONB DEFAULT '[]';

-- 1.11 Lesson comments (community).
CREATE TABLE IF NOT EXISTS lesson_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'visible' CHECK (status IN ('visible', 'pending', 'hidden')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
DROP TRIGGER IF EXISTS update_lesson_comments_updated_at ON lesson_comments;
CREATE TRIGGER update_lesson_comments_updated_at BEFORE UPDATE ON lesson_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 1.11a add_xp(uid, amount) — atomic XP increment helper for gamification.
CREATE OR REPLACE FUNCTION add_xp(uid uuid, amount int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles SET xp_points = COALESCE(xp_points, 0) + amount WHERE id = uid;
END;
$$;

-- 1.11b Gamification: XP + streaks on profiles, and an XP event log.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS xp_points INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_streak INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS longest_streak INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_activity_date DATE;

CREATE TABLE IF NOT EXISTS user_xp_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  points INT NOT NULL DEFAULT 0,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_xp_events_user ON user_xp_events(user_id, created_at);

-- 1.12 Referral capture in handle_new_user (override the earlier definition).
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, avatar_url, role, referred_by)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url',
    'visitor',
    NULLIF(NEW.raw_user_meta_data ->> 'referred_by', '')::uuid
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PART 2 — LEARNING & CERTIFICATES TABLES
-- ============================================================================

-- 2.1 enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'completed', 'dropped')),
  progress INT NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, course_id)
);

-- 2.2 lesson_progress
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  quiz_score INT CHECK (quiz_score >= 0 AND quiz_score <= 100),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, lesson_id)
);

-- 2.3 certificates
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certificate_number TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE SET NULL,
  recipient_name TEXT NOT NULL,
  course_title TEXT NOT NULL,
  score NUMERIC(5,2),
  issue_date DATE DEFAULT CURRENT_DATE,
  is_verified BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.4 saved_jobs (spec: "Save jobs")
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, job_id)
);

-- 2.5 updated_at triggers for the new tables
DROP TRIGGER IF EXISTS update_enrollments_updated_at ON enrollments;
DROP TRIGGER IF EXISTS update_lesson_progress_updated_at ON lesson_progress;
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_lesson_progress_updated_at BEFORE UPDATE ON lesson_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 2.6 Indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_course ON lesson_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user ON saved_jobs(user_id);

-- ============================================================================
-- PART 3 — RLS FOR THE NEW TABLES
-- ============================================================================

ALTER TABLE enrollments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress  ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates     ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_comments  ENABLE ROW LEVEL SECURITY;

-- Users manage their own rows
DROP POLICY IF EXISTS "Users can read own enrollments" ON enrollments;
CREATE POLICY "Users can read own enrollments" ON enrollments FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own enrollments" ON enrollments;
CREATE POLICY "Users can insert own enrollments" ON enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own enrollments" ON enrollments;
CREATE POLICY "Users can update own enrollments" ON enrollments FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own lesson progress" ON lesson_progress;
CREATE POLICY "Users can read own lesson progress" ON lesson_progress FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can write own lesson progress" ON lesson_progress;
CREATE POLICY "Users can write own lesson progress" ON lesson_progress FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own certificates" ON certificates;
CREATE POLICY "Users can read own certificates" ON certificates FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Anyone can verify a certificate" ON certificates;
CREATE POLICY "Anyone can verify a certificate" ON certificates FOR SELECT
  USING (is_verified = true);

DROP POLICY IF EXISTS "Users can read own saved jobs" ON saved_jobs;
CREATE POLICY "Users can read own saved jobs" ON saved_jobs FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can write own saved jobs" ON saved_jobs;
CREATE POLICY "Users can write own saved jobs" ON saved_jobs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Lesson comments: anyone can read visible comments, authenticated users can write their own.
DROP POLICY IF EXISTS "Anyone can read lesson comments" ON lesson_comments;
CREATE POLICY "Anyone can read lesson comments" ON lesson_comments FOR SELECT USING (status = 'visible');
DROP POLICY IF EXISTS "Users can insert lesson comments" ON lesson_comments;
CREATE POLICY "Users can insert lesson comments" ON lesson_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own comments" ON lesson_comments;
CREATE POLICY "Users can delete own comments" ON lesson_comments FOR DELETE USING (auth.uid() = user_id);

-- XP events: users read their own.
ALTER TABLE user_xp_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own xp events" ON user_xp_events;
CREATE POLICY "Users can read own xp events" ON user_xp_events FOR SELECT USING (auth.uid() = user_id);

-- Admins: full access (reuses public.is_admin())
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['enrollments','lesson_progress','certificates','saved_jobs','lesson_comments','user_xp_events'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Admins can do everything on %I" ON %I;', t, t);
    EXECUTE format(
      'CREATE POLICY "Admins can do everything on %I" ON %I FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());',
      t, t);
  END LOOP;
END $$;

COMMIT;

-- ============================================================================
-- PART 4 — BRANDING SEED (run once; idempotent-ish)
-- ============================================================================
-- Site name becomes "Hamed Hussein"; the handle "hamedprodev" is kept in the bio.
-- (Adjust wording to taste before running.)
-- UPDATE settings
--   SET site_name = 'Hamed Hussein',
--       description = 'Fullstack & AI/ML Engineer based in Kigali, Rwanda. Known online as @hamedprodev.'
--   WHERE id = (SELECT id FROM settings ORDER BY created_at ASC LIMIT 1);
