import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Clock, Users, Tag } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { SaveToItineraryButton } from '@/components/booking/SaveToItineraryButton';
import { ImageWithFallback } from '@/components/ui/shared';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

export function ExperienceDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['experience', slug],
    queryFn: () => repositories.experiences.getBySlug(slug!),
    enabled: !!slug,
  });

  const exp = data?.data;

  if (isLoading) {
    return (
      <div className="section-padding container-narrow space-y-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-8 w-1/2" />
      </div>
    );
  }

  if (!exp) {
    return (
      <div className="section-padding container-narrow py-16 text-center">
        <h1 className="heading-section mb-4">Experience Not Found</h1>
        <Button asChild>
          <Link to="/experiences">All Experiences</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="relative h-64 sm:h-80">
        <ImageWithFallback src={exp.images[0]} alt={exp.name} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
        <div className="container-narrow absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <span className="mb-2 block text-xs font-medium uppercase capitalize tracking-wider text-gold">
            {exp.category}
          </span>
          <h1 className="font-serif text-3xl font-semibold text-ivory sm:text-4xl">{exp.name}</h1>
        </div>
      </div>

      <div className="section-padding container-narrow">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <p className="text-body text-lg leading-relaxed">{exp.description}</p>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-mist-200 bg-white p-4">
                <Clock className="mb-1 h-4 w-4 text-forest" />
                <p className="text-xs text-charcoal-400">Duration</p>
                <p className="font-medium">{exp.durationMinutes} minutes</p>
              </div>
              <div className="rounded-xl border border-mist-200 bg-white p-4">
                <Users className="mb-1 h-4 w-4 text-forest" />
                <p className="text-xs text-charcoal-400">Max group</p>
                <p className="font-medium">{exp.maxParticipants} guests</p>
              </div>
              <div className="rounded-xl border border-mist-200 bg-white p-4">
                <Tag className="mb-1 h-4 w-4 text-forest" />
                <p className="text-xs text-charcoal-400">Price</p>
                <p className="font-medium text-forest">
                  ${exp.price} {exp.currency}
                </p>
              </div>
            </div>
          </div>

          <div className="sticky top-24 space-y-4 rounded-2xl border border-mist-200 bg-white p-6">
            <p className="font-serif text-2xl font-semibold text-forest">
              ${exp.price}
              <span className="text-sm font-normal text-charcoal-400"> per person</span>
            </p>
            <p className="text-sm text-charcoal-500">
              Book through reception or add to your itinerary and our team will confirm
              availability.
            </p>
            <SaveToItineraryButton
              type="experience"
              itemId={exp.id}
              name={exp.name}
              variant="primary"
              size="md"
            />
            <Button variant="outline" className="w-full" asChild>
              <Link to="/account/itinerary">View My Itinerary</Link>
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link to="/experiences">More Experiences</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
