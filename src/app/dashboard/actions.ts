"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  CertificateItem,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  SkillGroup,
  SocialLinks,
} from "@/lib/types";

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

function parseJsonField<T>(formData: FormData, key: string, fallback: T): T {
  const raw = formData.get(key);
  if (typeof raw !== "string" || !raw.trim()) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function splitList(value: FormDataEntryValue | null): string[] {
  return Array.from(
    new Set(
      String(value || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    )
  );
}

async function uploadFile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  bucket: string,
  userId: string,
  baseName: string,
  file: File
): Promise<{ url?: string; error?: string }> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${userId}/${baseName}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: `${publicUrl.publicUrl}?t=${Date.now()}` };
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

  const skills = splitList(formData.get("skills"));
  const typewriter_phrases = splitList(formData.get("typewriter_phrases"));

  let photo_url = String(formData.get("existing_photo_url") || "") || null;
  const photoFile = formData.get("photo") as File | null;
  if (photoFile && photoFile.size > 0) {
    const result = await uploadFile(supabase, "avatars", user.id, "avatar", photoFile);
    if (result.error) {
      return { error: `Photo upload failed: ${result.error}`, success: false };
    }
    photo_url = result.url!;
  }

  let resume_url = String(formData.get("existing_resume_url") || "") || null;
  const resumeFile = formData.get("resume") as File | null;
  if (resumeFile && resumeFile.size > 0) {
    const result = await uploadFile(supabase, "resumes", user.id, "resume", resumeFile);
    if (result.error) {
      return { error: `Resume upload failed: ${result.error}`, success: false };
    }
    resume_url = result.url!;
  }

  const certificates = parseJsonField<CertificateItem[]>(formData, "certificates", []);
  for (let i = 0; i < certificates.length; i++) {
    const file = formData.get(`certificate_image_${i}`) as File | null;
    if (file && file.size > 0) {
      const result = await uploadFile(
        supabase,
        "certificates",
        user.id,
        `cert-${i}-${Date.now()}`,
        file
      );
      if (result.error) {
        return {
          error: `Certificate image upload failed: ${result.error}`,
          success: false,
        };
      }
      certificates[i] = { ...certificates[i], image_url: result.url! };
    }
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
    typewriter_phrases,
    photo_url,
    resume_url,
    about: String(formData.get("about") || ""),
    experience: parseJsonField<ExperienceItem[]>(formData, "experience", []),
    projects: parseJsonField<ProjectItem[]>(formData, "projects", []),
    education: parseJsonField<EducationItem[]>(formData, "education", []),
    certificates,
    skill_groups: parseJsonField<SkillGroup[]>(formData, "skill_groups", []),
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
  return {
    error: null,
    success: true,
    updated: { photo_url, resume_url, certificates },
  };
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
