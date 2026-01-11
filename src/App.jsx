import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "./lib/api";
import { useAuth } from "./context/AuthContext";
import AuthPanel from "./components/AuthPanel";
import GigList from "./components/GigList";
import GigDetails from "./components/GigDetails";
import NewGigForm from "./components/NewGigForm";
import NotificationStack from "./components/NotificationStack";

export default function App() {
  const { user, loading, logout } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [selectedGig, setSelectedGig] = useState(null);
  const [bids, setBids] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [hireBusy, setHireBusy] = useState(false);
  const [error, setError] = useState("");
  const bidDisabledLabel = useMemo(() => {
    if (!selectedGig) {
      return "Select a gig";
    }
    if (!user) {
      return "Log in to bid";
    }
    if (isOwner) {
      return "You're the client";
    }
    if (selectedGig.status === "assigned") {
      return "Bidding closed";
    }
    return "";
  }, [selectedGig, user, isOwner]);

  const isOwner = useMemo(() => {
    if (!user || !selectedGig) {
      return false;
    }
    return String(user.id) === String(selectedGig.ownerId?._id || selectedGig.ownerId);
  }, [user, selectedGig]);

  const loadGigs = async (query = "") => {
    try {
      const data = await apiRequest(`/api/gigs?search=${encodeURIComponent(query)}`);
      setGigs(data.gigs || []);

      if (selectedGig) {
        const updated = data.gigs.find((gig) => gig._id === selectedGig._id);
        setSelectedGig(updated || selectedGig);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadGigs(searchTerm);
  }, [searchTerm]);

  const handleSelectGig = async (gig) => {
    setSelectedGig(gig);
    setBids(null);

    if (user && String(user.id) === String(gig.ownerId?._id || gig.ownerId)) {
      try {
        const data = await apiRequest(`/api/bids/${gig._id}`);
        setBids(data.bids);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    if (!user || !selectedGig || !isOwner) {
      return;
    }

    apiRequest(`/api/bids/${selectedGig._id}`)
      .then((data) => setBids(data.bids))
      .catch((err) => setError(err.message));
  }, [user, selectedGig, isOwner]);

  const handleCreateGig = async (payload) => {
    const data = await apiRequest("/api/gigs", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    await loadGigs(searchTerm);
    setSelectedGig(data.gig);
  };

  const handleBid = async (payload) => {
    if (!selectedGig) {
      return;
    }
    await apiRequest("/api/bids", {
      method: "POST",
      body: JSON.stringify({ ...payload, gigId: selectedGig._id }),
    });
  };

  const handleHire = async (bidId) => {
    if (!selectedGig) {
      return;
    }

    setHireBusy(true);
    try {
      await apiRequest(`/api/bids/${bidId}/hire`, { method: "PATCH" });
      const data = await apiRequest(`/api/bids/${selectedGig._id}`);
      setBids(data.bids);
      await loadGigs(searchTerm);
    } finally {
      setHireBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.1),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(251,191,36,0.12),_transparent_60%)]" />
      <NotificationStack />
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
        <header className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-950/70 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-amber-300">
              GigFlow
            </p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
              A focused freelance marketplace.
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Post gigs, review bids, and hire with realtime updates.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-4 text-sm">
            {loading ? (
              <p className="text-slate-400">Checking session...</p>
            ) : user ? (
              <div className="space-y-2">
                <p className="text-slate-200">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
                <button
                  className="rounded-full border border-slate-700 px-4 py-1 text-xs text-slate-200"
                  onClick={logout}
                >
                  Log out
                </button>
              </div>
            ) : (
              <p className="text-slate-400">Sign in to post or bid.</p>
            )}
          </div>
        </header>

        {error && (
          <div className="rounded-2xl border border-rose-400/40 bg-rose-950/30 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6">
            <GigList
              gigs={gigs}
              selectedGigId={selectedGig?._id}
              onSelect={handleSelectGig}
              onSearch={setSearchTerm}
            />
            {user ? (
              <NewGigForm onCreate={handleCreateGig} />
            ) : (
              <AuthPanel />
            )}
          </div>
          <div>
            <GigDetails
              gig={selectedGig}
              isOwner={isOwner}
              bids={bids}
              onBid={handleBid}
              onHire={handleHire}
              hireBusy={hireBusy}
              bidDisabled={!user || isOwner || selectedGig?.status === "assigned"}
              disabledLabel={bidDisabledLabel}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
