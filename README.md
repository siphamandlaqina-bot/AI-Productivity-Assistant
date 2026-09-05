# Brevity — AI Workplace Productivity Assistant

Brevity is a modern, responsive web application that helps busy professionals automate daily work tasks with AI. It combines a clean SaaS dashboard with five focused AI tools, each powered by structured prompt engineering and the Lovable AI Gateway.

![Brevity preview](public/favicon.ico)

## Features

- **Smart Email Generator** — Draft professional emails by choosing tone, audience, and length.
- **Meeting Notes Summarizer** — Turn raw notes or transcripts into structured summaries, action items, and deadlines.
- **AI Task Planner** — Prioritize and schedule tasks into a working-day plan with deep-work blocks.
- **AI Research Assistant** — Generate concise research briefs with insights, implications, and next steps.
- **AI Chatbot Interface** — Ask workplace questions and get direct, markdown-formatted answers.

Every AI output includes a clear disclaimer: *“AI-generated content may require human review.”*

## Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (React 19 + Vite 7)
- **Styling:** Tailwind CSS v4 with a custom Playful Pastel design system
- **AI:** Lovable AI Gateway via `ai` SDK (`google/gemini-3.7-flash`)
- **Routing:** TanStack Router file-based routes
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 20+ (recommended via [nvm](https://github.com/nvm-sh/nvm))
- A Lovable API key for AI generation

### Installation

```sh
git clone <repository-url>
cd <repository-name>
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
LOVABLE_API_KEY=your_lovable_api_key_here
```

`LOVABLE_API_KEY` is used server-side by the AI generation function.

### Run Locally

```sh
npm run dev
```

The app will be available at `http://localhost:8080`.

### Build for Production

```sh
npm run build
```

## Project Structure

```text
src/
  components/        # Shared UI components (AppShell, ToolWorkspace)
  lib/             # Server functions and AI gateway provider
  routes/          # TanStack Start file-based routes
  styles.css       # Design tokens, animations, and typography
public/            # Static assets
```

## AI Prompt Engineering

Each tool uses a dedicated structured prompt with:

- A clear role and task definition
- Output format constraints
- Anti-fabrication rules (`[confirm]` for missing details)
- Professional, concise business English

Prompts are defined in `src/lib/ai.functions.ts`.

## Design System

Brevity uses a Playful Pastel aesthetic:

- **Fonts:** Fredoka (display), Nunito (body), JetBrains Mono (mono)
- **Colors:** Cream page background, white surfaces, coral/butter/mint/powder/lilac accents
- **Components:** Rounded cards, chip selectors, sticky sidebar, responsive mobile menu

## Roadmap

- [ ] User accounts and saved history
- [ ] Export generated content to PDF / copy as HTML
- [ ] Custom prompt templates
- [ ] Dark mode

## License

This project is built with [Lovable](https://lovable.dev) and is owned by its creator. Feel free to modify and deploy as needed.

---

Built with ❤️ using Lovable, TanStack Start, and Tailwind CSS.
