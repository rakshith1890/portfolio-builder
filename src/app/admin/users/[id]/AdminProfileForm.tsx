"use client";

import { useActionState } from "react";
import { adminSaveProfile } from "@/app/admin/actions";
import type { SaveState } from "@/app/dashboard/actions";
import ProfileFormFields from "@/app/dashboard/ProfileFormFields";
import TemplatePicker from "@/app/dashboard/TemplatePicker";
import type { Profile } from "@/lib/types";

const initialState: SaveState = { error: null, success: false };

export default function AdminProfileForm({
  targetUserId,
  profile,
  email,
}: {
  targetUserId: string;
  profile: Profile | null;
  email: string;
}) {
  const boundAction = adminSaveProfile.bind(null, targetUserId);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <ProfileFormFields profile={profile} email={email} state={state} />

      <section
        id="template"
        className="scroll-mt-20 rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <h2 className="text-lg font-semibold text-white">Template</h2>
        <p className="mt-0.5 text-sm text-violet-300">
          Which design this user&apos;s public page uses.
        </p>
        <div className="mt-4">
          <TemplatePicker
            defaultValue={profile?.template ?? "aurora"}
            previewUsername={profile?.username || undefined}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Visibility</h2>
        <label className="mt-4 flex items-center gap-2 text-sm text-violet-200">
          <input
            type="checkbox"
            name="published"
            defaultChecked={profile?.published ?? true}
            className="h-4 w-4 rounded"
          />
          Publish this page publicly
        </label>
      </section>

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
        className="w-full rounded-lg bg-rose-500 px-4 py-3 font-semibold text-white shadow-lg shadow-rose-900/40 transition hover:-translate-y-0.5 hover:bg-rose-400 disabled:pointer-events-none disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
