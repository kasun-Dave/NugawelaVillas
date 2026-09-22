import { type ReactNode } from 'react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export function PlaceholderPage({ title, description, children }: PlaceholderPageProps) {
  return (
    <div className="section-padding min-h-[60vh] bg-ivory">
      <div className="container-narrow max-w-2xl">
        <h1 className="heading-section mb-4">{title}</h1>
        <p className="text-body mb-6">{description}</p>
        {children}
      </div>
    </div>
  );
}
