"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "./actions";

const initialState: ContactState = { error: null, success: false };

const THEMES = {
  aurora: {
    input:
      "w-full rounded-lg border border-white/10 bg-white/10 px-4 py-2.5 text-white placeholder-violet-300/50 outline-none transition focus:border-violet-400 lg:px-5 lg:py-3.5 lg:text-lg",
    success:
      "rounded-xl border border-green-400/30 bg-green-500/10 p-6 text-center text-green-200",
    error: "rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300",
    button:
      "w-full rounded-lg bg-violet-500 px-4 py-2.5 font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:-translate-y-0.5 hover:bg-violet-400 disabled:pointer-events-none disabled:opacity-60 lg:py-3.5 lg:text-lg",
  },
  nova: {
    input:
      "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-teal-50 placeholder-teal-100/30 outline-none transition focus:border-teal-400/60",
    success:
      "rounded-xl border border-teal-400/30 bg-teal-400/10 p-6 text-center text-teal-200",
    error: "rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300",
    button:
      "w-full rounded-xl bg-teal-400 px-4 py-3 font-semibold text-slate-950 shadow-lg shadow-teal-900/30 transition hover:-translate-y-0.5 hover:bg-teal-300 disabled:pointer-events-none disabled:opacity-60",
  },
} as const;

export default function ContactForm({
  profileId,
  accent = "aurora",
}: {
  profileId: string;
  accent?: keyof typeof THEMES;
}) {
  const boundAction = sendMessage.bind(null, profileId);
  const [state, formAction, pending] = useActionState(boundAction, initialState);
  const theme = THEMES[accent];

  if (state.success) {
    return <div className={theme.success}>✅ Message sent! Thanks for reaching out.</div>;
  }

  return (
    <form action={formAction} className="space-y-3 text-left lg:space-y-4">
      <input name="name" required placeholder="Your Name" className={theme.input} />
      <input
        type="email"
        name="email"
        required
        placeholder="Your Email"
        className={theme.input}
      />
      <textarea
        name="message"
        required
        rows={4}
        placeholder="Your Message"
        className={theme.input}
      />
      {state.error && <p className={theme.error}>{state.error}</p>}
      <button type="submit" disabled={pending} className={theme.button}>
        {pending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
