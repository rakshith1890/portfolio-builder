import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { normalizeProfile, type Profile } from "@/lib/types";
import { getTechIcon } from "@/lib/techIcons";
import Showcase from "./Showcase";
import Typewriter from "./Typewriter";
import ContactForm from "./ContactForm";
import Nav from "./Nav";

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
      <Nav
        fullName={profile.full_name}
        pronouns={profile.pronouns}
        contactEmail={profile.contact_email}
      />

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-4 pt-16 pb-10 text-center lg:flex lg:max-w-6xl lg:flex-row-reverse lg:items-center lg:gap-16 lg:px-8 lg:pt-24 lg:pb-16 lg:text-left">
        {profile.photo_url && (
          <div className="animate-fade-in-up animate-float mx-auto w-fit lg:mx-0 lg:flex-shrink-0">
            <div className="rounded-full bg-gradient-to-br from-violet-400 via-fuchsia-400 to-violet-500 p-1.5 shadow-2xl shadow-violet-900/50">
              <Image
                src={profile.photo_url}
                alt={profile.full_name}
                width={320}
                height={320}
                unoptimized
                className="h-40 w-40 rounded-full border-4 border-violet-950 object-cover sm:h-52 sm:w-52 lg:h-80 lg:w-80"
              />
            </div>
          </div>
        )}

        <div className="lg:flex-1">
          <h1 className="animate-fade-in-up delay-100 mt-8 text-3xl font-bold sm:text-5xl lg:mt-0 lg:text-6xl">
            {profile.full_name}
          </h1>

          {profile.tagline && (
            <p className="animate-fade-in-up delay-100 mt-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm text-violet-100 lg:px-5 lg:py-2 lg:text-base">
              ✨ {profile.tagline}
            </p>
          )}

          {profile.role_title && (
            <p className="animate-fade-in-up delay-200 mt-5 min-h-[2em] text-xl font-semibold text-violet-100 sm:text-2xl lg:text-3xl">
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
            <p className="animate-fade-in-up delay-200 mx-auto mt-4 max-w-xl text-sm leading-relaxed text-violet-200 lg:mx-0 lg:max-w-none lg:text-lg">
              {profile.bio}
            </p>
          )}

          {profile.skills.length > 0 && (
            <div className="animate-fade-in-up delay-300 mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
              {profile.skills.map((skill, i) => (
                <span
                  key={`${skill}-${i}`}
                  className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-violet-100 transition hover:-translate-y-0.5 hover:bg-violet-500 hover:text-white lg:px-4 lg:py-2 lg:text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          <div className="animate-fade-in-up delay-300 mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            {profile.contact_email && (
              <a
                href={`mailto:${profile.contact_email}`}
                className="rounded-lg bg-violet-500 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:-translate-y-0.5 hover:bg-violet-400 lg:px-8 lg:py-3.5 lg:text-lg"
              >
                ✉ Contact Me
              </a>
            )}
            {profile.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10 lg:px-8 lg:py-3.5 lg:text-lg"
              >
                📄 Download Resume
              </a>
            )}
          </div>
        </div>
      </section>

      {/* About */}
      {profile.about && (
        <section
          id="about"
          className="mx-auto max-w-3xl scroll-mt-20 px-4 py-8 lg:max-w-6xl lg:px-8 lg:py-12"
        >
          <h2 className="text-xl font-bold lg:text-2xl">About Me</h2>
          <p className="mt-3 text-sm leading-relaxed text-violet-100 lg:max-w-3xl lg:text-base">
            {profile.about}
          </p>
        </section>
      )}

      {/* Showcase (stats + tabs) */}
      <section
        id="showcase"
        className="mx-auto max-w-3xl scroll-mt-20 px-4 py-8 lg:max-w-6xl lg:px-8 lg:py-12"
      >
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
        className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16 text-center lg:max-w-6xl lg:px-8 lg:py-24 lg:text-left"
      >
        <h2 className="text-xl font-bold lg:text-2xl">Get in Touch</h2>
        <p className="mt-2 text-sm text-violet-200 lg:text-base">
          Open to opportunities! Feel free to reach out.
        </p>

        <div className="mt-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-12">
          <div className="mx-auto max-w-md lg:mx-0 lg:max-w-none">
            <ContactForm profileId={profile.id} />
          </div>

          <div className="mt-12 lg:mt-0">
            <h3 className="text-lg font-semibold lg:text-xl">Connect With Me</h3>
            <div className="mx-auto mt-4 flex max-w-md flex-col gap-3 lg:mx-0 lg:max-w-none">
              {profile.contact_email && (
                <FooterLink
                  href={`mailto:${profile.contact_email}`}
                  icon="✉"
                  label="Email"
                  value={profile.contact_email}
                />
              )}
              {profile.social_links.linkedin && (
                <FooterLink
                  href={profile.social_links.linkedin}
                  icon="in"
                  label="LinkedIn"
                  value={profile.social_links.linkedin}
                />
              )}
              {profile.social_links.github && (
                <FooterLink
                  href={profile.social_links.github}
                  icon="⌥"
                  label="GitHub"
                  value={profile.social_links.github}
                />
              )}
              {profile.social_links.twitter && (
                <FooterLink
                  href={profile.social_links.twitter}
                  icon="𝕏"
                  label="Twitter"
                  value={profile.social_links.twitter}
                />
              )}
              {profile.social_links.website && (
                <FooterLink
                  href={profile.social_links.website}
                  icon="🌐"
                  label="Website"
                  value={profile.social_links.website}
                />
              )}
            </div>
          </div>
        </div>

        <p className="mt-16 text-center text-xs text-violet-400 lg:mt-20">
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
  label,
  value,
}: {
  href: string;
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-left transition hover:-translate-y-0.5 hover:border-violet-400/50 hover:bg-white/10 lg:px-5 lg:py-4"
    >
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-base font-semibold text-violet-200 lg:h-11 lg:w-11">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-white lg:text-base">
          {label}
        </span>
        <span className="block truncate text-xs text-violet-300 lg:text-sm">
          {value}
        </span>
      </span>
    </a>
  );
}
