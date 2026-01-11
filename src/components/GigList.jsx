import GigCard from "./GigCard";

export default function GigList({ gigs, selectedGigId, onSelect, onSearch }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Open gigs</h2>
        <input
          className="w-48 rounded-full border border-slate-800 bg-slate-950/70 px-4 py-2 text-xs text-slate-100"
          placeholder="Search title"
          onChange={(event) => onSearch(event.target.value)}
        />
      </div>
      <div className="space-y-3">
        {gigs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-sm text-slate-500">
            No gigs found. Try adjusting the search.
          </div>
        )}
        {gigs.map((gig) => (
          <GigCard
            key={gig._id}
            gig={gig}
            selected={gig._id === selectedGigId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}