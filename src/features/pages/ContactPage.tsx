import { Mail, MapPin } from 'lucide-react';

export function ContactPage() {
  return (
    <div className="section-padding min-h-screen bg-ivory">
      <div className="container-narrow max-w-2xl">
        <h1 className="heading-section">Contact</h1>
        <p className="text-body mt-4">
          Questions about destinations, trails, or content partnerships? Reach the Lanka Horizons
          team.
        </p>
        <div className="mt-8 space-y-4 rounded-2xl border border-mist-200 bg-white p-6 text-sm text-charcoal-600">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 text-forest" />
            <a href="mailto:hello@lankahorizons.com" className="hover:text-forest">
              hello@lankahorizons.com
            </a>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 text-forest" />
            <p>Sri Lanka — covering all nine provinces</p>
          </div>
        </div>
      </div>
    </div>
  );
}
