import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getAdminUser, createAdminClient } from "@/lib/supabase/admin";
import { normalizeProfile, type Profile } from "@/lib/types";
import AdminProfileForm from "./AdminProfileForm";

export default async function AdminUserEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const adminUser = await getAdminUser();
  if (!adminUser) {
    redirect("/admin/login");
  }

  const admin = createAdminClient();

  const [{ data: authUser }, { data: profileRow }] = await Promise.all([
    admin.auth.admin.getUserById(id),
    admin.from("profiles").select("*").eq("id", id).maybeSingle<Profile>(),
  ]);

  if (!authUser?.user) {
    notFound();
  }

  const profile = profileRow ? normalizeProfile(profileRow) : null;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div>
          <Link href="/admin" className="text-sm text-slate-400 hover:text-white">
            ← All users
          </Link>
          <p className="mt-1 font-semibold text-white">{authUser.user.email}</p>
        </div>
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
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <span className="inline-block rounded-full border border-rose-400/30 bg-rose-400/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-rose-300">
          Admin edit
        </span>
        <h1 className="mt-2 text-2xl font-bold text-white">
          {profile?.full_name || "Unfinished profile"}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Changes save directly to this user&apos;s portfolio, same as if
          they&apos;d edited it themselves.
        </p>

        <AdminProfileForm
          targetUserId={id}
          profile={profile}
          email={authUser.user.email ?? ""}
        />
      </div>
    </main>
  );
}
