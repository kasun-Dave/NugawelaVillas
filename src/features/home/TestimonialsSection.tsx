import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { SectionHeading, ImageWithFallback } from '@/components/ui/shared';
import { Skeleton } from '@/components/ui/Skeleton';

export function TestimonialsSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => repositories.testimonials.getAll(),
  });

  const testimonials = data?.data ?? [];

  return (
    <section className="section-padding bg-ivory" aria-labelledby="testimonials-heading">
      <div className="container-narrow">
        <SectionHeading
          title="Guest Stories"
          subtitle="What our guests say about their Nugawela escape."
        />

        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-4 rounded-2xl border border-mist-200 p-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="mt-10 text-terracotta" role="alert">
            Unable to load testimonials.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote
                key={t.id}
                className="rounded-2xl border border-mist-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
                  ))}
                </div>
                <p className="italic leading-relaxed text-charcoal-700">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-6 flex items-center gap-3">
                  <ImageWithFallback src={t.imageUrl} alt="" className="h-12 w-12 rounded-full" />
                  <div>
                    <cite className="font-medium not-italic text-charcoal">{t.guestName}</cite>
                    <p className="text-sm text-charcoal-500">{t.location}</p>
                    <p className="text-xs text-charcoal-400">{t.stayType}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
