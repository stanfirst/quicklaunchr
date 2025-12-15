/**
 * Environment variable validation and type definitions
 */

/**
 * Validates that all required Supabase environment variables are present
 */
export function validateSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }

  if (!supabaseAnonKey) {
    throw new Error('Missing SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variable');
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
  };
}

/**
 * Get Supabase environment variables with type safety
 */
export function getSupabaseEnv() {
  return validateSupabaseEnv();
}

