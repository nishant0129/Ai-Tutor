"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [correction, setCorrection] = useState("");
  const [explanation, setExplanation] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });

      const data = await res.json();

      console.log(data);

      setCorrection(data.correction || "");
      setExplanation(data.explanation || "");
      setQuestion(data.question || "");
    } catch (error) {
      console.error(error);

      setCorrection("Error");
      setExplanation("Something went wrong");
      setQuestion("");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-6">
        AI Interview & English Coach
      </h1>

      <textarea
        className="w-full border p-3 rounded"
        rows={5}
        placeholder="Type your sentence..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={sendMessage}
        disabled={loading}
        className="mt-4 px-4 py-2 border rounded"
      >
        {loading ? "Thinking..." : "Send"}
      </button>

      {correction && (
        <div className="mt-6 border p-4 rounded">
          <h2 className="font-bold text-lg">✅ Correction</h2>
          <p>{correction}</p>

          <h2 className="font-bold text-lg mt-4">📖 Explanation</h2>
          <p>{explanation}</p>

          <h2 className="font-bold text-lg mt-4">🎤 Interview Question</h2>
          <p>{question}</p>
        </div>
      )}
    </main>
  );
}