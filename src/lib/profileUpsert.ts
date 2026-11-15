import type { SupabaseClient } from "@supabase/supabase-js";
import {
  isTemplateId,
  type CertificateItem,
  type EducationItem,
  type ExperienceItem,
  type ProjectItem,
  type SkillGroup,
  type SocialLinks,
} from "@/lib/types";

export interface ProfileUpsertResult {
  error: string | null;
  // Only set when error is null — callers that checked `if (result.error)`
  // and returned can safely use these (TS can't discriminate a plain
  // truthiness check on a non-literal `string | null` field, so these stay
  // optional rather than a true discriminated union).
  profile?: Record<string, unknown>;
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
  supabase: SupabaseClient,
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

/**
 * Validates form fields, uploads any new photo/resume/certificate images,
 * and builds the row to upsert into public.profiles — shared by the
 * owner's own save (dashboard/onboarding) and the admin's save-on-behalf-of
 * (admin/actions.ts). The caller picks which Supabase client to pass in
 * (cookie-based for the owner, service-role for an admin) and performs the
 * actual `.from("profiles").upsert(...)` + revalidation itself.
 */
export async function buildProfileUpsert(
  supabase: SupabaseClient,
  userId: string,
  formData: FormData
): Promise<ProfileUpsertResult> {
  const username = String(formData.get("username") || "")
    .trim()
    .toLowerCase();

  if (!/^[a-z0-9-]{3,30}$/.test(username)) {
    return {
      error:
        "Username must be 3-30 characters: lowercase letters, numbers, and hyphens only.",
    };
  }

  const skills = splitList(formData.get("skills"));
  const typewriter_phrases = splitList(formData.get("typewriter_phrases"));

  let photo_url = String(formData.get("existing_photo_url") || "") || null;
  const photoFile = formData.get("photo") as File | null;
  if (photoFile && photoFile.size > 0) {
    const result = await uploadFile(supabase, "avatars", userId, "avatar", photoFile);
    if (result.error) {
      return { error: `Photo upload failed: ${result.error}` };
    }
    photo_url = result.url!;
  }

  let resume_url = String(formData.get("existing_resume_url") || "") || null;
  const resumeFile = formData.get("resume") as File | null;
  if (resumeFile && resumeFile.size > 0) {
    const result = await uploadFile(supabase, "resumes", userId, "resume", resumeFile);
    if (result.error) {
      return { error: `Resume upload failed: ${result.error}` };
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
        userId,
        `cert-${i}-${Date.now()}`,
        file
      );
      if (result.error) {
        return { error: `Certificate image upload failed: ${result.error}` };
      }
      certificates[i] = { ...certificates[i], image_url: result.url! };
    }
  }

  const templateRaw = formData.get("template");
  const template = isTemplateId(templateRaw) ? templateRaw : "aurora";

  const profile = {
    id: userId,
    username,
    template,
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

  return {
    error: null,
    profile,
    updated: { photo_url, resume_url, certificates },
  };
}

export function friendlyUpsertError(error: { code?: string; message: string }): string {
  return error.code === "23505"
    ? "That username is already taken. Please choose another."
    : error.message;
}
