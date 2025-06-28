import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrandButton, BrandButtonTemplates } from '../BrandButton';

describe('BrandButton', () => {
  // Basic rendering tests
  it('renders correctly with default props', () => {
    render(<BrandButton>Test Button</BrandButton>);
    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
    // Test functional behavior instead of styles
    expect(button).not.toBeDisabled();
  });

  it('renders with custom text', () => {
    render(<BrandButton>Custom Text</BrandButton>);
    expect(screen.getByText('Custom Text')).toBeInTheDocument();
  });

  // Variant tests - focusing on props and behavior rather than styles
  describe('variants', () => {
    it('renders navy variant correctly', () => {
      render(<BrandButton variant="navy">Navy Button</BrandButton>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Navy Button');
    });

    it('renders gold variant correctly', () => {
      render(<BrandButton variant="gold">Gold Button</BrandButton>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Gold Button');
    });

    it('renders outline-navy variant correctly', () => {
      render(
        <BrandButton variant="navy-outline">Outline Navy Button</BrandButton>
      );
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Outline Navy Button');
    });

    it('renders outline-gold variant correctly', () => {
      render(
        <BrandButton variant="gold-outline">Outline Gold Button</BrandButton>
      );
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Outline Gold Button');
    });
  });

  // Size tests - focusing on behavior rather than exact styles
  describe('sizes', () => {
    it('renders small size correctly', () => {
      render(<BrandButton size="sm">Small Button</BrandButton>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Small Button');
    });

    it('renders medium size correctly', () => {
      render(<BrandButton size="md">Medium Button</BrandButton>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Medium Button');
    });

    it('renders large size correctly', () => {
      render(<BrandButton size="lg">Large Button</BrandButton>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Large Button');
    });
  });

  // Disabled state tests
  describe('disabled state', () => {
    it('applies disabled state when disabled', () => {
      render(<BrandButton disabled>Disabled Button</BrandButton>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not trigger click events when disabled', () => {
      const handleClick = jest.fn();
      render(<BrandButton disabled onClick={handleClick}>Disabled Button</BrandButton>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // Event handling tests
  describe('event handling', () => {
    it('handles click events', () => {
      const handleClick = jest.fn();
      render(<BrandButton onClick={handleClick}>Click Me</BrandButton>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles mouse events', () => {
      const handleMouseEnter = jest.fn();
      const handleMouseLeave = jest.fn();
      render(
        <BrandButton
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Hover Me
        </BrandButton>
      );
      const button = screen.getByRole('button');

      fireEvent.mouseEnter(button);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);

      fireEvent.mouseLeave(button);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });
  });

  // Accessibility tests
  describe('accessibility', () => {
    it('has proper button role', () => {
      render(<BrandButton>Accessible Button</BrandButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('supports custom aria attributes', () => {
      render(
        <BrandButton aria-label="Custom label" aria-describedby="description">
          Button
        </BrandButton>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
      expect(button).toHaveAttribute('aria-describedby', 'description');
    });
  });

  // Template tests
  describe('BrandButtonTemplates', () => {
    it('renders NavyPrimary template correctly', () => {
      render(<BrandButtonTemplates.NavyPrimary>Navy Primary</BrandButtonTemplates.NavyPrimary>);
      expect(screen.getByText('Navy Primary')).toBeInTheDocument();
    });

    it('renders GoldSecondary template correctly', () => {
      render(<BrandButtonTemplates.GoldSecondary>Gold Secondary</BrandButtonTemplates.GoldSecondary>);
      expect(screen.getByText('Gold Secondary')).toBeInTheDocument();
    });

    it('renders NavyOutline template correctly', () => {
      render(<BrandButtonTemplates.NavyOutline>Navy Outline</BrandButtonTemplates.NavyOutline>);
      expect(screen.getByText('Navy Outline')).toBeInTheDocument();
    });

    it('renders GoldOutline template correctly', () => {
      render(<BrandButtonTemplates.GoldOutline>Gold Outline</BrandButtonTemplates.GoldOutline>);
      expect(screen.getByText('Gold Outline')).toBeInTheDocument();
    });
  });
});
