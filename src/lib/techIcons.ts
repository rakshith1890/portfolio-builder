import fs from "node:fs";
import path from "node:path";
import iconsData from "simple-icons/icons.json";

export interface TechIcon {
  path: string; // SVG path "d" attribute
  hex: string; // brand color, no leading #
}

interface IconEntry {
  title: string;
  slug: string;
  hex: string;
  aliases?: { aka?: string[] };
}

function normalize(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]/g, "");
}

// Common shorthand → canonical Simple Icons title, for names people type
// that don't literally match the brand title (e.g. "Node" vs "Node.js").
const ALIAS_OVERRIDES: Record<string, string> = {
  node: "nodejs",
  nodejs: "nodejs",
  next: "nextjs",
  nextjs: "nextjs",
  vue: "vuejs",
  nuxt: "nuxtjs",
  postgres: "postgresql",
  mongo: "mongodb",
  mysql: "mysql",
  cplusplus: "cpp",
  csharp: "csharp",
  dotnet: "dotnet",
  golang: "go",
  vscode: "visualstudiocode",
  k8s: "kubernetes",
  aws: "amazonaws",
  gcp: "googlecloud",
  ai: "openai",
  restapi: "postman",
  html: "html5",
  html5: "html5",
  css: "css",
  css3: "css",
  express: "express",
  expressjs: "express",
  tailwind: "tailwindcss",
  reactjs: "react",
};

let titleIndex: Map<string, IconEntry> | null = null;

function getIndex(): Map<string, IconEntry> {
  if (titleIndex) return titleIndex;
  titleIndex = new Map();
  for (const icon of iconsData as IconEntry[]) {
    titleIndex.set(normalize(icon.title), icon);
    for (const aka of icon.aliases?.aka ?? []) {
      const key = normalize(aka);
      if (!titleIndex.has(key)) titleIndex.set(key, icon);
    }
  }
  return titleIndex;
}

const svgCache = new Map<string, string | null>();

function readIconPath(slug: string): string | null {
  if (svgCache.has(slug)) return svgCache.get(slug)!;
  try {
    const file = path.join(
      process.cwd(),
      "node_modules",
      "simple-icons",
      "icons",
      `${slug}.svg`
    );
    const svg = fs.readFileSync(file, "utf-8");
    const match = svg.match(/\sd="([^"]+)"/);
    const result = match ? match[1] : null;
    svgCache.set(slug, result);
    return result;
  } catch {
    svgCache.set(slug, null);
    return null;
  }
}

/**
 * Resolve a free-typed skill name (e.g. "React", "Node", "Tailwind CSS") to
 * a brand icon + color, if Simple Icons has a match. Returns null if there's
 * no reasonable match, so the caller can render a label-only fallback.
 */
export function getTechIcon(name: string): TechIcon | null {
  const key = normalize(name);
  if (!key) return null;

  const index = getIndex();
  const direct = index.get(key);
  const entry = direct ?? index.get(normalize(ALIAS_OVERRIDES[key] ?? ""));
  if (!entry) return null;

  const svgPath = readIconPath(entry.slug);
  if (!svgPath) return null;

  return { path: svgPath, hex: entry.hex };
}
