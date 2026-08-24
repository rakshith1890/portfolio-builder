import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900 text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-violet-950/70 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <p className="text-lg font-bold">Portfolio Builder</p>
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/login"
              className="text-violet-200 transition hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-violet-500 px-4 py-2 font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:-translate-y-0.5 hover:bg-violet-400"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <span className="animate-float inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm text-violet-100">
          ✨ Your portfolio, live in minutes
        </span>
        <h1 className="animate-fade-in-up delay-100 mt-6 text-4xl font-bold sm:text-5xl">
          One template. <span className="text-violet-300">Your details.</span>
        </h1>
        <p className="animate-fade-in-up delay-200 mx-auto mt-4 max-w-xl text-violet-200">
          Sign up, fill in your photo, bio, experience, projects and contact
          info — we handle the design. No code, no deployment, just a
          polished portfolio page at your own link.
        </p>
        <div className="animate-fade-in-up delay-300 mt-8 flex justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-violet-500 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:-translate-y-0.5 hover:bg-violet-400"
          >
            Build my portfolio
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-white/20 px-6 py-3 font-semibold transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            Log in
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-4 pb-24 sm:grid-cols-3">
        <Feature icon="🔐" title="Sign up & log in" text="Create an account and your dashboard is ready instantly." />
        <Feature icon="📝" title="Fill in your details" text="Photo, hero section, experience, projects, education, contact — all editable." />
        <Feature icon="🚀" title="Your page goes live" text="Instantly published at yourapp.com/your-username." />
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition hover:-translate-y-1 hover:border-violet-400/40 hover:bg-white/10">
      <div className="text-3xl transition group-hover:scale-110">{icon}</div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-violet-300">{text}</p>
    </div>
  );
}
