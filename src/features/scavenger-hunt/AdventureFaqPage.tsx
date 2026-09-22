const faqs = [
  {
    q: 'Do I need to be a resort guest?',
    a: 'Yes. Adventure codes are issued at check-in to registered guests.',
  },
  {
    q: 'Can children participate?',
    a: 'Yes, with adult supervision. Several stages offer staff-assisted options for families.',
  },
  {
    q: 'How long does the full trail take?',
    a: 'Typically 2–3 days of exploration, or a focused full day with a guide. You can pause anytime.',
  },
  {
    q: 'Is the story real?',
    a: 'The lantern tale is fictional entertainment. Cultural and heritage content at partner locations is real and labeled.',
  },
  {
    q: 'What if I get stuck?',
    a: 'Use the hint system on each stage, or contact the adventure desk for staff assistance.',
  },
  {
    q: 'Can I play at night?',
    a: 'Some resort stages are available after dark. Outdoor valley stages require daylight or supervised group visits.',
  },
];

export function AdventureFaqPage() {
  return (
    <div className="max-w-3xl space-y-4">
      {faqs.map((faq) => (
        <details key={faq.q} className="adventure-panel group rounded-xl p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-charcoal">
            {faq.q}
            <span className="text-charcoal-400 transition-transform group-open:rotate-180">▼</span>
          </summary>
          <p className="text-body mt-3">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}
