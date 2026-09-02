"use client";

import { useState } from "react";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Education" },
  { href: "#certificates", label: "Certificates" },
  { href: "#tech-stack", label: "Tech Stack" },
  { href: "#contact", label: "Contact" },
];

export default function Nav({
  fullName,
  pronouns,
  contactEmail,
}: {
  fullName: string;
  pronouns: string;
  contactEmail: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-violet-950/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 lg:max-w-6xl lg:px-8 lg:py-5">
        <p className="font-bold lg:text-lg">
          {fullName}
          {pronouns && (
            <span className="ml-2 text-sm font-normal text-violet-300">
              ({pronouns})
            </span>
          )}
        </p>

        <nav className="hidden gap-6 text-sm text-violet-200 sm:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="hidden rounded-full bg-violet-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:scale-105 hover:bg-violet-400 sm:inline-block"
            >
              Let&apos;s Connect ✉
            </a>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10 sm:hidden"
          >
            {open ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-violet-950/95 px-4 py-3 sm:hidden">
          <div className="mx-auto flex max-w-4xl flex-col gap-1">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-violet-100 transition hover:bg-white/10"
              >
                {link.label}
              </a>
            ))}
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                onClick={() => setOpen(false)}
                className="mt-2 rounded-lg bg-violet-500 px-3 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-violet-400"
              >
                Let&apos;s Connect ✉
              </a>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
