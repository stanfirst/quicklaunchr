/**
 * Example database operations
 * 
 * This file demonstrates how to create database operations.
 * Replace or remove this file once you have your actual database operations.
 */

import { createClient } from '@/lib/supabase/server';

/**
 * Example: Fetch all records from a table
 * 
 * Replace 'example_table' with your actual table name
 */
export async function getExamples() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('example_table')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching examples:', error);
    throw new Error(`Failed to fetch examples: ${error.message}`);
  }

  return data;
}

/**
 * Example: Fetch a single record by ID
 */
export async function getExampleById(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('example_table')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching example:', error);
    throw new Error(`Failed to fetch example: ${error.message}`);
  }

  return data;
}

/**
 * Example: Create a new record
 */
export async function createExample(exampleData: Record<string, unknown>) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('example_table')
    .insert(exampleData)
    .select()
    .single();

  if (error) {
    console.error('Error creating example:', error);
    throw new Error(`Failed to create example: ${error.message}`);
  }

  return data;
}

/**
 * Example: Update a record
 */
export async function updateExample(id: string, updates: Record<string, unknown>) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('example_table')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating example:', error);
    throw new Error(`Failed to update example: ${error.message}`);
  }

  return data;
}

/**
 * Example: Delete a record
 */
export async function deleteExample(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('example_table')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting example:', error);
    throw new Error(`Failed to delete example: ${error.message}`);
  }

  return { success: true };
}

