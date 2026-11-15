import Image from "next/image";
import type { Profile } from "@/lib/types";
import { getTechIcon } from "@/lib/techIcons";
import NovaNav from "./NovaNav";
import NovaShowcase from "./NovaShowcase";
import Typewriter from "../../Typewriter";
import ContactForm from "../../ContactForm";

const BLOB = "rounded-[71%_29%_65%_35%/50%_45%_55%_50%]";

export default function NovaTemplate({ profile }: { profile: Profile }) {
  const skillGroupsWithIcons = profile.skill_groups.map((group) => ({
    category: group.category,
    items: group.items.map((name) => ({ name, icon: getTechIcon(name) })),
  }));

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 text-teal-50">
      <NovaNav fullName={profile.full_name} contactEmail={profile.contact_email} />

      {/* Hero */}
      <section
        id="top"
        className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-10 px-4 pt-32 pb-20 sm:px-6 lg:flex-row lg:gap-16 lg:px-8 lg:pt-40 lg:pb-28"
      >
        <div className="w-full text-center lg:flex-1 lg:text-left">
          {profile.role_title && (
            <span className="inline-block rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-300">
              {profile.role_title}
            </span>
          )}

          <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Hi, I&apos;m <span className="text-teal-300">{profile.full_name}</span>
          </h1>

          {(profile.typewriter_phrases.length > 0 || profile.tagline) && (
            <p className="mt-4 min-h-[1.6em] text-lg font-semibold text-teal-100/80 sm:text-xl">
              {profile.typewriter_phrases.length > 0 ? (
                <>
                  I am a{" "}
                  <span className="text-teal-300">
                    <Typewriter phrases={profile.typewriter_phrases} />
                  </span>
                </>
              ) : (
                profile.tagline
              )}
            </p>
          )}

          {profile.bio && (
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-teal-100/70 lg:mx-0 lg:text-base">
              {profile.bio}
            </p>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            {profile.projects.length > 0 && (
              <a
                href="#projects"
                className="rounded-xl bg-teal-400 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-teal-900/30 transition hover:-translate-y-0.5 hover:bg-teal-300"
              >
                View Projects
              </a>
            )}
            {profile.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-teal-400/30 px-6 py-3 font-semibold text-teal-100 transition hover:-translate-y-0.5 hover:border-teal-400/60 hover:bg-white/5"
              >
                Download CV
              </a>
            )}
          </div>

          {(profile.social_links.github ||
            profile.social_links.linkedin ||
            profile.social_links.twitter ||
            profile.social_links.website ||
            profile.contact_email) && (
            <div className="mt-7 flex justify-center gap-3 lg:justify-start">
              {profile.contact_email && (
                <SocialIcon href={`mailto:${profile.contact_email}`} label="Email">
                  ✉
                </SocialIcon>
              )}
              {profile.social_links.github && (
                <SocialIcon href={profile.social_links.github} label="GitHub">
                  ⌥
                </SocialIcon>
              )}
              {profile.social_links.linkedin && (
                <SocialIcon href={profile.social_links.linkedin} label="LinkedIn">
                  in
                </SocialIcon>
              )}
              {profile.social_links.twitter && (
                <SocialIcon href={profile.social_links.twitter} label="Twitter">
                  𝕏
                </SocialIcon>
              )}
              {profile.social_links.website && (
                <SocialIcon href={profile.social_links.website} label="Website">
                  🌐
                </SocialIcon>
              )}
            </div>
          )}
        </div>

        {profile.photo_url && (
          <div className="relative mx-auto aspect-square w-56 flex-shrink-0 sm:w-72 lg:w-96">
            <div className={`absolute inset-0 ${BLOB} border border-teal-400/30`} />
            <div className={`absolute inset-3 overflow-hidden ${BLOB} bg-teal-900/40`}>
              <Image
                src={profile.photo_url}
                alt={profile.full_name}
                fill
                priority
                sizes="(min-width: 1024px) 384px, 256px"
                className="object-cover"
              />
            </div>
          </div>
        )}
      </section>

      {/* About */}
      {(profile.about || profile.tagline) && (
        <section
          id="about"
          className="mx-auto scroll-mt-24 border-t border-white/5 px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
        >
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-400">
              About
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              {profile.tagline || "A little more about me"}
            </h2>
            {profile.about && (
              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-teal-100/70 sm:text-base">
                {profile.about}
              </p>
            )}
            {profile.skills.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span
                    key={`${skill}-${i}`}
                    className="rounded-full border border-teal-400/20 bg-teal-400/5 px-3 py-1.5 text-xs font-medium text-teal-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Showcase */}
      <section className="mx-auto max-w-6xl scroll-mt-24 border-t border-white/5 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-400">
          Portfolio
        </p>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Selected work</h2>
        <div className="mt-8">
          <NovaShowcase
            experience={profile.experience}
            projects={profile.projects}
            education={profile.education}
            certificates={profile.certificates}
            skills={profile.skills}
            skillGroups={skillGroupsWithIcons}
          />
        </div>
      </section>

      {/* Contact */}
      <footer
        id="contact"
        className="mx-auto max-w-6xl scroll-mt-24 border-t border-white/5 px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-400">
          Contact
        </p>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Let&apos;s build something</h2>
        <p className="mt-2 max-w-lg text-sm text-teal-100/60">
          Open to new opportunities and collaborations — send a message.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ContactForm profileId={profile.id} accent="nova" />

          <div className="space-y-3">
            {profile.contact_email && (
              <ContactRow icon="✉" label="Email" value={profile.contact_email} href={`mailto:${profile.contact_email}`} />
            )}
            {profile.social_links.linkedin && (
              <ContactRow icon="in" label="LinkedIn" value={profile.social_links.linkedin} href={profile.social_links.linkedin} />
            )}
            {profile.social_links.github && (
              <ContactRow icon="⌥" label="GitHub" value={profile.social_links.github} href={profile.social_links.github} />
            )}
            {profile.social_links.twitter && (
              <ContactRow icon="𝕏" label="Twitter" value={profile.social_links.twitter} href={profile.social_links.twitter} />
            )}
            {profile.social_links.website && (
              <ContactRow icon="🌐" label="Website" value={profile.social_links.website} href={profile.social_links.website} />
            )}
          </div>
        </div>

        <p className="mt-16 text-center text-xs text-teal-100/30">
          © {new Date().getFullYear()} {profile.full_name}. Built with Portfolio Builder.
        </p>
      </footer>
    </main>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-400/20 text-sm font-semibold text-teal-100/80 transition hover:-translate-y-0.5 hover:border-teal-400/50 hover:text-teal-100"
    >
      {children}
    </a>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: string;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition hover:-translate-y-0.5 hover:border-teal-400/30 hover:bg-teal-400/5"
    >
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-400/10 text-base font-semibold text-teal-300">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-teal-50">{label}</span>
        <span className="block truncate text-xs text-teal-100/50">{value}</span>
      </span>
    </a>
  );
}
