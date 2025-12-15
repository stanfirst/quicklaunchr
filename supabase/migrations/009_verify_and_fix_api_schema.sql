-- Comprehensive verification and fix for api schema tables
-- Run this to verify everything is set up correctly

-- 1. Verify api schema exists
SELECT EXISTS (
    SELECT 1 FROM information_schema.schemata WHERE schema_name = 'api'
) AS api_schema_exists;

-- 2. Check if startup table exists in api schema
SELECT 
    table_schema,
    table_name,
    table_type
FROM information_schema.tables
WHERE table_name = 'startup'
AND table_schema = 'api';

-- 3. Check if investor table exists in api schema
SELECT 
    table_schema,
    table_name,
    table_type
FROM information_schema.tables
WHERE table_name = 'investor'
AND table_schema = 'api';

-- 4. Verify permissions on api schema
SELECT 
    grantee,
    privilege_type
FROM information_schema.schema_privileges
WHERE schema_name = 'api'
AND grantee IN ('anon', 'authenticated');

-- 5. Verify table permissions
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_name IN ('startup', 'investor')
AND table_schema = 'api'
ORDER BY table_name, grantee;

-- 6. Fix permissions if needed (uncomment if permissions are missing)
-- GRANT USAGE ON SCHEMA api TO anon, authenticated;
-- GRANT ALL ON api.startup TO anon, authenticated;
-- GRANT ALL ON api.investor TO anon, authenticated;

-- 7. Verify RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename IN ('startup', 'investor')
AND schemaname = 'api';

-- 8. List all policies
SELECT 
    schemaname,
    tablename,
    policyname
FROM pg_policies
WHERE tablename IN ('startup', 'investor')
AND schemaname = 'api';

