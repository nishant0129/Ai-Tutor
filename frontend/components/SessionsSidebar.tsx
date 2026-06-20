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
};

export default function SessionsSidebar({ currentMessages, currentResponse, onLoad }: Props) {
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [name, setName] = useState("");
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    setSessions(listSessions());
  }, []);

  const refresh = () => setSessions(listSessions());

  const handleSave = () => {
    const n = name.trim() || `Session ${new Date().toLocaleString()}`;
    saveSession(n, currentMessages, currentResponse);
    setName("");
    refresh();
  };

  const handleLoad = (s: SavedSession) => {
    onLoad(s.messages, s.response ?? null);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this session?")) return;
    deleteSession(id);
    refresh();
  };

  const handleRename = (id: string) => {
    const newName = prompt("New name for session:");
    if (!newName) return;
    renameSession(id, newName);
    refresh();
  };

  const handleExport = (id: string) => {
    const json = exportSessionJSON(id);
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
    if (!file) return;
    setImporting(true);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const added = importSessionsFromJSON(text);
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
        />
        <button onClick={handleSave} className="rounded-md bg-blue-600 px-3 py-2 text-white">
          Save
        </button>
      </div>

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
