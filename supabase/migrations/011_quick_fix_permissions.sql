-- Quick fix: Run this immediately to fix permissions
-- This ensures PostgREST can see and access the tables

-- 1. Ensure api schema exists and has proper grants
CREATE SCHEMA IF NOT EXISTS api;
GRANT USAGE ON SCHEMA api TO anon;
GRANT USAGE ON SCHEMA api TO authenticated;
GRANT USAGE ON SCHEMA api TO service_role;

-- 2. Grant permissions on startup table (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'api' AND table_name = 'startup') THEN
        GRANT SELECT, INSERT, UPDATE, DELETE ON api.startup TO anon;
        GRANT SELECT, INSERT, UPDATE, DELETE ON api.startup TO authenticated;
        RAISE NOTICE 'Permissions granted on api.startup';
    ELSE
        RAISE WARNING 'api.startup table does not exist!';
    END IF;
END $$;

-- 3. Grant permissions on investor table (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'api' AND table_name = 'investor') THEN
        GRANT SELECT, INSERT, UPDATE, DELETE ON api.investor TO anon;
        GRANT SELECT, INSERT, UPDATE, DELETE ON api.investor TO authenticated;
        RAISE NOTICE 'Permissions granted on api.investor';
    ELSE
        RAISE WARNING 'api.investor table does not exist!';
    END IF;
END $$;

-- 4. Verify the setup
SELECT 
    'Verification' AS check_type,
    CASE 
        WHEN EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'api' AND table_name = 'startup')
        THEN '✓ startup table exists'
        ELSE '✗ startup table MISSING'
    END AS startup_status,
    CASE 
        WHEN EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'api' AND table_name = 'investor')
        THEN '✓ investor table exists'
        ELSE '✗ investor table MISSING'
    END AS investor_status;

