'use server';

import { createClient } from '@/lib/supabase/server';
import type { StartupFormData } from '@/lib/types/startup';

/**
 * Creates a startup profile in the startup table
 * 
 * @param formData - The startup form data
 */
export async function createStartupProfile(formData: StartupFormData) {
  const supabase = await createClient();

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('You must be logged in to create a startup profile');
  }

  // Check if user already has a startup profile
  const { data: existingStartup, error: checkError } = await supabase
      .schema('api')
      .from('startup')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  // PGRST116 means no rows found - that's fine, continue
  // PGRST106 means table doesn't exist - we'll let the insert handle that error
  if (checkError && checkError.code !== 'PGRST116' && checkError.code !== 'PGRST106') {
    throw new Error(`Failed to check existing profile: ${checkError.message}`);
  }

  // If table doesn't exist (PGRST106), existingStartup will be null, which is fine
  // We'll proceed and let the insert throw a clear error about missing table
  if (existingStartup) {
    throw new Error('You already have a startup profile. Please update it instead.');
  }

  // Prepare the data for insertion
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

  const { data, error } = await supabase
      .schema('api')
      .from('startup')
    .insert(startupData)
    .select()
    .single();

  if (error) {
    // PGRST106 means the table/schema doesn't exist - likely migrations haven't been run
    if (error.code === 'PGRST106') {
      throw new Error(
        'The startup table does not exist. Please ensure you have run the database migrations. ' +
        'Error: ' + (error.message || 'Schema not found')
      );
    }
    
    const errorMessage = error.message || error.details || error.hint || 'Unknown error occurred';
    throw new Error(`Failed to create startup profile: ${errorMessage}`);
  }

  return data;
}

/**
 * Gets the startup profile for the current user
 */
export async function getStartupProfile() {
  const supabase = await createClient();

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('You must be logged in to view your startup profile');
  }

  const { data, error } = await supabase
      .schema('api')
      .from('startup')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    // PGRST106 means table doesn't exist - migrations haven't been run
    if (error.code === 'PGRST106') {
      throw new Error(
        'The startup table does not exist. Please ensure you have run the database migrations. ' +
        'Error: ' + (error.message || 'Schema not found')
      );
    }

    // PGRST116 means no rows found - that's fine, return null
    if (error.code === 'PGRST116') {
      return null;
    }

    const errorMessage = error.message || error.details || error.hint || JSON.stringify(error) || 'Unknown error occurred';
    throw new Error(`Failed to fetch startup profile: ${errorMessage}`);
  }

  // maybeSingle returns null if no rows found, which is what we want
  return data;
}

/**
 * Gets all startups (public access)
 */
export async function getAllStartups() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema('api')
    .from('startup')
    .select('id, name, industry, business_type, stage, description, product_is_live, current_valuation, ask_value, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    // PGRST106 means table doesn't exist - migrations haven't been run
    if (error.code === 'PGRST106') {
      throw new Error(
        'The startup table does not exist. Please ensure you have run the database migrations. ' +
        'Error: ' + (error.message || 'Schema not found')
      );
    }

    const errorMessage = error.message || error.details || error.hint || JSON.stringify(error) || 'Unknown error occurred';
    throw new Error(`Failed to fetch startups: ${errorMessage}`);
  }

  return data || [];
}

/**
 * Gets a startup by ID (public access)
 */
export async function getStartupById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema('api')
    .from('startup')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    // PGRST106 means table doesn't exist - migrations haven't been run
    if (error.code === 'PGRST106') {
      throw new Error(
        'The startup table does not exist. Please ensure you have run the database migrations. ' +
        'Error: ' + (error.message || 'Schema not found')
      );
    }

    // PGRST116 means no rows found - that's fine, return null
    if (error.code === 'PGRST116') {
      return null;
    }

    const errorMessage = error.message || error.details || error.hint || JSON.stringify(error) || 'Unknown error occurred';
    throw new Error(`Failed to fetch startup: ${errorMessage}`);
  }

  // maybeSingle returns null if no rows found, which is what we want
  return data;
}

