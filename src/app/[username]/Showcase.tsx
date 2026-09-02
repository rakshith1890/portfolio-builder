"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type {
  CertificateItem,
  EducationItem,
  ExperienceItem,
  ProjectItem,
} from "@/lib/types";

interface SkillIcon {
  path: string;
  hex: string;
}

interface SkillGroupWithIcons {
  category: string;
  items: { name: string; icon: SkillIcon | null }[];
}

type TabKey = "experience" | "projects" | "education" | "certificates" | "skills";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "experience", label: "Experience", icon: "💼" },
  { key: "projects", label: "Projects", icon: "⚡" },
  { key: "education", label: "Education", icon: "🎓" },
  { key: "certificates", label: "Certificates", icon: "🏆" },
  { key: "skills", label: "Tech Stack", icon: "⚙️" },
];

const PAGE_SIZE = 3;

// Nav links use one hash per section (e.g. #tech-stack); the tab state
// underneath uses shorter keys (e.g. "skills"). Map between the two so
// clicking a nav link opens the right tab, and switching tabs updates the
// URL to match.
const HASH_TO_TAB: Record<string, TabKey> = {
  experience: "experience",
  projects: "projects",
  education: "education",
  certificates: "certificates",
  "tech-stack": "skills",
};
const TAB_TO_HASH: Record<TabKey, string> = {
  experience: "experience",
  projects: "projects",
  education: "education",
  certificates: "certificates",
  skills: "tech-stack",
};

