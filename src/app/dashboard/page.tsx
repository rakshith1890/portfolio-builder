import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logOut } from "@/app/auth/actions";
import ProfileForm from "./ProfileForm";
import type { Profile } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div>
          <p className="font-semibold text-white">Portfolio Builder</p>
          <p className="text-xs text-violet-300">{user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          {profile?.username && (
            <a
              href={`/${profile.username}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/10"
            >
              View live page ↗
            </a>
          )}
          <form action={logOut}>
            <button
              type="submit"
              className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/10"
            >
              Log out
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold text-white">Edit your portfolio</h1>
        <p className="mt-1 text-sm text-violet-200">
          Fill in each section below. Changes go live on your public page as
          soon as you save.
        </p>

        <ProfileForm profile={profile ?? null} email={user.email ?? ""} />
      </div>
    </main>
  );
}
