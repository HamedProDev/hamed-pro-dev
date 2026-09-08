-- ============================================================================
-- 2026-09-09 — Remove Blog feature
-- The blog has been removed from the product. This migration drops the
-- blog_posts table (and its trigger/policies/index) from any existing database.
-- Idempotent: safe to run multiple times.
-- ============================================================================

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can do everything on blog_posts" ON blog_posts;
DROP INDEX IF EXISTS idx_blog_posts_search;
DROP TABLE IF EXISTS blog_posts CASCADE;
