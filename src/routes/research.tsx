import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { StatRow, ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Brevity" },
      {
        name: "description",
        content:
          "Produce structured research briefs with insights, implications, open questions and next steps.",
      },
      { property: "og:title", content: "AI Research Assistant — Brevity" },
      {
        property: "og:description",
        content:
          "Produce structured research briefs with insights, implications, open questions and next steps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <AppShell eyebrow="AI Research Assistant" title="Brief yourself before the meeting">
      <ToolWorkspace
        feature="research"
        formTitle="Research request"
        submitLabel="Build brief"
        outputTitle="Research brief"
        emptyHint="Name a topic and what you need from it. You'll get a five-part brief you can verify."
        initial={{ topic: "", depth: "Standard", audience: "Business stakeholders", context: "" }}
        stats={
          <StatRow
            items={[
              { label: "Brief sections", value: "5", badge: "Decision ready", tint: "bg-mint-soft" },
              { label: "Fabrication", value: "Blocked", badge: "No fake sources", tint: "bg-powder-soft" },
              { label: "Inference", value: "Labelled", badge: "Marked as analysis", tint: "bg-butter-soft" },
            ]}
          />
        }
        fields={[
          {
            kind: "text",
            name: "topic",
            label: "Topic",
            placeholder: "Usage-based pricing in B2B SaaS",
          },
          { kind: "chips", name: "depth", label: "Depth", options: ["Quick", "Standard", "Deep"] },
          {
            kind: "chips",
            name: "audience",
            label: "Audience",
            options: ["Business stakeholders", "Technical team", "Executive board"],
          },
          {
            kind: "textarea",
            name: "context",
            label: "Angle — what do you need from this?",
            rows: 6,
            placeholder: "We're deciding whether to move our mid-market tier to usage-based pricing next quarter.",
          },
        ]}
      />
    </AppShell>
  );
}
