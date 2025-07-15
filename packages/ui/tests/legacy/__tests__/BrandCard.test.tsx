import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrandCard, BrandCardTemplates } from '../../../src/BrandCard';
import { colors } from '../colors';

describe('BrandCard', () => {
  // Basic rendering tests
  it('renders correctly with default props', () => {
    render(<BrandCard>Test content</BrandCard>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders with title and subtitle', () => {
    render(
      <BrandCard title="Test Title" subtitle="Test Subtitle">
        Content here
      </BrandCard>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Content here')).toBeInTheDocument();
  });

  // Variant tests
  describe('variants', () => {
    it('renders navy-primary variant correctly', () => {
      const { container } = render(
        <BrandCard variant="navy-primary">Navy Primary Card</BrandCard>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle(`box-shadow: ${colors.shadow.md}`);
    });

    it('renders gold-primary variant correctly', () => {
      const { container } = render(
        <BrandCard variant="gold-primary">Gold Primary Card</BrandCard>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle(
        `background: linear-gradient(135deg, ${colors.gold} 0%, #FFD23F 100%)`
      );
      expect(card).toHaveStyle(`color: ${colors.navy}`);
    });

    it('renders navy-outline variant correctly', () => {
      const { container } = render(
        <BrandCard variant="navy-outline">Navy Outline Card</BrandCard>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle('background-color: transparent');
      expect(card).toHaveStyle(`border: 2px solid ${colors.navy}`);
      expect(card).toHaveStyle(`color: ${colors.navy}`);
    });

    it('renders gold-outline variant correctly', () => {
      const { container } = render(
        <BrandCard variant="gold-outline">Gold Outline Card</BrandCard>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle('background-color: transparent');
      expect(card).toHaveStyle(`border: 2px solid ${colors.gold}`);
      expect(card).toHaveStyle(`color: ${colors.gold}`);
    });

    it('renders gradient variant correctly', () => {
      const { container } = render(
        <BrandCard variant="gradient">Gradient Card</BrandCard>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle(
        `background: linear-gradient(135deg, ${colors.navy} 0%, ${colors.gold} 50%, ${colors.navy} 100%)`
      );
      expect(card).toHaveStyle(`color: ${colors.white}`);
    });

    it('renders navy-glass variant correctly', () => {
      const { container } = render(
        <BrandCard variant="navy-glass">Navy Glass Card</BrandCard>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle('background: rgba(13, 27, 42, 0.85)');
      expect(card).toHaveStyle('backdrop-filter: blur(16px) saturate(180%)');
      expect(card).toHaveStyle(`color: ${colors.white}`);
    });

    it('renders gold-glass variant correctly', () => {
      const { container } = render(
        <BrandCard variant="gold-glass">Gold Glass Card</BrandCard>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle('background: rgba(244, 180, 0, 0.85)');
      expect(card).toHaveStyle('backdrop-filter: blur(16px) saturate(180%)');
      expect(card).toHaveStyle(`color: ${colors.navy}`);
    });
  });

  // Size tests
  describe('sizes', () => {
    it('renders small size correctly', () => {
      const { container } = render(<BrandCard size="sm">Small Card</BrandCard>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle('padding: 1.25rem');
      expect(card).toHaveStyle('min-height: 120px');
    });

    it('renders medium size correctly', () => {
      const { container } = render(
        <BrandCard size="md">Medium Card</BrandCard>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle('padding: 1.75rem');
      expect(card).toHaveStyle('min-height: 160px');
    });

    it('renders large size correctly', () => {
      const { container } = render(<BrandCard size="lg">Large Card</BrandCard>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle('padding: 2.5rem');
      expect(card).toHaveStyle('min-height: 200px');
    });

    it('renders extra large size correctly', () => {
      const { container } = render(
        <BrandCard size="xl">Extra Large Card</BrandCard>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle('padding: 3.5rem');
      expect(card).toHaveStyle('min-height: 280px');
    });
  });

  // Elevation tests
  describe('elevation', () => {
    it('applies low elevation correctly', () => {
      const { container } = render(
        <BrandCard elevation="low">Low Elevation Card</BrandCard>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle(
        'box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      );
    });

    it('applies medium elevation correctly', () => {
      const { container } = render(
        <BrandCard elevation="medium">Medium Elevation Card</BrandCard>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle(
        'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      );
    });

    it('applies high elevation correctly', () => {
      const { container } = render(
        <BrandCard elevation="high">High Elevation Card</BrandCard>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle(
        'box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      );
    });
  });

  // Pattern tests
  describe('patterns', () => {
    it('renders with dots pattern', () => {
      const { container } = render(
        <BrandCard pattern="dots">Dots Pattern Card</BrandCard>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle(
        'background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)'
      );
      expect(card).toHaveStyle('background-size: 20px 20px');
    });

    it('renders with grid pattern', () => {
      const { container } = render(
        <BrandCard pattern="grid">Grid Pattern Card</BrandCard>
      );
      const card = container.firstChild as HTMLElement;
      const expectedBackgroundImage = `
        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
      `
        .replace(/\s+/g, ' ')
        .trim();
      expect(card).toHaveStyle(`background-image: ${expectedBackgroundImage}`);
      expect(card).toHaveStyle('background-size: 20px 20px');
    });

    it('renders with diagonal pattern', () => {
      const { container } = render(
        <BrandCard pattern="diagonal">Diagonal Pattern Card</BrandCard>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle(
        'background-image: repeating-linear-gradient( 45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px )'
      );
    });
  });

  // Icon tests
  describe('with icon', () => {
    it('renders with icon correctly', () => {
      const icon = <span data-testid="test-icon">🏢</span>;
      render(
        <BrandCard icon={icon} title="Card with Icon">
          Content here
        </BrandCard>
      );
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByText('Card with Icon')).toBeInTheDocument();
      expect(screen.getByText('Content here')).toBeInTheDocument();
    });
  });

  // Prompt functionality tests
  describe('prompt functionality', () => {
    it('uses prompt as title attribute when provided', () => {
      const { container } = render(
        <BrandCard prompt="This is a prompt card">Card content</BrandCard>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveAttribute('title', 'This is a prompt card');
    });

    it('uses title in title attribute when both title and prompt provided', () => {
      const { container } = render(
        <BrandCard title="Card Title" prompt="Prompt text">
          Card content
        </BrandCard>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveAttribute('title', 'Mahardika Brand Card: Card Title');
    });

    it('falls back to default title when no prompt or title', () => {
      const { container } = render(<BrandCard>Card content</BrandCard>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveAttribute('title', 'Mahardika Brand Card');
    });
  });

  // Event handling tests
  describe('event handling', () => {
    it('handles mouse events', () => {
      const handleMouseEnter = jest.fn();
      const handleMouseLeave = jest.fn();
      const { container } = render(
        <BrandCard
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Hover Me
        </BrandCard>
      );
      const card = container.firstChild as HTMLElement;

      fireEvent.mouseEnter(card);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);

      fireEvent.mouseLeave(card);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });

    it('handles click events', () => {
      const handleClick = jest.fn();
      const { container } = render(
        <BrandCard onClick={handleClick}>Click Me</BrandCard>
      );
      const card = container.firstChild as HTMLElement;
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // Style customization tests
  describe('style customization', () => {
    it('applies custom styles', () => {
      const customStyle = { marginTop: '20px', backgroundColor: 'red' };
      const { container } = render(
        <BrandCard style={customStyle}>Styled Card</BrandCard>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle('margin-top: 20px');
      expect(card).toHaveStyle('background-color: red');
    });

    it('maintains border radius of 0.5rem', () => {
      const { container } = render(<BrandCard>Card</BrandCard>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle('border-radius: 0.5rem');
    });
  });

  // Title and subtitle styling tests
  describe('title and subtitle styling', () => {
    it('applies correct title styles for navy-primary variant', () => {
      render(
        <BrandCard variant="navy-primary" title="Navy Title">
          Content
        </BrandCard>
      );
      const title = screen.getByText('Navy Title');
      expect(title).toHaveStyle(`color: ${colors.gold}`);
      expect(title).toHaveStyle('font-weight: 700');
      expect(title).toHaveStyle('font-size: 1.5rem');
    });

    it('applies correct subtitle styles for gold-primary variant', () => {
      render(
        <BrandCard variant="gold-primary" subtitle="Gold Subtitle">
          Content
        </BrandCard>
      );
      const subtitle = screen.getByText('Gold Subtitle');
      expect(subtitle).toHaveStyle(`color: ${colors.navy}`);
      expect(subtitle).toHaveStyle('opacity: 0.9');
    });
  });
});

describe('BrandCardTemplates', () => {
  it('renders NavyHero template correctly', () => {
    const { container } = render(
      <BrandCardTemplates.NavyHero>
        Navy Hero Content
      </BrandCardTemplates.NavyHero>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle(
      `background: linear-gradient(135deg, ${colors.navy} 0%, #1a2332 100%)`
    );
    expect(card).toHaveStyle('padding: 3.5rem'); // xl size
    expect(card).toHaveAttribute(
      'title',
      'Hero section card with navy background and gold accents'
    );
    expect(screen.getByText('Navy Hero Content')).toBeInTheDocument();
  });

  it('renders GoldFeature template correctly', () => {
    const { container } = render(
      <BrandCardTemplates.GoldFeature>
        Gold Feature Content
      </BrandCardTemplates.GoldFeature>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle(
      `background: linear-gradient(135deg, ${colors.gold} 0%, #FFD23F 100%)`
    );
    expect(card).toHaveStyle('padding: 2.5rem'); // lg size
    expect(card).toHaveAttribute(
      'title',
      'Feature highlight card with gold background'
    );
  });

  it('renders NavyOutlineInfo template correctly', () => {
    const { container } = render(
      <BrandCardTemplates.NavyOutlineInfo>
        Navy Outline Content
      </BrandCardTemplates.NavyOutlineInfo>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle('background-color: transparent');
    expect(card).toHaveStyle(`border: 2px solid ${colors.navy}`);
    expect(card).toHaveAttribute('title', 'Information card with navy outline');
  });

  it('renders GoldOutlineAccent template correctly', () => {
    const { container } = render(
      <BrandCardTemplates.GoldOutlineAccent>
        Gold Outline Content
      </BrandCardTemplates.GoldOutlineAccent>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle('background-color: transparent');
    expect(card).toHaveStyle(`border: 2px solid ${colors.gold}`);
    expect(card).toHaveAttribute('title', 'Accent card with gold outline');
  });

  it('renders GradientShowcase template correctly', () => {
    const { container } = render(
      <BrandCardTemplates.GradientShowcase>
        Gradient Content
      </BrandCardTemplates.GradientShowcase>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle(
      `background: linear-gradient(135deg, ${colors.navy} 0%, ${colors.gold} 50%, ${colors.navy} 100%)`
    );
    expect(card).toHaveStyle('padding: 2.5rem'); // lg size
    expect(card).toHaveAttribute(
      'title',
      'Showcase card with animated navy-gold gradient'
    );
  });

  it('renders NavyGlassModal template correctly', () => {
    const { container } = render(
      <BrandCardTemplates.NavyGlassModal>
        Navy Glass Content
      </BrandCardTemplates.NavyGlassModal>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle('background: rgba(13, 27, 42, 0.85)');
    expect(card).toHaveStyle('backdrop-filter: blur(16px) saturate(180%)');
    expect(card).toHaveAttribute(
      'title',
      'Glass morphism card with navy background'
    );
  });

  it('renders GoldGlassHighlight template correctly', () => {
    const { container } = render(
      <BrandCardTemplates.GoldGlassHighlight>
        Gold Glass Content
      </BrandCardTemplates.GoldGlassHighlight>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle('background: rgba(244, 180, 0, 0.85)');
    expect(card).toHaveStyle('backdrop-filter: blur(16px) saturate(180%)');
    expect(card).toHaveAttribute(
      'title',
      'Glass morphism card with gold background'
    );
  });

  it('template components accept additional props', () => {
    const handleClick = jest.fn();
    const { container } = render(
      <BrandCardTemplates.NavyHero onClick={handleClick} title="Custom Title">
        Custom Navy Hero
      </BrandCardTemplates.NavyHero>
    );
    const card = container.firstChild as HTMLElement;
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });
});
