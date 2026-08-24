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
  link: string;
  image_url: string;
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
  photo_url: string | null;

  about: string;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certificates: CertificateItem[];

  contact_email: string;
  social_links: SocialLinks;

  published: boolean;
  created_at: string;
  updated_at: string;
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
  photo_url: null,
  about: "",
  experience: [],
  projects: [],
  education: [],
  certificates: [],
  contact_email: "",
  social_links: {},
  published: true,
});
