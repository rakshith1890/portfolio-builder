"use client";

import { useActionState } from "react";
import Link from "next/link";
import { logIn, type AuthState } from "@/app/auth/actions";

const initialState: AuthState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(logIn, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg shadow-2xl">
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-violet-200">
          Log in to edit your portfolio.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-violet-200">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder-violet-300/50 outline-none focus:border-violet-400"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-violet-200">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder-violet-300/50 outline-none focus:border-violet-400"
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
            className="w-full rounded-lg bg-violet-500 px-4 py-2 font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:-translate-y-0.5 hover:bg-violet-400 disabled:pointer-events-none disabled:opacity-60"
          >
            {pending ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-violet-200">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-white underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
