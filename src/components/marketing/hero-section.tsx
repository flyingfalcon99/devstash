import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FadeIn } from "./fade-in";
import { ChaosVisual } from "./chaos-visual";
import { DashboardPreview } from "./dashboard-preview";

export function HeroSection() {
  return (
    <section className="pt-32 pb-16 px-6 text-center">
      <div className="max-w-5xl mx-auto">

        <FadeIn>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground mb-6">
            ✦ <span className="text-blue-400 font-semibold">New</span> AI-powered tagging now in Pro
          </div>
        </FadeIn>

        <FadeIn>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-5">
            Stop Losing Your<br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 bg-clip-text text-transparent">
              Developer Knowledge
            </span>
          </h1>
        </FadeIn>

        <FadeIn>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Snippets, prompts, commands, notes, files, and links — all in one place.
            Search instantly. Access anywhere. Ship faster.
          </p>
        </FadeIn>

        <FadeIn>
          <div className="flex justify-center gap-3 flex-wrap mb-16">
            <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
              Get Started Free
            </Link>
            <Link href="#features" className={cn(buttonVariants({ size: "lg", variant: "outline" }))}>
              View Features
            </Link>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="flex flex-col md:flex-row items-stretch gap-4">
            <ChaosVisual />

            {/* Arrow */}
            <div className="flex md:flex-col items-center justify-center gap-2 text-blue-500 rotate-90 md:rotate-0">
              <div className="w-px md:w-auto md:h-10 h-px flex-1 md:flex-none bg-gradient-to-b from-transparent to-blue-500 opacity-60" />
              <span className="text-2xl animate-pulse">→</span>
            </div>

            <DashboardPreview />
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
