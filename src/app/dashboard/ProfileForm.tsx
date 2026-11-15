"use client";

import { useActionState } from "react";
import { saveProfile, type SaveState } from "./actions";
import ProfileFormFields from "./ProfileFormFields";
import TemplatePicker from "./TemplatePicker";
import type { Profile } from "@/lib/types";

const initialState: SaveState = { error: null, success: false };

export default function ProfileForm({
  profile,
  email,
}: {
  profile: Profile | null;
  email: string;
}) {
  const [state, formAction, pending] = useActionState(saveProfile, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <ProfileFormFields profile={profile} email={email} state={state} />

      <section
        id="template"
        className="scroll-mt-20 rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <h2 className="text-lg font-semibold text-white">Template</h2>
        <p className="mt-0.5 text-sm text-violet-300">
          Switch the design your public page uses — your data stays the same.
        </p>
        <div className="mt-4">
          <TemplatePicker
            defaultValue={profile?.template ?? "aurora"}
            previewUsername={profile?.username || undefined}
          />
        </div>
      </section>

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
        className="w-full rounded-lg bg-violet-500 px-4 py-3 font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:-translate-y-0.5 hover:bg-violet-400 disabled:pointer-events-none disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
