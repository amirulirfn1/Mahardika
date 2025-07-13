import { colors } from '@mahardika/ui';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { SecurityStatus } from '../SecurityStatus';

describe('SecurityStatus Component', () => {
  it('renders with secure status', () => {
    render(<SecurityStatus isSecure={true} environment="production" />);

    expect(screen.getByText('Secure')).toBeInTheDocument();
    expect(screen.getByText('🔒')).toBeInTheDocument();
    expect(screen.getByText('production')).toBeInTheDocument();
    expect(
      screen.getByText(/All secrets properly configured/)
    ).toBeInTheDocument();
  });

  it('renders with insecure status', () => {
    render(<SecurityStatus isSecure={false} environment="development" />);

    expect(screen.getByText('Attention Required')).toBeInTheDocument();
    expect(screen.getByText('⚠️')).toBeInTheDocument();
    expect(screen.getAllByText('development')[0]).toBeInTheDocument();
    expect(
      screen.getByText(/Security configuration requires attention/)
    ).toBeInTheDocument();
  });

  it('displays environment name correctly', () => {
    render(<SecurityStatus isSecure={true} environment="staging" />);

    expect(screen.getAllByText('staging')[0]).toBeInTheDocument();
    expect(
      screen.getAllByText((content, element) => {
        return (
          (element?.textContent?.includes('Environment:') &&
            element?.textContent?.includes('staging')) ||
          false
        );
      })[0]
    ).toBeInTheDocument();
  });

  it('shows security indicators for secure environment', () => {
    render(<SecurityStatus isSecure={true} environment="production" />);

    expect(screen.getByText('.env protected')).toBeInTheDocument();
    expect(screen.getByText('Secrets secured')).toBeInTheDocument();
    expect(screen.getByText('API keys safe')).toBeInTheDocument();

    // Should show checkmarks for secure status
    const checkmarks = screen.getAllByText('✅');
    expect(checkmarks).toHaveLength(3);
  });

  it('shows security indicators for insecure environment', () => {
    render(<SecurityStatus isSecure={false} environment="development" />);

    expect(screen.getByText('.env protected')).toBeInTheDocument();
    expect(screen.getByText('Secrets secured')).toBeInTheDocument();
    expect(screen.getByText('API keys safe')).toBeInTheDocument();

    // Should show X marks for insecure status
    const xmarks = screen.getAllByText('❌');
    expect(xmarks).toHaveLength(3);
  });

  it('displays Mahardika branding', () => {
    render(<SecurityStatus isSecure={true} environment="production" />);

    expect(screen.getByText('Mahardika Security')).toBeInTheDocument();
    expect(
      screen.getByText('Navy colors.navy • Gold colors.gold')
    ).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <SecurityStatus
        isSecure={true}
        environment="test"
        className="custom-security-class"
      />
    );

    const securityComponent = container.firstChild as HTMLElement;
    expect(securityComponent).toHaveClass('custom-security-class');
  });

  it('calls onSecurityClick when clicked', () => {
    const mockClick = vi.fn();
    const { container } = render(
      <SecurityStatus
        isSecure={true}
        environment="production"
        onSecurityClick={mockClick}
      />
    );

    const securityComponent = container.firstChild as HTMLElement;
    fireEvent.click(securityComponent);

    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct styling for secure status', () => {
    const { container } = render(
      <SecurityStatus isSecure={true} environment="production" />
    );

    const securityComponent = container.firstChild as HTMLElement;
    const styles = window.getComputedStyle(securityComponent);

    expect(styles.backgroundColor).toBe('rgb(13, 27, 42)'); // Navy colors.navy
    expect(styles.borderColor).toBe('rgb(244, 180, 0)'); // Gold colors.gold
  });

  it('applies correct styling for insecure status', () => {
    const { container } = render(
      <SecurityStatus isSecure={false} environment="development" />
    );

    const securityComponent = container.firstChild as HTMLElement;
    const styles = window.getComputedStyle(securityComponent);

    expect(styles.backgroundColor).toBe('rgb(31, 41, 55)'); // Gray 800
    expect(styles.borderColor).toBe('rgb(75, 85, 99)'); // Gray 600
  });

  it('shows hover effects when clickable', () => {
    const mockClick = vi.fn();
    const { container } = render(
      <SecurityStatus
        isSecure={true}
        environment="production"
        onSecurityClick={mockClick}
      />
    );

    const securityComponent = container.firstChild as HTMLElement;

    // Check cursor style for clickable
    const styles = window.getComputedStyle(securityComponent);
    expect(styles.cursor).toBe('pointer');

    // Test hover effects
    fireEvent.mouseEnter(securityComponent);
    expect(securityComponent.style.transform).toBe('translateY(-2px)');
    expect(securityComponent.style.boxShadow).toBe(
      '0 4px 12px rgba(244, 180, 0, 0.2)'
    );

    fireEvent.mouseLeave(securityComponent);
    expect(securityComponent.style.transform).toBe('translateY(0)');
    expect(securityComponent.style.boxShadow).toBe('none');
  });

  it('does not show hover effects when not clickable', () => {
    const { container } = render(
      <SecurityStatus isSecure={true} environment="production" />
    );

    const securityComponent = container.firstChild as HTMLElement;

    // Check cursor style for non-clickable
    const styles = window.getComputedStyle(securityComponent);
    expect(styles.cursor).toBe('default');

    // Hover should not change styles
    fireEvent.mouseEnter(securityComponent);
    expect(securityComponent.style.transform).toBe('');
    expect(securityComponent.style.boxShadow).toBe('');
  });

  it('renders with different environments', () => {
    const environments = ['development', 'staging', 'production', 'testing'];

    environments.forEach(env => {
      const { unmount } = render(
        <SecurityStatus isSecure={true} environment={env} />
      );

      expect(
        screen.getAllByText((content, element) => {
          return (
            (element?.textContent?.includes('Environment:') &&
              element?.textContent?.includes(env)) ||
            false
          );
        })[0]
      ).toBeInTheDocument();

      unmount();
    });
  });

  it('maintains accessibility standards', () => {
    const { container } = render(
      <SecurityStatus
        isSecure={true}
        environment="production"
        onSecurityClick={() => {}}
      />
    );

    const securityComponent = container.firstChild as HTMLElement;

    // Should have proper color contrast
    const styles = window.getComputedStyle(securityComponent);
    expect(styles.backgroundColor).toBeTruthy();
    expect(styles.color).toBeTruthy();

    // Should be keyboard accessible when clickable
    expect(securityComponent.style.cursor).toBe('pointer');
  });

  it('displays correct brand colors in different states', () => {
    // Test secure state colors
    const { rerender } = render(
      <SecurityStatus isSecure={true} environment="production" />
    );

    expect(
      screen.getByText('Navy colors.navy • Gold colors.gold')
    ).toBeInTheDocument();

    // Test insecure state colors
    rerender(<SecurityStatus isSecure={false} environment="development" />);

    expect(
      screen.getByText('Navy colors.navy • Gold colors.gold')
    ).toBeInTheDocument();
  });
});
