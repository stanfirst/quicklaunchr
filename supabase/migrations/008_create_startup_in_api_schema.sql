-- Create startup table in api schema (since PostgREST only exposes api schema)
-- This is the solution if your PostgREST is configured to only use 'api' schema

-- Create api schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS api;

-- Create the startup table in api schema
CREATE TABLE IF NOT EXISTS api.startup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  CONSTRAINT startup_user_id_unique UNIQUE (user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS startup_user_id_idx ON api.startup(user_id);
CREATE INDEX IF NOT EXISTS startup_industry_idx ON api.startup(industry);
CREATE INDEX IF NOT EXISTS startup_business_type_idx ON api.startup(business_type);
CREATE INDEX IF NOT EXISTS startup_stage_idx ON api.startup(stage);
CREATE INDEX IF NOT EXISTS startup_product_is_live_idx ON api.startup(product_is_live);
CREATE INDEX IF NOT EXISTS startup_created_at_idx ON api.startup(created_at);
CREATE INDEX IF NOT EXISTS startup_founders_gin_idx ON api.startup USING GIN (founders);

-- Create trigger for updated_at
CREATE TRIGGER update_startup_updated_at
  BEFORE UPDATE ON api.startup
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE api.startup ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own startup data"
  ON api.startup
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own startup data"
  ON api.startup
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own startup data"
  ON api.startup
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own startup data"
  ON api.startup
  FOR DELETE
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT USAGE ON SCHEMA api TO anon, authenticated;
GRANT ALL ON api.startup TO anon, authenticated;

-- Create investor table in api schema as well
CREATE TABLE IF NOT EXISTS api.investor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  industries_interested_in TEXT[] DEFAULT '{}',
  business_type_interested_in business_type[] DEFAULT '{}',
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  CONSTRAINT investor_user_id_unique UNIQUE (user_id)
);

-- Create indexes for investor
CREATE INDEX IF NOT EXISTS investor_user_id_idx ON api.investor(user_id);
CREATE INDEX IF NOT EXISTS investor_email_idx ON api.investor(email);
CREATE INDEX IF NOT EXISTS investor_industries_gin_idx ON api.investor USING GIN (industries_interested_in);
CREATE INDEX IF NOT EXISTS investor_business_type_gin_idx ON api.investor USING GIN (business_type_interested_in);
CREATE INDEX IF NOT EXISTS investor_created_at_idx ON api.investor(created_at);

-- Create trigger for investor updated_at
CREATE TRIGGER update_investor_updated_at
  BEFORE UPDATE ON api.investor
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on investor
ALTER TABLE api.investor ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for investor
CREATE POLICY "Users can read own investor data"
  ON api.investor
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investor data"
  ON api.investor
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own investor data"
  ON api.investor
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own investor data"
  ON api.investor
  FOR DELETE
  USING (auth.uid() = user_id);

-- Grant permissions for investor
GRANT ALL ON api.investor TO anon, authenticated;

