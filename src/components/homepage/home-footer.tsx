import Link from "next/link";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#" },
      { label: "Roadmap", href: "#" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign In", href: "/sign-in" },
      { label: "Register", href: "/register" },
      { label: "Settings", href: "/settings" },
      { label: "Favorites", href: "/favorites" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "Docs", href: "#" },
      { label: "API", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
];

export function HomeFooter() {
  return (
    <footer className="border-t border-border bg-card px-6 pt-12 pb-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-border mb-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-base mb-3">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <rect width="28" height="28" rx="7" fill="#3b82f6" />
                <path d="M10 10 Q14 7 18 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <path d="M7 14 Q14 10 21 14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <path d="M5 19 Q14 13 23 19" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              </svg>
              DevNest
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[160px]">
              Your developer knowledge hub. Organized, searchable, always accessible.
            </p>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                {col.heading}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} DevNest. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
