"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthContext";

type StudyTask = {
  id: string;
  title: string;
  date: string;
  done: boolean;
};

export default function StudyPlannerPage() {
  const { loading, user } = useAuth();
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading || !user) return;

    async function loadTasks() {
      const response = await fetch("/api/study-planner", {
        credentials: "include",
      });

      if (!response.ok) return;
      const data = await response.json();
      setTasks(data.tasks ?? []);
    }

    loadTasks();
  }, [loading, user]);

  const addTask = async () => {
    if (!title || !date) return;
    setError("");

    const response = await fetch("/api/study-planner", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, date }),
    });

    if (!response.ok) {
      setError("Unable to save the task. Please log in and try again.");
      return;
    }

    const data = await response.json();
    setTasks((current) => [data.task, ...current]);
    setTitle("");
    setDate("");
  };

  const toggleDone = async (id: string, done: boolean) => {
    await fetch("/api/study-planner", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, done }),
    });

    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done } : task
      )
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-10 text-center">Loading your study planner…</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-3xl font-semibold">Keep your study plan saved to your account</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Sign in to preserve your study tasks and jump back into preparation whenever you need.
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
          <h1 className="text-3xl font-semibold">Study planner</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Plan your practice sessions, schedule study blocks, and keep your career prep on track.
          </p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-xl font-semibold">Add study task</h2>
              <div className="mt-5 space-y-4">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task description"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={addTask}
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  Add task
                </button>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
              <h2 className="text-xl font-semibold">Today&apos;s focus</h2>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                {tasks.filter((task) => !task.done).length} tasks left, {tasks.filter((task) => task.done).length} completed.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold">Planned study tasks</h2>
          <div className="mt-4 space-y-4">
            {tasks.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                Create a study task to start planning your practice timeline.
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className={`text-lg font-semibold ${task.done ? "text-slate-400 line-through" : "text-slate-900 dark:text-slate-100"}`}>
                      {task.title}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(task.date).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => toggleDone(task.id, !task.done)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${task.done ? "border border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" : "bg-blue-600 text-white hover:bg-blue-500"}`}
                  >
                    {task.done ? "Mark incomplete" : "Mark complete"}
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
