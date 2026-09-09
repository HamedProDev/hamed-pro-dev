-- ============================================================================
-- HAMED HUSSEIN — SETTINGS SAFETY NET
-- Idempotent. Run in Supabase Dashboard → SQL Editor.
--
-- Ensures the `settings` table has every column the admin UI (Settings, SEO,
-- About pages) saves through /api/settings, plus the update_updated_at
-- function/trigger. Safe to run repeatedly: every statement is idempotent.
-- Without these columns the API silently drops the corresponding fields
-- (see src/app/api/settings/route.ts) instead of failing the whole save.
-- ============================================================================

-- Extensions needed for uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table skeleton in case settings is missing entirely
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Core identity / site info
ALTER TABLE settings ADD COLUMN IF NOT EXISTS site_name TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS keywords TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS logo TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS favicon TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS og_image TEXT;

-- Profile & hero
ALTER TABLE settings ADD COLUMN IF NOT EXISTS profile_photo TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS hero_name TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS hero_title TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS hero_subtitle TEXT;

-- Contact info
ALTER TABLE settings ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS location TEXT;

-- Site options
ALTER TABLE settings ADD COLUMN IF NOT EXISTS maintenance_mode BOOLEAN DEFAULT false;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS allow_registration BOOLEAN DEFAULT true;

-- Structured JSON blobs
ALTER TABLE settings ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS email_notifications JSONB DEFAULT '{}';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS seo_defaults JSONB DEFAULT '{}';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS integrations JSONB DEFAULT '{}';

-- Career extras (resume + Hire Me pricing + About image)
ALTER TABLE settings ADD COLUMN IF NOT EXISTS resume_url TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS hire_services JSONB DEFAULT '[]';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS about_image TEXT;

-- ============================================================================
-- updated_at trigger (function + trigger are both idempotent)
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
