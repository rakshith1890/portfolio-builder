"use client";

import { useState } from "react";
import type {
  CertificateItem,
  EducationItem,
  ExperienceItem,
  ProjectItem,
} from "@/lib/types";

type TabKey = "experience" | "projects" | "education" | "certificates" | "skills";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "experience", label: "Experience", icon: "💼" },
  { key: "projects", label: "Projects", icon: "⚡" },
  { key: "education", label: "Education", icon: "🎓" },
  { key: "certificates", label: "Certificates", icon: "🏆" },
  { key: "skills", label: "Tech Stack", icon: "⚙️" },
];

const PAGE_SIZE = 3;

export default function Tabs({
  experience,
  projects,
  education,
  certificates,
  skills,
}: {
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certificates: CertificateItem[];
  skills: string[];
}) {
  const available = TABS.filter((t) => {
    if (t.key === "experience") return experience.length > 0;
    if (t.key === "projects") return projects.length > 0;
    if (t.key === "education") return education.length > 0;
    if (t.key === "certificates") return certificates.length > 0;
    return skills.length > 0;
  });

  const [active, setActive] = useState<TabKey>(available[0]?.key ?? "experience");
  const [showAll, setShowAll] = useState(false);

  if (available.length === 0) return null;

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
      <div className="flex flex-wrap gap-2">
        {available.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActive(tab.key);
              setShowAll(false);
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 ${
              active === tab.key
                ? "bg-violet-500 text-white shadow-lg shadow-violet-900/40"
                : "bg-white/10 text-violet-200 hover:bg-white/20"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {active === "experience" &&
          visibleExperience.map((item, i) => (
            <div
              key={i}
              className="animate-fade-in-up rounded-xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-white/10"
            >
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-violet-300">{item.company}</p>
              <p className="text-xs text-violet-400">
                {item.start_date} – {item.end_date || "Present"}
              </p>
              {item.description && (
                <p className="mt-2 text-sm text-violet-100">{item.description}</p>
              )}
            </div>
          ))}

        {active === "projects" &&
          visibleProjects.map((item, i) => (
            <div
              key={i}
              className="animate-fade-in-up rounded-xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-white/10"
            >
              <h3 className="font-semibold text-white">{item.title}</h3>
              {item.description && (
                <p className="mt-1 text-sm text-violet-100">{item.description}</p>
              )}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm text-violet-300 underline transition hover:text-violet-100"
                >
                  View project ↗
                </a>
              )}
            </div>
          ))}

        {active === "education" &&
          visibleEducation.map((item, i) => (
            <div
              key={i}
              className="animate-fade-in-up rounded-xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-white/10"
            >
              <h3 className="font-semibold text-white">{item.school}</h3>
              <p className="text-sm text-violet-300">{item.degree}</p>
              <p className="text-xs text-violet-400">
                {item.start_date} – {item.end_date}
              </p>
            </div>
          ))}

        {active === "certificates" &&
          visibleCertificates.map((item, i) => (
            <div
              key={i}
              className="animate-fade-in-up rounded-xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-white/10"
            >
              <h3 className="font-semibold text-white">{item.name}</h3>
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
          ))}

        {active === "skills" && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
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
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 text-sm text-violet-200 transition hover:bg-white/10"
          >
            {showAll ? "See less ↑" : `See more (${currentTotal - PAGE_SIZE} more) ↓`}
          </button>
        )}
      </div>
    </div>
  );
}
