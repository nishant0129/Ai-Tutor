import { ChatHistoryItem, ChatResponse } from "./types";

export type SavedSession = {
  id: string;
  name: string;
  createdAt: string;
  messages: ChatHistoryItem[];
  response?: ChatResponse | null;
};

const SESSIONS_KEY = "ai-tutor-sessions";

function readStorage(): SavedSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to read sessions", e);
    return [];
  }
}

function writeStorage(sessions: SavedSession[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function listSessions(): SavedSession[] {
  return readStorage();
}

export function saveSession(name: string, messages: ChatHistoryItem[], response?: ChatResponse | null) {
  const sessions = readStorage();
  const session: SavedSession = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name,
    createdAt: new Date().toISOString(),
    messages,
    response: response ?? null,
  };
  sessions.unshift(session);
  writeStorage(sessions);
  return session;
}

export function deleteSession(id: string) {
  const sessions = readStorage().filter((s) => s.id !== id);
  writeStorage(sessions);
}

export function renameSession(id: string, newName: string) {
  const sessions = readStorage();
  const idx = sessions.findIndex((s) => s.id === id);
  if (idx !== -1) {
    sessions[idx].name = newName;
    writeStorage(sessions);
  }
}

export function getSession(id: string): SavedSession | undefined {
  return readStorage().find((s) => s.id === id);
}

export function exportSessionJSON(id: string): string | null {
  const session = getSession(id);
  if (!session) return null;
  return JSON.stringify(session, null, 2);
}

export function importSessionsFromJSON(json: string): SavedSession[] {
  try {
    const parsed = JSON.parse(json);
    const sessionsToImport: SavedSession[] = Array.isArray(parsed) ? parsed : [parsed];
    const existing = readStorage();
    // assign new ids to imported sessions to avoid conflicts
    const newSessions = sessionsToImport.map((s) => ({
      ...s,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    }));
    const merged = [...newSessions, ...existing];
    writeStorage(merged);
    return newSessions;
  } catch (e) {
    console.error("Failed to import sessions", e);
    return [];
  }
}
