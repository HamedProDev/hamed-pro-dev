-- Add missing columns to organizations
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS is_hiring BOOLEAN DEFAULT false;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS tech_stack TEXT[] DEFAULT '{}';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS team_roles INT DEFAULT 0;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS team_size TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS location TEXT;

-- Add missing column to lessons
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false;

-- Add missing columns to courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'free';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS enrolled INT DEFAULT 0;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1) DEFAULT 0;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS prerequisites JSONB DEFAULT '[]';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS outcomes JSONB DEFAULT '[]';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]';

-- Add missing columns to blog_posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]';
