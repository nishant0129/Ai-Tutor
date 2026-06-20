"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthContext";

export default function ResumeBuilderPage() {
  const { loading, user } = useAuth();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [jobTarget, setJobTarget] = useState("");
  const [style, setStyle] = useState("Classic");
  const [message, setMessage] = useState("");

  const previewClassName =
    style === "Modern"
      ? "border-l-4 border-blue-600 bg-white/95 shadow-sm"
      : style === "Professional"
      ? "border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-950"
      : "border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-950";

  useEffect(() => {
    if (loading || !user) return;

    async function loadResume() {
      const response = await fetch("/api/resume", {
        credentials: "include",
      });

      if (!response.ok) return;
      const data = await response.json();
      if (data.resume) {
        setName(data.resume.name || "");
        setTitle(data.resume.title || "");
        setSummary(data.resume.summary || "");
        setSkills(data.resume.skills || "");
        setExperience(data.resume.experience || "");
        setJobTarget(data.resume.jobTarget || "");
        setStyle(data.resume.style || "Classic");
      }
    }

    loadResume();
  }, [loading, user]);

  const saveResume = async () => {
    setMessage("");
    const response = await fetch("/api/resume", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, title, summary, skills, experience, jobTarget, style }),
    });

    if (!response.ok) {
      setMessage("Unable to save resume. Please log in and try again.");
      return;
    }

    setMessage("Resume saved successfully.");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-10 text-center">Loading your resume…</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-3xl font-semibold">Save your resume draft to your account</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Log in to keep your resume draft available anytime you return.
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
          <h1 className="text-3xl font-semibold">Resume builder</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Create a simple resume draft and preview it side-by-side as you write.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="no-print rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="text-xl font-semibold">Resume details</h2>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={saveResume}
                  className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                >
                  Save resume
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  Download PDF
                </button>
              </div>
            </div>
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
              <input
                value={jobTarget}
                onChange={(e) => setJobTarget(e.target.value)}
                placeholder="Target role or industry"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Resume style</span>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  <option>Classic</option>
                  <option>Modern</option>
                  <option>Professional</option>
                </select>
              </label>
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
            {message && <p className="mt-4 text-sm text-green-600 dark:text-green-400">{message}</p>}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold">Resume preview</h2>
            <div className={`mt-5 rounded-3xl p-6 ${previewClassName} resume-preview-card`}>
              <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{name || "Your Name"}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{title || "Professional Title"}</p>
                {jobTarget ? (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Target role: {jobTarget}</p>
                ) : null}
                <p className="mt-2 inline-flex rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                  {style} style resume
                </p>
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
          </div>
        </section>
      </div>
    </main>
  );
}
