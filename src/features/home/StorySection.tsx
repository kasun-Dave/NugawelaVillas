import { images } from '@/config/images';
import { ImageWithFallback } from '@/components/ui/shared';

export function StorySection() {
  return (
    <section
      id="story"
      className="section-padding relative overflow-hidden bg-mist"
      aria-labelledby="story-heading"
    >
      <div
        className="absolute right-0 top-20 h-96 w-96 translate-x-1/2 rounded-full bg-gold/10"
        aria-hidden="true"
      />
      <div className="container-narrow relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-terracotta">
              Our Story
            </p>
            <h2 id="story-heading" className="heading-section mb-6">
              A valley of mist, memory, and mystery
            </h2>
            <div className="text-body space-y-4">
              <p>
                Nugawela sits in the heart of Sri Lanka&apos;s central highlands — a place where
                morning mist drapes ancient tea terraces and evening stars reveal constellations
                unseen in city skies.
              </p>
              <p>
                Our resort was born from a desire to share this valley not as a passing destination,
                but as a living story. Every room, trail, and experience is woven into the fabric of
                hill-country heritage — from colonial-era architecture to village artisan
                traditions.
              </p>
              <p>
                And for those who seek more than scenery,{' '}
                <strong>The Hidden Trail of Nugawela</strong> invites you into a story-driven
                adventure across safe, verified locations — where fiction and local history
                intertwine in ways that surprise and delight.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ImageWithFallback
              src={images.resort.garden}
              alt="Resort garden with misty mountains"
              className="h-64 rounded-2xl"
            />
            <ImageWithFallback
              src={images.resort.terrace}
              alt="Resort terrace overlooking the valley"
              className="mt-8 h-64 rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
