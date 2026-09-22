import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { repositories } from '@/services/repository-registry';
import { usePreferencesStore } from '@/stores/preferencesStore';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { showToast } from '@/components/ui/toast-utils';
import { cn } from '@/utils/cn';

const INTEREST_OPTIONS = [
  { id: 'nature', label: 'Nature & Trails' },
  { id: 'culture', label: 'Culture & Heritage' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'culinary', label: 'Food & Tea' },
  { id: 'photography', label: 'Photography' },
  { id: 'family', label: 'Family Activities' },
];

export function PreferencesPage() {
  const user = useAuthStore((s) => s.user);
  const { preferences, updatePreferences } = usePreferencesStore();

  const { data, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => repositories.auth.getProfile(user!.id),
    enabled: !!user,
  });

  const profile = data?.data;

  useEffect(() => {
    if (profile?.preferences) {
      updatePreferences(profile.preferences);
    }
  }, [profile, updatePreferences]);

  const toggleInterest = (interest: string) => {
    const interests = preferences.interests.includes(interest)
      ? preferences.interests.filter((i) => i !== interest)
      : [...preferences.interests, interest];
    updatePreferences({ interests });
  };

  const savePreferences = async () => {
    if (!user) return;
    const result = await repositories.auth.updateProfile(user.id, {
      preferences: preferences,
    });
    if (result.error) {
      showToast(result.error, 'error');
      return;
    }
    showToast('Preferences saved', 'success');
  };

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-2xl" />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-mist-200 bg-white p-6">
        <h2 className="mb-2 font-serif text-xl font-semibold">Travel Interests</h2>
        <p className="mb-6 text-sm text-charcoal-500">
          Select interests to improve destination and experience recommendations.
        </p>
        <div className="flex flex-wrap gap-3">
          {INTEREST_OPTIONS.map((opt) => {
            const selected = preferences.interests.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleInterest(opt.id)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                  selected
                    ? 'border-forest bg-forest text-ivory'
                    : 'border-mist-200 bg-white text-charcoal-600 hover:border-forest',
                )}
                aria-pressed={selected}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-mist-200 bg-white p-6">
        <h2 className="font-serif text-xl font-semibold">Experience Settings</h2>

        <ToggleRow
          label="Accessibility mode"
          description="Prioritize easy routes and accessible options"
          checked={preferences.accessibilityMode}
          onChange={(v) => updatePreferences({ accessibilityMode: v })}
        />
        <ToggleRow
          label="Adventure hints"
          description="Enable hints during The Hidden Trail"
          checked={preferences.adventureHintsEnabled}
          onChange={(v) => updatePreferences({ adventureHintsEnabled: v })}
        />
        <ToggleRow
          label="Newsletter"
          description="Receive seasonal updates and offers"
          checked={preferences.newsletterOptIn}
          onChange={(v) => updatePreferences({ newsletterOptIn: v })}
        />
      </div>

      <Button variant="primary" onClick={savePreferences}>
        Save Preferences
      </Button>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="font-medium text-charcoal">{label}</p>
        <p className="text-sm text-charcoal-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-forest' : 'bg-mist-200',
        )}
      >
        <span
          className={cn(
            'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
            checked && 'translate-x-5',
          )}
        />
      </button>
    </div>
  );
}
