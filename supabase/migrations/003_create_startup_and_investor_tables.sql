-- Create enum types for startup and investor related fields
CREATE TYPE business_stage AS ENUM ('idea', 'mvp', 'early_stage', 'growth', 'scaling', 'mature');
CREATE TYPE business_type AS ENUM ('b2b', 'b2c', 'b2b2c', 'marketplace', 'saas', 'ecommerce', 'fintech', 'healthtech', 'edtech', 'other');

-- Create api schema if it doesn't exist (PostgREST only exposes api schema)
CREATE SCHEMA IF NOT EXISTS api;

-- Create startup table in api schema
-- Note: user_id references auth.users(id) but we can't use foreign key constraint
-- on auth schema tables, so we use UUID and enforce via RLS policies
CREATE TABLE IF NOT EXISTS api.startup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- References auth.users(id)
  name TEXT NOT NULL,
  date_of_incorporation DATE,
  registration_id TEXT,
  gst_no TEXT,
  business_pan_number TEXT,
  industry TEXT,
  business_type business_type,
  description TEXT,
  revenue NUMERIC(15, 2),
  stage business_stage,
  product_is_live BOOLEAN DEFAULT false,
  investment_raised NUMERIC(15, 2),
  current_valuation NUMERIC(15, 2),
  founders JSONB DEFAULT '[]'::jsonb,
  ask_value NUMERIC(15, 2),
  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  -- Constraints
  CONSTRAINT startup_user_id_unique UNIQUE (user_id)
);

-- Create indexes for startup table
CREATE INDEX IF NOT EXISTS startup_user_id_idx ON api.startup(user_id);
CREATE INDEX IF NOT EXISTS startup_industry_idx ON api.startup(industry);
CREATE INDEX IF NOT EXISTS startup_business_type_idx ON api.startup(business_type);
CREATE INDEX IF NOT EXISTS startup_stage_idx ON api.startup(stage);
CREATE INDEX IF NOT EXISTS startup_product_is_live_idx ON api.startup(product_is_live);
CREATE INDEX IF NOT EXISTS startup_created_at_idx ON api.startup(created_at);

-- Create GIN index for JSONB founders array for efficient querying
CREATE INDEX IF NOT EXISTS startup_founders_gin_idx ON api.startup USING GIN (founders);

-- Create trigger to automatically update updated_at for startup table
CREATE TRIGGER update_startup_updated_at
  BEFORE UPDATE ON api.startup
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on startup table
ALTER TABLE api.startup ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own startup data
CREATE POLICY "Users can read own startup data"
  ON api.startup
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own startup data
CREATE POLICY "Users can insert own startup data"
  ON api.startup
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own startup data
CREATE POLICY "Users can update own startup data"
  ON api.startup
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own startup data
CREATE POLICY "Users can delete own startup data"
  ON api.startup
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create investor table in api schema
-- Note: user_id references auth.users(id) but we can't use foreign key constraint
-- on auth schema tables, so we use UUID and enforce via RLS policies
CREATE TABLE IF NOT EXISTS api.investor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- References auth.users(id)
  name TEXT NOT NULL,
  email TEXT,
  industries_interested_in TEXT[] DEFAULT '{}',
  business_type_interested_in business_type[] DEFAULT '{}',
  phone TEXT,
  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  -- Constraints
  CONSTRAINT investor_user_id_unique UNIQUE (user_id)
);

-- Create indexes for investor table
CREATE INDEX IF NOT EXISTS investor_user_id_idx ON api.investor(user_id);
CREATE INDEX IF NOT EXISTS investor_email_idx ON api.investor(email);
CREATE INDEX IF NOT EXISTS investor_industries_gin_idx ON api.investor USING GIN (industries_interested_in);
CREATE INDEX IF NOT EXISTS investor_business_type_gin_idx ON api.investor USING GIN (business_type_interested_in);
CREATE INDEX IF NOT EXISTS investor_created_at_idx ON api.investor(created_at);

-- Create trigger to automatically update updated_at for investor table
CREATE TRIGGER update_investor_updated_at
  BEFORE UPDATE ON api.investor
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on investor table
ALTER TABLE api.investor ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own investor data
CREATE POLICY "Users can read own investor data"
  ON api.investor
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own investor data
CREATE POLICY "Users can insert own investor data"
  ON api.investor
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own investor data
CREATE POLICY "Users can update own investor data"
  ON api.investor
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own investor data
CREATE POLICY "Users can delete own investor data"
  ON api.investor
  FOR DELETE
  USING (auth.uid() = user_id);

-- Grant necessary permissions for PostgREST API access
GRANT USAGE ON SCHEMA api TO anon, authenticated;
GRANT ALL ON api.startup TO anon, authenticated;
GRANT ALL ON api.investor TO anon, authenticated;

-- Add comments for documentation
COMMENT ON TABLE api.startup IS 'Stores detailed information about startups registered on the platform';
COMMENT ON COLUMN api.startup.founders IS 'JSONB array of founder objects with fields: name, email, linkedin, years_of_experience, field_of_expertise';
COMMENT ON TABLE api.investor IS 'Stores detailed information about investors registered on the platform';

