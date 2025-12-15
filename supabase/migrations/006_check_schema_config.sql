-- Check what schemas are available and PostgREST configuration
-- This will help diagnose the schema issue

-- Check all schemas
SELECT schema_name 
FROM information_schema.schemata 
ORDER BY schema_name;

-- Check if 'api' schema exists
SELECT EXISTS (
    SELECT 1 
    FROM information_schema.schemata 
    WHERE schema_name = 'api'
) AS api_schema_exists;

-- Check current search_path
SHOW search_path;

-- Check PostgREST configuration (if accessible)
-- Note: This might not work depending on permissions
SELECT 
    name,
    setting
FROM pg_settings
WHERE name LIKE '%search_path%' OR name LIKE '%schema%';

-- Check where startup table actually is
SELECT 
    table_schema,
    table_name
FROM information_schema.tables
WHERE table_name = 'startup';

-- If api schema doesn't exist, we might need to create it or move tables
-- Or check if there's a schema alias configured

