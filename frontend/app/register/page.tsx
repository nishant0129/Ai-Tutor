"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../components/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const ok = await register(username.trim(), email.trim(), password);
    setLoading(false);
    if (!ok) {
      setError("An account with that email already exists.");
      return;
    }
    router.push("/");
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white px-8 py-10 shadow-md dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-2 text-sm text-slate-500">Sign up to save sessions and personalise your practice.</p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col text-sm">
            <span className="mb-2 text-xs font-semibold text-slate-600">Full name</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-2 text-xs font-semibold text-slate-600">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-2 text-xs font-semibold text-slate-600">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-xl bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-600">
          Already have an account? <Link href="/login" className="text-blue-600">Log in</Link>
        </div>
      </div>
    </div>
  );
}
