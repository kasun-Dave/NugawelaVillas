export function HowItWorksPage() {
  const steps = [
    {
      n: 1,
      title: 'Check in & receive your code',
      desc: 'Your welcome card contains a unique adventure code tied to your stay.',
    },
    {
      n: 2,
      title: 'Enter your code online',
      desc: 'Sign in and enter the code to activate The Hidden Trail on your device.',
    },
    {
      n: 3,
      title: 'Explore story stages',
      desc: 'Follow clues across 12 stages in 4 chapters — resort first, then approved valley locations.',
    },
    {
      n: 4,
      title: 'Solve puzzles & collect artifacts',
      desc: 'Each stage reveals story fragments and rewards you with collectible artifact cards.',
    },
    {
      n: 5,
      title: 'Complete the lantern ceremony',
      desc: 'Gather all artifacts and speak the final keeper phrase at the supervised ridge station.',
    },
  ];

  return (
    <div className="max-w-3xl space-y-8">
      <p className="text-body text-lg">
        The Hidden Trail is a story-driven scavenger hunt designed for safe exploration. Fiction and
        local heritage are clearly labeled throughout.
      </p>
      <ol className="space-y-6">
        {steps.map((s) => (
          <li key={s.n} className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest font-serif font-semibold text-ivory">
              {s.n}
            </span>
            <div>
              <h3 className="font-serif text-lg font-semibold">{s.title}</h3>
              <p className="text-body mt-1">{s.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
