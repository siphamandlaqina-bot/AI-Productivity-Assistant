import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell, Disclaimer } from "@/components/AppShell";
import { StatRow } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brevity — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Draft emails, summarise meetings, plan tasks and research faster with an AI workplace assistant built for professionals.",
      },
      { property: "og:title", content: "Brevity — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, summarise meetings, plan tasks and research faster with an AI workplace assistant built for professionals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email" as const,
    initial: "E",
    tint: "bg-lilac-soft",
    title: "Smart Email Generator",
    copy: "Tone and audience aware drafts with one clear call to action.",
  },
  {
    to: "/notes" as const,
    initial: "M",
    tint: "bg-butter-soft",
    title: "Meeting Notes Summarizer",
    copy: "Key points, owner-tagged actions and deadlines from raw notes.",
  },
  {
    to: "/planner" as const,
    initial: "P",
    tint: "bg-mint-soft",
    title: "AI Task Planner",
    copy: "Impact-ranked priorities scheduled into your working hours.",
  },
  {
    to: "/research" as const,
    initial: "R",
    tint: "bg-powder-soft",
    title: "AI Research Assistant",
    copy: "Structured briefs with insights, implications and next steps.",
  },
  {
    to: "/chat" as const,
    initial: "C",
    tint: "bg-lilac-soft",
    title: "AI Chatbot",
    copy: "Ask anything about your work, writing or process.",
  },
];

function Dashboard() {
  return (
    <AppShell eyebrow="Dashboard" title="Your workday, in fewer steps">
      <StatRow
        items={[
          {
            label: "AI tools ready",
            value: "5",
            badge: "All operational",
            tint: "bg-mint-soft",
          },
          {
            label: "Avg. draft time",
            value: "1m 40s",
            badge: "-32s vs manual",
            tint: "bg-powder-soft",
          },
          {
            label: "Review step",
            value: "Always",
            badge: "Human in the loop",
            tint: "bg-butter-soft",
          },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {TOOLS.map((tool, i) => (
          <Link
            key={tool.to}
            to={tool.to}
            className="animate-rise rounded-3xl bg-surface p-5 ring-1 ring-black/5 transition-shadow hover:shadow-lg"
            style={{ animationDelay: `${210 + i * 70}ms` }}
          >
            <div className="flex items-center gap-3">
              <span
                className={`grid size-9 place-items-center rounded-2xl font-display text-sm font-bold text-ink ${tool.tint}`}
              >
                {tool.initial}
              </span>
              <h2 className="font-display text-lg font-semibold">{tool.title}</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-soft">{tool.copy}</p>
            <span className="mt-4 inline-block font-mono text-[10px] uppercase tracking-widest text-coral">
              Open tool →
            </span>
          </Link>
        ))}
      </div>

      <Disclaimer />
    </AppShell>
  );
}
