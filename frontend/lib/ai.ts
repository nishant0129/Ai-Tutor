import { ChatMode } from "./types";

const modeDescription: Record<ChatMode, string> = {
  grammar:
    "Focus on grammatical correction and concise explanation for the sentence.",
  interview:
    "Evaluate the answer and ask a strong follow-up technical or soft-skills interview question.",
  behavioral:
    "Review the response and provide feedback on behavior, clarity, and improvement.",
};

export function buildCoachPrompt(message: string, mode: ChatMode) {
  return `You are an AI Interview & English Coach.
Mode: ${mode}
${modeDescription[mode]}

Return ONLY valid JSON.

Format:
{
  "correction": "",
  "explanation": "",
  "question": ""
}

Rules:
- If the sentence is correct, put "Correct" in correction.
- Keep explanation under 20 words.
- Ask exactly one interview question.
- Do not return markdown.
- Do not return \`\`\`json.

User message:
${message}`;
}
