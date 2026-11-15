import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import { isTemplateId, normalizeProfile, type Profile } from "@/lib/types";
import AuroraTemplate from "./templates/aurora/AuroraTemplate";
import NovaTemplate from "./templates/nova/NovaTemplate";

// The public page is read by anyone, so it's served from a cookie-free
// client and cached for 5 minutes (see src/lib/supabase/public.ts). Saving
// a profile calls revalidatePath(`/${username}`), so edits still show up
// immediately — this just avoids hitting the DB on every anonymous visit.
export const revalidate = 300;

async function getProfile(username: string): Promise<Profile | null> {
  const supabase = createPublicClient();
  const { data: row } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .eq("published", true)
    .maybeSingle<Profile>();

  return row ? normalizeProfile(row) : null;
}

type PageProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ preview?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfile(username);
  if (!profile) return { title: "Portfolio not found" };

  const title = `${profile.full_name} — ${profile.role_title || "Portfolio"}`;
  const description =
    profile.tagline || profile.bio || `${profile.full_name}'s portfolio.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: profile.photo_url ? [{ url: profile.photo_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: profile.photo_url ? [profile.photo_url] : undefined,
    },
  };
}

export default async function PublicProfilePage({ params, searchParams }: PageProps) {
  const { username } = await params;
  const { preview } = await searchParams;

  const profile = await getProfile(username);
  if (!profile) notFound();

  const template = isTemplateId(preview) ? preview : profile.template;
  const Template = template === "nova" ? NovaTemplate : AuroraTemplate;

  return <Template profile={profile} />;
}
