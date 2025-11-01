# Supabase Integration - Quick Start

## Your Supabase Project

- **Project URL:** https://riimwxyjsqatyvttdajp.supabase.co
- **Database:** PostgreSQL on db.riimwxyjsqatyvttdajp.supabase.co:5432

## Setup Steps

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 2. Get API Keys from Supabase Dashboard

1. Visit: https://supabase.com/dashboard/project/riimwxyjsqatyvttdajp
2. Go to **Settings** → **API**
3. Copy:
   - `anon/public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Keep secret!

### 3. Create `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://riimwxyjsqatyvttdajp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaW13eHlqc3FhdHl2dHRkYWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNDc0NTIsImV4cCI6MjA3NTgyMzQ1Mn0.rpSqlb0zntTYSe6-gHWmHUTZajU7cCaXzqFuahQdcJs
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaW13eHlqc3FhdHl2dHRkYWpwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDI0NzQ1MiwiZXhwIjoyMDc1ODIzNDUyfQ.WsqYZyS2IxDiUUG6Xfrf07oSx99cjcoKKqMw1fZVklk
DATABASE_URL=postgresql://postgres:[J_@sra@1996]@db.riimwxyjsqatyvttdajp.supabase.co:5432/postgres
```

### 4. Create Database Tables

Run the SQL schema in Supabase SQL Editor:
- See `lib/supabase/client.ts` for complete schema
- Includes: listings, forum_threads, forum_posts, forum_users tables
- Includes: indexes and RPC functions

### 5. Enable API Routes

Uncomment Supabase queries in:
- `app/api/listings/[country]/route.ts`
- `app/api/forums/[country]/route.ts`
- `app/api/forums/[country]/[thread]/route.ts`

All routes are ready with commented Supabase code!

