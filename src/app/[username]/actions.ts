"use server";

import { createClient } from "@/lib/supabase/server";

export interface ContactState {
  error: string | null;
  success: boolean;
}

export async function sendMessage(
  profileId: string,
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    return { error: "Please fill in every field.", success: false };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address.", success: false };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("messages")
    .insert({ profile_id: profileId, name, email, message });

  if (error) {
    return { error: "Something went wrong sending your message. Please try again.", success: false };
  }

  return { error: null, success: true };
}
