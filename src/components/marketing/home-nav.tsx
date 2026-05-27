"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomeNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur border-b border-border"
          : "bg-background/40 backdrop-blur-md"
      }`}
    >
      <Link href="/" className="flex items-center gap-2 font-bold text-lg">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="7" fill="#3b82f6" />
          <path d="M7 10h14M7 14h10M7 18h12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
        DevStash
      </Link>

      <ul className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
        <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
        <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
      </ul>

      <div className="flex items-center gap-2">
        <Link href="/sign-in" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
          Sign In
        </Link>
        <Link href="/register" className={cn(buttonVariants({ size: "sm" }))}>
          Get Started
        </Link>
      </div>
    </nav>
  );
}
