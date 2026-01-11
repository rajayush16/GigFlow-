export default function GigCard({ gig, selected, onSelect }) {
  return (
    <button
      className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
        selected
          ? "border-amber-300 bg-slate-900"
          : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
      }`}
      onClick={() => onSelect(gig)}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-100">{gig.title}</h3>
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
          ${gig.budget}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-400">
        {gig.description}
      </p>
      <div className="mt-4 text-xs text-slate-500">
        Posted by {gig.ownerId?.name || "Unknown"}
      </div>
    </button>
  );
}
