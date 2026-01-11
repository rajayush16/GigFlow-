import { useState } from "react";

export default function BidPanel({ onSubmit, disabled }) {
  const [form, setForm] = useState({ message: "", price: "" });
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
      await onSubmit({ message: form.message, price: Number(form.price) });
      setForm({ message: "", price: "" });
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
      <h3 className="text-base font-semibold text-slate-100">Place a bid</h3>
      <div className="mt-4 space-y-3">
        <textarea
          className="min-h-[110px] w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm text-slate-100"
          placeholder="Write a concise proposal"
          name="message"
          value={form.message}
          onChange={handleChange}
          required
        />
        <input
          className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm text-slate-100"
          placeholder="Bid price"
          name="price"
          type="number"
          min="0"
          value={form.price}
          onChange={handleChange}
          required
        />
        {error && <p className="text-xs text-rose-300">{error}</p>}
        <button
          className="w-full rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900"
          type="submit"
          disabled={busy || disabled}
        >
          {busy ? "Sending..." : disabled ? "Log in to bid" : "Submit bid"}
        </button>
      </div>
    </form>
  );
}