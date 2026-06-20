import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  const { message } = await req.json();

  const prompt = `
You are an AI Interview & English Coach.

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
${message}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

//   const text = response.text;
const text = response.text;

if (!text) {
  throw new Error("Empty response from Gemini");
}

try {
  const parsed = JSON.parse(text);

  return Response.json(parsed);
} catch (error) {
  console.error(error);

  return Response.json({
    correction: "",
    explanation: "Failed to parse AI response",
    question: "",
  });
}
//   console.log("Gemini Response:", text);

//   return Response.json({
//     reply: text,
//   });
}