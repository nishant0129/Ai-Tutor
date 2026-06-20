import { ChatMode } from "./types";

export type AnalyticsEventType =
  | "chat"
  | "saveSession"
  | "loadSession"
  | "exportSession"
  | "importSession";

export type AnalyticsEvent = {
  id: string;
  type: AnalyticsEventType;
  timestamp: string;
  mode?: ChatMode;
  messageCount?: number;
  sessionName?: string;
};

const ANALYTICS_KEY = "ai-tutor-analytics";

function readAnalytics(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to read analytics", error);
    return [];
  }
}

function writeAnalytics(events: AnalyticsEvent[]) {
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(events));
}

function createEvent(event: Omit<AnalyticsEvent, "id" | "timestamp">): AnalyticsEvent {
  return {
    ...event,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    timestamp: new Date().toISOString(),
  };
}

export function trackChatSend(mode: ChatMode, messageCount: number) {
  const events = readAnalytics();
  events.push(createEvent({ type: "chat", mode, messageCount }));
  writeAnalytics(events);
}

export function trackSessionSaved(sessionName: string) {
  const events = readAnalytics();
  events.push(createEvent({ type: "saveSession", sessionName }));
  writeAnalytics(events);
}

export function trackSessionLoaded(sessionName: string) {
  const events = readAnalytics();
  events.push(createEvent({ type: "loadSession", sessionName }));
  writeAnalytics(events);
}

export function trackSessionExported(sessionName: string) {
  const events = readAnalytics();
  events.push(createEvent({ type: "exportSession", sessionName }));
  writeAnalytics(events);
}

export function trackSessionImported(count: number) {
  const events = readAnalytics();
  events.push(createEvent({ type: "importSession", sessionName: `${count} imported` }));
  writeAnalytics(events);
}

export type AnalyticsSummary = {
  totalChats: number;
  totalMessages: number;
  totalSessionsSaved: number;
  totalSessionsLoaded: number;
  totalSessionsExported: number;
  totalSessionsImported: number;
  modeCounts: Record<ChatMode, number>;
  recentEvents: AnalyticsEvent[];
};

export function getAnalyticsSummary(): AnalyticsSummary {
  const events = readAnalytics();
  const summary: AnalyticsSummary = {
    totalChats: 0,
    totalMessages: 0,
    totalSessionsSaved: 0,
    totalSessionsLoaded: 0,
    totalSessionsExported: 0,
    totalSessionsImported: 0,
    modeCounts: { grammar: 0, interview: 0, behavioral: 0 },
    recentEvents: events.slice(-10).reverse(),
  };

  for (const event of events) {
    if (event.type === "chat") {
      summary.totalChats += 1;
      summary.totalMessages += event.messageCount ?? 0;
      if (event.mode) summary.modeCounts[event.mode] += 1;
    }
    if (event.type === "saveSession") summary.totalSessionsSaved += 1;
    if (event.type === "loadSession") summary.totalSessionsLoaded += 1;
    if (event.type === "exportSession") summary.totalSessionsExported += 1;
    if (event.type === "importSession") summary.totalSessionsImported += 1;
  }

  return summary;
}

export function exportAnalyticsJSON() {
  const events = readAnalytics();
  return JSON.stringify(events, null, 2);
}

export function resetAnalytics() {
  writeAnalytics([]);
}
