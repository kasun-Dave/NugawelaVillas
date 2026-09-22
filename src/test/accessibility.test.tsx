import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';

describe('PageLayout accessibility', () => {
  it('provides skip link and main landmark', () => {
    render(
      <BrowserRouter>
        <PageLayout>
          <p>Page content</p>
        </PageLayout>
      </BrowserRouter>,
    );

    const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
    expect(skipLink).toHaveAttribute('href', '#main-content');

    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'main-content');
    expect(main).toHaveTextContent('Page content');
  });
});
