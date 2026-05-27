import { FadeIn } from "./fade-in";

const CHECKLIST = [
  "Auto-generate tags from content and context",
  "Smart search with semantic similarity",
  "Summarize long notes and docs instantly",
  "Detect duplicate or similar items",
  "Suggest collections based on content",
];

export function AiSection() {
  return (
    <section className="py-24 px-6 bg-muted/30 border-y border-border">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        <FadeIn>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-blue-400 to-blue-600 text-white mb-4">
            Pro Feature
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            AI that understands your stash
          </h2>
          <p className="text-muted-foreground mb-6">
            Upgrade to Pro and let AI do the housekeeping — so you can focus on building.
          </p>
          <ul className="space-y-3">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <span className="text-green-500 font-bold mt-0.5 shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn>
          <div className="rounded-xl overflow-hidden border border-border bg-[#0d1117] font-mono text-sm">
            {/* macOS dots */}
            <div className="flex gap-1.5 px-3 py-2.5 bg-muted/20 border-b border-border">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="p-4 leading-7 text-[13px]">
              <div className="text-[#6b737d]"># JWT decode utility</div>
              <div>&nbsp;</div>
              <div><span className="text-cyan-400">import</span> jwt</div>
              <div>&nbsp;</div>
              <div><span className="text-cyan-400">def</span> decode_token(token):</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-cyan-400">return</span> jwt.decode(</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;token, options=<span className="text-green-400">&#123;&quot;verify_signature&quot;</span>: <span className="text-cyan-400">False</span><span className="text-green-400">&#125;</span>)</div>
              <div>&nbsp;</div>
              <div className="flex items-center flex-wrap gap-1">
                <span className="text-[#6b737d]">✦ AI Generated Tags</span>
                {["jwt", "python", "auth"].map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded text-[11px] font-semibold"
                    style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
