export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-white/60" />
        <p className="text-sm text-white/40">Loading portfolio…</p>
      </div>
    </main>
  );
}
