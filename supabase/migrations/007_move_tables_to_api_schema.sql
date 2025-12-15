-- Option 1: Move tables to api schema (if api schema exists)
-- First, create api schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS api;

-- Move startup table to api schema
-- Note: This will drop the existing table and recreate it
-- Make sure to backup data first if you have any!

-- Step 1: Create the table in api schema
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

-- Step 2: Copy data from public.startup to api.startup (if data exists)
-- Uncomment and run if you have existing data:
-- INSERT INTO api.startup SELECT * FROM public.startup;

-- Step 3: Create indexes
CREATE INDEX IF NOT EXISTS startup_user_id_idx ON api.startup(user_id);
CREATE INDEX IF NOT EXISTS startup_industry_idx ON api.startup(industry);
CREATE INDEX IF NOT EXISTS startup_business_type_idx ON api.startup(business_type);
CREATE INDEX IF NOT EXISTS startup_stage_idx ON api.startup(stage);
CREATE INDEX IF NOT EXISTS startup_product_is_live_idx ON api.startup(product_is_live);
CREATE INDEX IF NOT EXISTS startup_created_at_idx ON api.startup(created_at);
CREATE INDEX IF NOT EXISTS startup_founders_gin_idx ON api.startup USING GIN (founders);

-- Step 4: Create trigger for updated_at
CREATE TRIGGER update_startup_updated_at
  BEFORE UPDATE ON api.startup
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 5: Enable RLS
ALTER TABLE api.startup ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies
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

-- Step 7: Grant permissions
GRANT USAGE ON SCHEMA api TO anon, authenticated;
GRANT ALL ON api.startup TO anon, authenticated;

-- Step 8: Drop old table (ONLY after verifying new table works!)
-- DROP TABLE IF EXISTS public.startup CASCADE;

