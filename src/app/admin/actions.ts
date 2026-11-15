"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, getAdminUser } from "@/lib/supabase/admin";
import { buildProfileUpsert, friendlyUpsertError } from "@/lib/profileUpsert";
import type { AuthState } from "@/app/auth/actions";
import type { SaveState } from "@/app/dashboard/actions";

export async function adminLogIn(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const userId = data.user?.id;
  if (!userId) {
    return { error: "Login failed." };
  }

  let isAdmin = false;
  try {
    const admin = createAdminClient();
    const { data: adminRow } = await admin
      .from("admins")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
    isAdmin = Boolean(adminRow);
  } catch (e) {
    await supabase.auth.signOut();
    return { error: e instanceof Error ? e.message : "Admin check failed." };
  }

  if (!isAdmin) {
    // Don't leave a signed-in non-admin session dangling on the admin path.
    await supabase.auth.signOut();
    return { error: "This account does not have admin access." };
  }

  redirect("/admin");
}

export async function adminLogOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/**
 * Save-on-behalf-of-a-user, used by the admin profile editor. Re-checks
 * admin membership on every call (never trust a client-side flag), then
 * runs the same validation/upload/upsert path as the owner's own save but
 * through the service-role client so it can write to any user's row and
 * storage folder regardless of RLS.
 */
export async function adminSaveProfile(
  targetUserId: string,
  _prevState: SaveState,
  formData: FormData
): Promise<SaveState> {
  const adminUser = await getAdminUser();
  if (!adminUser) {
    return { error: "Not authorized.", success: false };
  }

  const admin = createAdminClient();
  const result = await buildProfileUpsert(admin, targetUserId, formData);
  if (result.error || !result.profile || !result.updated) {
    return { error: result.error ?? "Something went wrong.", success: false };
  }

  const { error } = await admin.from("profiles").upsert(result.profile);
  if (error) {
    return { error: friendlyUpsertError(error), success: false };
  }

  const username = result.profile.username as string;
  revalidatePath(`/admin/users/${targetUserId}`);
  revalidatePath("/admin");
  revalidatePath(`/${username}`);
  return { error: null, success: true, updated: result.updated };
}
