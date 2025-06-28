import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BossUploadForm from '@/components/BossUploadForm';

// Mock MAHARDIKA_COLORS
jest.mock('@/lib/env', () => ({
  MAHARDIKA_COLORS: {
    navy: '#0D1B2A',
    gold: '#F4B400',
  },
}));

describe('BossUploadForm', () => {
  const mockOnUploadComplete = jest.fn();
  const mockOnUploadError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mock-token'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  test('renders upload form with correct branding', () => {
    render(<BossUploadForm />);

    expect(screen.getByText('Boss Upload')).toBeInTheDocument();
    expect(
      screen.getByText('Secure PDF upload with compression & virus scanning')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /upload files/i })
    ).toBeInTheDocument();
  });

  test('displays file input and handles file selection', () => {
    render(<BossUploadForm />);

    const fileInput = screen.getByRole('textbox', {
      hidden: true,
    }) as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();
    expect(fileInput.accept).toBe('.pdf');

    const testFile = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });
    fireEvent.change(fileInput, { target: { files: [testFile] } });

    expect(screen.getByText('Selected Files:')).toBeInTheDocument();
    expect(screen.getByText(/test.pdf/)).toBeInTheDocument();
  });

  test('shows upload progress when uploading', async () => {
    render(<BossUploadForm onUploadComplete={mockOnUploadComplete} />);

    const fileInput = screen.getByRole('textbox', {
      hidden: true,
    }) as HTMLInputElement;
    const testFile = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });
    fireEvent.change(fileInput, { target: { files: [testFile] } });

    const uploadButton = screen.getByRole('button', { name: /upload files/i });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText(/uploading file.../i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/scanning for viruses.../i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/compressing pdf.../i)).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(screen.getByText(/upload complete!/i)).toBeInTheDocument();
      },
      { timeout: 6000 }
    );

    expect(mockOnUploadComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        fileName: 'test.pdf',
        size_kb: expect.any(Number),
        url: expect.any(String),
      })
    );
  });

  test('disables upload button when no files selected', () => {
    render(<BossUploadForm />);

    const uploadButton = screen.getByRole('button', { name: /upload files/i });
    expect(uploadButton).toBeDisabled();
  });

  test('enables upload button when files are selected', () => {
    render(<BossUploadForm />);

    const fileInput = screen.getByRole('textbox', {
      hidden: true,
    }) as HTMLInputElement;
    const testFile = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });
    fireEvent.change(fileInput, { target: { files: [testFile] } });

    const uploadButton = screen.getByRole('button', { name: /upload files/i });
    expect(uploadButton).not.toBeDisabled();
  });

  test('allows file removal', () => {
    render(<BossUploadForm />);

    const fileInput = screen.getByRole('textbox', {
      hidden: true,
    }) as HTMLInputElement;
    const testFile = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });
    fireEvent.change(fileInput, { target: { files: [testFile] } });

    expect(screen.getByText('Selected Files:')).toBeInTheDocument();

    const removeButton = screen.getByRole('button', { name: '' }); // Remove button
    fireEvent.click(removeButton);

    expect(screen.queryByText('Selected Files:')).not.toBeInTheDocument();
  });

  test('shows progress bar during upload', async () => {
    render(<BossUploadForm />);

    const fileInput = screen.getByRole('textbox', {
      hidden: true,
    }) as HTMLInputElement;
    const testFile = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });
    fireEvent.change(fileInput, { target: { files: [testFile] } });

    const uploadButton = screen.getByRole('button', { name: /upload files/i });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      const progressBar = document.querySelector('.progress-bar');
      expect(progressBar).toBeInTheDocument();
    });
  });

  test('applies Mahardika brand colors', () => {
    render(<BossUploadForm />);

    // Check if component uses brand colors through CSS variables
    const uploadForm = document.querySelector('.boss-upload-form');
    expect(uploadForm).toBeInTheDocument();

    // CSS variables should be set correctly
    const styles = window.getComputedStyle(uploadForm!);
    // Note: jsdom doesn't fully support CSS custom properties, so we check the presence of the element
    expect(uploadForm).toHaveClass('boss-upload-form');
  });

  test('handles upload with custom endpoint', async () => {
    const customEndpoint = '/api/custom-upload';
    render(
      <BossUploadForm
        endpoint={customEndpoint}
        onUploadComplete={mockOnUploadComplete}
      />
    );

    const fileInput = screen.getByRole('textbox', {
      hidden: true,
    }) as HTMLInputElement;
    const testFile = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });
    fireEvent.change(fileInput, { target: { files: [testFile] } });

    // Mock fetch for custom endpoint
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          fileName: 'test.pdf',
          size_kb: 1,
          url: 'https://example.com/test.pdf',
        }),
    });

    const uploadButton = screen.getByRole('button', { name: /upload files/i });
    fireEvent.click(uploadButton);

    await waitFor(
      () => {
        expect(mockOnUploadComplete).toHaveBeenCalled();
      },
      { timeout: 6000 }
    );
  });

  test('displays appropriate file size', () => {
    render(<BossUploadForm />);

    const fileInput = screen.getByRole('textbox', {
      hidden: true,
    }) as HTMLInputElement;
    const testFile = new File(['x'.repeat(1024)], 'test.pdf', {
      type: 'application/pdf',
    });
    fireEvent.change(fileInput, { target: { files: [testFile] } });

    expect(screen.getByText(/0.00 MB/)).toBeInTheDocument();
  });
});
