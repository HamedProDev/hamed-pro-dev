-- ============================================================================
-- HAMED HUSSEIN — SETTINGS EXTRAS (resume + hire pricing)
-- Idempotent. Run in Supabase Dashboard → SQL Editor.
-- ============================================================================

-- Admin-uploaded resume (public download link)
ALTER TABLE settings ADD COLUMN IF NOT EXISTS resume_url TEXT;

-- Admin-managed services & pricing shown on the Hire Me page
ALTER TABLE settings ADD COLUMN IF NOT EXISTS hire_services JSONB DEFAULT '[]';
