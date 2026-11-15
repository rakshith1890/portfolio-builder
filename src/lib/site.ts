/**
 * The canonical public URL for metadata (sitemap, robots, OG tags).
 * Prefers an explicit NEXT_PUBLIC_SITE_URL, then falls back to Vercel's
 * own env vars (set automatically on every Vercel deployment, no setup
 * needed) so sitemap.xml/robots.txt never point at localhost in a real
 * deployment just because NEXT_PUBLIC_SITE_URL wasn't configured.
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;

  const vercelUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}
