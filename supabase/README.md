# Supabase Migrations

This directory contains SQL migration files for your Supabase database.

## Running Migrations

### Option 1: Using Supabase Dashboard (Recommended for Quick Setup)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of the migration file
4. Paste and run the SQL

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Link your project (if not already linked)
supabase link --project-ref <your-project-ref>

# Run migrations
supabase db push
```

### Option 3: Using Supabase Migration Tool

```bash
# Apply a specific migration
psql <your-connection-string> -f supabase/migrations/001_create_users_table.sql
```

## Migration Files

- `001_create_users_table.sql` - Creates the users table with role and userType columns

## Notes

- Always backup your database before running migrations in production
- Test migrations in a development environment first
- The migrations include Row Level Security (RLS) policies - adjust them based on your needs

