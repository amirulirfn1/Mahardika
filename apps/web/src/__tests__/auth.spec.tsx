import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignInPage from '@/app/auth/sign-in/page';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock global alert as Jest mock
globalThis.alert = jest.fn() as unknown as typeof alert;

afterEach(() => {
  (globalThis.alert as jest.Mock).mockClear();
});

describe('Authentication Flows', () => {
  it('renders SignIn page and submits login', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    // Set mock resolution
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      error: null,
    });

    render(<SignInPage />);

    // Fill inputs
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Click Sign In button
    fireEvent.click(screen.getAllByRole('button', { name: /sign in/i })[1]);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
});
