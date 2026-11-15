"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { buildProfileUpsert, friendlyUpsertError } from "@/lib/profileUpsert";
import type { CertificateItem } from "@/lib/types";

export interface SaveState {
  error: string | null;
  success: boolean;
  // What was actually persisted, so the client can resync its local state
  // after a save (otherwise a second save in the same session would
  // resubmit stale pre-upload values and silently wipe out the first
  // upload's photo/resume/certificate-image URLs).
  updated?: {
    photo_url: string | null;
    resume_url: string | null;
    certificates: CertificateItem[];
  };
}

export async function saveProfile(
  _prevState: SaveState,
  formData: FormData
): Promise<SaveState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in.", success: false };
  }

  const result = await buildProfileUpsert(supabase, user.id, formData);
  if (result.error || !result.profile || !result.updated) {
    return { error: result.error ?? "Something went wrong.", success: false };
  }

  const { error } = await supabase.from("profiles").upsert(result.profile);
  if (error) {
    return { error: friendlyUpsertError(error), success: false };
  }

  const username = result.profile.username as string;
  revalidatePath("/dashboard");
  revalidatePath(`/${username}`);
  return { error: null, success: true, updated: result.updated };
}

export async function checkUsernameAvailability(
  username: string,
  excludeId?: string
): Promise<{ available: boolean }> {
  const normalized = username.trim().toLowerCase();
  if (!/^[a-z0-9-]{3,30}$/.test(normalized)) {
    return { available: true };
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", normalized)
    .maybeSingle();

  return { available: !data || data.id === excludeId };
}

export async function markMessageRead(messageId: string) {
  const supabase = await createClient();
  await supabase.from("messages").update({ read: true }).eq("id", messageId);
  revalidatePath("/dashboard");
}

export async function deleteMessage(messageId: string) {
  const supabase = await createClient();
  await supabase.from("messages").delete().eq("id", messageId);
  revalidatePath("/dashboard");
}
