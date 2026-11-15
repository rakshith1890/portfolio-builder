"use client";

import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "#top", label: "Home", id: "top" },
  { href: "#about", label: "About", id: "about" },
  { href: "#tech-stack", label: "Skills", id: "showcase" },
  { href: "#projects", label: "Projects", id: "showcase" },
  { href: "#contact", label: "Contact", id: "contact" },
];

export default function NovaNav({
  fullName,
  contactEmail,
}: {
  fullName: string;
  contactEmail: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");
  const ticking = useRef(false);

  useEffect(() => {
    const sectionIds = ["top", "about", "showcase", "contact"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        if (ticking.current) return;
        ticking.current = true;
        requestAnimationFrame(() => {
          ticking.current = false;
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (visible?.target.id) setActive(visible.target.id);
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-30 flex justify-center px-4">
      <div className="pointer-events-auto flex w-full max-w-3xl items-center justify-between gap-2 rounded-full border border-teal-400/20 bg-slate-950/80 px-3 py-2 shadow-xl shadow-black/40 backdrop-blur-lg">
        <a
          href="#top"
          className="truncate px-2 text-sm font-bold text-teal-50 sm:text-base"
        >
          {fullName || "Portfolio"}
        </a>

        <nav className="hidden items-center gap-1 sm:flex">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                active === link.id
                  ? "bg-teal-400/15 text-teal-200"
                  : "text-teal-100/60 hover:text-teal-100"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="hidden rounded-full bg-teal-400 px-4 py-1.5 text-sm font-semibold text-slate-950 transition hover:bg-teal-300 sm:inline-block"
            >
              Say hello
            </a>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-8 w-8 items-center justify-center rounded-full text-teal-100 transition hover:bg-white/10 sm:hidden"
          >
            {open ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="pointer-events-auto absolute top-16 w-[min(90vw,20rem)] rounded-2xl border border-teal-400/20 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-lg sm:hidden">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-2.5 text-sm font-medium text-teal-100/80 transition hover:bg-white/10 hover:text-teal-50"
            >
              {link.label}
            </a>
          ))}
          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-xl bg-teal-400 px-4 py-2.5 text-center text-sm font-semibold text-slate-950"
            >
              Say hello
            </a>
          )}
        </nav>
      )}
    </header>
  );
}
