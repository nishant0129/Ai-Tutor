import { ChatHistoryItem, ChatResponse } from "./types";

export type SavedSession = {
  id: string;
  name: string;
  createdAt: string;
  messages: ChatHistoryItem[];
  response?: ChatResponse | null;
};

const SESSIONS_KEY = "ai-tutor-sessions";

function getStorageKey(userKey?: string) {
  return userKey ? `${SESSIONS_KEY}-${userKey}` : SESSIONS_KEY;
}

function readStorage(userKey?: string): SavedSession[] {
  try {
    const raw = localStorage.getItem(getStorageKey(userKey));
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to read sessions", e);
    return [];
  }
}

function writeStorage(sessions: SavedSession[], userKey?: string) {
  localStorage.setItem(getStorageKey(userKey), JSON.stringify(sessions));
}

export function listSessions(userKey?: string): SavedSession[] {
  return readStorage(userKey);
}

export function saveSession(
  name: string,
  messages: ChatHistoryItem[],
  response?: ChatResponse | null,
  userKey?: string,
) {
  const sessions = readStorage(userKey);
  const session: SavedSession = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name,
    createdAt: new Date().toISOString(),
    messages,
    response: response ?? null,
  };
  sessions.unshift(session);
  writeStorage(sessions, userKey);
  return session;
}

export function deleteSession(id: string, userKey?: string) {
  const sessions = readStorage(userKey).filter((s) => s.id !== id);
  writeStorage(sessions, userKey);
}

export function renameSession(id: string, newName: string, userKey?: string) {
  const sessions = readStorage(userKey);
  const idx = sessions.findIndex((s) => s.id === id);
  if (idx !== -1) {
    sessions[idx].name = newName;
    writeStorage(sessions, userKey);
  }
}

export function getSession(id: string, userKey?: string): SavedSession | undefined {
  return readStorage(userKey).find((s) => s.id === id);
}

export function exportSessionJSON(id: string, userKey?: string): string | null {
  const session = getSession(id, userKey);
  if (!session) return null;
  return JSON.stringify(session, null, 2);
}

export function importSessionsFromJSON(json: string, userKey?: string): SavedSession[] {
  try {
    const parsed = JSON.parse(json);
    const sessionsToImport: SavedSession[] = Array.isArray(parsed) ? parsed : [parsed];
    const existing = readStorage(userKey);
    // assign new ids to imported sessions to avoid conflicts
    const newSessions = sessionsToImport.map((s) => ({
      ...s,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    }));
    const merged = [...newSessions, ...existing];
    writeStorage(merged, userKey);
    return newSessions;
  } catch (e) {
    console.error("Failed to import sessions", e);
    return [];
  }
}
