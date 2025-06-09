/**
 * ForgotPasswordForm Component Tests - Mahardika Platform
 * Testing form validation, submission, and UI interactions
 * Brand Colors: Navy #0D1B2A, Gold #F4B400
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

// Mock the environment module
jest.mock('@/lib/env', () => ({
  MAHARDIKA_COLORS: {
    navy: '#0D1B2A',
    gold: '#F4B400',
  },
}));

describe('ForgotPasswordForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnBackToLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('renders the form with all required elements', () => {
      render(<ForgotPasswordForm />);

      expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
      expect(
        screen.getByText("No worries, we'll send you reset instructions")
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /send reset link/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /back to login/i })
      ).toBeInTheDocument();
    });

    it('has the email input focused by default', () => {
      render(<ForgotPasswordForm />);

      const emailInput = screen.getByLabelText('Email Address');
      expect(emailInput).toHaveFocus();
    });

    it('has the submit button disabled when email is empty', () => {
      render(<ForgotPasswordForm />);

      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });
      expect(submitButton).toBeDisabled();
    });

    it('displays security message in footer', () => {
      render(<ForgotPasswordForm />);

      expect(
        screen.getByText('Your security is our priority')
      ).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('shows error when submitting empty email', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordForm onSubmit={mockOnSubmit} />);

      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      // Type and then clear the email to enable the button
      await user.type(emailInput, 'test');
      await user.clear(emailInput);

      // Force submit by clicking (even though button should be disabled)
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Email address is required')
        ).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('shows error for invalid email format', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordForm onSubmit={mockOnSubmit} />);

      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Please enter a valid email address')
        ).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('clears error when user starts typing', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordForm onSubmit={mockOnSubmit} />);

      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      // First, create an error
      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Please enter a valid email address')
        ).toBeInTheDocument();
      });

      // Then start typing to clear the error
      await user.type(emailInput, '@');

      await waitFor(() => {
        expect(
          screen.queryByText('Please enter a valid email address')
        ).not.toBeInTheDocument();
      });
    });

    it('enables submit button when valid email is entered', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordForm />);

      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      expect(submitButton).toBeDisabled();

      await user.type(emailInput, 'test@example.com');

      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Form Submission', () => {
    it('calls onSubmit with valid email', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);

      render(<ForgotPasswordForm onSubmit={mockOnSubmit} />);

      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith('test@example.com');
      });
    });

    it('shows loading state during submission', async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      const submitPromise = new Promise<void>(resolve => {
        resolveSubmit = resolve;
      });
      mockOnSubmit.mockReturnValue(submitPromise);

      render(<ForgotPasswordForm onSubmit={mockOnSubmit} />);

      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      // Check loading state
      expect(screen.getByText('Sending Reset Link...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      // Resolve the promise
      resolveSubmit!();

      await waitFor(() => {
        expect(
          screen.queryByText('Sending Reset Link...')
        ).not.toBeInTheDocument();
      });
    });

    it('handles submission error', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Network error';
      mockOnSubmit.mockRejectedValue(new Error(errorMessage));

      render(<ForgotPasswordForm onSubmit={mockOnSubmit} />);

      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('shows success state after successful submission', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);

      render(
        <ForgotPasswordForm
          onSubmit={mockOnSubmit}
          onBackToLogin={mockOnBackToLogin}
        />
      );

      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Check Your Email')).toBeInTheDocument();
        expect(
          screen.getByText(/We've sent a password reset link to/)
        ).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('calls onBackToLogin when back button is clicked', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordForm onBackToLogin={mockOnBackToLogin} />);

      const backButton = screen.getByRole('button', { name: /back to login/i });
      await user.click(backButton);

      expect(mockOnBackToLogin).toHaveBeenCalled();
    });

    it('calls onBackToLogin from success state', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);

      render(
        <ForgotPasswordForm
          onSubmit={mockOnSubmit}
          onBackToLogin={mockOnBackToLogin}
        />
      );

      // Submit form to get to success state
      const emailInput = screen.getByLabelText('Email Address');
      await user.type(emailInput, 'test@example.com');
      await user.click(
        screen.getByRole('button', { name: /send reset link/i })
      );

      await waitFor(() => {
        expect(screen.getByText('Check Your Email')).toBeInTheDocument();
      });

      // Click back button in success state
      const backButton = screen.getByRole('button', { name: /back to login/i });
      await user.click(backButton);

      expect(mockOnBackToLogin).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels and ARIA attributes', () => {
      render(<ForgotPasswordForm />);

      const emailInput = screen.getByLabelText('Email Address');
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('required');
      expect(emailInput).toHaveAttribute('autoComplete', 'email');
    });

    it('associates error messages with form fields', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordForm onSubmit={mockOnSubmit} />);

      const emailInput = screen.getByLabelText('Email Address');
      await user.type(emailInput, 'invalid');
      await user.click(
        screen.getByRole('button', { name: /send reset link/i })
      );

      await waitFor(() => {
        const errorMessage = screen.getByText(
          'Please enter a valid email address'
        );
        expect(errorMessage).toBeInTheDocument();
        expect(emailInput).toHaveClass('is-invalid');
      });
    });

    it('has proper heading hierarchy', () => {
      render(<ForgotPasswordForm />);

      const mainHeading = screen.getByRole('heading', { level: 3 });
      expect(mainHeading).toHaveTextContent('Forgot Password?');
    });
  });

  describe('Props and Configuration', () => {
    it('applies custom className', () => {
      const { container } = render(
        <ForgotPasswordForm className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('works without optional props', () => {
      expect(() => {
        render(<ForgotPasswordForm />);
      }).not.toThrow();
    });

    it('respects isLoading prop', () => {
      render(<ForgotPasswordForm isLoading={true} />);

      const submitButton = screen.getByRole('button', {
        name: /sending reset link/i,
      });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Email Validation Edge Cases', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org',
      'user123@test-domain.com',
    ];

    const invalidEmails = [
      'invalid',
      '@example.com',
      'test@',
      'test..test@example.com',
      'test@example',
      '',
      '   ',
    ];

    validEmails.forEach(email => {
      it(`accepts valid email: ${email}`, async () => {
        const user = userEvent.setup();
        render(<ForgotPasswordForm onSubmit={mockOnSubmit} />);

        const emailInput = screen.getByLabelText('Email Address');
        await user.type(emailInput, email);

        const submitButton = screen.getByRole('button', {
          name: /send reset link/i,
        });
        expect(submitButton).not.toBeDisabled();
      });
    });

    invalidEmails.forEach(email => {
      it(`rejects invalid email: "${email}"`, async () => {
        const user = userEvent.setup();
        render(<ForgotPasswordForm onSubmit={mockOnSubmit} />);

        const emailInput = screen.getByLabelText('Email Address');

        if (email.trim()) {
          await user.type(emailInput, email);
          await user.click(
            screen.getByRole('button', { name: /send reset link/i })
          );

          await waitFor(() => {
            expect(
              screen.getByText('Please enter a valid email address')
            ).toBeInTheDocument();
          });
        }

        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });
  });
});
