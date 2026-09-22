import { useQuery, useQueryClient } from '@tanstack/react-query';
import { repositories } from '@/services/repository-registry';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { showToast } from '@/components/ui/toast-utils';

export function AdminCodesPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-adventure-codes'],
    queryFn: () => repositories.admin.listAdventureCodes(),
  });

  const codes = data?.data ?? [];

  const handleToggle = async (id: string, current: boolean) => {
    if (!user) return;
    const actor = { id: user.id, name: user.displayName, role: user.role };
    const result = await repositories.admin.toggleAdventureCode(id, !current, actor);
    if (result.error) {
      showToast(result.error, 'error');
      return;
    }
    showToast(result.data.active ? 'Code activated' : 'Code deactivated', 'success');
    queryClient.invalidateQueries({ queryKey: ['admin-adventure-codes'] });
    queryClient.invalidateQueries({ queryKey: ['admin-adventure-analytics'] });
    queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold">Adventure Codes</h2>
        <p className="mt-1 text-sm text-charcoal-500">
          Activate or deactivate welcome card codes for guest check-in.
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-mist/50 text-charcoal-500">
              <tr>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Label</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((code) => (
                <tr key={code.id} className="border-t border-mist-100">
                  <td className="px-4 py-3 font-mono font-medium text-forest">{code.code}</td>
                  <td className="px-4 py-3 text-charcoal-600">{code.label}</td>
                  <td className="px-4 py-3 text-center">
                    {code.active ? (
                      <span className="rounded-full bg-forest-50 px-2 py-1 text-xs font-medium text-forest">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-mist px-2 py-1 text-xs font-medium text-charcoal-400">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggle(code.id, code.active)}
                    >
                      {code.active ? 'Deactivate' : 'Activate'}
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
