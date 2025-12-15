-- Fix permissions for startup and investor tables in api schema
-- Run this if you're getting PGRST106 errors even though the tables exist

-- Grant schema usage
GRANT USAGE ON SCHEMA api TO anon, authenticated;

-- Grant table permissions
GRANT ALL ON api.startup TO anon, authenticated;
GRANT ALL ON api.investor TO anon, authenticated;

-- Verify the grants
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_name IN ('startup', 'investor')
AND table_schema = 'api'
ORDER BY table_name, grantee;

