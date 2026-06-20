"use client";

import { useEffect, useRef, useState } from "react";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";
import SessionsSidebar from "../components/SessionsSidebar";
import { ChatHistoryItem, ChatMode, ChatResponse } from "../lib/types";

const STORAGE_KEY = "ai-tutor-chat-history";
const RESPONSE_KEY = "ai-tutor-last-response";
const MODE_KEY = "ai-tutor-mode";

const introText =
  "Practice English answers, get correction feedback, and receive one interview-style question.";

export default function Home() {
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<ChatMode>("grammar");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedHistory = window.localStorage.getItem(STORAGE_KEY);
    const savedResponse = window.localStorage.getItem(RESPONSE_KEY);
    const savedMode = window.localStorage.getItem(MODE_KEY) as ChatMode | null;

    if (savedHistory) {
      try {
        setChatHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Failed to restore chat history:", error);
      }
    }

    if (savedResponse) {
      try {
        setResponse(JSON.parse(savedResponse));
      } catch (error) {
        console.error("Failed to restore last response:", error);
      }
    }

    if (savedMode && ["grammar", "interview", "behavioral"].includes(savedMode)) {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    if (response) {
      window.localStorage.setItem(RESPONSE_KEY, JSON.stringify(response));
    } else {
      window.localStorage.removeItem(RESPONSE_KEY);
    }
  }, [response]);

  useEffect(() => {
    window.localStorage.setItem(MODE_KEY, mode);
  }, [mode]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setError("");

    const newHistory: ChatHistoryItem[] = [
      ...chatHistory,
      { role: "user", text: message.trim() },
    ];
    setChatHistory(newHistory);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), mode }),
      });

      if (!res.ok) {
        throw new Error("Failed to connect to the AI coach");
      }

      const data = (await res.json()) as ChatResponse;
      setResponse(data);

      const assistantText = `Correction: ${data.correction}\nExplanation: ${data.explanation}\nQuestion: ${data.question}`;
      setChatHistory([...newHistory, { role: "assistant", text: assistantText }]);
      setMessage("");
    } catch (caught) {
      console.error(caught);
      setError(
        "There was a problem generating a response. Please check your API key and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    setChatHistory([]);
    setResponse(null);
    setError("");
    setMessage("");
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(RESPONSE_KEY);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white px-8 py-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-300">
              AI Tutor
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Smart interview and English coaching in one chat.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
              {introText}
            </p>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          <section className="flex min-h-[520px] flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Conversation</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your chat history with the AI coach.
                </p>
              </div>
              <button
                type="button"
                onClick={clearConversation}
                className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Clear
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
              {chatHistory.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                  Start your first chat by typing a sentence and pressing Send.
                </div>
              ) : (
                chatHistory.map((item, index) => (
                  <ChatMessage key={`${item.role}-${index}`} role={item.role} text={item.text} />
                ))
              )}
              <div ref={bottomRef} />
            </div>

            <div className="mt-6">
              <ChatInput
                message={message}
                mode={mode}
                loading={loading}
                onMessageChange={setMessage}
                onModeChange={setMode}
                onSend={sendMessage}
                onClear={clearConversation}
              />
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-[1rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <SessionsSidebar
                currentMessages={chatHistory}
                currentResponse={response}
                onLoad={(messages, resp) => {
                  setChatHistory(messages);
                  setResponse(resp);
                }}
              />
            </section>

            <section className="rounded-[1rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-semibold">Latest coaching result</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Corrections, explanations, and a question appear here after each submission.
              </p>

              {error ? (
                <div className="mt-6 rounded-3xl border border-red-300 bg-red-50 p-5 text-sm text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-200">
                  {error}
                </div>
              ) : response ? (
                <div className="space-y-5 mt-6">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                    <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">Correction</div>
                    <p className="mt-2 text-base leading-7 text-slate-900 dark:text-slate-100">
                      {response.correction}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                    <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">Explanation</div>
                    <p className="mt-2 text-base leading-7 text-slate-900 dark:text-slate-100">
                      {response.explanation}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                    <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">Interview question</div>
                    <p className="mt-2 text-base leading-7 text-slate-900 dark:text-slate-100">
                      {response.question}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                  No response yet. Send a message to see suggestions from the AI coach.
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
