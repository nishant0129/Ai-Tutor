import { ChatMode } from "../lib/types";

type ChatInputProps = {
  message: string;
  mode: ChatMode;
  loading: boolean;
  onMessageChange: (value: string) => void;
  onModeChange: (value: ChatMode) => void;
  onSend: () => void;
  onClear: () => void;
};

const modeOptions: { value: ChatMode; label: string }[] = [
  { value: "grammar", label: "Grammar Coach" },
  { value: "interview", label: "Interview Prep" },
  { value: "behavioral", label: "Behavioral Feedback" },
];

export default function ChatInput({
  message,
  mode,
  loading,
  onMessageChange,
  onModeChange,
  onSend,
  onClear,
}: ChatInputProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Coach mode
          </label>
          <select
            value={mode}
            onChange={(event) => onModeChange(event.target.value as ChatMode)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-900"
          >
            {modeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClear}
            className="rounded-2xl border border-slate-300 bg-transparent px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onSend}
            disabled={loading || !message.trim()}
            className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {loading ? "Sending…" : "Send message"}
          </button>
        </div>
      </div>

      <label className="mt-5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
        Type your sentence or answer
      </label>
      <textarea
        rows={5}
        value={message}
        onChange={(event) => onMessageChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (!loading) onSend();
          }
        }}
        placeholder="I am looking for a job as a frontend developer..."
        className="mt-2 w-full resize-none rounded-3xl border border-slate-300 bg-slate-50 px-4 py-4 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-900"
      />
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Press Enter to submit, Shift+Enter for a new line.
      </p>
    </div>
  );
}
