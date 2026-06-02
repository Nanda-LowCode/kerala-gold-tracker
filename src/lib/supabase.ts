import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/** Read-only client using anon key — safe for server-component queries */
export function createSupabaseReadClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/** Admin client using service role key — only use for cron writes */
export function createSupabaseAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
