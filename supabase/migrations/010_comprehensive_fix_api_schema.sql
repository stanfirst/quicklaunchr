-- Comprehensive fix for api schema - Run this to ensure everything is correct
-- This script will verify and fix all issues with the api schema setup

-- Step 1: Ensure api schema exists
CREATE SCHEMA IF NOT EXISTS api;

-- Step 2: Grant schema usage (critical for PostgREST)
GRANT USAGE ON SCHEMA api TO anon, authenticated;
GRANT USAGE ON SCHEMA api TO postgres, service_role;

-- Step 3: Verify startup table exists and fix if needed
DO $$
BEGIN
    -- Check if table exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'api' AND table_name = 'startup'
    ) THEN
        RAISE NOTICE 'startup table does not exist in api schema - you need to create it first';
    ELSE
        RAISE NOTICE 'startup table exists in api schema';
    END IF;
END $$;

-- Step 4: Grant ALL necessary permissions on startup table (if it exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'api' AND table_name = 'startup'
    ) THEN
        GRANT ALL ON api.startup TO anon, authenticated;
        GRANT ALL ON api.startup TO postgres, service_role;
        RAISE NOTICE 'Permissions granted on api.startup';
    END IF;
END $$;

-- Step 5: Grant ALL necessary permissions on investor table (if it exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'api' AND table_name = 'investor'
    ) THEN
        GRANT ALL ON api.investor TO anon, authenticated;
        GRANT ALL ON api.investor TO postgres, service_role;
        RAISE NOTICE 'Permissions granted on api.investor';
    END IF;
END $$;

-- Step 6: Verify what PostgREST can see
-- This query shows what tables are accessible via the API
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'api'
ORDER BY tablename;

-- Step 7: Show current permissions
SELECT 
    grantee,
    table_schema,
    table_name,
    string_agg(privilege_type, ', ' ORDER BY privilege_type) AS privileges
FROM information_schema.role_table_grants
WHERE table_schema = 'api'
AND table_name IN ('startup', 'investor')
GROUP BY grantee, table_schema, table_name
ORDER BY table_name, grantee;

-- Step 8: Important - Check if PostgREST schema is configured correctly
-- Note: This might require superuser access
SELECT 
    name,
    setting
FROM pg_settings
WHERE name = 'search_path'
OR name LIKE '%schema%';

-- Final verification query
SELECT 
    'Schema exists' AS check_type,
    EXISTS(SELECT 1 FROM information_schema.schemata WHERE schema_name = 'api') AS result
UNION ALL
SELECT 
    'startup table exists',
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'api' AND table_name = 'startup')
UNION ALL
SELECT 
    'investor table exists',
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'api' AND table_name = 'investor')
UNION ALL
SELECT 
    'anon has schema usage',
    EXISTS(
        SELECT 1 FROM information_schema.schema_privileges 
        WHERE schema_name = 'api' AND grantee = 'anon' AND privilege_type = 'USAGE'
    )
UNION ALL
SELECT 
    'authenticated has schema usage',
    EXISTS(
        SELECT 1 FROM information_schema.schema_privileges 
        WHERE schema_name = 'api' AND grantee = 'authenticated' AND privilege_type = 'USAGE'
    );

