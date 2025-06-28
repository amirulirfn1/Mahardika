import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignInPage from '@/app/auth/sign-in/page';

// Mock alert
beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.alert = jest.fn();
});

afterEach(() => {
  (global.alert as jest.Mock).mockClear();
});

describe('Authentication Flows', () => {
  it('renders SignIn page and submits login', async () => {
    render(<SignInPage />);

    // Fill inputs
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Click Sign In button
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Signed in successfully');
    });
  });
}); 