export type ChatMode = "grammar" | "interview" | "behavioral";

export type ChatResponse = {
  correction: string;
  explanation: string;
  question: string;
};

export type ChatHistoryItem = {
  role: "user" | "assistant";
  text: string;
};
