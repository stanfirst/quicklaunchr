-- Diagnostic query to verify startup table exists and is accessible
-- Run this in Supabase SQL Editor to verify the table setup

-- Check if table exists in api schema
SELECT 
    table_schema,
    table_name,
    table_type
FROM information_schema.tables
WHERE table_name = 'startup'
AND table_schema = 'api';

-- Check table structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'api'
AND table_name = 'startup'
ORDER BY ordinal_position;

-- Verify RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'startup'
AND schemaname = 'api';

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'startup'
AND schemaname = 'api';

-- Grant necessary permissions (if needed)
-- Uncomment these if the table exists but isn't accessible
-- GRANT USAGE ON SCHEMA api TO anon, authenticated;
-- GRANT ALL ON api.startup TO anon, authenticated;
-- ALTER TABLE api.startup ENABLE ROW LEVEL SECURITY;

