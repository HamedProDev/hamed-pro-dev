-- Fix settings table schema (drop old key-value, recreate with proper columns)
DROP TABLE IF EXISTS settings CASCADE;

CREATE TABLE settings (
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

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can do everything on settings" ON settings;
CREATE POLICY "Admins can do everything on settings" ON settings FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
