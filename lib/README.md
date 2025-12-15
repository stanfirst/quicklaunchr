# Library Directory

This directory contains shared utilities and configurations for the application.

## Structure

```
lib/
├── supabase/          # Supabase configuration and utilities
│   ├── server.ts      # Server-side Supabase client
│   ├── types.ts       # Database TypeScript types
│   └── README.md      # Supabase documentation
├── db/                # Database operations
│   ├── example.ts     # Example database operations
│   └── README.md      # Database operations documentation
├── env.ts             # Environment variable validation
└── README.md          # This file
```

## Usage

### Supabase Client

All database operations use the server-side Supabase client:

```typescript
import { createServerClient } from '@/lib/supabase/server';

const supabase = createServerClient();
```

### Database Operations

Create database operation files in `lib/db/`:

```typescript
// lib/db/users.ts
import { createServerClient } from '@/lib/supabase/server';

export async function getUsers() {
  const supabase = createServerClient();
  // ... your query
}
```

### Environment Variables

Use the env validation utility:

```typescript
import { getSupabaseEnv } from '@/lib/env';

const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();
```

## Best Practices

1. **Server-Side Only**: All database operations should be server-side (Server Components, Server Actions, API Routes)
2. **Error Handling**: Always handle errors appropriately and provide meaningful error messages
3. **Type Safety**: Use TypeScript types from `@/lib/supabase/types` for type safety
4. **Organization**: Group related operations in the same file (e.g., all user operations in `users.ts`)

