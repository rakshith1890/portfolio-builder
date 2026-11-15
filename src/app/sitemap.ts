import type { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/public";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const supabase = createPublicClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("username, updated_at")
    .eq("published", true);

  const profileUrls: MetadataRoute.Sitemap = (profiles ?? []).map((p) => ({
    url: `${baseUrl}/${p.username}`,
    lastModified: p.updated_at ?? undefined,
    changeFrequency: "weekly",
  }));

  return [
    { url: baseUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/signup`, changeFrequency: "yearly" },
    { url: `${baseUrl}/login`, changeFrequency: "yearly" },
    ...profileUrls,
  ];
}
