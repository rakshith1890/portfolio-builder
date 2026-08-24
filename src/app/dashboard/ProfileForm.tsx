"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { saveProfile, type SaveState } from "./actions";
import type {
  CertificateItem,
  EducationItem,
  ExperienceItem,
  Profile,
  ProjectItem,
  SocialLinks,
} from "@/lib/types";

const initialState: SaveState = { error: null, success: false };

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-violet-200">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder-violet-300/50 outline-none focus:border-violet-400";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {description && (
        <p className="mt-0.5 text-sm text-violet-300">{description}</p>
      )}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export default function ProfileForm({
  profile,
  email,
}: {
  profile: Profile | null;
  email: string;
}) {
  const [state, formAction, pending] = useActionState(
    saveProfile,
    initialState
  );

  const [photoPreview, setPhotoPreview] = useState<string | null>(
    profile?.photo_url ?? null
  );
  const [experience, setExperience] = useState<ExperienceItem[]>(
    profile?.experience ?? []
  );
  const [projects, setProjects] = useState<ProjectItem[]>(
    profile?.projects ?? []
  );
  const [education, setEducation] = useState<EducationItem[]>(
    profile?.education ?? []
  );
  const [certificates, setCertificates] = useState<CertificateItem[]>(
    profile?.certificates ?? []
  );
  const [social, setSocial] = useState<SocialLinks>(
    profile?.social_links ?? {}
  );

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <input
        type="hidden"
        name="existing_photo_url"
        value={profile?.photo_url ?? ""}
      />
      <input type="hidden" name="experience" value={JSON.stringify(experience)} />
      <input type="hidden" name="projects" value={JSON.stringify(projects)} />
      <input type="hidden" name="education" value={JSON.stringify(education)} />
      <input
        type="hidden"
        name="certificates"
        value={JSON.stringify(certificates)}
      />
      <input type="hidden" name="social_links" value={JSON.stringify(social)} />

      <Section
        title="Your page URL"
        description="This is where your public portfolio will live."
      >
        <Field label="Username">
          <div className="flex items-center gap-1 text-violet-300">
            <span className="text-sm">yourapp.com/</span>
            <input
              name="username"
              defaultValue={profile?.username ?? ""}
              required
              pattern="[a-z0-9-]{3,30}"
              title="Lowercase letters, numbers, and hyphens only (3-30 chars)"
              className={inputClass}
              placeholder="jane-doe"
            />
          </div>
        </Field>
      </Section>

      <Section
        title="Photo"
        description="Shown large at the top of your public page."
      >
        <div className="flex items-center gap-5">
          {photoPreview ? (
            <Image
              src={photoPreview}
              alt="Profile preview"
              width={112}
              height={112}
              className="h-28 w-28 rounded-full border-2 border-violet-400/50 object-cover shadow-lg"
              unoptimized
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-dashed border-white/20 bg-white/10 text-4xl">
              🙂
            </div>
          )}
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPhotoPreview(URL.createObjectURL(file));
            }}
            className="text-sm text-violet-200 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-violet-500 file:px-3 file:py-1.5 file:text-white file:transition hover:file:bg-violet-400"
          />
        </div>
      </Section>

      <Section title="Hero section" description="The first thing visitors see.">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full name">
            <input
              name="full_name"
              defaultValue={profile?.full_name ?? ""}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Pronouns (optional)">
            <input
              name="pronouns"
              defaultValue={profile?.pronouns ?? ""}
              className={inputClass}
              placeholder="she/her"
            />
          </Field>
        </div>
        <Field label="Role / title">
          <input
            name="role_title"
            defaultValue={profile?.role_title ?? ""}
            className={inputClass}
            placeholder="Full Stack Engineer"
          />
        </Field>
        <Field label="Tagline">
          <input
            name="tagline"
            defaultValue={profile?.tagline ?? ""}
            className={inputClass}
            placeholder="Creating Tomorrow, Today."
          />
        </Field>
        <Field label="Short bio">
          <textarea
            name="bio"
            defaultValue={profile?.bio ?? ""}
            rows={3}
            className={inputClass}
          />
        </Field>
        <Field label="Skills (comma separated)">
          <input
            name="skills"
            defaultValue={(profile?.skills ?? []).join(", ")}
            className={inputClass}
            placeholder="React, Node, AWS"
          />
        </Field>
      </Section>

      <Section title="About" description="Your longer, mid-page bio.">
        <textarea
          name="about"
          defaultValue={profile?.about ?? ""}
          rows={4}
          className={inputClass}
        />
      </Section>

      <ListSection
        title="Experience"
        items={experience}
        setItems={setExperience}
        empty={{ title: "", company: "", start_date: "", end_date: "", description: "" }}
        renderFields={(item, update) => (
          <>
            <div className="grid grid-cols-2 gap-3">
              <input
                className={inputClass}
                placeholder="Title"
                value={item.title}
                onChange={(e) => update({ ...item, title: e.target.value })}
              />
              <input
                className={inputClass}
                placeholder="Company"
                value={item.company}
                onChange={(e) => update({ ...item, company: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                className={inputClass}
                placeholder="Start date"
                value={item.start_date}
                onChange={(e) => update({ ...item, start_date: e.target.value })}
              />
              <input
                className={inputClass}
                placeholder="End date (or Present)"
                value={item.end_date}
                onChange={(e) => update({ ...item, end_date: e.target.value })}
              />
            </div>
            <textarea
              className={inputClass}
              placeholder="Description"
              rows={2}
              value={item.description}
              onChange={(e) => update({ ...item, description: e.target.value })}
            />
          </>
        )}
      />

      <ListSection
        title="Projects"
        items={projects}
        setItems={setProjects}
        empty={{ title: "", description: "", link: "", image_url: "" }}
        renderFields={(item, update) => (
          <>
            <input
              className={inputClass}
              placeholder="Project title"
              value={item.title}
              onChange={(e) => update({ ...item, title: e.target.value })}
            />
            <textarea
              className={inputClass}
              placeholder="Description"
              rows={2}
              value={item.description}
              onChange={(e) => update({ ...item, description: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Link (optional)"
              value={item.link}
              onChange={(e) => update({ ...item, link: e.target.value })}
            />
          </>
        )}
      />

      <ListSection
        title="Education"
        items={education}
        setItems={setEducation}
        empty={{ school: "", degree: "", start_date: "", end_date: "" }}
        renderFields={(item, update) => (
          <>
            <input
              className={inputClass}
              placeholder="School"
              value={item.school}
              onChange={(e) => update({ ...item, school: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Degree"
              value={item.degree}
              onChange={(e) => update({ ...item, degree: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className={inputClass}
                placeholder="Start date"
                value={item.start_date}
                onChange={(e) => update({ ...item, start_date: e.target.value })}
              />
              <input
                className={inputClass}
                placeholder="End date"
                value={item.end_date}
                onChange={(e) => update({ ...item, end_date: e.target.value })}
              />
            </div>
          </>
        )}
      />

      <ListSection
        title="Certificates"
        items={certificates}
        setItems={setCertificates}
        empty={{ name: "", issuer: "", date: "", link: "" }}
        renderFields={(item, update) => (
          <>
            <input
              className={inputClass}
              placeholder="Certificate name"
              value={item.name}
              onChange={(e) => update({ ...item, name: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Issuer"
              value={item.issuer}
              onChange={(e) => update({ ...item, issuer: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Link (optional)"
              value={item.link}
              onChange={(e) => update({ ...item, link: e.target.value })}
            />
          </>
        )}
      />

      <Section title="Footer / contact">
        <Field label="Contact email">
          <input
            type="email"
            name="contact_email"
            defaultValue={profile?.contact_email ?? email}
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="LinkedIn URL">
            <input
              className={inputClass}
              value={social.linkedin ?? ""}
              onChange={(e) => setSocial({ ...social, linkedin: e.target.value })}
            />
          </Field>
          <Field label="GitHub URL">
            <input
              className={inputClass}
              value={social.github ?? ""}
              onChange={(e) => setSocial({ ...social, github: e.target.value })}
            />
          </Field>
          <Field label="Twitter / X URL">
            <input
              className={inputClass}
              value={social.twitter ?? ""}
              onChange={(e) => setSocial({ ...social, twitter: e.target.value })}
            />
          </Field>
          <Field label="Website URL">
            <input
              className={inputClass}
              value={social.website ?? ""}
              onChange={(e) => setSocial({ ...social, website: e.target.value })}
            />
          </Field>
        </div>
      </Section>

      <Section title="Visibility">
        <label className="flex items-center gap-2 text-sm text-violet-200">
          <input
            type="checkbox"
            name="published"
            defaultChecked={profile?.published ?? true}
            className="h-4 w-4 rounded"
          />
          Publish my page publicly
        </label>
      </Section>

      {state.error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-300">
          Saved!
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-violet-500 px-4 py-3 font-semibold text-white transition hover:bg-violet-400 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

function ListSection<T extends Record<string, string>>({
  title,
  items,
  setItems,
  empty,
  renderFields,
}: {
  title: string;
  items: T[];
  setItems: (items: T[]) => void;
  empty: T;
  renderFields: (item: T, update: (next: T) => void) => React.ReactNode;
}) {
  return (
    <Section title={title}>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="space-y-3 rounded-xl border border-white/10 bg-black/10 p-4"
        >
          {renderFields(item, (next) => {
            const copy = [...items];
            copy[idx] = next;
            setItems(copy);
          })}
          <button
            type="button"
            onClick={() => setItems(items.filter((_, i) => i !== idx))}
            className="text-sm text-red-300 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems([...items, empty])}
        className="rounded-lg border border-dashed border-white/20 px-3 py-2 text-sm text-violet-200 hover:bg-white/10"
      >
        + Add {title.toLowerCase().replace(/s$/, "")}
      </button>
    </Section>
  );
}
