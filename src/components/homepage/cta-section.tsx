import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FadeIn } from "./fade-in";

export function CtaSection() {
  return (
    <section className="py-24 px-6 text-center bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-2xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to organize your knowledge?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join developers who stopped losing things between browser tabs and random text files.
          </p>
          <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
            Start Free Today
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
