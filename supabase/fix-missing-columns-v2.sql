-- Add missing columns that admin forms need but schema lacks
-- Run this in Supabase Dashboard > SQL Editor

-- Skills: missing 'color' column
ALTER TABLE skills ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#3B82F6';

-- Site Stats: missing 'suffix' column
ALTER TABLE site_stats ADD COLUMN IF NOT EXISTS suffix TEXT DEFAULT '';

-- Lessons: missing 'quiz' column
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS quiz JSONB DEFAULT '[]';

-- Courses: missing 'youtube_url' column
ALTER TABLE courses ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- Lessons: missing 'type' column (text, video, quiz, mixed)
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'text';

-- Lessons: missing 'resources' column
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS resources JSONB DEFAULT '[]';
