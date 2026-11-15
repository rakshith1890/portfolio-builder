"use client";

import type { TemplateId } from "@/lib/types";

const TEMPLATES: {
  id: TemplateId;
  name: string;
  description: string;
}[] = [
  {
    id: "aurora",
    name: "Aurora",
    description: "Dreamy violet gradient, centered hero, tabbed showcase.",
  },
  {
    id: "nova",
    name: "Nova",
    description: "Dark slate & teal, floating pill nav, timeline & project cards.",
  },
];

/**
 * Native radio-card picker — no client state needed, so it works purely
 * through the surrounding <form>'s submission (used by both the dashboard
 * and the onboarding wizard).
 */
export default function TemplatePicker({
  defaultValue,
  previewUsername,
}: {
  defaultValue: TemplateId;
  previewUsername?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {TEMPLATES.map((tpl) => (
        <label key={tpl.id} className="group relative block cursor-pointer">
          <input
            type="radio"
            name="template"
            value={tpl.id}
            defaultChecked={defaultValue === tpl.id}
            className="peer sr-only"
          />
          <div className="rounded-2xl border-2 border-white/10 bg-white/5 p-4 transition peer-checked:border-violet-400 peer-checked:bg-violet-500/10 hover:border-white/20">
            <Mockup id={tpl.id} />
            <div className="mt-3 flex items-center justify-between">
              <h3 className="font-semibold text-white">{tpl.name}</h3>
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/30 text-xs text-transparent transition group-has-[:checked]:border-violet-400 group-has-[:checked]:bg-violet-400 group-has-[:checked]:text-white">
                ✓
              </span>
            </div>
            <p className="mt-1 text-xs text-violet-300">{tpl.description}</p>
            {previewUsername && (
              <a
                href={`/${previewUsername}?preview=${tpl.id}`}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 mt-2 inline-block text-xs font-medium text-violet-300 underline hover:text-violet-100"
              >
                Preview with your data ↗
              </a>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}

function Mockup({ id }: { id: TemplateId }) {
  if (id === "nova") {
    return (
      <div className="aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 p-2">
        <div className="mx-auto h-2 w-2/3 rounded-full border border-teal-400/30 bg-slate-950/80" />
        <div className="mt-3 flex h-full items-center gap-2">
          <div className="flex-1 space-y-1">
            <div className="h-1.5 w-3/4 rounded bg-teal-100/80" />
            <div className="h-1.5 w-1/2 rounded bg-teal-300/60" />
            <div className="mt-1.5 h-2 w-10 rounded-full bg-teal-400" />
          </div>
          <div className="h-10 w-10 flex-shrink-0 rounded-[60%_40%_55%_45%/45%_55%_45%_55%] border border-teal-400/40" />
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900 p-2">
      <div className="h-1.5 w-full rounded bg-white/10" />
      <div className="mt-2 flex flex-col items-center gap-1.5">
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400" />
        <div className="h-1.5 w-1/2 rounded bg-white/80" />
        <div className="h-1.5 w-1/3 rounded bg-violet-300/70" />
      </div>
    </div>
  );
}
