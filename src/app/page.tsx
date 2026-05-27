import { HomeNav } from "@/components/homepage/home-nav";
import { HeroSection } from "@/components/homepage/hero-section";
import { FeaturesSection } from "@/components/homepage/features-section";
import { AiSection } from "@/components/homepage/ai-section";
import { PricingSection } from "@/components/homepage/pricing-section";
import { CtaSection } from "@/components/homepage/cta-section";
import { HomeFooter } from "@/components/homepage/home-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HomeNav />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AiSection />
        <PricingSection />
        <CtaSection />
      </main>
      <HomeFooter />
    </div>
  );
}
