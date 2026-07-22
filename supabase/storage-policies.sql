-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'uploads');

-- Allow public access to view files
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'uploads');

-- Allow users to update their own files
CREATE POLICY "Authenticated users can update their images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');

-- Allow users to delete their own files
CREATE POLICY "Authenticated users can delete their images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');
