import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { normalizeProfile, type Profile } from "@/lib/types";
import { getTechIcon } from "@/lib/techIcons";
import Showcase from "./Showcase";
import Typewriter from "./Typewriter";
import ContactForm from "./ContactForm";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: row } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .eq("published", true)
    .maybeSingle<Profile>();

  if (!row) {
    notFound();
  }

  const profile = normalizeProfile(row);

  const skillGroupsWithIcons = profile.skill_groups.map((group) => ({
    category: group.category,
    items: group.items.map((name) => ({ name, icon: getTechIcon(name) })),
  }));

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900 text-white">
      {/* Sticky nav */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-violet-950/70 backdrop-blur-lg">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <p className="font-bold">
            {profile.full_name}
            {profile.pronouns && (
              <span className="ml-2 text-sm font-normal text-violet-300">
                ({profile.pronouns})
              </span>
            )}
          </p>
          <nav className="hidden gap-6 text-sm text-violet-200 sm:flex">
            <a href="#about" className="transition hover:text-white">About</a>
            <a href="#showcase" className="transition hover:text-white">Showcase</a>
            <a href="#contact" className="transition hover:text-white">Contact</a>
          </nav>
          {profile.contact_email && (
            <a
              href={`mailto:${profile.contact_email}`}
              className="rounded-full bg-violet-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:scale-105 hover:bg-violet-400"
            >
              Let&apos;s Connect ✉
            </a>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-4 pt-16 pb-10 text-center">
        {profile.photo_url && (
          <div className="animate-fade-in-up animate-float mx-auto w-fit">
            <div className="rounded-full bg-gradient-to-br from-violet-400 via-fuchsia-400 to-violet-500 p-1.5 shadow-2xl shadow-violet-900/50">
              <Image
                src={profile.photo_url}
                alt={profile.full_name}
                width={220}
                height={220}
                unoptimized
                className="h-40 w-40 rounded-full border-4 border-violet-950 object-cover sm:h-52 sm:w-52"
              />
            </div>
          </div>
        )}

        <h1 className="animate-fade-in-up delay-100 mt-8 text-3xl font-bold sm:text-5xl">
          {profile.full_name}
        </h1>

        {profile.tagline && (
          <p className="animate-fade-in-up delay-100 mt-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm text-violet-100">
            ✨ {profile.tagline}
          </p>
        )}

        {profile.role_title && (
          <p className="animate-fade-in-up delay-200 mt-5 min-h-[2em] text-xl font-semibold text-violet-100 sm:text-2xl">
            {profile.typewriter_phrases.length > 0 ? (
              <Typewriter phrases={profile.typewriter_phrases} />
            ) : (
              <>
                {profile.role_title}
                <span className="animate-blink ml-1 text-violet-300">|</span>
              </>
            )}
          </p>
        )}

        {profile.bio && (
          <p className="animate-fade-in-up delay-200 mx-auto mt-4 max-w-xl text-sm leading-relaxed text-violet-200">
            {profile.bio}
          </p>
        )}

        {profile.skills.length > 0 && (
          <div className="animate-fade-in-up delay-300 mt-6 flex flex-wrap justify-center gap-2">
            {profile.skills.map((skill, i) => (
              <span
                key={`${skill}-${i}`}
                className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-violet-100 transition hover:-translate-y-0.5 hover:bg-violet-500 hover:text-white"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="animate-fade-in-up delay-300 mt-8 flex flex-wrap justify-center gap-3">
          {profile.contact_email && (
            <a
              href={`mailto:${profile.contact_email}`}
              className="rounded-lg bg-violet-500 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:-translate-y-0.5 hover:bg-violet-400"
            >
              ✉ Contact Me
            </a>
          )}
          {profile.resume_url && (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              📄 Download Resume
            </a>
          )}
        </div>
      </section>

      {/* About */}
      {profile.about && (
        <section id="about" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-8">
          <h2 className="text-xl font-bold">About Me</h2>
          <p className="mt-3 text-sm leading-relaxed text-violet-100">
            {profile.about}
          </p>
        </section>
      )}

      {/* Showcase (stats + tabs) */}
      <section id="showcase" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-8">
        <Showcase
          experience={profile.experience}
          projects={profile.projects}
          education={profile.education}
          certificates={profile.certificates}
          skills={profile.skills}
          skillGroups={skillGroupsWithIcons}
        />
      </section>

      {/* Footer / contact */}
      <footer
        id="contact"
        className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16 text-center"
      >
        <h2 className="text-xl font-bold">Get in Touch</h2>
        <p className="mt-2 text-sm text-violet-200">
          Open to opportunities! Feel free to reach out.
        </p>

        <div className="mx-auto mt-6 max-w-md">
          <ContactForm profileId={profile.id} />
        </div>

        <h3 className="mt-12 text-lg font-semibold">Connect With Me</h3>
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
          {profile.contact_email && (
            <FooterLink href={`mailto:${profile.contact_email}`} icon="✉">
              {profile.contact_email}
            </FooterLink>
          )}
          {profile.social_links.linkedin && (
            <FooterLink href={profile.social_links.linkedin} icon="in">
              LinkedIn
            </FooterLink>
          )}
          {profile.social_links.github && (
            <FooterLink href={profile.social_links.github} icon="⌥">
              GitHub
            </FooterLink>
          )}
          {profile.social_links.twitter && (
            <FooterLink href={profile.social_links.twitter} icon="𝕏">
              Twitter
            </FooterLink>
          )}
          {profile.social_links.website && (
            <FooterLink href={profile.social_links.website} icon="🌐">
              Website
            </FooterLink>
          )}
        </div>
        <p className="mt-10 text-xs text-violet-400">
          © {new Date().getFullYear()} {profile.full_name}. Built with Portfolio
          Builder.
        </p>
      </footer>
    </main>
  );
}

function FooterLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 transition hover:-translate-y-0.5 hover:border-violet-400/50 hover:bg-white/10"
    >
      <span className="font-semibold">{icon}</span>
      {children}
    </a>
  );
}
