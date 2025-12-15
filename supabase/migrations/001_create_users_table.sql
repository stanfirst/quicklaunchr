-- Create enum types for userType (stored in auth.users metadata)
-- Note: We use auth.users table directly, user_type will be stored in user_metadata
CREATE TYPE user_type AS ENUM ('startup', 'investor');

-- Create function to automatically update updated_at timestamp
-- This will be used by other tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: We use auth.users table directly for user authentication
-- user_type and role are stored in auth.users.user_metadata
-- No separate users table is needed

