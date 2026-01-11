export default function BidList({ bids, onHire, loading }) {
  if (!bids) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-100">Bids</h3>
        <span className="text-xs text-slate-500">{bids.length} total</span>
      </div>
      <div className="mt-4 space-y-3">
        {bids.length === 0 && (
          <p className="text-sm text-slate-500">No bids yet.</p>
        )}
        {bids.map((bid) => (
          <div
            key={bid._id}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-100">
                  {bid.freelancerId?.name || "Freelancer"}
                </p>
                <p className="text-xs text-slate-500">
                  {bid.freelancerId?.email}
                </p>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-amber-300">
                ${bid.price}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-300">{bid.message}</p>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="uppercase tracking-[0.2em] text-slate-500">
                {bid.status}
              </span>
              {bid.status === "pending" && (
                <button
                  className="rounded-full border border-emerald-300 px-4 py-1 text-emerald-200"
                  onClick={() => onHire(bid._id)}
                  disabled={loading}
                >
                  {loading ? "Hiring..." : "Hire"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}