type ChatMessageProps = {
  role: "user" | "assistant";
  text: string;
};

export default function ChatMessage({ role, text }: ChatMessageProps) {
  const containerAlignment = role === "assistant" ? "justify-start" : "justify-end";
  const bubbleStyle =
    role === "assistant"
      ? "border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      : "border-blue-200 bg-blue-50 text-slate-900 dark:border-blue-700 dark:bg-blue-950 dark:text-slate-100";

  return (
    <div className={`flex w-full ${containerAlignment}`}>
      <div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl border px-4 py-3 text-sm leading-6 ${bubbleStyle}`}>
        <div className="font-semibold mb-2 text-xs uppercase tracking-[0.2em]">
          {role === "assistant" ? "Coach" : "You"}
        </div>
        <div>{text}</div>
      </div>
    </div>
  );
}
