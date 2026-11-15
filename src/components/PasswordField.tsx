"use client";

import { useState } from "react";

export default function PasswordField({
  id,
  name,
  placeholder,
  autoComplete,
  required,
}: {
  id: string;
  name: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 pr-10 text-white placeholder-violet-300/50 outline-none focus:border-violet-400"
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-violet-300 transition hover:text-white"
      >
        {visible ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.58 10.59a2 2 0 002.83 2.83M9.36 5.11A9.77 9.77 0 0112 5c5 0 9 4 10.5 7-.57 1.14-1.36 2.3-2.33 3.33M6.1 6.1C4.07 7.45 2.54 9.37 1.5 12c1 2.21 2.6 4.18 4.6 5.6A9.8 9.8 0 0012 19c.98 0 1.92-.14 2.8-.4"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z"
            />
            <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
