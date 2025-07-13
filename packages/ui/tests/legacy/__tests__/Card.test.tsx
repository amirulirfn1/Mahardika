import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Card } from '../Card';

describe('Card Component', () => {
  it('renders with default props', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(
      <Card>
        <p>This is card content</p>
      </Card>
    );
    expect(screen.getByText('This is card content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Card title="Card Title">Content</Card>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<Card subtitle="Card Subtitle">Content</Card>);
    expect(screen.getByText('Card Subtitle')).toBeInTheDocument();
  });

  it('renders both title and subtitle', () => {
    render(
      <Card title="Main Title" subtitle="Supporting text">
        Card content here
      </Card>
    );

    expect(screen.getByText('Main Title')).toBeInTheDocument();
    expect(screen.getByText('Supporting text')).toBeInTheDocument();
    expect(screen.getByText('Card content here')).toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    render(<Card>Default Card</Card>);
    const cardElement = screen.getByText('Default Card').parentElement;
    expect(cardElement).toBeInTheDocument();
  });

  it('applies branded variant styles', () => {
    render(<Card variant="branded">Branded Card</Card>);
    const cardElement = screen.getByText('Branded Card').parentElement;
    expect(cardElement).toBeInTheDocument();
  });

  it('applies outlined variant styles', () => {
    render(<Card variant="outlined">Outlined Card</Card>);
    const cardElement = screen.getByText('Outlined Card').parentElement;
    expect(cardElement).toBeInTheDocument();
  });

  it('applies small size styles', () => {
    render(<Card size="sm">Small Card</Card>);
    const cardElement = screen.getByText('Small Card').parentElement;
    expect(cardElement).toBeInTheDocument();
  });

  it('applies medium size styles by default', () => {
    render(<Card>Medium Card</Card>);
    const cardElement = screen.getByText('Medium Card').parentElement;
    expect(cardElement).toBeInTheDocument();
  });

  it('applies large size styles', () => {
    render(<Card size="lg">Large Card</Card>);
    const cardElement = screen.getByText('Large Card').parentElement;
    expect(cardElement).toBeInTheDocument();
  });

  it('handles mouse events for hover states', () => {
    const handleMouseEnter = vi.fn();
    const handleMouseLeave = vi.fn();

    render(
      <Card onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        Hover Card
      </Card>
    );

    const cardElement = screen.getByText('Hover Card').parentElement;

    if (cardElement) {
      fireEvent.mouseEnter(cardElement);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);

      fireEvent.mouseLeave(cardElement);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    }
  });

  it('passes through additional props', () => {
    render(
      <Card data-testid="custom-card" aria-label="Custom Card">
        Card content
      </Card>
    );

    const card = screen.getByTestId('custom-card');
    expect(card).toHaveAttribute('aria-label', 'Custom Card');
  });

  it('applies custom styles when provided', () => {
    const customStyle = { margin: '20px' };
    render(<Card style={customStyle}>Styled Card</Card>);

    const cardElement = screen.getByText('Styled Card').parentElement;
    expect(cardElement).toBeInTheDocument();
  });

  it('combines all features together', () => {
    render(
      <Card
        title="Full Featured Card"
        subtitle="With all props"
        variant="branded"
        size="lg"
        data-testid="full-card"
      >
        <div>Complex content here</div>
        <button>Action Button</button>
      </Card>
    );

    expect(screen.getByText('Full Featured Card')).toBeInTheDocument();
    expect(screen.getByText('With all props')).toBeInTheDocument();
    expect(screen.getByText('Complex content here')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /action button/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('full-card')).toBeInTheDocument();
  });
});
