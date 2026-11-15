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

type TabKey = "projects" | "experience" | "education" | "certificates" | "skills";

const TABS: { key: TabKey; label: string }[] = [
  { key: "projects", label: "Projects" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "certificates", label: "Certificates" },
  { key: "skills", label: "Skills" },
];

const PAGE_SIZE = 4;

const HASH_TO_TAB: Record<string, TabKey> = {
  projects: "projects",
  experience: "experience",
  education: "education",
  certificates: "certificates",
  "tech-stack": "skills",
};
const TAB_TO_HASH: Record<TabKey, string> = {
  projects: "projects",
  experience: "experience",
  education: "education",
  certificates: "certificates",
  skills: "tech-stack",
};

export default function NovaShowcase({
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
    if (t.key === "projects") return projects.length > 0;
    if (t.key === "experience") return experience.length > 0;
    if (t.key === "education") return education.length > 0;
    if (t.key === "certificates") return certificates.length > 0;
    return skillGroups.length > 0 || skills.length > 0;
  });

  const [active, setActive] = useState<TabKey>(available[0]?.key ?? "projects");
  const [showAll, setShowAll] = useState(false);
  const [activeGroup, setActiveGroup] = useState(0);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
    null
  );

  const goTo = (tab: TabKey) => {
    setActive(tab);
    setShowAll(false);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${TAB_TO_HASH[tab]}`);
    }
  };

  useEffect(() => {
    const applyHash = (opts: { scroll?: boolean } = {}) => {
      const key = HASH_TO_TAB[window.location.hash.slice(1)];
      if (key && available.some((t) => t.key === key)) {
        setActive(key);
        if (opts.scroll) {
          document
            .getElementById("showcase")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    applyHash();
    const onHashChange = () => applyHash({ scroll: true });
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (available.length === 0) return null;

  const visibleProjects = showAll ? projects : projects.slice(0, PAGE_SIZE);
  const visibleCertificates = showAll ? certificates : certificates.slice(0, PAGE_SIZE);

  return (
    <div id="showcase" className="scroll-mt-24">
      <div className="flex flex-wrap gap-2">
        {available.map((tab) => (
          <button
            key={tab.key}
            onClick={() => goTo(tab.key)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              active === tab.key
                ? "border-teal-400 bg-teal-400/10 text-teal-200"
                : "border-white/10 text-teal-100/50 hover:border-teal-400/30 hover:text-teal-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {active === "projects" && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {visibleProjects.map((item, i) => (
              <BrowserCard key={i}>
                {item.image_url && (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    width={640}
                    height={280}
                    className="h-40 w-full object-cover"
                  />
                )}
                <div className="p-5">
                  <h3 className="font-semibold text-teal-50">{item.title}</h3>
                  {item.description && (
                    <p className="mt-1.5 text-sm text-teal-100/70">
                      {item.description}
                    </p>
                  )}
                  {item.tags && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.tags.split(",").map((tag, ti) => (
                        <span
                          key={ti}
                          className="rounded-full bg-teal-400/10 px-2.5 py-1 text-xs font-medium text-teal-300"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex gap-4 text-sm font-medium">
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-300 transition hover:text-teal-200"
                      >
                        Live ↗
                      </a>
                    )}
                    {item.github_url && (
                      <a
                        href={item.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-100/60 transition hover:text-teal-100"
                      >
                        GitHub ↗
                      </a>
                    )}
                  </div>
                </div>
              </BrowserCard>
            ))}
          </div>
        )}

        {active === "experience" && (
          <Timeline
            items={experience.map((item) => ({
              title: item.title,
              subtitle: item.company,
              range: `${item.start_date} – ${item.end_date || "Present"}`,
              description: item.description,
            }))}
          />
        )}

        {active === "education" && (
          <Timeline
            items={education.map((item) => ({
              title: item.school,
              subtitle: item.degree,
              range: `${item.start_date} – ${item.end_date}`,
            }))}
          />
        )}

        {active === "certificates" && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {visibleCertificates.map((item, i) => (
              <BrowserCard key={i}>
                <div className="flex items-start gap-5 p-5">
                  {item.image_url && (
                    <button
                      type="button"
                      onClick={() => setLightbox({ src: item.image_url, alt: item.name })}
                      className="block h-28 w-28 flex-shrink-0 cursor-zoom-in overflow-hidden rounded-xl sm:h-32 sm:w-32"
                    >
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        width={160}
                        height={160}
                        className="h-full w-full object-cover transition hover:opacity-90"
                      />
                    </button>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-teal-50">{item.name}</h3>
                    <p className="text-sm text-teal-100/60">{item.issuer}</p>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-sm text-teal-300 hover:text-teal-200"
                      >
                        View credential ↗
                      </a>
                    )}
                  </div>
                </div>
              </BrowserCard>
            ))}
          </div>
        )}

        {active === "skills" && skillGroups.length > 0 && (
          <div>
            <div className="flex flex-wrap gap-2">
              {skillGroups.map((group, i) => (
                <button
                  key={group.category + i}
                  onClick={() => setActiveGroup(i)}
                  className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition ${
                    activeGroup === i
                      ? "bg-teal-400 text-slate-950"
                      : "bg-white/5 text-teal-100/70 hover:bg-white/10"
                  }`}
                >
                  {group.category}
                </button>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {(skillGroups[activeGroup] ?? skillGroups[0]).items.map((skill, i) => (
                <div
                  key={`${skill.name}-${i}`}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3.5 transition hover:border-teal-400/30 hover:bg-teal-400/5"
                >
                  {skill.icon ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0" fill={`#${skill.icon.hex}`}>
                      <path d={skill.icon.path} />
                    </svg>
                  ) : (
                    <span className="text-lg">⌁</span>
                  )}
                  <span className="truncate text-sm font-medium text-teal-50">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "skills" && skillGroups.length === 0 && skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span
                key={`${skill}-${i}`}
                className="rounded-full border border-teal-400/20 bg-teal-400/5 px-3.5 py-1.5 text-sm font-medium text-teal-200"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {((active === "projects" && projects.length > PAGE_SIZE) ||
          (active === "certificates" && certificates.length > PAGE_SIZE)) && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="mt-6 w-full rounded-xl border border-white/10 py-2.5 text-sm font-medium text-teal-100/70 transition hover:border-teal-400/30 hover:text-teal-100"
          >
            {showAll ? "Show less ↑" : "Show more ↓"}
          </button>
        )}
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
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
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}

function BrowserCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-teal-400/30">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-black/20 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-teal-300/70" />
      </div>
      {children}
    </div>
  );
}

function Timeline({
  items,
}: {
  items: { title: string; subtitle: string; range: string; description?: string }[];
}) {
  return (
    <ol className="relative ml-3 space-y-8 border-l border-teal-400/20 pl-8">
      {items.map((item, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[2.35rem] top-1 h-3.5 w-3.5 rounded-full border-2 border-teal-400 bg-slate-950" />
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-400">
            {item.range}
          </p>
          <h3 className="mt-1 font-semibold text-teal-50">{item.title}</h3>
          <p className="text-sm text-teal-100/60">{item.subtitle}</p>
          {item.description && (
            <p className="mt-2 text-sm leading-relaxed text-teal-100/70">
              {item.description}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
