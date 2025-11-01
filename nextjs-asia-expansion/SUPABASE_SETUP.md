# Supabase Setup Guide for Autoilty.com

## Connection Details

Your Supabase project:
- **Project URL:** https://riimwxyjsqatyvttdajp.supabase.co
- **Project Reference:** riimwxyjsqatyvttdajp
- **PostgreSQL URI:** postgresql://postgres:[J_@sra@1996]@db.riimwxyjsqatyvttdajp.supabase.co:5432/postgres

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://riimwxyjsqatyvttdajp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaW13eHlqc3FhdHl2dHRkYWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNDc0NTIsImV4cCI6MjA3NTgyMzQ1Mn0.rpSqlb0zntTYSe6-gHWmHUTZajU7cCaXzqFuahQdcJs
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaW13eHlqc3FhdHl2dHRkYWpwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDI0NzQ1MiwiZXhwIjoyMDc1ODIzNDUyfQ.WsqYZyS2IxDiUUG6Xfrf07oSx99cjcoKKqMw1fZVklk
DATABASE_URL=postgresql://postgres:[J_@sra@1996]@db.riimwxyjsqatyvttdajp.supabase.co:5432/postgres
```

## Getting Your API Keys

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/riimwxyjsqatyvttdajp
2. Navigate to **Settings** → **API**
3. Copy:
   - **Project URL** (already configured: https://riimwxyjsqatyvttdajp.supabase.co)
   - **anon/public key** (already configured)
   - **service_role key** (already configured - keep secret! Only use server-side)

## Database Schema

Run the SQL schema provided in `lib/supabase/client.ts` in your Supabase SQL Editor.

## Installation

```bash
npm install @supabase/supabase-js
```

## Usage

The Supabase client is already configured in `lib/supabase/client.ts`:

```typescript
import { supabase } from '@/lib/supabase/client'; // Client-side
import { supabaseAdmin } from '@/lib/supabase/client'; // Server-side
```

## Direct PostgreSQL Access

For advanced queries or migrations, use the PostgreSQL connection:

```bash
npm install pg @types/pg
```

Then uncomment the code in `lib/db/postgres.ts`.

## Next Steps

1. ✅ Copy `.env.local.example` to `.env.local`
2. ✅ Add your Supabase API keys
3. ✅ Run the database schema SQL in Supabase SQL Editor
4. ✅ Update API routes to uncomment Supabase queries
5. ✅ Test endpoints

