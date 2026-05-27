/* ── NAVBAR SCROLL OPACITY ─────────────────────────────────────────────── */

const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

/* ── CHAOS ICON ANIMATION ─────────────────────────────────────────────── */

(function initChaos() {
  const container = document.getElementById("chaos-canvas");
  if (!container) return;

  const icons = Array.from(container.querySelectorAll(".chaos-icon"));
  const rect = () => container.getBoundingClientRect();
  let mouse = { x: -999, y: -999 };
  let cRect = rect();

  const REPEL_RADIUS = 80;
  const REPEL_STRENGTH = 2.5;
  const DAMPING = 0.96;
  const ICON_SIZE = 36;

  const particles = icons.map((el) => ({
    el,
    x: Math.random() * (cRect.width - ICON_SIZE),
    y: Math.random() * (cRect.height - ICON_SIZE),
    vx: (Math.random() - 0.5) * 1.4,
    vy: (Math.random() - 0.5) * 1.4,
    rot: Math.random() * 360,
    rotV: (Math.random() - 0.5) * 0.8,
  }));

  container.addEventListener("mousemove", (e) => {
    cRect = rect();
    mouse.x = e.clientX - cRect.left;
    mouse.y = e.clientY - cRect.top;
  });

  container.addEventListener("mouseleave", () => {
    mouse.x = -999;
    mouse.y = -999;
  });

  window.addEventListener("resize", () => { cRect = rect(); }, { passive: true });

  function tick() {
    const W = container.clientWidth - ICON_SIZE;
    const H = container.clientHeight - ICON_SIZE;

    particles.forEach((p) => {
      // repel from mouse
      const dx = p.x + ICON_SIZE / 2 - mouse.x;
      const dy = p.y + ICON_SIZE / 2 - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < REPEL_RADIUS && dist > 0) {
        const force = (REPEL_RADIUS - dist) / REPEL_RADIUS * REPEL_STRENGTH;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      p.vx *= DAMPING;
      p.vy *= DAMPING;

      // floor velocity
      if (Math.abs(p.vx) < 0.3) p.vx += (Math.random() - 0.5) * 0.4;
      if (Math.abs(p.vy) < 0.3) p.vy += (Math.random() - 0.5) * 0.4;

      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotV;

      // bounce
      if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
      if (p.x > W) { p.x = W; p.vx = -Math.abs(p.vx); }
      if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
      if (p.y > H) { p.y = H; p.vy = -Math.abs(p.vy); }

      p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg)`;
    });

    requestAnimationFrame(tick);
  }

  // position icons absolutely
  icons.forEach((el) => {
    el.style.position = "absolute";
    el.style.left = "0";
    el.style.top = "0";
  });

  tick();
})();

/* ── PRICING TOGGLE ───────────────────────────────────────────────────── */

(function initPricing() {
  const toggle = document.getElementById("yearly-toggle");
  const priceEl = document.getElementById("pro-price");
  const periodEl = document.getElementById("pro-period");

  if (!toggle || !priceEl || !periodEl) return;

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      priceEl.innerHTML = "<sup>$</sup>6";
      periodEl.textContent = "per month, billed $72/yr";
    } else {
      priceEl.innerHTML = "<sup>$</sup>8";
      periodEl.textContent = "per month";
    }
  });
})();

/* ── SCROLL FADE-IN ───────────────────────────────────────────────────── */

(function initFadeIn() {
  const els = document.querySelectorAll(".fade-in");
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  els.forEach((el) => observer.observe(el));
})();

/* ── CURRENT YEAR IN FOOTER ───────────────────────────────────────────── */

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
