"use client";

import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database";

export const supabaseBrowserClient = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

