import { useState } from "react";

export default function NewGigForm({ onCreate }) {
  const [form, setForm] = useState({ title: "", description: "", budget: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await onCreate({
        title: form.title,
        description: form.description,
        budget: Number(form.budget),
      });
      setForm({ title: "", description: "", budget: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6"
      onSubmit={handleSubmit}
    >
      <h3 className="text-base font-semibold text-slate-100">Post a gig</h3>
      <div className="mt-4 space-y-3">
        <input
          className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm text-slate-100"
          placeholder="Job title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          className="min-h-[110px] w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm text-slate-100"
          placeholder="Describe the work"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm text-slate-100"
          placeholder="Budget (USD)"
          name="budget"
          type="number"
          min="0"
          value={form.budget}
          onChange={handleChange}
          required
        />
        {error && <p className="text-xs text-rose-300">{error}</p>}
        <button
          className="w-full rounded-full bg-emerald-300 px-4 py-2 text-sm font-semibold text-slate-900"
          type="submit"
          disabled={busy}
        >
          {busy ? "Publishing..." : "Publish gig"}
        </button>
      </div>
    </form>
  );
}