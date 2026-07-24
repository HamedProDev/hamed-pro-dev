-- Ensure uploads bucket exists and is public
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies to allow re-running
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated insert access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete access" ON storage.objects;

-- Allow public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

-- Allow uploads for any authenticated request
CREATE POLICY "Authenticated insert access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'uploads');

-- Allow updates
CREATE POLICY "Authenticated update access"
ON storage.objects FOR UPDATE
USING (bucket_id = 'uploads');

-- Allow deletes
CREATE POLICY "Authenticated delete access"
ON storage.objects FOR DELETE
USING (bucket_id = 'uploads');
