import { GoogleGenAI } from "@google/genai";
import { buildCoachPrompt } from "../../../lib/ai";
import { ChatMode } from "../../../lib/types";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey ?? "",
});

type RequestBody = {
  message: string;
  mode?: ChatMode;
};

export async function POST(req: Request) {
  if (!apiKey) {
    return Response.json(
      {
        correction: "",
        explanation: "GEMINI_API_KEY is not configured.",
        question: "",
      },
      { status: 500 }
    );
  }

  const body = (await req.json()) as RequestBody;
  const { message, mode = "grammar" } = body;

  if (!message || !message.trim()) {
    return Response.json(
      {
        correction: "",
        explanation: "Please provide a sentence or answer.",
        question: "",
      },
      { status: 400 }
    );
  }

  const prompt = buildCoachPrompt(message.trim(), mode);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text?.trim();

  if (!text) {
    return Response.json(
      {
        correction: "",
        explanation: "Empty response from Gemini.",
        question: "",
      },
      { status: 502 }
    );
  }

  try {
    const parsed = JSON.parse(text);
    return Response.json(parsed);
  } catch (error) {
    console.error("AI parse error:", error, text);
    return Response.json(
      {
        correction: "",
        explanation: "Failed to parse AI response.",
        question: "",
      },
      { status: 500 }
    );
  }
}
