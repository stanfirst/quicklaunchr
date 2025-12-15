'use server';

import { createClient } from '@/lib/supabase/server';
import type { StartupFormData } from '@/lib/types/startup';

/**
 * Creates a startup profile in the startup table
 * 
 * @param formData - The startup form data
 */
export async function createStartupProfile(formData: StartupFormData) {
  console.log('[createStartupProfile] Function called');
  console.log('[createStartupProfile] Form data received:', {
    name: formData.name,
    industry: formData.industry,
    business_type: formData.business_type,
    founders_count: formData.founders.length,
  });

  const supabase = await createClient();
  console.log('[createStartupProfile] Supabase client created');

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  console.log('[createStartupProfile] User check:', {
    hasUser: !!user,
    userId: user?.id,
    userError: userError ? {
      message: userError.message,
      status: userError.status,
    } : null,
  });

  if (userError || !user) {
    console.error('[createStartupProfile] User authentication failed:', userError);
    throw new Error('You must be logged in to create a startup profile');
  }

  // Check if user already has a startup profile
  console.log('[createStartupProfile] Checking for existing startup profile...');
  const { data: existingStartup, error: checkError } = await supabase
      .schema('api')
      .from('startup')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  console.log('[createStartupProfile] Existing startup check result:', {
    existingStartup,
    checkError: checkError ? {
      code: checkError.code,
      message: checkError.message,
      details: checkError.details,
      hint: checkError.hint,
    } : null,
  });

  // PGRST116 means no rows found - that's fine, continue
  // PGRST106 means table doesn't exist - we'll let the insert handle that error
  if (checkError && checkError.code !== 'PGRST116' && checkError.code !== 'PGRST106') {
    console.error('[createStartupProfile] Error checking existing startup:', checkError);
    throw new Error(`Failed to check existing profile: ${checkError.message}`);
  }

  // If table doesn't exist (PGRST106), existingStartup will be null, which is fine
  // We'll proceed and let the insert throw a clear error about missing table
  if (existingStartup) {
    console.log('[createStartupProfile] User already has a startup profile');
    throw new Error('You already have a startup profile. Please update it instead.');
  }

  // Prepare the data for insertion
  console.log('[createStartupProfile] Preparing data for insertion...');
  const startupData = {
    user_id: user.id,
    name: formData.name.trim(),
    date_of_incorporation: formData.date_of_incorporation || null,
    registration_id: formData.registration_id.trim() || null,
    gst_no: formData.gst_no.trim().toUpperCase() || null,
    business_pan_number: formData.business_pan_number.trim().toUpperCase() || null,
    industry: formData.industry.trim(),
    business_type: formData.business_type,
    description: formData.description.trim(),
    revenue: formData.revenue ? parseFloat(formData.revenue) : null,
    stage: formData.stage,
    product_is_live: formData.product_is_live,
    investment_raised: formData.investment_raised ? parseFloat(formData.investment_raised) : null,
    current_valuation: formData.current_valuation ? parseFloat(formData.current_valuation) : null,
    ask_value: formData.ask_value ? parseFloat(formData.ask_value) : null,
    founders: formData.founders.map(founder => ({
      name: founder.name.trim(),
      email: founder.email.trim().toLowerCase(),
      linkedin: founder.linkedin.trim() || null,
      years_of_experience: founder.years_of_experience || 0,
      field_of_expertise: founder.field_of_expertise.trim(),
    })),
  };

  console.log('[createStartupProfile] Prepared startup data:', {
    user_id: startupData.user_id,
    name: startupData.name,
    industry: startupData.industry,
    business_type: startupData.business_type,
    stage: startupData.stage,
    founders_count: startupData.founders.length,
    has_revenue: !!startupData.revenue,
    has_valuation: !!startupData.current_valuation,
  });

  console.log('[createStartupProfile] Attempting to insert into startup table...');
  const { data, error } = await supabase
      .schema('api')
      .from('startup')
    .insert(startupData)
    .select()
    .single();

  console.log('[createStartupProfile] Insert result:', {
    hasData: !!data,
    dataId: data?.id,
    error: error ? {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    } : null,
  });

  if (error) {
    console.error('[createStartupProfile] Error creating startup profile:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
      error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    });
    
    // PGRST106 means the table/schema doesn't exist - likely migrations haven't been run
    if (error.code === 'PGRST106') {
      console.error('[createStartupProfile] PGRST106 Error - Table/schema not found. Details:', {
        errorMessage: error.message,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        suggestion: 'Check if table exists in api schema and has proper permissions',
      });
      throw new Error(
        'The startup table does not exist. Please ensure you have run the database migrations. ' +
        'Error: ' + (error.message || 'Schema not found')
      );
    }
    
    const errorMessage = error.message || error.details || error.hint || 'Unknown error occurred';
    throw new Error(`Failed to create startup profile: ${errorMessage}`);
  }

  console.log('[createStartupProfile] Successfully created startup profile:', {
    id: data?.id,
    name: data?.name,
  });

  return data;
}

