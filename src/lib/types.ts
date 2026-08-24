export interface ExperienceItem {
  title: string;
  company: string;
  start_date: string;
  end_date: string; // "" or "Present"
  description: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  tags: string; // comma-separated, e.g. "Python, MySQL"
  image_url: string;
  link: string; // "View Details" link (live demo / write-up)
  github_url: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  start_date: string;
  end_date: string;
}

export interface CertificateItem {
  name: string;
  issuer: string;
  date: string;
  link: string;
  image_url: string;
}

export interface SkillGroup {
  category: string; // e.g. "Frontend"
  items: string[]; // e.g. ["React", "Next.js"]
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
}

export interface Profile {
  id: string;
  username: string;

  full_name: string;
  pronouns: string;
  role_title: string;
  tagline: string;
  bio: string;
  skills: string[];
  typewriter_phrases: string[];
  photo_url: string | null;
  resume_url: string | null;

  about: string;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certificates: CertificateItem[];
  skill_groups: SkillGroup[];

  contact_email: string;
  social_links: SocialLinks;

  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  profile_id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
}

/**
 * Fills in defaults for any columns that don't exist yet on a profile row
 * (e.g. the DB hasn't had the latest supabase/schema.sql migration run
 * against it), so the app never crashes on a stale row shape.
 */
export function normalizeProfile(row: Partial<Profile> & { id: string }): Profile {
  return {
    ...emptyProfileDraft(),
    ...row,
    skills: row.skills ?? [],
    typewriter_phrases: row.typewriter_phrases ?? [],
    experience: row.experience ?? [],
    projects: row.projects ?? [],
    education: row.education ?? [],
    certificates: row.certificates ?? [],
    skill_groups: row.skill_groups ?? [],
    social_links: row.social_links ?? {},
    created_at: row.created_at ?? new Date().toISOString(),
    updated_at: row.updated_at ?? new Date().toISOString(),
  };
}

export const emptyProfileDraft = (): Omit<
  Profile,
  "id" | "created_at" | "updated_at"
> => ({
  username: "",
  full_name: "",
  pronouns: "",
  role_title: "",
  tagline: "",
  bio: "",
  skills: [],
  typewriter_phrases: [],
  photo_url: null,
  resume_url: null,
  about: "",
  experience: [],
  projects: [],
  education: [],
  certificates: [],
  skill_groups: [],
  contact_email: "",
  social_links: {},
  published: true,
});
