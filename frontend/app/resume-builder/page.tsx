"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "career-portal-resume-builder";

export default function ResumeBuilderPage() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setName(parsed.name || "");
      setTitle(parsed.title || "");
      setSummary(parsed.summary || "");
      setSkills(parsed.skills || "");
      setExperience(parsed.experience || "");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ name, title, summary, skills, experience })
    );
  }, [name, title, summary, skills, experience]);

  return (
    <main className="min-h-screen bg-slate-50 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-3xl font-semibold">Resume builder</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Create a simple resume draft and preview it side-by-side as you write.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold">Resume details</h2>
            <div className="mt-5 space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Professional title"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Summary / objective"
                rows={4}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Skills (comma separated)"
                rows={3}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Experience summary"
                rows={5}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold">Resume preview</h2>
            <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{name || "Your Name"}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{title || "Professional Title"}</p>
              <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700 dark:text-slate-200">
                <div>
                  <h4 className="font-semibold">Summary</h4>
                  <p>{summary || "Write a short summary about your strengths, experience, and goals."}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Skills</h4>
                  <p>{skills || "List key skills separated by commas."}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Experience</h4>
                  <p>{experience || "Describe one or two key roles to highlight your background."}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
