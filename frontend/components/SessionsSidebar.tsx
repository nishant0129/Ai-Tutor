"use client";

import { useEffect, useState } from "react";
import {
  listSessions,
  saveSession,
  deleteSession,
  renameSession,
  exportSessionJSON,
  importSessionsFromJSON,
  SavedSession,
} from "../lib/sessions";
import { ChatHistoryItem, ChatResponse } from "../lib/types";

type Props = {
  currentMessages: ChatHistoryItem[];
  currentResponse: ChatResponse | null;
  onLoad: (messages: ChatHistoryItem[], response: ChatResponse | null) => void;
  userKey?: string;
};

export default function SessionsSidebar({
  currentMessages,
  currentResponse,
  onLoad,
  userKey,
}: Props) {
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [name, setName] = useState("");
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    setSessions(userKey ? listSessions(userKey) : []);
  }, [userKey]);

  const refresh = () => setSessions(userKey ? listSessions(userKey) : []);

  const handleSave = () => {
    if (!userKey) {
      alert("Log in to save sessions.");
      return;
    }

    const n = name.trim() || `Session ${new Date().toLocaleString()}`;
    saveSession(n, currentMessages, currentResponse, userKey);
    setName("");
    refresh();
  };

  const handleLoad = (s: SavedSession) => {
    onLoad(s.messages, s.response ?? null);
  };

  const handleDelete = (id: string) => {
    if (!userKey) return;
    if (!confirm("Delete this session?")) return;
    deleteSession(id, userKey);
    refresh();
  };

  const handleRename = (id: string) => {
    if (!userKey) return;
    const newName = prompt("New name for session:");
    if (!newName) return;
    renameSession(id, newName, userKey);
    refresh();
  };

  const handleExport = (id: string) => {
    if (!userKey) return;
    const json = exportSessionJSON(id, userKey);
    if (!json) return alert("Unable to export session.");
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-tutor-session-${id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (file: File | null) => {
    if (!userKey) {
      alert("Log in to import sessions.");
      return;
    }

    if (!file) return;
    setImporting(true);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const added = importSessionsFromJSON(text, userKey);
        if (added.length === 0) alert("No valid sessions found in file.");
        refresh();
      } catch (e) {
        alert("Failed to import file.");
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Saved sessions</h3>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Session name"
          className="flex-1 rounded-md border px-3 py-2"
          disabled={!userKey}
        />
        <button
          onClick={handleSave}
          className="rounded-md bg-blue-600 px-3 py-2 text-white"
          disabled={!userKey}
        >
          Save
        </button>
      </div>
      {!userKey ? (
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          Log in to save, load, and manage your AI coaching sessions.
        </div>
      ) : null}

      <div className="mb-4">
        <label className="block text-sm text-slate-600">Import session</label>
        <input
          type="file"
          accept="application/json"
          onChange={(e) => handleImportFile(e.target.files?.[0] ?? null)}
          disabled={importing}
          className="mt-2"
        />
      </div>

      <div className="space-y-3">
        {sessions.length === 0 ? (
          <div className="text-sm text-slate-500">No saved sessions yet.</div>
        ) : (
          sessions.map((s) => (
            <div key={s.id} className="rounded-lg border p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-xs text-slate-500">{new Date(s.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLoad(s)}
                    className="rounded-md border px-2 py-1 text-sm"
                  >
                    Load
                  </button>
                  <button onClick={() => handleExport(s.id)} className="rounded-md border px-2 py-1 text-sm">
                    Export
                  </button>
                  <button onClick={() => handleRename(s.id)} className="rounded-md border px-2 py-1 text-sm">
                    Rename
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="rounded-md border px-2 py-1 text-sm text-red-600">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
