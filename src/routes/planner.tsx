import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { StatRow, ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Brevity" },
      {
        name: "description",
        content:
          "Rank your tasks by impact and urgency, then fit them into a realistic schedule for the day.",
      },
      { property: "og:title", content: "AI Task Planner — Brevity" },
      {
        property: "og:description",
        content:
          "Rank your tasks by impact and urgency, then fit them into a realistic schedule for the day.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  return (
    <AppShell eyebrow="AI Task Planner" title="Prioritise and schedule your day">
      <ToolWorkspace
        feature="planner"
        formTitle="Task intake"
        submitLabel="Plan my day"
        outputTitle="Prioritised plan"
        emptyHint="List your tasks one per line. You'll get a priority table, time blocks and anything deferred."
        initial={{ hours: "6", start: "09:00", focus: "", context: "" }}
        stats={
          <StatRow
            items={[
              { label: "Ranking model", value: "Impact", badge: "× urgency", tint: "bg-mint-soft" },
              { label: "Deep work", value: "Blocked", badge: "Scheduled early", tint: "bg-powder-soft" },
              { label: "Overbooking", value: "Never", badge: "Deferred instead", tint: "bg-butter-soft" },
            ]}
          />
        }
        fields={[
          { kind: "chips", name: "hours", label: "Hours available", options: ["4", "6", "8"] },
          { kind: "text", name: "start", label: "Day starts at", placeholder: "09:00" },
          {
            kind: "text",
            name: "focus",
            label: "Focus or constraints",
            placeholder: "Two meetings after 14:00",
          },
          {
            kind: "textarea",
            name: "context",
            label: "Tasks (one per line)",
            rows: 10,
            placeholder: "Finish pricing deck\nReview onboarding flow\nReply to legal on the MSA",
          },
        ]}
      />
    </AppShell>
  );
}
