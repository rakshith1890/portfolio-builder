"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  CertificateItem,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  SocialLinks,
} from "@/lib/types";

export interface SaveState {
  error: string | null;
  success: boolean;
}

function parseJsonField<T>(formData: FormData, key: string, fallback: T): T {
  const raw = formData.get(key);
  if (typeof raw !== "string" || !raw.trim()) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
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

  const username = String(formData.get("username") || "")
    .trim()
    .toLowerCase();

  if (!/^[a-z0-9-]{3,30}$/.test(username)) {
    return {
      error:
        "Username must be 3-30 characters: lowercase letters, numbers, and hyphens only.",
      success: false,
    };
  }

  const skills = String(formData.get("skills") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  let photo_url = String(formData.get("existing_photo_url") || "") || null;

  const photoFile = formData.get("photo") as File | null;
  if (photoFile && photoFile.size > 0) {
    const ext = photoFile.name.split(".").pop() || "jpg";
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, photoFile, { upsert: true });

    if (uploadError) {
      return { error: `Photo upload failed: ${uploadError.message}`, success: false };
    }

    const { data: publicUrl } = supabase.storage
      .from("avatars")
      .getPublicUrl(path);
    photo_url = `${publicUrl.publicUrl}?t=${Date.now()}`;
  }

  const profile = {
    id: user.id,
    username,
    full_name: String(formData.get("full_name") || ""),
    pronouns: String(formData.get("pronouns") || ""),
    role_title: String(formData.get("role_title") || ""),
    tagline: String(formData.get("tagline") || ""),
    bio: String(formData.get("bio") || ""),
    skills,
    photo_url,
    about: String(formData.get("about") || ""),
    experience: parseJsonField<ExperienceItem[]>(formData, "experience", []),
    projects: parseJsonField<ProjectItem[]>(formData, "projects", []),
    education: parseJsonField<EducationItem[]>(formData, "education", []),
    certificates: parseJsonField<CertificateItem[]>(formData, "certificates", []),
    contact_email: String(formData.get("contact_email") || ""),
    social_links: parseJsonField<SocialLinks>(formData, "social_links", {}),
    published: formData.get("published") === "on",
  };

  const { error } = await supabase.from("profiles").upsert(profile);

  if (error) {
    const message =
      error.code === "23505"
        ? "That username is already taken. Please choose another."
        : error.message;
    return { error: message, success: false };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/${username}`);
  return { error: null, success: true };
}
