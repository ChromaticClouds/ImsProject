import { LandingCta } from '@/features/landing/components/landing-cta.js';
import { LandingFeatureSection } from '@/features/landing/components/landing-feature-section.js';
import { LandingHero } from '@/features/landing/components/landing-hero.js';
import { LandingInsightSection } from '@/features/landing/components/landing-insight-section.js';
import { LandingNav } from '@/features/landing/components/landing-nav.js';
import { LandingWorkflowSection } from '@/features/landing/components/landing-workflow-section.js';

export const LandingPage = () => {
  return (
    <div className='min-h-screen overflow-hidden bg-[#08070d] text-white'>
      <LandingNav />
      <main>
        <LandingHero />
        <LandingFeatureSection />
        <LandingWorkflowSection />
        <LandingInsightSection />
        <LandingCta />
      </main>
    </div>
  );
};
