import type { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/public";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

async function getProfileUrls(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  // Supabase env vars aren't needed to serve the rest of the sitemap, so a
  // missing/misconfigured env (e.g. a build environment that hasn't set
  // them) shouldn't be able to fail the whole build over this one section.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }

  try {
    const supabase = createPublicClient();
    const { data: profiles } = await supabase
      .from("profiles")
      .select("username, updated_at")
      .eq("published", true);

    return (profiles ?? []).map((p) => ({
      url: `${baseUrl}/${p.username}`,
      lastModified: p.updated_at ?? undefined,
      changeFrequency: "weekly" as const,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const profileUrls = await getProfileUrls(baseUrl);

  return [
    { url: baseUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/signup`, changeFrequency: "yearly" },
    { url: `${baseUrl}/login`, changeFrequency: "yearly" },
    ...profileUrls,
  ];
}
