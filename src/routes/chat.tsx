import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { AppShell, Disclaimer } from "@/components/AppShell";
import { runAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Brevity" },
      {
        name: "description",
        content:
          "Ask a workplace copilot about writing, planning, process and day-to-day work decisions.",
      },
      { property: "og:title", content: "AI Chatbot — Brevity" },
      {
        property: "og:description",
        content:
          "Ask a workplace copilot about writing, planning, process and day-to-day work decisions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "How do I say no to a scope change politely?",
  "Give me an agenda for a 30-minute project kickoff.",
  "Rewrite this update so an executive can skim it.",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const call = useServerFn(runAssistant);
  const endRef = useRef<HTMLDivElement>(null);

  const mutation = useMutation({
    mutationFn: (history: Msg[]) =>
      call({ data: { feature: "chat" as const, fields: {}, messages: history } }),
    onSuccess: (res) => setMessages((m) => [...m, { role: "assistant", content: res.text }]),
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mutation.isPending]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || mutation.isPending) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    mutation.mutate(next);
  };

  return (
    <AppShell eyebrow="AI Chatbot" title="Ask your workplace copilot">
      <section className="animate-rise flex min-h-[60vh] flex-col rounded-3xl bg-surface p-5 ring-1 ring-black/5">
        <div className="flex-1 space-y-3 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-page/40 p-6">
              <p className="text-sm text-soft">Start with one of these:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-bold text-soft transition-colors hover:border-coral/40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl bg-coral px-4 py-2.5 text-sm font-semibold leading-relaxed text-white"
                    : "prose-work max-w-[85%] rounded-2xl bg-page/60 px-4 py-3"
                }
              >
                {m.role === "user" ? m.content : <ReactMarkdown>{m.content}</ReactMarkdown>}
              </div>
            </div>
          ))}

          {mutation.isPending ? (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-page/60 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 animate-blink rounded-full bg-coral" />
                  <span
                    className="h-2 w-2 animate-blink rounded-full bg-butter"
                    style={{ animationDelay: "200ms" }}
                  />
                  <span
                    className="h-2 w-2 animate-blink rounded-full bg-mint"
                    style={{ animationDelay: "400ms" }}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {mutation.isError ? (
            <div className="rounded-2xl bg-coral-soft/60 p-4 text-sm font-semibold">
              {(mutation.error as Error).message}
            </div>
          ) : null}

          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="mt-4 flex items-end gap-2"
        >
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask about a task, an email, a plan…"
            className="flex-1 resize-none rounded-2xl border border-line bg-page/60 p-3 text-sm outline-none placeholder:text-soft/70 focus:border-coral"
          />
          <button
            type="submit"
            disabled={mutation.isPending || !input.trim()}
            className="rounded-2xl bg-coral px-5 py-3 font-display text-base font-bold text-white disabled:opacity-50"
          >
            Send
          </button>
        </form>

        <div className="mt-4">
          <Disclaimer />
        </div>
      </section>
    </AppShell>
  );
}
