import "server-only";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import type { Database } from "@/types/database";

export const createSupabaseServerClient = () => {
  const cookieStore = cookies();
  const headerStore = headers();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 });
        }
      },
      global: {
        headers: {
          "X-Forwarded-For": headerStore.get("x-forwarded-for") ?? "",
          "X-Client-Info": "autoilty-nextjs-server"
        }
      }
    }
  );
};


