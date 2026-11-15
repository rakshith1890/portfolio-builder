"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveProfile, type SaveState } from "@/app/dashboard/actions";
import ProfileFormFields from "@/app/dashboard/ProfileFormFields";
import TemplatePicker from "@/app/dashboard/TemplatePicker";

const initialState: SaveState = { error: null, success: false };

export default function OnboardingWizard({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState(saveProfile, initialState);
  const [step, setStep] = useState<1 | 2>(1);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  // On a successful publish, send the user to their new live page.
  useEffect(() => {
    if (!state.success) return;
    const usernameField = formRef.current?.elements.namedItem("username");
    const username =
      usernameField instanceof HTMLInputElement ? usernameField.value : "";
    if (username) router.push(`/${username}`);
  }, [state, router]);

  const goToTemplateStep = () => {
    if (formRef.current?.reportValidity()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <form ref={formRef} action={formAction} className="mt-8 space-y-6">
      {/* Default "publish" on — onboarding's whole point is going live. */}
      <input type="hidden" name="published" value="on" />

      <ol className="flex items-center gap-3 text-sm font-medium text-violet-300">
        <StepPill n={1} label="Your details" active={step === 1} done={step > 1} />
        <span className="h-px flex-1 bg-white/10" />
        <StepPill n={2} label="Choose a template" active={step === 2} done={false} />
      </ol>

      <div className={step === 1 ? "space-y-6" : "hidden"}>
        <ProfileFormFields profile={null} email={email} state={state} />

        {state.error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {state.error}
          </p>
        )}

        <button
          type="button"
          onClick={goToTemplateStep}
          className="w-full rounded-lg bg-violet-500 px-4 py-3 font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:-translate-y-0.5 hover:bg-violet-400"
        >
          Continue to template →
        </button>
      </div>

      <div className={step === 2 ? "space-y-6" : "hidden"}>
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Pick a template</h2>
          <p className="mt-0.5 text-sm text-violet-300">
            You can switch this anytime from your dashboard.
          </p>
          <div className="mt-4">
            <TemplatePicker defaultValue="aurora" />
          </div>
        </section>

        {state.error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {state.error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="rounded-lg border border-white/20 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={pending}
            className="flex-1 rounded-lg bg-violet-500 px-4 py-3 font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:-translate-y-0.5 hover:bg-violet-400 disabled:pointer-events-none disabled:opacity-60"
          >
            {pending ? "Publishing…" : "Publish my portfolio 🚀"}
          </button>
        </div>
      </div>
    </form>
  );
}

function StepPill({
  n,
  label,
  active,
  done,
}: {
  n: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
          active || done
            ? "bg-violet-500 text-white"
            : "bg-white/10 text-violet-300"
        }`}
      >
        {done ? "✓" : n}
      </span>
      <span className={active ? "text-white" : ""}>{label}</span>
    </span>
  );
}
