# Database Operations

This directory contains all database operation functions.

## Structure

- Each table or feature should have its own file (e.g., `users.ts`, `posts.ts`)
- All functions should use the `createClient()` from `@/lib/supabase/server` (it's async!)
- All operations are server-side only

## Example Usage

```typescript
// lib/db/users.ts
import { createClient } from '@/lib/supabase/server';

export async function getUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*');
  
  if (error) throw error;
  return data;
}
```

## Available Operations

### Users (`users.ts`)

- `getUsers(filters?)` - Get all users with optional role/userType filters
- `getUserById(id)` - Get a user by ID
- `getUserByEmail(email)` - Get a user by email
- `createUser(userData)` - Create a new user
- `updateUser(id, updates)` - Update a user
- `updateUserRole(id, role)` - Update user role (admin operation)
- `updateUserType(id, userType)` - Update user type
- `deleteUser(id)` - Delete a user
- `getUsersByRole(role)` - Get users by role
- `getUsersByType(userType)` - Get users by type

## Best Practices

1. Always handle errors appropriately
2. Use TypeScript types from `@/lib/supabase/types`
3. Keep functions focused and single-purpose
4. Export functions that can be used in Server Components and Server Actions
5. Remember: `createClient()` is async, so always use `await`

