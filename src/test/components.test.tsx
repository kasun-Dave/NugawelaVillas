import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Book Now</Button>);
    expect(screen.getByRole('button', { name: 'Book Now' })).toBeInTheDocument();
  });

  it('can render as child link', () => {
    render(
      <BrowserRouter>
        <Button asChild>
          <a href="/rooms">View Rooms</a>
        </Button>
      </BrowserRouter>,
    );
    expect(screen.getByRole('link', { name: 'View Rooms' })).toBeInTheDocument();
  });
});
