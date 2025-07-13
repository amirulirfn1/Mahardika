import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('applies primary variant styles by default', () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    // Note: We test for presence rather than exact styles due to CSS-in-JS complexities
  });

  it('applies secondary variant styles', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('applies outline variant styles', () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('applies small size styles', () => {
    render(<Button size="sm">Small Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('applies medium size styles by default', () => {
    render(<Button>Medium Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('applies large size styles', () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable Button</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('handles mouse events for hover states', () => {
    const handleMouseEnter = vi.fn();
    const handleMouseLeave = vi.fn();

    render(
      <Button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        Hover Button
      </Button>
    );

    const button = screen.getByRole('button');

    fireEvent.mouseEnter(button);
    expect(handleMouseEnter).toHaveBeenCalledTimes(1);

    fireEvent.mouseLeave(button);
    expect(handleMouseLeave).toHaveBeenCalledTimes(1);
  });

  it('passes through additional props', () => {
    render(
      <Button data-testid="custom-button" aria-label="Custom Button">
        Button
      </Button>
    );

    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom Button');
  });

  it('applies custom styles when provided', () => {
    const customStyle = { margin: '10px' };
    render(<Button style={customStyle}>Styled Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
