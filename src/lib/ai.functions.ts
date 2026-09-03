import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3.7-flash";

const BASE_STYLE = [
  "You are a workplace productivity assistant for busy professionals.",
  "Write in clear, professional business English. No filler, no hype, no emoji.",
  "Never invent facts, names, numbers or dates that were not provided; write [confirm] where a detail is missing.",
  "Format with concise markdown. Do not add a preamble such as 'Here is'. Output only the requested artefact.",
].join(" ");

export const FEATURES = ["email", "notes", "planner", "research", "chat"] as const;
export type Feature = (typeof FEATURES)[number];

const Message = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const Input = z.object({
  feature: z.enum(FEATURES),
  fields: z.record(z.string()).default({}),
  messages: z.array(Message).default([]),
});

function buildPrompt(feature: Feature, fields: Record<string, string>) {
  const f = (k: string) => fields[k] ?? "";
  switch (feature) {
    case "email":
      return {
        system: `${BASE_STYLE}
ROLE: Senior business communications writer.
TASK: Draft one email.
CONSTRAINTS:
- Match the requested TONE exactly and calibrate formality to the AUDIENCE.
- Length: ${f("length") || "Standard"} (Short = under 90 words, Standard = 90-160 words, Detailed = 160-250 words).
- Include exactly one clear call to action.
OUTPUT FORMAT (markdown, nothing else):
**Subject:** <subject line under 60 characters>

<body paragraphs>

<sign-off>`,
        prompt: `TONE: ${f("tone")}
AUDIENCE: ${f("audience")}
SENDER NAME: ${f("sender") || "[confirm]"}
KEY POINTS / CONTEXT:
${f("context")}`,
      };
    case "notes":
      return {
        system: `${BASE_STYLE}
ROLE: Executive chief of staff summarising a meeting.
TASK: Convert raw meeting notes or a transcript into a structured summary.
RULES:
- Only extract what is present in the source. Do not speculate on owners or dates.
- Actions must be written as "Owner — action" and be verifiable against the source.
OUTPUT FORMAT (markdown, exactly these four sections):
## Summary
2-3 sentences.
## Key Points
Bulleted, max 6.
## Action Items
Bulleted "Owner — action". Write "Unassigned" if no owner is stated.
## Deadlines & Dates
Bulleted "Date — what is due". Write "None stated" if absent.`,
        prompt: `MEETING TITLE: ${f("title") || "[confirm]"}
RAW NOTES / TRANSCRIPT:
${f("context")}`,
      };
    case "planner":
      return {
        system: `${BASE_STYLE}
ROLE: Productivity coach applying impact/effort prioritisation.
TASK: Turn a raw task list into a prioritised, scheduled plan for the stated working window.
RULES:
- Rank by impact and urgency, then fit into the available hours; never overbook.
- Group deep work into uninterrupted blocks and place it earliest.
- Anything that does not fit goes under Deferred with a one-line reason.
OUTPUT FORMAT (markdown, exactly these three sections):
## Priorities
A markdown table with columns: Task | Priority (High/Medium/Low) | Est. time | Why.
## Suggested Schedule
Bulleted time blocks, e.g. "09:00-10:30 — Task".
## Deferred
Bulleted task — reason. Write "Nothing deferred" if all tasks fit.`,
        prompt: `WORKING HOURS AVAILABLE: ${f("hours") || "8"}
DAY STARTS AT: ${f("start") || "09:00"}
FOCUS OR CONSTRAINTS: ${f("focus") || "None stated"}
TASKS:
${f("context")}`,
      };
    case "research":
      return {
        system: `${BASE_STYLE}
ROLE: Research analyst briefing a decision maker.
TASK: Produce a research brief on the topic at a ${f("depth") || "Standard"} depth.
RULES:
- Separate established knowledge from your own inference; label inference as "Analysis".
- State clearly where the reader must verify with a primary source.
- No citations you cannot substantiate; never fabricate URLs, studies or statistics.
OUTPUT FORMAT (markdown, exactly these five sections):
## Overview
## Key Insights
## Implications
## Open Questions
## Suggested Next Steps`,
        prompt: `TOPIC: ${f("topic")}
ANGLE / WHAT THE READER NEEDS: ${f("context") || "General briefing"}
AUDIENCE: ${f("audience") || "Business stakeholders"}`,
      };
    case "chat":
      return {
        system: `${BASE_STYLE}
ROLE: A workplace copilot answering questions about work tasks, writing, planning and process.
RULES:
- Be direct. Lead with the answer, then supporting detail.
- Use short markdown lists when structure helps; otherwise plain prose.
- If a request is ambiguous, ask one clarifying question before answering.`,
        prompt: "",
      };
  }
}

export const runAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured for this workspace.");

    const gateway = createLovableAiGatewayProvider(key);
    const { system, prompt } = buildPrompt(data.feature, data.fields);

    try {
      const result = streamText({
        model: gateway(MODEL),
        system,
        messages:
          data.feature === "chat"
            ? data.messages
            : [{ role: "user" as const, content: prompt }],
      });
      return { text: await result.text };
    } catch (error: unknown) {
      const status = (error as { statusCode?: number; status?: number })?.statusCode ??
        (error as { status?: number })?.status;
      if (status === 429) {
        throw new Error("The assistant is rate limited right now. Try again in a moment.");
      }
      if (status === 402) {
        throw new Error("AI credits are exhausted for this workspace. Add credits to continue.");
      }
      if (status === 403) {
        throw new Error("AI access is blocked by workspace policy.");
      }
      throw new Error(
        error instanceof Error ? error.message : "The assistant could not complete that request.",
      );
    }
  });
