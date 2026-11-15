import { redirect } from "next/navigation";
import { getAdminUser, createAdminClient } from "@/lib/supabase/admin";
import { normalizeProfile, type Profile } from "@/lib/types";
import { adminLogOut } from "./actions";
import AdminUsersTable, { type AdminUserRow } from "./AdminUsersTable";

export default async function AdminPage() {
  const adminUser = await getAdminUser();
  if (!adminUser) {
    redirect("/admin/login");
  }

  const admin = createAdminClient();

  const [{ data: profileRows }, { data: userList }] = await Promise.all([
    admin.from("profiles").select("*").returns<Profile[]>(),
    admin.auth.admin.listUsers({ page: 1, perPage: 200 }),
  ]);

  const profilesById = new Map(
    (profileRows ?? []).map((row) => [row.id, normalizeProfile(row)])
  );

  const rows: AdminUserRow[] = (userList?.users ?? [])
    .map((u) => ({
      id: u.id,
      email: u.email ?? "(no email)",
      authCreatedAt: u.created_at,
      profile: profilesById.get(u.id) ?? null,
    }))
    .sort((a, b) => (a.authCreatedAt < b.authCreatedAt ? 1 : -1));

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div>
          <span className="inline-block rounded-full border border-rose-400/30 bg-rose-400/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-rose-300">
            Admin
          </span>
          <p className="mt-1 font-semibold text-white">{adminUser.email}</p>
        </div>
        <form action={adminLogOut}>
          <button
            type="submit"
            className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/10"
          >
            Log out
          </button>
        </form>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold">All users</h1>
        <p className="mt-1 text-sm text-slate-400">
          {rows.length} account{rows.length === 1 ? "" : "s"}. Click any row
          to open and edit that user&apos;s portfolio.
        </p>

        <AdminUsersTable rows={rows} />
      </div>
    </main>
  );
}
