"use client";

import { useEffect, useRef } from "react";

const ICONS = [
  { emoji: "📓", label: "Notion" },
  { emoji: "🐙", label: "GitHub" },
  { emoji: "💬", label: "Slack" },
  { emoji: "🖥️", label: "VS Code" },
  { emoji: "🌐", label: "Browser" },
  { emoji: "⬛", label: "Terminal" },
  { emoji: "📄", label: "Text file" },
  { emoji: "🔖", label: "Bookmarks" },
];

const ICON_SIZE = 36;
const DAMPING = 0.96;
const REPEL_RADIUS = 80;
const REPEL_STRENGTH = 2.5;

export function ChaosVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const icons = Array.from(container.querySelectorAll<HTMLElement>("[data-chaos-icon]"));
    const W = () => container.clientWidth - ICON_SIZE;
    const H = () => container.clientHeight - ICON_SIZE;

    const particles = icons.map((el) => ({
      el,
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 1.4,
      vy: (Math.random() - 0.5) * 1.4,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 0.8,
    }));

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouseRef.current = { x: -999, y: -999 }; };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    let raf: number;
    function tick() {
      const maxX = W();
      const maxY = H();
      const { x: mx, y: my } = mouseRef.current;

      particles.forEach((p) => {
        const cx = p.x + ICON_SIZE / 2;
        const cy = p.y + ICON_SIZE / 2;
        const dx = cx - mx;
        const dy = cy - my;
        const dist = Math.hypot(dx, dy);

        if (dist < REPEL_RADIUS && dist > 0) {
          const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_STRENGTH;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.vx *= DAMPING;
        p.vy *= DAMPING;
        if (Math.abs(p.vx) < 0.3) p.vx += (Math.random() - 0.5) * 0.4;
        if (Math.abs(p.vy) < 0.3) p.vy += (Math.random() - 0.5) * 0.4;

        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotV;

        if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
        if (p.x > maxX) { p.x = maxX; p.vx = -Math.abs(p.vx); }
        if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
        if (p.y > maxY) { p.y = maxY; p.vy = -Math.abs(p.vy); }

        p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg)`;
      });

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div className="flex-1 rounded-xl border border-border bg-card p-4 min-w-0">
      <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-2">
        Your knowledge today...
      </p>
      <div ref={containerRef} className="relative overflow-hidden h-[160px] sm:h-[200px]">
        {ICONS.map(({ emoji, label }) => (
          <div
            key={label}
            data-chaos-icon
            title={label}
            className="absolute w-9 h-9 rounded-lg border border-border bg-muted flex items-center justify-center text-lg select-none left-0 top-0"
            style={{ willChange: "transform" }}
          >
            {emoji}
          </div>
        ))}
      </div>
    </div>
  );
}
