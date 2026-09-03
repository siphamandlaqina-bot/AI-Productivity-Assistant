import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { StatRow, ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Brevity" },
      {
        name: "description",
        content:
          "Turn raw meeting notes or transcripts into key points, owner-tagged action items and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Brevity" },
      {
        property: "og:description",
        content:
          "Turn raw meeting notes or transcripts into key points, owner-tagged action items and deadlines.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  return (
    <AppShell eyebrow="Meeting Notes Summarizer" title="Turn a messy transcript into actions">
      <ToolWorkspace
        feature="notes"
        formTitle="Paste your notes"
        submitLabel="Summarise meeting"
        outputTitle="Structured summary"
        emptyHint="Paste a transcript or rough notes. You'll get a summary, key points, actions and deadlines."
        initial={{ title: "", context: "" }}
        stats={
          <StatRow
            items={[
              { label: "Sections", value: "4", badge: "Fixed structure", tint: "bg-mint-soft" },
              { label: "Owner tagging", value: "On", badge: "Never invented", tint: "bg-powder-soft" },
              { label: "Key points", value: "≤ 6", badge: "Signal only", tint: "bg-butter-soft" },
            ]}
          />
        }
        fields={[
          { kind: "text", name: "title", label: "Meeting title", placeholder: "Q3 roadmap review" },
          {
            kind: "textarea",
            name: "context",
            label: "Raw notes or transcript",
            rows: 12,
            placeholder: "Paste the transcript or your rough notes here…",
          },
        ]}
      />
    </AppShell>
  );
}
