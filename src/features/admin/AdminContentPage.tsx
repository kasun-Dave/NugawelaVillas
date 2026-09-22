import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { repositories } from '@/services/repository-registry';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { showToast } from '@/components/ui/toast-utils';

type Tab = 'destinations' | 'experiences';

export function AdminContentPage() {
  const [tab, setTab] = useState<Tab>('destinations');
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data: destData, isLoading: destLoading } = useQuery({
    queryKey: ['admin-destinations'],
    queryFn: () => repositories.admin.listDestinationsForAdmin(),
  });

  const { data: expData, isLoading: expLoading } = useQuery({
    queryKey: ['admin-experiences'],
    queryFn: () => repositories.admin.listExperiencesForAdmin(),
  });

  const actor = user ? { id: user.id, name: user.displayName, role: user.role } : null;

  const handleDestToggle = async (id: string, featured: boolean, name: string) => {
    if (!actor) return;
    const result = await repositories.admin.toggleDestinationFeatured(id, !featured, actor);
    if (result.error) {
      showToast(result.error, 'error');
      return;
    }
    showToast(`${name} featured updated`, 'success');
    queryClient.invalidateQueries({ queryKey: ['admin-destinations'] });
    queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
  };

  const handleExpToggle = async (id: string, featured: boolean, name: string) => {
    if (!actor) return;
    const result = await repositories.admin.toggleExperienceFeatured(id, !featured, actor);
    if (result.error) {
      showToast(result.error, 'error');
      return;
    }
    showToast(`${name} featured updated`, 'success');
    queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
    queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold">Content Management</h2>
        <p className="mt-1 text-sm text-charcoal-500">
          Toggle featured destinations and experiences on the public site.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab('destinations')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            tab === 'destinations' ? 'bg-forest text-ivory' : 'bg-mist text-charcoal-600'
          }`}
        >
          Destinations
        </button>
        <button
          type="button"
          onClick={() => setTab('experiences')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            tab === 'experiences' ? 'bg-forest text-ivory' : 'bg-mist text-charcoal-600'
          }`}
        >
          Experiences
        </button>
      </div>

      {tab === 'destinations' ? (
        destLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ContentList
            items={(destData?.data ?? []).map((d) => ({
              id: d.id,
              name: d.name,
              subtitle: `${d.distanceKm} km · ${d.difficulty}`,
              featured: d.featured,
            }))}
            onToggle={(id, featured, name) => handleDestToggle(id, featured, name)}
          />
        )
      ) : expLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <ContentList
          items={(expData?.data ?? []).map((e) => ({
            id: e.id,
            name: e.name,
            subtitle: e.category,
            featured: e.featured,
          }))}
          onToggle={(id, featured, name) => handleExpToggle(id, featured, name)}
        />
      )}
    </div>
  );
}

function ContentList({
  items,
  onToggle,
}: {
  items: { id: string; name: string; subtitle: string; featured: boolean }[];
  onToggle: (id: string, featured: boolean, name: string) => void;
}) {
  return (
    <div className="divide-y divide-mist-100 rounded-2xl border border-mist-200 bg-white">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="font-medium text-charcoal">{item.name}</p>
            <p className="text-xs text-charcoal-500">{item.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            {item.featured ? (
              <span className="text-gold-700 rounded-full bg-gold/10 px-2 py-1 text-xs font-medium">
                Featured
              </span>
            ) : (
              <span className="text-xs text-charcoal-400">Not featured</span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggle(item.id, item.featured, item.name)}
            >
              {item.featured ? 'Remove' : 'Feature'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
