-- Add missing columns to organizations
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS is_hiring BOOLEAN DEFAULT false;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS tech_stack TEXT[] DEFAULT '{}';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS team_roles INT DEFAULT 0;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS team_size TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS location TEXT;

-- Add missing column to lessons
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false;
