"use client";

import { useEffect, useState } from "react";

type InterviewItem = {
  id: string;
  company: string;
  role: string;
  date: string;
  status: string;
};

const STORAGE_KEY = "career-portal-interview-tracker";

export default function InterviewTrackerPage() {
  const [items, setItems] = useState<InterviewItem[]>([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Planned");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!company || !role || !date) return;
    const next: InterviewItem = {
      id: Date.now().toString(),
      company,
      role,
      date,
      status,
    };
    setItems((current) => [next, ...current]);
    setCompany("");
    setRole("");
    setDate("");
    setStatus("Planned");
  };

  const updateStatus = (id: string, nextStatus: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item
      )
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-3xl font-semibold">Interview tracker</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Organize upcoming interview rounds, set employer goals, and update statuses as you move forward.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold">Add a new interview</h2>
            <div className="mt-5 space-y-4">
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company name"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Role / position"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  <option>Planned</option>
                  <option>Scheduled</option>
                  <option>Completed</option>
                  <option>Offer</option>
                </select>
              </div>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Add interview
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold">Your progress</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <p>Interviews logged: {items.length}</p>
              <p>Next scheduled: {items.filter((item) => item.status === "Scheduled").length}</p>
              <p>Offers received: {items.filter((item) => item.status === "Offer").length}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold">Interview list</h2>
          <div className="mt-4 space-y-4">
            {items.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                No interviews added yet. Create one to start tracking your next round.
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{item.company}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.role}</p>
                    </div>
                    <div className="space-y-1 text-right text-sm text-slate-500 dark:text-slate-400">
                      <p>{new Date(item.date).toLocaleDateString()}</p>
                      <span className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.status !== "Planned" && (
                      <button
                        onClick={() => updateStatus(item.id, "Planned")}
                        className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                      >
                        Set Planned
                      </button>
                    )}
                    {item.status !== "Scheduled" && (
                      <button
                        onClick={() => updateStatus(item.id, "Scheduled")}
                        className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                      >
                        Set Scheduled
                      </button>
                    )}
                    {item.status !== "Completed" && (
                      <button
                        onClick={() => updateStatus(item.id, "Completed")}
                        className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                      >
                        Set Completed
                      </button>
                    )}
                    {item.status !== "Offer" && (
                      <button
                        onClick={() => updateStatus(item.id, "Offer")}
                        className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                      >
                        Set Offer
                      </button>
                    )}
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
