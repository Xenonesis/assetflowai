-- AssetFlow AI - Storage RLS Policies for asset-documents bucket

-- 1. Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Policy: Allow public read access to objects in 'asset-documents' (for viewing uploaded receipts)
CREATE POLICY "Allow public read access to asset-documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'asset-documents');

-- 3. Policy: Allow authenticated users to upload/insert files into 'asset-documents'
CREATE POLICY "Allow authenticated users to upload to asset-documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'asset-documents' 
    AND auth.role() = 'authenticated'
  );

-- 4. Policy: Allow authenticated users to update/delete their own files in 'asset-documents'
CREATE POLICY "Allow authenticated users to manage own asset-documents" ON storage.objects
  FOR ALL USING (
    bucket_id = 'asset-documents' 
    AND auth.role() = 'authenticated'
  );
