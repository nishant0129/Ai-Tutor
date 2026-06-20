"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthContext";

type JobItem = {
  id: string;
  company: string;
  role: string;
  status: string;
};

export default function JobSearchPage() {
  const { loading, user } = useAuth();
  const [items, setItems] = useState<JobItem[]>([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading || !user) return;

    async function loadJobs() {
      const response = await fetch("/api/job-search", {
        credentials: "include",
      });

      if (!response.ok) return;
      const data = await response.json();
      setItems(data.jobs ?? []);
    }

    loadJobs();
  }, [loading, user]);

  const addItem = async () => {
    if (!company || !role) return;
    setError("");

    const response = await fetch("/api/job-search", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, role, status }),
    });

    if (!response.ok) {
      setError("Unable to save this role. Please make sure you are logged in.");
      return;
    }

    const data = await response.json();
    setItems((current) => [data.job, ...current]);
    setCompany("");
    setRole("");
    setStatus("Applied");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-10 text-center">Loading your job tracker…</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-3xl font-semibold">Save your job applications to your account</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Log in to track roles, update stages, and keep your application history across sessions.
          </p>
          <Link href="/login" className="mt-6 inline-flex rounded-full bg-blue-600 px-6 py-3 text-white">
            Log in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-3xl font-semibold">Job search dashboard</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Track your job applications and move them from applied to interviewing, offer, or closed.
          </p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-xl font-semibold">Add new job application</h2>
              <div className="mt-5 space-y-4">
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Role"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  <option>Applied</option>
                  <option>Interviewing</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  Track job
                </button>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
              <h2 className="text-xl font-semibold">Summary</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <p>Total tracked roles: {items.length}</p>
                <p>Interviewing: {items.filter((item) => item.status === "Interviewing").length}</p>
                <p>Offers: {items.filter((item) => item.status === "Offer").length}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold">Applications</h2>
          <div className="mt-4 space-y-4">
            {items.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                Track your first job application here.
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{item.company}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.role}</p>
                    </div>
                    <span className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
