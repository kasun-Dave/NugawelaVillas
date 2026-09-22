import { useQuery, useQueryClient } from '@tanstack/react-query';
import { repositories } from '@/services/repository-registry';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { showToast } from '@/components/ui/toast-utils';

export function AdminGuestProgressPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-guest-progress'],
    queryFn: () => repositories.admin.listGuestProgress(),
  });

  const guests = data?.data ?? [];

  const handleReset = async (userId: string, name: string) => {
    if (!user) return;
    if (!confirm(`Reset adventure progress for ${name}? This cannot be undone.`)) return;
    const actor = { id: user.id, name: user.displayName, role: user.role };
    const result = await repositories.admin.resetGuestAdventure(userId, actor);
    if (result.error) {
      showToast(result.error, 'error');
      return;
    }
    showToast('Guest adventure reset', 'success');
    queryClient.invalidateQueries({ queryKey: ['admin-guest-progress'] });
    queryClient.invalidateQueries({ queryKey: ['admin-adventure-analytics'] });
    queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold">Guest Adventure Progress</h2>
        <p className="mt-1 text-sm text-charcoal-500">
          Monitor active trails and assist guests in the field.
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : guests.length === 0 ? (
        <div className="rounded-2xl border border-mist-200 bg-white p-8 text-center text-charcoal-500">
          No guest adventures yet. Guests appear here after entering an adventure code.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-mist/50 text-charcoal-500">
              <tr>
                <th className="px-4 py-3 text-left">Guest</th>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-right">Progress</th>
                <th className="px-4 py-3 text-left">Current stage</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((g) => (
                <tr key={g.userId} className="border-t border-mist-100">
                  <td className="px-4 py-3">
                    <p className="font-medium text-charcoal">{g.guestName}</p>
                    <p className="text-xs text-charcoal-400">{g.email}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{g.code}</td>
                  <td className="px-4 py-3 text-right">
                    {g.completedStages}/{g.totalStages}
                    <span className="ml-1 text-xs text-charcoal-400">
                      ({g.artifactCount} artifacts)
                    </span>
                  </td>
                  <td className="px-4 py-3 text-charcoal-600">{g.currentStageTitle ?? '—'}</td>
                  <td className="px-4 py-3 text-center">
                    {g.isComplete ? (
                      <span className="rounded-full bg-forest-50 px-2 py-1 text-xs font-medium text-forest">
                        Complete
                      </span>
                    ) : g.paused ? (
                      <span className="rounded-full bg-terracotta/10 px-2 py-1 text-xs font-medium text-terracotta">
                        Paused
                      </span>
                    ) : (
                      <span className="rounded-full bg-mist px-2 py-1 text-xs font-medium text-charcoal-600">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReset(g.userId, g.guestName)}
                    >
                      Reset
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
