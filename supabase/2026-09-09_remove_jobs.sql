-- ============================================================================
-- 2026-09-09 — Remove Jobs feature
-- The Jobs board (and Save Jobs) has been removed from the product. This
-- migration drops the jobs and saved_jobs tables (and their
-- triggers/policies/indexes) from any existing database so the schema
-- matches the codebase.
-- Idempotent: safe to run multiple times.
-- ============================================================================

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
DROP POLICY IF EXISTS "Anyone can view published jobs" ON jobs;
DROP POLICY IF EXISTS "Admins can do everything on jobs" ON jobs;
DROP POLICY IF EXISTS "Users can read own saved jobs" ON saved_jobs;
DROP POLICY IF EXISTS "Users can write own saved jobs" ON saved_jobs;
DROP INDEX IF EXISTS idx_jobs_search;
DROP INDEX IF EXISTS idx_saved_jobs_user;
DROP TABLE IF EXISTS saved_jobs CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
