-- Add public read policy for startups
-- This allows anyone (including anonymous users) to read startup profiles
-- This is needed for the public startups listing and detail pages

-- Policy: Anyone can read startup data (public access)
CREATE POLICY "Public can read startup data"
  ON api.startup
  FOR SELECT
  USING (true);

-- Verify the policy was created
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'api' 
        AND tablename = 'startup' 
        AND policyname = 'Public can read startup data'
    ) THEN
        RAISE NOTICE '✓ Public read policy created successfully for api.startup';
    ELSE
        RAISE WARNING '✗ Failed to create public read policy for api.startup';
    END IF;
END $$;

