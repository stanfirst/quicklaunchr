/**
 * User database operations
 * 
 * DEPRECATED: This file is no longer used. We now use auth.users directly.
 * User metadata (user_type, role) is stored in auth.users.user_metadata.
 * 
 * All operations are server-side only and use the Supabase client.
 */

import { createClient } from '@/lib/supabase/server';
import type { Database, UserRole, UserType } from '@/lib/supabase/types';

type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

/**
 * Get all users
 * 
 * @param filters - Optional filters for role and userType
 * @returns Array of users
 */
export async function getUsers(filters?: {
  role?: UserRole;
  userType?: UserType;
}) {
  const supabase = await createClient();
  
  let query = supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.role) {
    query = query.eq('role', filters.role);
  }

  if (filters?.userType) {
    query = query.eq('user_type', filters.userType);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching users:', error);
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  return data;
}

/**
 * Get a single user by ID
 * 
 * @param id - User ID
 * @returns User object or null if not found
 */
export async function getUserById(id: string): Promise<User | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching user:', error);
    throw new Error(`Failed to fetch user: ${error.message}`);
  }

  return data;
}

/**
 * Get a user by email
 * 
 * @param email - User email
 * @returns User object or null if not found
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching user by email:', error);
    throw new Error(`Failed to fetch user: ${error.message}`);
  }

  return data;
}

/**
 * Create a new user
 * 
 * @param userData - User data to insert
 * @returns Created user object
 */
export async function createUser(userData: UserInsert): Promise<User> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return data;
}

/**
 * Update a user
 * 
 * @param id - User ID
 * @param updates - Fields to update
 * @returns Updated user object
 */
export async function updateUser(id: string, updates: UserUpdate): Promise<User> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating user:', error);
    throw new Error(`Failed to update user: ${error.message}`);
  }

  return data;
}

/**
 * Update user role (admin operation)
 * 
 * @param id - User ID
 * @param role - New role
 * @returns Updated user object
 */
export async function updateUserRole(id: string, role: UserRole): Promise<User> {
  return updateUser(id, { role });
}

/**
 * Update user type
 * 
 * @param id - User ID
 * @param userType - New user type
 * @returns Updated user object
 */
export async function updateUserType(id: string, userType: UserType): Promise<User> {
  return updateUser(id, { user_type: userType });
}

/**
 * Delete a user
 * 
 * @param id - User ID
 * @returns Success status
 */
export async function deleteUser(id: string): Promise<{ success: boolean }> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting user:', error);
    throw new Error(`Failed to delete user: ${error.message}`);
  }

  return { success: true };
}

/**
 * Get users by role
 * 
 * @param role - User role
 * @returns Array of users with the specified role
 */
export async function getUsersByRole(role: UserRole): Promise<User[]> {
  return getUsers({ role });
}

/**
 * Get users by type
 * 
 * @param userType - User type
 * @returns Array of users with the specified type
 */
export async function getUsersByType(userType: UserType): Promise<User[]> {
  return getUsers({ userType });
}

