import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient } from "./server";

/**
 * Service-role Supabase client — bypasses Row Level Security entirely.
 * Server-only: SUPABASE_SERVICE_ROLE_KEY has no NEXT_PUBLIC_ prefix, so
 * Next never ships it to the browser. Only import this from Server
 * Components/Actions under src/app/admin/, never from a "use client" file.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local (Project Settings → API → service_role key) to use the admin dashboard."
    );
  }
  return createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Returns the current session's user if (and only if) they're listed in
 * public.admins, else null. The admins table has RLS enabled with no
 * policies at all, so checking membership requires the service-role
 * client even for the signed-in user's own row.
 */
export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  return data ? user : null;
}
