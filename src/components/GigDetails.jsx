import BidList from "./BidList";
import BidPanel from "./BidPanel";

export default function GigDetails({
  gig,
  isOwner,
  bids,
  onBid,
  onHire,
  hireBusy,
  bidDisabled,
}) {
  if (!gig) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-800 p-10 text-sm text-slate-500">
        Select a gig to view details.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-100">{gig.title}</h2>
            <p className="mt-2 text-sm text-slate-400">
              {gig.ownerId?.name} · {gig.ownerId?.email}
            </p>
          </div>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
            {gig.status}
          </span>
        </div>
        <p className="mt-4 text-sm text-slate-300">{gig.description}</p>
        <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
          <span>Budget</span>
          <span className="text-lg font-semibold text-amber-300">${gig.budget}</span>
        </div>
      </div>

      {isOwner ? (
        <BidList bids={bids} onHire={onHire} loading={hireBusy} />
      ) : (
        <BidPanel onSubmit={onBid} disabled={bidDisabled} />
      )}
    </div>
  );
}