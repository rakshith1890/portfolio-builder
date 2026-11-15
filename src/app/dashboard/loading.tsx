export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900 px-6 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="h-10 w-1/3 animate-pulse rounded-lg bg-white/10" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/5"
          />
        ))}
      </div>
    </main>
  );
}
