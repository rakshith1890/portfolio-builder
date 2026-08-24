"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "./actions";

const initialState: ContactState = { error: null, success: false };

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/10 px-4 py-2.5 text-white placeholder-violet-300/50 outline-none transition focus:border-violet-400";

export default function ContactForm({ profileId }: { profileId: string }) {
  const boundAction = sendMessage.bind(null, profileId);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  if (state.success) {
    return (
      <div className="rounded-xl border border-green-400/30 bg-green-500/10 p-6 text-center text-green-200">
        ✅ Message sent! Thanks for reaching out.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3 text-left">
      <input name="name" required placeholder="Your Name" className={inputClass} />
      <input
        type="email"
        name="email"
        required
        placeholder="Your Email"
        className={inputClass}
      />
      <textarea
        name="message"
        required
        rows={4}
        placeholder="Your Message"
        className={inputClass}
      />
      {state.error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-violet-500 px-4 py-2.5 font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:-translate-y-0.5 hover:bg-violet-400 disabled:pointer-events-none disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
