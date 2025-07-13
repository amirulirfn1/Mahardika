/**
 * =============================================================================
 * Mahardika Platform - Customer Sign Up Page Tests
 * Unit tests for customer registration form
 * =============================================================================
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import CustomerSignUpPage from '@/app/auth/sign-up/customer/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock sessionStorage
const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

describe('CustomerSignUpPage', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (global.fetch as jest.Mock).mockClear();
    mockSessionStorage.setItem.mockClear();
  });

  describe('Form Rendering', () => {
    it('should render the sign-up form with all fields', () => {
      render(<CustomerSignUpPage />);

      expect(screen.getByText('Create Customer Account')).toBeInTheDocument();
      expect(
        screen.getByText('Step 1: Enter your basic information')
      ).toBeInTheDocument();

      // Check form fields
      expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Create Account' })
      ).toBeInTheDocument();
    });

    it('should show password requirements', () => {
      render(<CustomerSignUpPage />);

      expect(
        screen.getByText('Password must be at least 8 characters long')
      ).toBeInTheDocument();
    });

    it('should show link to sign in', () => {
      render(<CustomerSignUpPage />);

      expect(screen.getByText('Already have an account?')).toBeInTheDocument();
      expect(screen.getByText('Sign in here')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show error for invalid email', async () => {
      render(<CustomerSignUpPage />);

      const emailInput = screen.getByLabelText('Email Address');
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

      const submitButton = screen.getByRole('button', {
        name: 'Create Account',
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Valid email required')).toBeInTheDocument();
      });
    });

    it('should show error for short name', async () => {
      render(<CustomerSignUpPage />);

      const nameInput = screen.getByLabelText('Full Name');
      fireEvent.change(nameInput, { target: { value: 'A' } });

      const submitButton = screen.getByRole('button', {
        name: 'Create Account',
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Name must be at least 2 characters')
        ).toBeInTheDocument();
      });
    });

    it('should show error for short password', async () => {
      render(<CustomerSignUpPage />);

      const passwordInput = screen.getByLabelText('Password');
      fireEvent.change(passwordInput, { target: { value: '123' } });

      const submitButton = screen.getByRole('button', {
        name: 'Create Account',
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Password must be at least 8 characters')
        ).toBeInTheDocument();
      });
    });

    it('should show error for mismatched passwords', async () => {
      render(<CustomerSignUpPage />);

      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: 'different123' },
      });

      const submitButton = screen.getByRole('button', {
        name: 'Create Account',
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
      });
    });

    it('should clear error when user starts typing', async () => {
      render(<CustomerSignUpPage />);

      const emailInput = screen.getByLabelText('Email Address');
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

      const submitButton = screen.getByRole('button', {
        name: 'Create Account',
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Valid email required')).toBeInTheDocument();
      });

      fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });

      await waitFor(() => {
        expect(
          screen.queryByText('Valid email required')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should successfully submit form and redirect', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
        user_type: 'customer',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Account created successfully!',
          user: mockUser,
        }),
      });

      render(<CustomerSignUpPage />);

      // Fill form
      fireEvent.change(screen.getByLabelText('Full Name'), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText('Email Address'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'password123' },
      });

      // Submit form
      const submitButton = screen.getByRole('button', {
        name: 'Create Account',
      });
      fireEvent.click(submitButton);

      // Check loading state
      await waitFor(() => {
        expect(screen.getByText('Creating Account...')).toBeInTheDocument();
      });

      // Check API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
            user_type: 'customer',
          }),
        });
      });

      // Check success message
      await waitFor(() => {
        expect(
          screen.getByText('Account created successfully!')
        ).toBeInTheDocument();
      });

      // Check session storage
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'signup_user',
        JSON.stringify(mockUser)
      );

      // Check redirect after delay
      await waitFor(
        () => {
          expect(mockRouter.push).toHaveBeenCalledWith(
            '/auth/sign-up/customer/step-2'
          );
        },
        { timeout: 2000 }
      );
    });

    it('should handle API error response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          error: 'User already exists with this email',
        }),
      });

      render(<CustomerSignUpPage />);

      // Fill form
      fireEvent.change(screen.getByLabelText('Full Name'), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText('Email Address'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'password123' },
      });

      // Submit form
      const submitButton = screen.getByRole('button', {
        name: 'Create Account',
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('User already exists with this email')
        ).toBeInTheDocument();
      });

      // Should not redirect
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      render(<CustomerSignUpPage />);

      // Fill form
      fireEvent.change(screen.getByLabelText('Full Name'), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText('Email Address'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'password123' },
      });

      // Submit form
      const submitButton = screen.getByRole('button', {
        name: 'Create Account',
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('should handle API response without user data', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Account created successfully!',
        }),
      });

      render(<CustomerSignUpPage />);

      // Fill form
      fireEvent.change(screen.getByLabelText('Full Name'), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText('Email Address'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'password123' },
      });

      // Submit form
      const submitButton = screen.getByRole('button', {
        name: 'Create Account',
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Account created successfully!')
        ).toBeInTheDocument();
      });

      // Should not set session storage if no user data
      expect(mockSessionStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('should disable form inputs during submission', async () => {
      (global.fetch as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      render(<CustomerSignUpPage />);

      // Fill form
      fireEvent.change(screen.getByLabelText('Full Name'), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText('Email Address'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'password123' },
      });

      // Submit form
      const submitButton = screen.getByRole('button', {
        name: 'Create Account',
      });
      fireEvent.click(submitButton);

      // Check loading state
      await waitFor(() => {
        expect(screen.getByText('Creating Account...')).toBeInTheDocument();
      });

      // Check that inputs are disabled
      expect(screen.getByLabelText('Full Name')).toBeDisabled();
      expect(screen.getByLabelText('Email Address')).toBeDisabled();
      expect(screen.getByLabelText('Password')).toBeDisabled();
      expect(screen.getByLabelText('Confirm Password')).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    it('should clear error when user starts typing in any field', async () => {
      render(<CustomerSignUpPage />);

      // Trigger an error first
      const emailInput = screen.getByLabelText('Email Address');
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

      const submitButton = screen.getByRole('button', {
        name: 'Create Account',
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Valid email required')).toBeInTheDocument();
      });

      // Clear error by typing in name field
      const nameInput = screen.getByLabelText('Full Name');
      fireEvent.change(nameInput, { target: { value: 'Test User' } });

      await waitFor(() => {
        expect(
          screen.queryByText('Valid email required')
        ).not.toBeInTheDocument();
      });
    });

    it('should show success message with checkmark icon', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Account created successfully!',
          user: {
            id: 'user-id',
            email: 'test@example.com',
            name: 'Test User',
            user_type: 'customer',
          },
        }),
      });

      render(<CustomerSignUpPage />);

      // Fill and submit form
      fireEvent.change(screen.getByLabelText('Full Name'), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText('Email Address'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'password123' },
      });

      const submitButton = screen.getByRole('button', {
        name: 'Create Account',
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const successMessage = screen.getByText(
          'Account created successfully!'
        );
        expect(successMessage).toBeInTheDocument();

        // Check that it's in a success alert
        const alert = successMessage.closest('.alert-success');
        expect(alert).toBeInTheDocument();
      });
    });

    it('should show error message with warning icon', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          error: 'User already exists with this email',
        }),
      });

      render(<CustomerSignUpPage />);

      // Fill and submit form
      fireEvent.change(screen.getByLabelText('Full Name'), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText('Email Address'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'password123' },
      });

      const submitButton = screen.getByRole('button', {
        name: 'Create Account',
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(
          'User already exists with this email'
        );
        expect(errorMessage).toBeInTheDocument();

        // Check that it's in a danger alert
        const alert = errorMessage.closest('.alert-danger');
        expect(alert).toBeInTheDocument();
      });
    });
  });
});