/**
 * Gets the startup profile for the current user
 */
export async function getStartupProfile() {
  console.log('[getStartupProfile] Function called');
  const supabase = await createClient();

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  console.log('[getStartupProfile] User check:', {
    hasUser: !!user,
    userId: user?.id,
    userError: userError ? { message: userError.message } : null,
  });

  if (userError || !user) {
    console.error('[getStartupProfile] User authentication failed:', userError);
    throw new Error('You must be logged in to view your startup profile');
  }

  console.log('[getStartupProfile] Fetching startup profile for user:', user.id);
  const { data, error } = await supabase
      .schema('api')
      .from('startup')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  console.log('[getStartupProfile] Fetch result:', {
    hasData: !!data,
    dataId: data?.id,
    error: error ? {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    } : null,
  });

  if (error) {
    // PGRST106 means table doesn't exist - migrations haven't been run
    if (error.code === 'PGRST106') {
      console.error('[getStartupProfile] PGRST106 Error - Table/schema not found');
      throw new Error(
        'The startup table does not exist. Please ensure you have run the database migrations. ' +
        'Error: ' + (error.message || 'Schema not found')
      );
    }

    // PGRST116 means no rows found - that's fine, return null
    if (error.code === 'PGRST116') {
      console.log('[getStartupProfile] No startup profile found (PGRST116)');
      return null;
    }

    console.error('[getStartupProfile] Error fetching startup profile:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
      error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });
    
    const errorMessage = error.message || error.details || error.hint || JSON.stringify(error) || 'Unknown error occurred';
    throw new Error(`Failed to fetch startup profile: ${errorMessage}`);
  }

  // maybeSingle returns null if no rows found, which is what we want
  console.log('[getStartupProfile] Successfully fetched startup profile');
  return data;
}

/**
 * Gets all startups (public access)
 */
export async function getAllStartups() {
  console.log('[getAllStartups] Function called');
  const supabase = await createClient();

  console.log('[getAllStartups] Fetching all startups...');
  const { data, error } = await supabase
    .schema('api')
    .from('startup')
    .select('id, name, industry, business_type, stage, description, product_is_live, current_valuation, ask_value, created_at')
    .order('created_at', { ascending: false });

  console.log('[getAllStartups] Fetch result:', {
    count: data?.length || 0,
    error: error ? {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    } : null,
  });

  if (error) {
    // PGRST106 means table doesn't exist - migrations haven't been run
    if (error.code === 'PGRST106') {
      console.error('[getAllStartups] PGRST106 Error - Table/schema not found');
      throw new Error(
        'The startup table does not exist. Please ensure you have run the database migrations. ' +
        'Error: ' + (error.message || 'Schema not found')
      );
    }

    console.error('[getAllStartups] Error fetching startups:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
      error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });
    
    const errorMessage = error.message || error.details || error.hint || JSON.stringify(error) || 'Unknown error occurred';
    throw new Error(`Failed to fetch startups: ${errorMessage}`);
  }

  console.log('[getAllStartups] Successfully fetched startups');
  return data || [];
}

/**
 * Gets a startup by ID (public access)
 */
export async function getStartupById(id: string) {
  console.log('[getStartupById] Function called with id:', id);
  const supabase = await createClient();

  console.log('[getStartupById] Fetching startup with id:', id);
  const { data, error } = await supabase
    .schema('api')
    .from('startup')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  console.log('[getStartupById] Fetch result:', {
    hasData: !!data,
    dataId: data?.id,
    error: error ? {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    } : null,
  });

  if (error) {
    // PGRST106 means table doesn't exist - migrations haven't been run
    if (error.code === 'PGRST106') {
      console.error('[getStartupById] PGRST106 Error - Table/schema not found');
      throw new Error(
        'The startup table does not exist. Please ensure you have run the database migrations. ' +
        'Error: ' + (error.message || 'Schema not found')
      );
    }

    // PGRST116 means no rows found - that's fine, return null
    if (error.code === 'PGRST116') {
      console.log('[getStartupById] No startup found (PGRST116)');
      return null;
    }

    console.error('[getStartupById] Error fetching startup:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
      error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });
    
    const errorMessage = error.message || error.details || error.hint || JSON.stringify(error) || 'Unknown error occurred';
    throw new Error(`Failed to fetch startup: ${errorMessage}`);
  }

  // maybeSingle returns null if no rows found, which is what we want
  console.log('[getStartupById] Successfully fetched startup');
  return data;
}

