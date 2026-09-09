-- ============================================================================
-- TIME TRACKING — lesson_progress.time_spent_seconds
-- Run in Supabase Dashboard → SQL Editor. Idempotent.
-- ============================================================================
ALTER TABLE lesson_progress ADD COLUMN IF NOT EXISTS time_spent_seconds INT DEFAULT 0;
