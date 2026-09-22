import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { repositories } from '@/services/repository-registry';
import { usePreferencesStore } from '@/stores/preferencesStore';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { showToast } from '@/components/ui/toast-utils';

export function PrivacyPage() {
  const user = useAuthStore((s) => s.user);
  const { preferences, updatePreferences } = usePreferencesStore();

  const { data, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => repositories.auth.getProfile(user!.id),
    enabled: !!user,
  });

  const saveNotificationPrefs = async () => {
    if (!user) return;
    const result = await repositories.auth.updateProfile(user.id, { preferences });
    if (result.error) {
      showToast(result.error, 'error');
      return;
    }
    showToast('Privacy settings saved', 'success');
  };

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-2xl" />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-2xl border border-mist-200 bg-white p-6">
        <h2 className="font-serif text-xl font-semibold">Notification Preferences</h2>
        <ToggleCheckbox
          label="Email notifications"
          description="Booking confirmations, adventure updates, and resort news"
          checked={preferences.notificationEmail}
          onChange={(v) => updatePreferences({ notificationEmail: v })}
        />
        <ToggleCheckbox
          label="Push notifications"
          description="Real-time alerts during your stay (mock — not enabled in local mode)"
          checked={preferences.notificationPush}
          onChange={(v) => updatePreferences({ notificationPush: v })}
        />
        <Button variant="primary" onClick={saveNotificationPrefs}>
          Save Settings
        </Button>
      </div>

      <div className="rounded-2xl border border-mist-200 bg-white p-6">
        <h2 className="mb-4 font-serif text-xl font-semibold">Data & Privacy</h2>
        <div className="space-y-3 text-sm text-charcoal-600">
          <p>
            Your data is stored locally in this demo. When Firebase is integrated, data will be
            handled according to our privacy policy with encrypted storage and secure
            authentication.
          </p>
          <p>
            Adventure progress, booking history, and itinerary data are associated with your account
            and can be exported upon request.
          </p>
          <p>We never share guest personal information with third parties without consent.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-terracotta/20 bg-terracotta/5 p-6">
        <h2 className="mb-2 font-serif text-lg font-semibold">Emergency Preferences</h2>
        <p className="mb-4 text-sm text-charcoal-600">
          Keep your emergency contact updated in your{' '}
          <Link to="/account/profile" className="text-forest hover:underline">
            profile settings
          </Link>
          . Resort staff can access this during your stay for safety purposes.
        </p>
        {data?.data?.emergencyContact ? (
          <div className="text-sm">
            <p className="font-medium">{data.data.emergencyContact.name}</p>
            <p className="text-charcoal-500">
              {data.data.emergencyContact.phone} · {data.data.emergencyContact.relationship}
            </p>
          </div>
        ) : (
          <p className="text-sm text-charcoal-500">No emergency contact set.</p>
        )}
      </div>
    </div>
  );
}

function ToggleCheckbox({
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
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-mist-200 text-forest focus:ring-forest"
      />
      <div>
        <p className="font-medium text-charcoal">{label}</p>
        <p className="text-sm text-charcoal-500">{description}</p>
      </div>
    </label>
  );
}
