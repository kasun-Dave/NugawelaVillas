import { Link } from 'react-router-dom';
import { Sparkles, Shield, MapPin, BookOpen, Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { repositories } from '@/services/repository-registry';
import { Button } from '@/components/ui/Button';

export function AdventureLandingPage() {
  const { data } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => repositories.adventure.getLeaderboard(),
  });

  const leaderboard = data?.data ?? [];

  return (
    <div className="space-y-12">
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          icon={<BookOpen className="h-5 w-5" />}
          title="12 Story Stages"
          desc="Four chapters of mystery across the valley"
        />
        <FeatureCard
          icon={<Shield className="h-5 w-5" />}
          title="Safety First"
          desc="Verified locations, daylight guidance, staff support"
        />
        <FeatureCard
          icon={<MapPin className="h-5 w-5" />}
          title="Valley Exploration"
          desc="Resort gardens to approved partner stations"
        />
        <FeatureCard
          icon={<Sparkles className="h-5 w-5" />}
          title="Collect Artifacts"
          desc="Earn story tokens as you progress"
        />
      </section>

      <section className="adventure-panel rounded-2xl p-8 text-center">
        <h2 className="mb-3 font-serif text-2xl font-semibold">Ready to begin?</h2>
        <p className="text-body mx-auto mb-6 max-w-xl">
          Receive your adventure code at check-in, then enter it here to unlock your personal trail.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="primary" size="lg" asChild>
            <Link to="/adventure/play">Enter Adventure Code</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/adventure/how-it-works">Learn How It Works</Link>
          </Button>
        </div>
        <p className="mt-4 text-xs text-charcoal-400">Demo codes: NEG-TRAIL01 · WELCOME-VALLEY</p>
      </section>

      <section>
        <div className="mb-6 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-gold" />
          <h2 className="font-serif text-xl font-semibold">Adventure Leaderboard</h2>
        </div>
        <div className="adventure-panel overflow-hidden rounded-2xl">
          <table className="w-full text-sm">
            <thead className="bg-mist/50 text-charcoal-500">
              <tr>
                <th className="px-4 py-3 text-left">Rank</th>
                <th className="px-4 py-3 text-left">Guest</th>
                <th className="px-4 py-3 text-right">Stages</th>
                <th className="px-4 py-3 text-right">Artifacts</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.rank} className="border-t border-mist-100">
                  <td className="px-4 py-3 font-medium text-forest">#{entry.rank}</td>
                  <td className="px-4 py-3">{entry.guestName}</td>
                  <td className="px-4 py-3 text-right">{entry.completedStages}</td>
                  <td className="px-4 py-3 text-right">{entry.artifactsCollected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="adventure-panel rounded-2xl p-6">
      <div className="mb-3 text-forest">{icon}</div>
      <h3 className="font-serif font-semibold text-charcoal">{title}</h3>
      <p className="mt-1 text-sm text-charcoal-500">{desc}</p>
    </div>
  );
}
