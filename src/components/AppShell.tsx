import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

const NAV = [
  { to: "/", label: "Dashboard", initial: "D", chip: "bg-coral text-white" },
  { to: "/email", label: "Email Generator", initial: "E", chip: "bg-lilac-soft text-ink" },
  { to: "/notes", label: "Meeting Notes", initial: "M", chip: "bg-butter-soft text-ink" },
  { to: "/planner", label: "Task Planner", initial: "P", chip: "bg-mint-soft text-ink" },
  { to: "/research", label: "Research", initial: "R", chip: "bg-powder-soft text-ink" },
  { to: "/chat", label: "Chatbot", initial: "C", chip: "bg-lilac-soft text-ink" },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-1">
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: item.to === "/" }}
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-soft transition-colors hover:bg-lilac-soft/60"
          activeProps={{ className: "bg-coral-soft text-ink font-bold" }}
        >
          <span
            className={`grid size-6 place-items-center rounded-full font-display text-xs ${item.chip}`}
          >
            {item.initial}
          </span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({
  eyebrow,
  title,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-page font-body text-ink antialiased md:flex">
      <aside className="hidden w-60 shrink-0 border-r border-line bg-surface p-5 md:sticky md:top-0 md:block md:h-screen">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-2xl bg-coral font-display text-lg font-bold text-white">
            B
          </div>
          <div>
            <div className="font-display text-lg font-semibold leading-none">Brevity</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-soft">
              workplace copilot
            </div>
          </div>
        </Link>
        <div className="mt-8">
          <NavList />
        </div>
        <div className="mt-8 rounded-3xl bg-lilac-soft p-4">
          <div className="font-mono text-[10px] uppercase tracking-widest text-soft">
            Human in the loop
          </div>
          <p className="mt-1.5 text-xs font-semibold leading-relaxed">
            AI-generated content may require human review.
          </p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="z-10 flex items-center justify-between gap-3 border-b border-line bg-surface px-5 py-4 md:sticky md:top-0">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
              className="grid size-9 shrink-0 place-items-center rounded-2xl border border-line font-display text-sm font-bold md:hidden"
            >
              {open ? "×" : "≡"}
            </button>
            <div className="min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-widest text-coral">
                {eyebrow}
              </div>
              <h1 className="truncate font-display text-xl font-semibold leading-tight sm:text-2xl">
                {title}
              </h1>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {actions}
            <div className="grid size-9 place-items-center rounded-full bg-butter font-display text-sm font-bold">
              AR
            </div>
          </div>
        </header>

        {open ? (
          <div className="border-b border-line bg-surface px-5 py-3 md:hidden">
            <NavList onNavigate={() => setOpen(false)} />
          </div>
        ) : null}

        <main className="space-y-4 p-4 sm:p-5">{children}</main>
      </div>
    </div>
  );
}

export function Disclaimer() {
  return (
    <p className="rounded-2xl bg-butter-soft px-3.5 py-2.5 text-[11px] font-semibold leading-relaxed text-ink">
      AI-generated content may require human review.
    </p>
  );
}
