import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { repositories } from '@/services/repository-registry';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

export function UpdateDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['travel', 'update', slug],
    queryFn: () => repositories.travel.getUpdateBySlug(slug!),
    enabled: !!slug,
  });
  const upd = data?.data;

  if (isLoading) {
    return (
      <div className="section-padding container-narrow">
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }
  if (!upd) {
    return (
      <div className="section-padding container-narrow py-16 text-center">
        <h1 className="heading-section mb-4">Update Not Found</h1>
        <Button asChild>
          <Link to="/updates">All Updates</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="section-padding min-h-screen bg-ivory">
      <article className="container-narrow max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-wider text-forest">
          {upd.category} · <time dateTime={upd.publishedAt}>{upd.publishedAt}</time>
        </p>
        <h1 className="heading-section mt-2">{upd.title}</h1>
        <p className="text-body mt-4 text-lg">{upd.summary}</p>
        <p className="mt-6 leading-relaxed text-charcoal-600">{upd.body}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/updates">More updates</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/guides">Travel guides</Link>
          </Button>
        </div>
      </article>
    </div>
  );
}