function scrollToShowcase() {
  document
    .getElementById("showcase")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Showcase({
  experience,
  projects,
  education,
  certificates,
  skills,
  skillGroups,
}: {
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certificates: CertificateItem[];
  skills: string[];
  skillGroups: SkillGroupWithIcons[];
}) {
  const available = TABS.filter((t) => {
    if (t.key === "experience") return experience.length > 0;
    if (t.key === "projects") return projects.length > 0;
    if (t.key === "education") return education.length > 0;
    if (t.key === "certificates") return certificates.length > 0;
    return skillGroups.length > 0 || skills.length > 0;
  });

  const [active, setActive] = useState<TabKey>(available[0]?.key ?? "experience");
  const [showAll, setShowAll] = useState(false);
  const [activeGroup, setActiveGroup] = useState(0);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
    null
  );

  const goTo = (tab: TabKey, opts: { scroll?: boolean } = {}) => {
    setActive(tab);
    setShowAll(false);
    if (opts.scroll ?? true) scrollToShowcase();
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${TAB_TO_HASH[tab]}`);
    }
  };

  // Let the nav's per-section links (#experience, #tech-stack, ...) open the
  // matching tab — both on load (direct link) and when clicked while already
  // on the page (hashchange, since there's no in-DOM element to jump to).
  useEffect(() => {
    const applyHash = () => {
      const key = HASH_TO_TAB[window.location.hash.slice(1)];
      if (key && available.some((t) => t.key === key)) {
        goTo(key);
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleExperience = showAll ? experience : experience.slice(0, PAGE_SIZE);
  const visibleProjects = showAll ? projects : projects.slice(0, PAGE_SIZE);
  const visibleEducation = showAll ? education : education.slice(0, PAGE_SIZE);
  const visibleCertificates = showAll ? certificates : certificates.slice(0, PAGE_SIZE);

  const currentTotal =
    active === "experience"
      ? experience.length
      : active === "projects"
      ? projects.length
      : active === "education"
      ? education.length
      : active === "certificates"
      ? certificates.length
      : 0;

  return (
    <div>
      {/* Stat tiles */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          icon="⚡"
          label="Projects"
          value={projects.length}
          desc="Things I've built"
          onClick={() => goTo("projects")}
        />
        <StatTile
          icon="💼"
          label="Experience"
          value={experience.length}
          desc="Roles held"
          onClick={() => goTo("experience")}
        />
        <StatTile
          icon="🏆"
          label="Certificates"
          value={certificates.length}
          desc="Skills validated"
          onClick={() => goTo("certificates")}
        />
      </div>

      <h2 className="text-xl font-bold lg:text-2xl">Portfolio Showcase</h2>
      <p className="mt-2 mb-6 max-w-xl text-sm text-violet-300 lg:max-w-2xl lg:text-base">
        Explore my journey through projects, experience, education, and
        technical expertise — each section is a milestone along the way.
      </p>

      <div className="flex flex-wrap gap-2">
        {available.map((tab) => (
          <button
            key={tab.key}
            onClick={() => goTo(tab.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 lg:px-5 lg:py-2.5 lg:text-base ${
              active === tab.key
                ? "bg-violet-500 text-white shadow-lg shadow-violet-900/40"
                : "bg-white/10 text-violet-200 hover:bg-white/20"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div
        className={`mt-6 ${
          active === "certificates"
            ? "grid grid-cols-1 gap-4 sm:grid-cols-2"
            : "space-y-4"
        }`}
      >
        {active === "experience" &&
          visibleExperience.map((item, i) => (
            <Card key={i}>
              <h3 className="font-semibold text-white lg:text-lg">{item.title}</h3>
              <p className="text-sm text-violet-300">{item.company}</p>
              <p className="text-xs text-violet-400">
                {item.start_date} – {item.end_date || "Present"}
              </p>
              {item.description && (
                <p className="mt-2 text-sm text-violet-100">{item.description}</p>
              )}
            </Card>
          ))}

        {active === "projects" &&
          visibleProjects.map((item, i) => (
            <Card key={i} padded={false}>
              {item.image_url && (
                <Image
                  src={item.image_url}
                  alt={item.title}
                  width={640}
                  height={280}
                  unoptimized
                  className="h-44 w-full rounded-t-xl object-cover"
                />
              )}
              <div className="p-5">
                <h3 className="font-semibold text-white lg:text-lg">{item.title}</h3>
                {item.description && (
                  <p className="mt-1 text-sm text-violet-100">{item.description}</p>
                )}
                {item.tags && (
                  <p className="mt-2 text-sm text-violet-300">{item.tags}</p>
                )}
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm text-violet-300 underline transition hover:text-violet-100"
                  >
                    View Details ↗
                  </a>
                )}
              </div>
              {item.github_url && (
                <a
                  href={item.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 border-t border-white/10 bg-black/20 py-3 text-sm font-medium text-white transition hover:bg-black/30"
                >
                  ⌥ GitHub
                </a>
              )}
            </Card>
          ))}

        {active === "education" &&
          visibleEducation.map((item, i) => (
            <Card key={i}>
              <h3 className="font-semibold text-white lg:text-lg">{item.school}</h3>
              <p className="text-sm text-violet-300">{item.degree}</p>
              <p className="text-xs text-violet-400">
                {item.start_date} – {item.end_date}
              </p>
            </Card>
          ))}

        {active === "certificates" &&
          visibleCertificates.map((item, i) => (
            <Card key={i} padded={false}>
              {item.image_url && (
                <button
                  type="button"
                  onClick={() =>
                    setLightbox({ src: item.image_url, alt: item.name })
                  }
                  className="block w-full cursor-zoom-in"
                >
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    width={640}
                    height={280}
                    unoptimized
                    className="h-40 w-full rounded-t-xl object-cover transition hover:opacity-90"
                  />
                </button>
              )}
              <div className="p-5">
                <h3 className="font-semibold text-white lg:text-lg">{item.name}</h3>
                <p className="text-sm text-violet-300">{item.issuer}</p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm text-violet-300 underline transition hover:text-violet-100"
                  >
                    View credential ↗
                  </a>
                )}
              </div>
            </Card>
          ))}

        {active === "skills" && skillGroups.length > 0 && (
          <div>
            <div className="flex flex-wrap gap-2">
              {skillGroups.map((group, i) => (
                <button
                  key={group.category + i}
                  onClick={() => setActiveGroup(i)}
                  className={`rounded-lg px-4 py-2 text-sm font-bold shadow transition-transform hover:scale-105 ${
                    activeGroup === i
                      ? "bg-violet-500 text-white"
                      : "bg-white/10 text-violet-200"
                  }`}
                >
                  {group.category}
                </button>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {(skillGroups[activeGroup] ?? skillGroups[0]).items.map(
                (skill, i) => (
                  <div
                    key={`${skill.name}-${i}`}
                    className="flex flex-col items-center gap-2 rounded-xl bg-white/10 p-4 text-center shadow transition-colors hover:bg-violet-500/30"
                  >
                    {skill.icon ? (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-7 w-7"
                        fill={`#${skill.icon.hex}`}
                      >
                        <path d={skill.icon.path} />
                      </svg>
                    ) : (
                      <span className="text-xl">⚙️</span>
                    )}
                    <span className="text-xs font-semibold text-violet-100 sm:text-sm">
                      {skill.name}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {active === "skills" && skillGroups.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span
                key={`${skill}-${i}`}
                className="animate-fade-in-up rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-violet-100 transition hover:-translate-y-0.5 hover:bg-violet-500 hover:text-white"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {active !== "skills" && currentTotal > PAGE_SIZE && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="col-span-full w-full rounded-lg border border-white/10 bg-white/5 py-2 text-sm text-violet-200 transition hover:bg-white/10"
          >
            {showAll ? "See less ↑" : `See more (${currentTotal - PAGE_SIZE} more) ↓`}
          </button>
        )}
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
          >
            ×
          </button>
          <Image
            src={lightbox.src}
            alt={lightbox.alt}
            width={1000}
            height={700}
            unoptimized
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}

function Card({
  children,
  padded = true,
}: {
  children: React.ReactNode;
  padded?: boolean;
}) {
  return (
    <div
      className={`animate-fade-in-up overflow-hidden rounded-xl border border-white/10 bg-white/5 transition hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-white/10 ${
        padded ? "p-5" : ""
      }`}
    >
      {children}
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  desc,
  onClick,
}: {
  icon: string;
  label: string;
  value: number;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-violet-400/40 hover:bg-white/10 lg:p-7"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl lg:h-12 lg:w-12 lg:text-2xl">
          {icon}
        </div>
        <span className="text-violet-400 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-violet-200">
          ↗
        </span>
      </div>
      <div className="mt-4 text-3xl font-bold lg:text-4xl">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wide text-violet-300 lg:text-sm">
        {label}
      </div>
      <div className="mt-1 text-xs text-violet-400 lg:text-sm">{desc}</div>
    </button>
  );
}
