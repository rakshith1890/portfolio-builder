import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client for fully public, cacheable reads (the published portfolio
 * page). Unlike src/lib/supabase/server.ts, this never touches cookies() —
 * a request-time API that would force the route to render dynamically on
 * every visit. Keeping this client cookie-free lets Next cache/ISR the
 * route via `export const revalidate`, while saveProfile's revalidatePath
 * call still invalidates it instantly after an edit.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
