"use client";

import { useEffect, useState } from "react";
import {
  AnalyticsEvent,
  AnalyticsSummary,
  exportAnalyticsJSON,
  getAnalyticsSummary,
  resetAnalytics,
} from "../../lib/analytics";

function formatEvent(event: AnalyticsEvent) {
  const time = new Date(event.timestamp).toLocaleString();
  const label = {
    chat: "Chat message",
    saveSession: "Session saved",
    loadSession: "Session loaded",
    exportSession: "Session exported",
    importSession: "Session imported",
  }[event.type];

  return `${time} — ${label}${event.sessionName ? ` (${event.sessionName})` : ""}`;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [exportData, setExportData] = useState<string>("");

  useEffect(() => {
    setSummary(getAnalyticsSummary());
  }, []);

  const onExport = () => {
    setExportData(exportAnalyticsJSON());
  };

  const onReset = () => {
    resetAnalytics();
    setSummary(getAnalyticsSummary());
    setExportData("");
  };

  if (!summary) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p>Loading dashboard metrics…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Analytics Dashboard
            </p>
            <h1 className="text-3xl font-semibold">AI Tutor usage summary</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onExport}
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Export analytics
            </button>
            <button
              type="button"
              onClick={onReset}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Reset metrics
            </button>
          </div>
        </div>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Chats started</p>
          <p className="mt-3 text-4xl font-semibold">{summary.totalChats}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Messages exchanged</p>
          <p className="mt-3 text-4xl font-semibold">{summary.totalMessages}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Saved sessions</p>
          <p className="mt-3 text-4xl font-semibold">{summary.totalSessionsSaved}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Session loads</p>
          <p className="mt-3 text-4xl font-semibold">{summary.totalSessionsLoaded}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Exports</p>
          <p className="mt-3 text-4xl font-semibold">{summary.totalSessionsExported}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Imports</p>
          <p className="mt-3 text-4xl font-semibold">{summary.totalSessionsImported}</p>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Top modes</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {Object.entries(summary.modeCounts).map(([mode, count]) => (
            <div key={mode} className="rounded-3xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-sm text-slate-500 dark:text-slate-400">{mode}</p>
              <p className="mt-2 text-3xl font-semibold">{count}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Recent activity</h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Latest 10 events
          </span>
        </div>
        <div className="mt-4 space-y-3">
          {summary.recentEvents.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No activity recorded yet.</p>
          ) : (
            summary.recentEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-3xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950"
              >
                <p className="text-sm text-slate-700 dark:text-slate-200">{formatEvent(event)}</p>
                {event.messageCount ? (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Messages in chat: {event.messageCount}
                  </p>
                ) : null}
              </div>
            ))
          )}
        </div>
      </section>

      {exportData ? (
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold">Exported analytics data</h2>
          <pre className="mt-4 max-h-72 overflow-auto rounded-3xl border border-slate-200 bg-slate-950 p-4 text-xs text-slate-100 dark:border-slate-700">
            {exportData}
          </pre>
        </section>
      ) : null}
    </main>
  );
}
