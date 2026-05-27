import { FadeIn } from "./fade-in";
import { PricingToggle } from "./pricing-toggle";

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-6 text-center">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Simple, honest pricing</h2>
          <p className="text-muted-foreground mb-10">Start free. Upgrade when you need more.</p>
        </FadeIn>
        <FadeIn>
          <PricingToggle />
        </FadeIn>
      </div>
    </section>
  );
}
