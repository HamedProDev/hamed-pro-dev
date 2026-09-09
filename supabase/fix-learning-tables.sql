-- ============================================================================
-- HAMED HUSSEIN — COURSE / LESSON / PROGRESS SAFETY NET
-- Idempotent. Run in Supabase Dashboard → SQL Editor.
--
-- Guarantees the full learning flow works end to end:
--   admin creates course → adds lessons → user enrolls → lessons tracked in
--   order → final quiz → verifiable certificate.
--
-- Creates the learning tables if missing (enrollments, lesson_progress,
-- certificates), adds every lesson/course column the admin forms save, and
-- the lesson-time-tracking column. Safe to run repeatedly.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- Lessons: every column the "New/Edit Lesson" admin form saves
-- (youtubeUrl→video_url, videoDuration→duration, quiz, resources…)
-- ----------------------------------------------------------------------------
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS quiz JSONB DEFAULT '[]';
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS resources JSONB DEFAULT '[]';
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'text';
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ----------------------------------------------------------------------------
-- Courses: final assessment + extras the admin form saves
-- ----------------------------------------------------------------------------
ALTER TABLE courses ADD COLUMN IF NOT EXISTS final_quiz JSONB DEFAULT '[]';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS youtube_url TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS prerequisites JSONB DEFAULT '[]';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS outcomes JSONB DEFAULT '[]';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0;

-- ----------------------------------------------------------------------------
-- Enrollments — one per user per course
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  progress INT DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_enrollments_user_course ON enrollments(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);

-- ----------------------------------------------------------------------------
-- Lesson progress — per-lesson completion, quiz score, time spent
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  quiz_score INT,
  time_spent_seconds INT DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- The API upserts by (user_id, lesson_id) — enforce it at the DB level too.
CREATE UNIQUE INDEX IF NOT EXISTS uq_lesson_progress_user_lesson ON lesson_progress(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_course ON lesson_progress(user_id, course_id);

-- Time tracking added later — ensure it exists even on older tables.
ALTER TABLE lesson_progress ADD COLUMN IF NOT EXISTS time_spent_seconds INT DEFAULT 0;
ALTER TABLE lesson_progress ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMPTZ;

-- ----------------------------------------------------------------------------
-- Certificates — publicly verifiable via /verify/[number]
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certificate_number TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE SET NULL,
  recipient_name TEXT,
  course_title TEXT,
  score NUMERIC(5,2),
  issue_date DATE DEFAULT CURRENT_DATE,
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_course ON certificates(course_id);

-- ----------------------------------------------------------------------------
-- XP / streak support used by lesson completion
-- ----------------------------------------------------------------------------
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

-- add_xp RPC used by awardXp() (idempotent create-or-replace)
CREATE OR REPLACE FUNCTION add_xp(uid UUID, amount INT)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles SET xp_points = COALESCE(xp_points, 0) + amount WHERE id = uid;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- Admin content columns other forms rely on (same class of bug)
-- ----------------------------------------------------------------------------
ALTER TABLE skills ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#3B82F6';
ALTER TABLE site_stats ADD COLUMN IF NOT EXISTS suffix TEXT DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS screenshots JSONB DEFAULT '[]';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS year TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS role TEXT;

-- ----------------------------------------------------------------------------
-- RLS: enable on the learning tables (the app uses the service-role client,
-- which bypasses RLS — this only closes direct anonymous access).
-- ----------------------------------------------------------------------------
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_xp_events ENABLE ROW LEVEL SECURITY;
