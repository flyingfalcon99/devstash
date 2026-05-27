"use client";

import { useState } from "react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const FREE_FEATURES = [
  { text: "50 items", included: true },
  { text: "3 collections", included: true },
  { text: "All item types", included: true },
  { text: "Full text search", included: true },
  { text: "AI features", included: false },
  { text: "Unlimited items", included: false },
];

const PRO_FEATURES = [
  { text: "Unlimited items", included: true },
  { text: "Unlimited collections", included: true },
  { text: "All item types", included: true },
  { text: "Full text search", included: true },
  { text: "AI tagging & search", included: true },
  { text: "Priority support", included: true },
];

export function PricingToggle() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Toggle */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>Monthly</span>
        <Switch checked={yearly} onCheckedChange={setYearly} />
        <span className="flex items-center gap-2">
          Yearly
          <Badge variant="secondary" className="text-green-500 bg-green-500/10 text-[10px] px-1.5">
            Save 25%
          </Badge>
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* Free */}
        <div className="rounded-xl border border-border bg-card p-7 flex flex-col">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Free</h3>
          <div className="text-5xl font-extrabold mb-1">
            <sup className="text-2xl font-semibold align-top mt-3">$</sup>0
          </div>
          <p className="text-sm text-muted-foreground mb-6">forever</p>
          <ul className="space-y-2.5 mb-8 flex-1">
            {FREE_FEATURES.map((f) => (
              <li key={f.text} className={`flex items-center gap-2.5 text-sm ${f.included ? "" : "text-muted-foreground"}`}>
                <span className={f.included ? "text-green-500 font-bold" : "text-border font-bold"}>
                  {f.included ? "✓" : "–"}
                </span>
                {f.text}
              </li>
            ))}
          </ul>
          <Link href="/register" className={cn(buttonVariants({ variant: "outline" }), "w-full text-center")}>
            Get Started
          </Link>
        </div>

        {/* Pro */}
        <div className="rounded-xl border-2 border-blue-500 bg-card p-7 flex flex-col relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wide whitespace-nowrap">
            Most Popular
          </div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Pro</h3>
          <div className="text-5xl font-extrabold mb-1">
            <sup className="text-2xl font-semibold align-top mt-3">$</sup>
            {yearly ? "6" : "8"}
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            {yearly ? "per month, billed $72/yr" : "per month"}
          </p>
          <ul className="space-y-2.5 mb-8 flex-1">
            {PRO_FEATURES.map((f) => (
              <li key={f.text} className="flex items-center gap-2.5 text-sm">
                <span className="text-green-500 font-bold">✓</span>
                {f.text}
              </li>
            ))}
          </ul>
          <Link href="/register" className={cn(buttonVariants(), "w-full text-center")}>
            Start Pro Trial
          </Link>
        </div>
      </div>
    </div>
  );
}
