-- Allow service role to upload to uploads bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

-- Allow authenticated uploads via service role
CREATE POLICY "Authenticated insert access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'uploads');

-- Allow authenticated updates
CREATE POLICY "Authenticated update access"
ON storage.objects FOR UPDATE
USING (bucket_id = 'uploads');

-- Allow authenticated deletes
CREATE POLICY "Authenticated delete access"
ON storage.objects FOR DELETE
USING (bucket_id = 'uploads');
