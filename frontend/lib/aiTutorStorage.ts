export const AI_TUTOR_CHAT_KEY = "ai-tutor-chat-history";
export const AI_TUTOR_RESPONSE_KEY = "ai-tutor-last-response";
export const AI_TUTOR_MODE_KEY = "ai-tutor-mode";
export const AI_TUTOR_SESSIONS_KEY = "ai-tutor-sessions";

export function getUserStorageKey(userEmail?: string) {
  return userEmail ? userEmail.toLowerCase() : undefined;
}

export function getPersistedKey(baseKey: string, userKey?: string) {
  return userKey ? `${baseKey}-${userKey}` : baseKey;
}

export function clearAITutorStorage(userKey?: string) {
  if (typeof window === "undefined") return;

  const keys = [
    getPersistedKey(AI_TUTOR_CHAT_KEY, userKey),
    getPersistedKey(AI_TUTOR_RESPONSE_KEY, userKey),
    getPersistedKey(AI_TUTOR_MODE_KEY, userKey),
    getPersistedKey(AI_TUTOR_SESSIONS_KEY, userKey),
  ];

  keys.forEach((key) => window.localStorage.removeItem(key));
}
