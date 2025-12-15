# Supabase Configuration

This directory contains all Supabase-related configuration and utilities.

## Files

- `server.ts` - Server-side Supabase client creation
- `types.ts` - TypeScript type definitions for your database schema

## Usage

### In Server Components

```typescript
import { createServerClient } from '@/lib/supabase/server';

export default async function MyPage() {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('table').select('*');
  
  // Use data...
}
```

### In Server Actions

```typescript
'use server';

import { createServerClient } from '@/lib/supabase/server';

export async function myAction() {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('table').insert({...});
  
  return { success: !error, data };
}
```

## Generating Types

To generate TypeScript types from your Supabase schema:

```bash
npx supabase gen types typescript --project-id <your-project-id> > lib/supabase/types.ts
```

Or if you have the Supabase CLI installed:

```bash
supabase gen types typescript --local > lib/supabase/types.ts
```

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key (preferred for server-side)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Fallback if SUPABASE_ANON_KEY is not set

