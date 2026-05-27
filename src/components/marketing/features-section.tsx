import { FadeIn } from "./fade-in";

const FEATURES = [
  {
    icon: "</>" ,
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
    title: "Code Snippets",
    description: "Syntax-highlighted editor with language detection and one-click copy. Never lose a useful snippet again.",
  },
  {
    icon: "✦",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    title: "AI Prompts",
    description: "Build your personal prompt library. Reuse, refine, and organize the prompts that actually work.",
  },
  {
    icon: "$",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.1)",
    title: "Commands",
    description: "Shell commands, CLI flags, and scripts you always Google. Indexed and ready.",
  },
  {
    icon: "✎",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.1)",
    title: "Notes & Docs",
    description: "Markdown editor with live preview. Decision logs, runbooks, ADRs — all searchable.",
  },
  {
    icon: "⧉",
    color: "#94a3b8",
    bg: "rgba(100,116,139,0.1)",
    title: "Files & Images",
    description: "Drag-and-drop upload for diagrams, screenshots, PDFs, and configs. Stored securely on R2.",
  },
  {
    icon: "⚙",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.1)",
    title: "Collections",
    description: "Group related items into collections. Keep project resources organized and accessible.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything in your nest,<br className="hidden sm:block" /> organized your way
          </h2>
          <p className="text-muted-foreground max-w-lg mb-12">
            Six item types, one powerful search. Stop copying from Slack, your browser,
            and random text files — put it all here.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <FadeIn key={f.title}>
              <div className="rounded-xl border border-border bg-card p-6 hover:-translate-y-0.5 transition-transform">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold mb-4"
                  style={{ background: f.bg, color: f.color }}
                >
                  {f.icon}
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
