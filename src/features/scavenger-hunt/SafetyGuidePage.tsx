import { AlertTriangle, Sun, Users, Home, Shield } from 'lucide-react';

export function SafetyGuidePage() {
  const rules = [
    {
      icon: <Sun className="h-5 w-5" />,
      title: 'Daylight guidance',
      text: 'Most outdoor stages are daylight-only unless marked as supervised evening activities.',
    },
    {
      icon: <Home className="h-5 w-5" />,
      title: 'No trespassing',
      text: 'Never enter private property. Off-resort locations are approved partner stations only.',
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: 'Story keepers',
      text: 'Only registered approved partners act as story keepers — not random residents.',
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: 'Staff assistance',
      text: 'Children, older guests, and accessibility needs — request staff-guided options anytime.',
    },
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      title: 'Pause or skip',
      text: 'You can pause your adventure or skip a stage with staff approval and safety review.',
    },
  ];

  return (
    <div className="max-w-3xl space-y-8">
      <div className="rounded-2xl border border-terracotta/20 bg-terracotta/5 p-6">
        <p className="flex items-center gap-2 font-medium text-charcoal">
          <AlertTriangle className="h-5 w-5 text-terracotta" />
          Your safety is our priority
        </p>
        <p className="text-body mt-2">
          Every stage includes safety notes, difficulty guidance, and estimated duration. Fictional
          story content is labeled separately from local historical facts.
        </p>
      </div>

      <ul className="space-y-4">
        {rules.map((r) => (
          <li key={r.title} className="adventure-panel flex gap-4 rounded-xl p-5">
            <div className="shrink-0 text-forest">{r.icon}</div>
            <div>
              <h3 className="font-medium text-charcoal">{r.title}</h3>
              <p className="mt-1 text-sm text-charcoal-600">{r.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
