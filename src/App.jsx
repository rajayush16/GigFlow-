export default function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            GigFlow
          </p>
          <h1 className="text-4xl font-semibold sm:text-5xl">
            Launch your next gig with calm, clear focus.
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">
            Vite + React + Tailwind are ready. Start shaping your product
            experience from a clean, minimal foundation.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="text-xl font-medium">Fast dev loop</h2>
            <p className="mt-2 text-sm text-slate-400">
              Hot module reload stays snappy while you build the core flow.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="text-xl font-medium">Tailwind ready</h2>
            <p className="mt-2 text-sm text-slate-400">
              Utility-first styles are wired and waiting for your system.
            </p>
          </div>
        </div>
        <button className="w-fit rounded-full bg-slate-100 px-6 py-2 text-sm font-semibold text-slate-950">
          Build something great
        </button>
      </section>
    </main>
  );
}