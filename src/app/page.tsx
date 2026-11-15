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
          Two templates. <span className="text-violet-300">Your details.</span>
        </h1>
        <p className="animate-fade-in-up delay-200 mx-auto mt-4 max-w-xl text-violet-200">
          Sign up, fill in your photo, bio, experience, projects and contact
          info — pick the design you like best. No code, no deployment, just
          a polished portfolio page at your own link.
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

      <section className="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-4 pb-20 sm:grid-cols-3">
        <Feature icon="🔐" title="Sign up & log in" text="Create an account and your dashboard is ready instantly." />
        <Feature icon="📝" title="Fill in your details" text="Photo, hero section, experience, projects, education, contact — all editable." />
        <Feature icon="🚀" title="Your page goes live" text="Instantly published at yourapp.com/your-username." />
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Two templates, pick one</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-violet-200">
            Same data, two completely different looks. Switch anytime from
            your dashboard — your content never changes.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TemplateCard
            name="Aurora"
            description="Dreamy violet gradient, centered hero, tabbed showcase."
            gradient="from-violet-950 via-purple-900 to-fuchsia-900"
          >
            <div className="h-1.5 w-full rounded bg-white/10" />
            <div className="mt-3 flex flex-col items-center gap-1.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400" />
              <div className="h-1.5 w-1/2 rounded bg-white/80" />
              <div className="h-1.5 w-1/3 rounded bg-violet-300/70" />
            </div>
          </TemplateCard>

          <TemplateCard
            name="Nova"
            description="Dark slate & teal, floating pill nav, timeline & project cards."
            gradient="from-slate-950 via-teal-950 to-slate-900"
          >
            <div className="mx-auto h-2 w-2/3 rounded-full border border-teal-400/30 bg-slate-950/80" />
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 space-y-1.5">
                <div className="h-1.5 w-3/4 rounded bg-teal-100/80" />
                <div className="h-1.5 w-1/2 rounded bg-teal-300/60" />
                <div className="mt-1.5 h-2 w-10 rounded-full bg-teal-400" />
              </div>
              <div className="h-12 w-12 flex-shrink-0 rounded-[60%_40%_55%_45%/45%_55%_45%_55%] border border-teal-400/40" />
            </div>
          </TemplateCard>
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-8 text-center text-xs text-violet-400">
        © {new Date().getFullYear()} Portfolio Builder. Built for people who
        want a great page without building one from scratch.
      </footer>
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

function TemplateCard({
  name,
  description,
  gradient,
  children,
}: {
  name: string;
  description: string;
  gradient: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-violet-400/40">
      <div className={`aspect-video bg-gradient-to-br p-4 ${gradient}`}>
        {children}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-white">{name}</h3>
        <p className="mt-1 text-sm text-violet-300">{description}</p>
      </div>
    </div>
  );
}
