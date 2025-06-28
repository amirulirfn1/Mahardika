import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignInPage from '@/app/auth/sign-in/page';

// Mock global alert as Jest mock
globalThis.alert = jest.fn() as unknown as typeof alert;

afterEach(() => {
  (globalThis.alert as jest.Mock).mockClear();
});

describe('Authentication Flows', () => {
  it('renders SignIn page and submits login', async () => {
    // Mock Supabase auth call to succeed
    const supabase = require('@/lib/supabase').supabase;
    jest.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValue({ error: null });

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
      expect(globalThis.alert).toHaveBeenCalledWith('Signed in successfully');
    });
  });
}); 