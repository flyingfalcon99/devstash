"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomeNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur border-b border-border"
          : "bg-background/40 backdrop-blur-md"
      }`}
    >
      <div className="flex items-center justify-between px-6 h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <rect width="28" height="28" rx="7" fill="#3b82f6" />
            <path d="M10 10 Q14 7 18 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <path d="M7 14 Q14 10 21 14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <path d="M5 19 Q14 13 23 19" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
          DevNest
        </Link>

        <ul className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
          <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/sign-in" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            Sign In
          </Link>
          <Link href="/register" className={cn(buttonVariants({ size: "sm" }))}>
            Get Started
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur px-6 py-4 flex flex-col gap-1">
          <a
            href="#features"
            onClick={closeMobile}
            className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            onClick={closeMobile}
            className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            Pricing
          </a>
        </div>
      )}
    </nav>
  );
}
