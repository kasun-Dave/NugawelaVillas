import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { HeroSection } from './HeroSection';
import { JourneyIntroSection } from './JourneyIntroSection';
import { DestinationChaptersSection } from './DestinationChaptersSection';
import { NatureImmersionSection } from './NatureImmersionSection';
import { ActivitiesPanelsSection } from './ActivitiesPanelsSection';
import { InspirationEditorialSection } from './InspirationEditorialSection';
import { IslandMapPreviewSection } from './IslandMapPreviewSection';
import { EditorialUpdatesSection } from './EditorialUpdatesSection';
import { CinematicCtaSection } from './CinematicCtaSection';
import { NewsletterSection } from './NewsletterSection';

export function HomePage() {
  useDocumentTitle('Explore Sri Lanka');

  return (
    <div className="bg-charcoal">
      <HeroSection />
      <JourneyIntroSection />
      <DestinationChaptersSection />
      <NatureImmersionSection />
      <ActivitiesPanelsSection />
      <InspirationEditorialSection />
      <IslandMapPreviewSection />
      <EditorialUpdatesSection />
      <NewsletterSection />
      <CinematicCtaSection />
    </div>
  );
}
