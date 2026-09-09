-- ============================================================================
-- 2026-09-09 — Remove Organizations feature
-- The Organizations/Orgs feature has been removed from the product. This
-- migration drops the organizations table (and its trigger/policies) from any
-- existing database so the schema matches the codebase.
-- Idempotent: safe to run multiple times.
-- ============================================================================

DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
DROP POLICY IF EXISTS "Anyone can view published organizations" ON organizations;
DROP POLICY IF EXISTS "Admins can do everything on organizations" ON organizations;
DROP TABLE IF EXISTS organizations CASCADE;
