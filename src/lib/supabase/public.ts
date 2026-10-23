import { createClient } from "@supabase/supabase-js";

let publicClient: ReturnType<typeof createClient> | null = null;

/**
 * Returns a lightweight public Supabase client for reading public data.
 * Does not read or write cookies, enabling ISR and Next.js static caching.
 */
export function getPublicSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  if (!publicClient) {
    publicClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return publicClient;
}
