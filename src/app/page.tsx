import { HomeNav } from "@/components/marketing/home-nav";
import { HeroSection } from "@/components/marketing/hero-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { AiSection } from "@/components/marketing/ai-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { HomeFooter } from "@/components/marketing/home-footer";

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
