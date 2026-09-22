import { useEffect, useState, type ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from '@/app/AppProviders';
import { AppRoutes } from '@/routes/AppRoutes';
import { usePreferencesStore } from '@/stores/preferencesStore';
import { useItineraryStore } from '@/stores/itineraryStore';
import { useAuthStore } from '@/stores/authStore';
import {
  getDataSource,
  isFirebaseConfigured,
  isFirebaseMode,
} from '@/config/data-source';
import { initializeDataLayer } from '@/services/repository-registry';
import { Button } from '@/components/ui/Button';

function DataLayerBootstrap({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!isFirebaseMode());
  const [bootError, setBootError] = useState<string | null>(null);
  const initializeAuth = useAuthStore((s) => s.initialize);
  const initializePrefs = usePreferencesStore((s) => s.initialize);
  const initializeItinerary = useItineraryStore((s) => s.initialize);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (getDataSource() === 'firebase' && !isFirebaseConfigured()) {
        setBootError(
          'VITE_DATA_SOURCE=firebase but Firebase env vars are missing. Copy .env.example to .env and add your VITE_FIREBASE_* keys. See FIREBASE_MIGRATION.md.',
        );
        setReady(true);
        return;
      }

      if (!isFirebaseMode()) {
        initializeAuth();
      }
      initializePrefs();
      initializeItinerary();

      try {
        await initializeDataLayer();
        if (!cancelled) setBootError(null);
      } catch (error) {
        console.error('Failed to initialize data layer:', error);
        if (!cancelled) {
          setBootError(
            'Could not connect to Firebase. Check your .env config, enable Email/Password auth, create Firestore, and deploy firestore.rules. See FIREBASE_MIGRATION.md.',
          );
        }
      }

      if (!cancelled) setReady(true);
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, [initializeAuth, initializePrefs, initializeItinerary]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <div className="text-center">
          <div
            className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-forest border-t-transparent"
            aria-hidden="true"
          />
          <p className="text-sm text-charcoal-500">Connecting to Firebase…</p>
        </div>
      </div>
    );
  }

  if (bootError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
        <div className="max-w-lg rounded-2xl border border-mist-200 bg-white p-8 text-center shadow-sm">
          <h1 className="font-serif text-xl font-semibold text-charcoal">Firebase setup needed</h1>
          <p className="mt-3 text-sm text-charcoal-600">{bootError}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="primary" onClick={() => window.location.reload()}>
              Retry
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                window.open(
                  'https://console.firebase.google.com',
                  '_blank',
                  'noopener,noreferrer',
                );
              }}
            >
              Open Firebase Console
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

function AppInitializer() {
  return (
    <DataLayerBootstrap>
      <AppRoutes />
    </DataLayerBootstrap>
  );
}

export function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <AppInitializer />
      </BrowserRouter>
    </AppProviders>
  );
}
