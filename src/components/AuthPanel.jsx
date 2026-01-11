import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthPanel() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-100">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h2>
        <button
          className="text-xs uppercase tracking-[0.2em] text-amber-300"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Sign up" : "Log in"}
        </button>
      </div>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {mode === "register" && (
          <input
            className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100"
            placeholder="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100"
          placeholder="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100"
          placeholder="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error && <p className="text-sm text-rose-300">{error}</p>}
        <button
          className="w-full rounded-full bg-amber-300 px-4 py-3 text-sm font-semibold text-slate-900"
          type="submit"
          disabled={busy}
        >
          {busy ? "Working..." : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>
    </div>
  );
}