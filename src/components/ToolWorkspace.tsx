import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";

import { Disclaimer } from "./AppShell";
import { runAssistant, type Feature } from "@/lib/ai.functions";

export type Field =
  | { kind: "chips"; name: string; label: string; options: string[] }
  | { kind: "text"; name: string; label: string; placeholder?: string }
  | { kind: "textarea"; name: string; label: string; placeholder?: string; rows?: number };

export function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-coral px-3.5 py-1.5 text-sm font-bold text-white"
          : "rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-bold text-soft transition-colors hover:border-coral/40"
      }
    >
      {children}
    </button>
  );
}

export function ToolWorkspace({
  feature,
  formTitle,
  fields,
  initial,
  submitLabel,
  outputTitle,
  emptyHint,
  stats,
}: {
  feature: Feature;
  formTitle: string;
  fields: Field[];
  initial: Record<string, string>;
  submitLabel: string;
  outputTitle: string;
  emptyHint: string;
  stats?: ReactNode;
}) {
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [copied, setCopied] = useState(false);
  const call = useServerFn(runAssistant);

  const mutation = useMutation({
    mutationFn: (data: Record<string, string>) =>
      call({ data: { feature, fields: data, messages: [] } }),
  });

  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const contextField = fields.find((f) => f.kind === "textarea");
  const disabled =
    mutation.isPending || (contextField ? !values[contextField.name]?.trim() : false);

  const copy = async () => {
    if (!mutation.data?.text) return;
    await navigator.clipboard.writeText(mutation.data.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      {stats}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="animate-rise rounded-3xl bg-surface p-5 ring-1 ring-black/5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">{formTitle}</h2>
            <span className="font-mono text-[10px] uppercase tracking-widest text-soft">
              {fields.length} inputs
            </span>
          </div>

          {fields.map((field) => (
            <div className="mt-4" key={field.name}>
              <label
                htmlFor={field.name}
                className="font-mono text-[10px] uppercase tracking-widest text-soft"
              >
                {field.label}
              </label>
              {field.kind === "chips" ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {field.options.map((option) => (
                    <Chip
                      key={option}
                      active={values[field.name] === option}
                      onClick={() => set(field.name, option)}
                    >
                      {option}
                    </Chip>
                  ))}
                </div>
              ) : field.kind === "text" ? (
                <input
                  id={field.name}
                  value={values[field.name] ?? ""}
                  placeholder={field.placeholder}
                  onChange={(e) => set(field.name, e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-line bg-page/60 px-3 py-2.5 text-sm outline-none placeholder:text-soft/70 focus:border-coral"
                />
              ) : (
                <textarea
                  id={field.name}
                  rows={field.rows ?? 6}
                  value={values[field.name] ?? ""}
                  placeholder={field.placeholder}
                  onChange={(e) => set(field.name, e.target.value)}
                  className="mt-2 w-full resize-y rounded-2xl border border-line bg-page/60 p-3 text-sm leading-relaxed outline-none placeholder:text-soft/70 focus:border-coral"
                />
              )}
            </div>
          ))}

          <button
            onClick={() => mutation.mutate(values)}
            disabled={disabled}
            className="mt-5 w-full rounded-2xl bg-coral py-3 font-display text-base font-bold text-white transition-opacity disabled:opacity-50"
          >
            {mutation.isPending ? "Working…" : submitLabel}
          </button>
        </section>

        <section className="animate-rise rounded-3xl bg-surface p-5 ring-1 ring-black/5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">{outputTitle}</h2>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ink ${
                mutation.isPending
                  ? "bg-butter-soft"
                  : mutation.data
                    ? "bg-mint-soft"
                    : "bg-page"
              }`}
            >
              {mutation.isPending ? "Generating" : mutation.data ? "Ready" : "Idle"}
            </span>
          </div>

          {mutation.isPending ? (
            <div className="mt-4 rounded-2xl bg-page/60 p-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-soft">
                Composing a professional draft…
              </div>
              <div className="mt-3 flex gap-1.5">
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
              <div className="mt-4 space-y-2">
                {[100, 92, 78].map((w) => (
                  <div
                    key={w}
                    className="h-3 rounded-full bg-line/70"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            </div>
          ) : mutation.isError ? (
            <div className="mt-4 rounded-2xl bg-coral-soft/60 p-4 text-sm font-semibold">
              {(mutation.error as Error).message}
            </div>
          ) : mutation.data ? (
            <div className="prose-work mt-4 rounded-2xl bg-page/60 p-4">
              <ReactMarkdown>{mutation.data.text}</ReactMarkdown>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-line bg-page/40 p-6 text-sm text-soft">
              {emptyHint}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={copy}
              disabled={!mutation.data}
              className="rounded-full bg-ink px-3.5 py-2 text-sm font-bold text-white disabled:opacity-40"
            >
              {copied ? "Copied" : "Copy output"}
            </button>
            <button
              onClick={() => mutation.mutate(values)}
              disabled={disabled}
              className="rounded-full border border-line bg-surface px-3.5 py-2 text-sm font-bold text-ink disabled:opacity-40"
            >
              Regenerate
            </button>
          </div>

          <div className="mt-4">
            <Disclaimer />
          </div>
        </section>
      </div>
    </>
  );
}

export function StatRow({
  items,
}: {
  items: { label: string; value: string; badge: string; tint: string }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item, i) => (
        <div
          key={item.label}
          className="animate-rise rounded-3xl bg-surface p-4 ring-1 ring-black/5"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-soft">
            {item.label}
          </div>
          <div className="mt-1 font-display text-3xl font-semibold">{item.value}</div>
          <div
            className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold text-ink ${item.tint}`}
          >
            {item.badge}
          </div>
        </div>
      ))}
    </div>
  );
}
