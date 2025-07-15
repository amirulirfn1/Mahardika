import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrandButton, BrandButtonTemplates } from '@mah/ui';
import { colors } from '../colors';

describe('BrandButton', () => {
  // Basic rendering tests
  it('renders correctly with default props', () => {
    render(<BrandButton>Test Button</BrandButton>);
    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle(`background-color: ${colors.navy}`);
  });

  it('renders with custom text', () => {
    render(<BrandButton>Custom Text</BrandButton>);
    expect(screen.getByText('Custom Text')).toBeInTheDocument();
  });

  // Variant tests
  describe('variants', () => {
    it('renders navy variant correctly', () => {
      render(<BrandButton variant="navy">Navy Button</BrandButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle(`background-color: ${colors.navy}`);
      expect(button).toHaveStyle(`color: ${colors.white}`);
    });

    it('renders gold variant correctly', () => {
      render(<BrandButton variant="gold">Gold Button</BrandButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle(`background-color: ${colors.gold}`);
      expect(button).toHaveStyle(`color: ${colors.navy}`);
    });

    it('renders outline-navy variant correctly', () => {
      render(
        <BrandButton variant="navy-outline">Outline Navy Button</BrandButton>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('background-color: transparent');
      expect(button).toHaveStyle(`border-color: ${colors.navy}`);
      expect(button).toHaveStyle(`color: ${colors.navy}`);
    });

    it('renders outline-gold variant correctly', () => {
      render(
        <BrandButton variant="gold-outline">Outline Gold Button</BrandButton>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('background-color: transparent');
      expect(button).toHaveStyle(`border-color: ${colors.gold}`);
      expect(button).toHaveStyle(`color: ${colors.gold}`);
    });

    it('renders gradient variant correctly', () => {
      render(<BrandButton variant="gradient">Gradient Button</BrandButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle(
        `background: linear-gradient(135deg, ${colors.navy} 0%, ${colors.gold} 100%)`
      );
      expect(button).toHaveStyle(`color: ${colors.white}`);
    });
  });

  // Size tests
  describe('sizes', () => {
    it('renders small size correctly', () => {
      render(<BrandButton size="sm">Small Button</BrandButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('padding: 0.75rem 1.25rem');
      expect(button).toHaveStyle('font-size: 0.875rem');
    });

    it('renders medium size correctly', () => {
      render(<BrandButton size="md">Medium Button</BrandButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('padding: 1rem 2rem');
      expect(button).toHaveStyle('font-size: 1rem');
    });

    it('renders large size correctly', () => {
      render(<BrandButton size="lg">Large Button</BrandButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('padding: 1.25rem 2.5rem');
      expect(button).toHaveStyle('font-size: 1.125rem');
    });
  });

  // Disabled state tests
  describe('disabled state', () => {
    it('applies disabled styles when disabled', () => {
      render(<BrandButton disabled>Disabled Button</BrandButton>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveStyle('opacity: 0.6');
      expect(button).toHaveStyle('cursor: not-allowed');
    });

    it('does not trigger hover effects when disabled', () => {
      render(<BrandButton disabled>Disabled Button</BrandButton>);
      const button = screen.getByRole('button');
      fireEvent.mouseEnter(button);
      // Should not have hover transform when disabled
      expect(button).toHaveStyle('opacity: 0.6');
    });
  });

  // Icon tests
  describe('with icon', () => {
    it('renders with icon correctly', () => {
      const icon = <span data-testid="test-icon">🏢</span>;
      render(<BrandButton icon={icon}>Button with Icon</BrandButton>);
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByText('Button with Icon')).toBeInTheDocument();
    });
  });

  // Prompt functionality tests
  describe('prompt functionality', () => {
    it('uses prompt as title when provided', () => {
      render(<BrandButton prompt="This is a prompt">Button</BrandButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'This is a prompt');
    });

    it('uses children as title fallback', () => {
      render(<BrandButton>Button Text</BrandButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'Button Text');
    });

    it('uses title prop over prompt', () => {
      render(
        <BrandButton prompt="Prompt text" title="Title text">
          Button
        </BrandButton>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'Title text');
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

  // Style customization tests
  describe('style customization', () => {
    it('applies custom styles', () => {
      const customStyle = { marginTop: '20px', backgroundColor: 'red' };
      render(<BrandButton style={customStyle}>Styled Button</BrandButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('margin-top: 20px');
      expect(button).toHaveStyle('background-color: red');
    });

    it('maintains border radius of 0.5rem', () => {
      render(<BrandButton>Button</BrandButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('border-radius: 0.5rem');
    });
  });
});

describe('BrandButtonTemplates', () => {
  it('renders NavyPrimary template correctly', () => {
    render(
      <BrandButtonTemplates.NavyPrimary>
        Navy Primary
      </BrandButtonTemplates.NavyPrimary>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveStyle(`background-color: ${colors.navy}`);
    expect(button).toHaveAttribute(
      'title',
      'Primary action button in Mahardika navy'
    );
  });

  it('renders GoldSecondary template correctly', () => {
    render(
      <BrandButtonTemplates.GoldSecondary>
        Gold Secondary
      </BrandButtonTemplates.GoldSecondary>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveStyle(`background-color: ${colors.gold}`);
    expect(button).toHaveAttribute(
      'title',
      'Secondary action button in Mahardika gold'
    );
  });

  it('renders NavyOutline template correctly', () => {
    render(
      <BrandButtonTemplates.NavyOutline>
        Navy Outline
      </BrandButtonTemplates.NavyOutline>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('background-color: transparent');
    expect(button).toHaveStyle(`border-color: ${colors.navy}`);
    expect(button).toHaveAttribute('title', 'Outlined button with navy border');
  });

  it('renders GoldOutline template correctly', () => {
    render(
      <BrandButtonTemplates.GoldOutline>
        Gold Outline
      </BrandButtonTemplates.GoldOutline>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('background-color: transparent');
    expect(button).toHaveStyle(`border-color: ${colors.gold}`);
    expect(button).toHaveAttribute('title', 'Outlined button with gold border');
  });

  it('renders GradientFeature template correctly', () => {
    render(
      <BrandButtonTemplates.GradientFeature>
        Gradient Feature
      </BrandButtonTemplates.GradientFeature>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveStyle(
      `background: linear-gradient(135deg, ${colors.navy} 0%, ${colors.gold} 100%)`
    );
    expect(button).toHaveAttribute(
      'title',
      'Feature button with navy-to-gold gradient'
    );
  });

  it('template components accept additional props', () => {
    const handleClick = jest.fn();
    render(
      <BrandButtonTemplates.NavyPrimary onClick={handleClick} size="lg">
        Custom Navy
      </BrandButtonTemplates.NavyPrimary>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('padding: 1.25rem 2.5rem'); // lg size
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
