import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OnboardingWizard from "./OnboardingWizard";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  // Onboarding is a one-time, first-run flow — once a profile row exists,
  // send returning users straight to the dashboard to edit it.
  if (profileRow) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-violet-300">
          Welcome to Portfolio Builder
        </p>
        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
          Let&apos;s set up your portfolio
        </h1>
        <p className="mt-2 text-sm text-violet-200">
          Fill in your details, then pick a template — your page goes live
          the moment you publish.
        </p>

        <OnboardingWizard email={user.email ?? ""} />
      </div>
    </main>
  );
}
