"use client";

import { useActionState } from "react";
import { adminLogIn } from "@/app/admin/actions";
import type { AuthState } from "@/app/auth/actions";
import PasswordField from "@/components/PasswordField";

const initialState: AuthState = { error: null };

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLogIn, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg shadow-2xl">
        <span className="inline-block rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-300">
          Admin
        </span>
        <h1 className="mt-3 text-2xl font-bold text-white">Admin sign in</h1>
        <p className="mt-1 text-sm text-slate-400">
          Restricted to accounts with admin access.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-slate-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-rose-400"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-slate-300">
              Password
            </label>
            <PasswordField
              id="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          {state.error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-rose-500 px-4 py-2.5 font-semibold text-white shadow-lg shadow-rose-900/40 transition hover:-translate-y-0.5 hover:bg-rose-400 disabled:pointer-events-none disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
