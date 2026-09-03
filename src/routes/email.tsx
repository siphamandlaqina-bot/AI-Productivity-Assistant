import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { StatRow, ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Brevity" },
      {
        name: "description",
        content:
          "Generate professional emails tuned to tone, audience and length, with one clear call to action.",
      },
      { property: "og:title", content: "Smart Email Generator — Brevity" },
      {
        property: "og:description",
        content:
          "Generate professional emails tuned to tone, audience and length, with one clear call to action.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  return (
    <AppShell eyebrow="Smart Email Generator" title="Draft a reply to a client">
      <ToolWorkspace
        feature="email"
        formTitle="Compose brief"
        submitLabel="Generate email"
        outputTitle="Generated draft"
        emptyHint="Set a tone and audience, add your key points, then generate a draft."
        initial={{
          tone: "Professional",
          audience: "External client",
          length: "Standard",
          sender: "",
          context: "",
        }}
        stats={
          <StatRow
            items={[
              {
                label: "Tone presets",
                value: "4",
                badge: "Audience aware",
                tint: "bg-mint-soft",
              },
              {
                label: "Target length",
                value: "90-160w",
                badge: "Standard brief",
                tint: "bg-powder-soft",
              },
              {
                label: "Calls to action",
                value: "1",
                badge: "Always explicit",
                tint: "bg-butter-soft",
              },
            ]}
          />
        }
        fields={[
          {
            kind: "chips",
            name: "tone",
            label: "Tone",
            options: ["Professional", "Friendly", "Direct", "Apologetic"],
          },
          {
            kind: "chips",
            name: "audience",
            label: "Audience",
            options: ["External client", "Internal team", "Executive", "Vendor"],
          },
          { kind: "chips", name: "length", label: "Length", options: ["Short", "Standard", "Detailed"] },
          { kind: "text", name: "sender", label: "Sign off as", placeholder: "Amara Reddy" },
          {
            kind: "textarea",
            name: "context",
            label: "Context",
            placeholder:
              "Apologise for the slip in the Q3 deliverable date and confirm the new launch for the 14th. Keep it warm and reassuring.",
          },
        ]}
      />
    </AppShell>
  );
}
