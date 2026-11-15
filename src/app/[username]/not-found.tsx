import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900 px-4 text-center text-white">
      <p className="text-7xl font-black text-violet-300/40">404</p>
      <h1 className="mt-4 text-2xl font-bold">This portfolio doesn&apos;t exist</h1>
      <p className="mt-2 max-w-sm text-sm text-violet-200">
        The page you&apos;re looking for isn&apos;t published, or the
        username doesn&apos;t match an account.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-violet-500 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:-translate-y-0.5 hover:bg-violet-400"
      >
        ← Back to Portfolio Builder
      </Link>
    </main>
  );
}
