"use client";

import { useState } from "react";
import Link from "next/link";
import type { Profile } from "@/lib/types";

export interface AdminUserRow {
  id: string;
  email: string;
  authCreatedAt: string;
  profile: Profile | null;
}

export default function AdminUsersTable({ rows }: { rows: AdminUserRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = rows.filter((row) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      row.email.toLowerCase().includes(q) ||
      (row.profile?.username ?? "").toLowerCase().includes(q) ||
      (row.profile?.full_name ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="mt-6">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by email, username, or name…"
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-rose-400 sm:max-w-sm"
      />

      <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Template</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((row) => (
              <tr key={row.id} className="group transition hover:bg-white/5">
                <td className="p-0">
                  <Link
                    href={`/admin/users/${row.id}`}
                    className="block px-4 py-3 text-white"
                  >
                    {row.email}
                  </Link>
                </td>
                <td className="p-0">
                  <Link
                    href={`/admin/users/${row.id}`}
                    className="block px-4 py-3 text-slate-300"
                  >
                    {row.profile?.full_name || "—"}
                  </Link>
                </td>
                <td className="p-0">
                  <Link
                    href={`/admin/users/${row.id}`}
                    className="block px-4 py-3 text-slate-300"
                  >
                    {row.profile?.username ? `@${row.profile.username}` : "—"}
                  </Link>
                </td>
                <td className="p-0">
                  <Link
                    href={`/admin/users/${row.id}`}
                    className="block px-4 py-3 capitalize text-slate-300"
                  >
                    {row.profile?.template ?? "—"}
                  </Link>
                </td>
                <td className="p-0">
                  <Link
                    href={`/admin/users/${row.id}`}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    {row.profile ? (
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          row.profile.published
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-amber-400/10 text-amber-300"
                        }`}
                      >
                        {row.profile.published ? "Published" : "Draft"}
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-400/10 px-2.5 py-1 text-xs font-semibold text-slate-400">
                        Not started
                      </span>
                    )}
                    <span className="text-slate-500 opacity-0 transition group-hover:opacity-100">
                      Edit →
                    </span>
                  </Link>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No users match &quot;{query}&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
