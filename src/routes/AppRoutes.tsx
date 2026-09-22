import { Suspense, type ReactNode } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { PlaceholderPage } from '@/components/layout/PlaceholderPage';
import { Skeleton } from '@/components/ui/Skeleton';
import { HomePage } from '@/features/home/HomePage';
import { RegionsListingPage } from '@/features/regions/RegionsListingPage';
import { RegionDetailPage } from '@/features/regions/RegionDetailPage';
import { DestinationsListingPage } from '@/features/destinations/DestinationsListingPage';
import { DestinationDetailPage } from '@/features/destinations/DestinationDetailPage';
import { ActivitiesListingPage } from '@/features/activities/ActivitiesListingPage';
import { ActivityDetailPage } from '@/features/activities/ActivityDetailPage';
import { TrailsListingPage } from '@/features/trails/TrailsListingPage';
import { TrailDetailPage } from '@/features/trails/TrailDetailPage';
import { GuidesListingPage } from '@/features/guides/GuidesListingPage';
import { GuideDetailPage } from '@/features/guides/GuideDetailPage';
import { UpdatesListingPage } from '@/features/updates/UpdatesListingPage';
import { UpdateDetailPage } from '@/features/updates/UpdateDetailPage';
import { AboutPage } from '@/features/pages/AboutPage';
import { ContactPage } from '@/features/pages/ContactPage';
import { SearchPage } from '@/features/search/SearchPage';

const PageLoader = () => (
  <div className="section-padding container-narrow space-y-4">
    <Skeleton className="h-10 w-1/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

function withLayout(page: ReactNode) {
  return <PageLayout>{page}</PageLayout>;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={withLayout(<HomePage />)} />

        <Route path="/destinations" element={withLayout(<RegionsListingPage />)} />
        <Route path="/destinations/:slug" element={withLayout(<RegionDetailPage />)} />

        <Route path="/attractions" element={withLayout(<DestinationsListingPage />)} />
        <Route path="/attractions/:slug" element={withLayout(<DestinationDetailPage />)} />

        <Route
          path="/national-parks"
          element={withLayout(
            <DestinationsListingPage
              title="National Parks & Nature"
              subtitle="Wildlife reserves, wetlands, and wild landscapes across Sri Lanka."
              presetCategory="nature"
              presetSearch="park"
              basePath="/attractions"
            />,
          )}
        />
        <Route
          path="/beaches"
          element={withLayout(
            <DestinationsListingPage
              title="Beaches & Coast"
              subtitle="Bays, palm shores, and coastal viewpoints — filter by city along the island."
              presetSearch="beach"
              basePath="/attractions"
            />,
          )}
        />
        <Route
          path="/wildlife"
          element={withLayout(
            <DestinationsListingPage
              title="Wildlife"
              subtitle="Parks, sanctuaries, and nature stops for animal encounters and birding."
              presetCategory="nature"
              presetSearch="wildlife"
              basePath="/attractions"
            />,
          )}
        />
        <Route
          path="/heritage"
          element={withLayout(
            <DestinationsListingPage
              title="Heritage"
              subtitle="Temples, ancient cities, forts, and cultural landmarks."
              presetCategory="historic"
              presetSearch="temple"
              basePath="/attractions"
            />,
          )}
        />

        <Route path="/activities" element={withLayout(<ActivitiesListingPage />)} />
        <Route path="/activities/:slug" element={withLayout(<ActivityDetailPage />)} />

        <Route path="/trails" element={withLayout(<TrailsListingPage />)} />
        <Route path="/trails/:slug" element={withLayout(<TrailDetailPage />)} />

        <Route path="/guides" element={withLayout(<GuidesListingPage />)} />
        <Route path="/guides/:slug" element={withLayout(<GuideDetailPage />)} />

        <Route path="/updates" element={withLayout(<UpdatesListingPage />)} />
        <Route path="/updates/:slug" element={withLayout(<UpdateDetailPage />)} />

        <Route path="/about" element={withLayout(<AboutPage />)} />
        <Route path="/contact" element={withLayout(<ContactPage />)} />
        <Route path="/search" element={withLayout(<SearchPage />)} />

        {/* Legacy redirects */}
        <Route path="/rooms" element={<Navigate to="/attractions" replace />} />
        <Route path="/rooms/*" element={<Navigate to="/attractions" replace />} />
        <Route path="/booking/*" element={<Navigate to="/destinations" replace />} />
        <Route path="/experiences" element={<Navigate to="/activities" replace />} />
        <Route path="/experiences/*" element={<Navigate to="/activities" replace />} />
        <Route path="/adventure/*" element={<Navigate to="/trails" replace />} />
        <Route path="/adventure" element={<Navigate to="/trails" replace />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Navigate to="/" replace />} />
        <Route path="/account/*" element={<Navigate to="/" replace />} />
        <Route path="/admin/*" element={<Navigate to="/" replace />} />

        <Route
          path="*"
          element={withLayout(
            <PlaceholderPage
              title="Page Not Found"
              description="The page you're looking for doesn't exist. Try returning to the home page."
            />,
          )}
        />
      </Routes>
    </Suspense>
  );
}
