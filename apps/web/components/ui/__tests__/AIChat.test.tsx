import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { AIChat } from '../AIChat';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('AIChat Component', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renders with initial welcome message', () => {
    render(<AIChat />);

    expect(screen.getByText('Mahardika AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('Powered by DeepSeek AI')).toBeInTheDocument();
    expect(
      screen.getByText('Welcome to Mahardika AI Assistant!')
    ).toBeInTheDocument();
  });

  it('renders input field and send button', () => {
    render(<AIChat />);

    const textarea = screen.getByPlaceholderText(/Type your message here/);
    const sendButton = screen.getByRole('button', { name: /send/i });

    expect(textarea).toBeInTheDocument();
    expect(sendButton).toBeInTheDocument();
    expect(sendButton).toBeDisabled(); // Should be disabled when input is empty
  });

  it('enables send button when text is entered', () => {
    render(<AIChat />);

    const textarea = screen.getByPlaceholderText(/Type your message here/);
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(textarea, { target: { value: 'Hello AI!' } });

    expect(sendButton).not.toBeDisabled();
  });

  it('sends message on button click', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: 'Hello! How can I help you?' }),
    });

    render(<AIChat />);

    const textarea = screen.getByPlaceholderText(/Type your message here/);
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(textarea, { target: { value: 'Hello AI!' } });
    fireEvent.click(sendButton);

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/chat',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Hello AI!',
          apiKey: undefined,
        }),
      })
    );

    await waitFor(() => {
      expect(screen.getByText('Hello AI!')).toBeInTheDocument();
    });
  });

  it('sends message on Enter key press', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: 'Response from AI' }),
    });

    render(<AIChat />);

    const textarea = screen.getByPlaceholderText(/Type your message here/);

    fireEvent.change(textarea, { target: { value: 'Test message' } });
    fireEvent.keyPress(textarea, { key: 'Enter', code: 'Enter' });

    expect(mockFetch).toHaveBeenCalled();
  });

  it('displays error when API call fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<AIChat />);

    const textarea = screen.getByPlaceholderText(/Type your message here/);
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(textarea, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/Error: Network error/)).toBeInTheDocument();
    });
  });

  it('shows loading state during API call', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });

    mockFetch.mockReturnValueOnce(promise);

    render(<AIChat />);

    const textarea = screen.getByPlaceholderText(/Type your message here/);
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(textarea, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('AI is thinking...')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sending/i })
    ).toBeInTheDocument();

    // Resolve the promise to complete the test
    resolvePromise!({
      ok: true,
      json: async () => ({ response: 'Test response' }),
    });
  });

  it('calls onMessage callback when provided', async () => {
    const mockOnMessage = vi.fn();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: 'AI response' }),
    });

    render(<AIChat onMessage={mockOnMessage} />);

    const textarea = screen.getByPlaceholderText(/Type your message here/);
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(textarea, { target: { value: 'User message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockOnMessage).toHaveBeenCalledWith('User message', 'AI response');
    });
  });

  it('uses provided API key', async () => {
    const testApiKey = 'test-api-key-123';
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: 'Response' }),
    });

    render(<AIChat apiKey={testApiKey} />);

    const textarea = screen.getByPlaceholderText(/Type your message here/);
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(textarea, { target: { value: 'Test' } });
    fireEvent.click(sendButton);

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/chat',
      expect.objectContaining({
        body: JSON.stringify({
          message: 'Test',
          apiKey: testApiKey,
        }),
      })
    );
  });
});
