'use client';

import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface HeroImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencyId: string;
  currentImageUrl?: string;
  currentTagline?: string;
  currentAbout?: string;
  onSuccess?: (data: {
    imageUrl: string;
    tagline: string;
    about: string;
  }) => void;
  className?: string;
}

interface UploadData {
  tagline: string;
  about: string;
  imageFile: File | null;
}

const MAHARDIKA_COLORS = {
  navy: '#0D1B2A',
  gold: '#F4B400',
};

const HeroImageUploadModal: React.FC<HeroImageUploadModalProps> = ({
  isOpen,
  onClose,
  agencyId,
  currentImageUrl = '',
  currentTagline = '',
  currentAbout = '',
  onSuccess,
  className = '',
}) => {
  const [formData, setFormData] = useState<UploadData>({
    tagline: currentTagline,
    about: currentAbout,
    imageFile: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, imageFile: file }));

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setError(null);
    } else {
      setError('Please select a valid image file (JPG, PNG, GIF)');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tagline.trim()) {
      setError('Tagline is required');
      return;
    }

    if (formData.tagline.length > 60) {
      setError('Tagline must be 60 characters or less');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create FormData for file upload
      const uploadData = new FormData();
      uploadData.append('agencyId', agencyId);
      uploadData.append('tagline', formData.tagline.trim());
      uploadData.append('about', formData.about.trim());

      if (formData.imageFile) {
        uploadData.append('heroImage', formData.imageFile);
      }

      const response = await fetch('/api/agency/hero-upload', {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();

      onSuccess?.({
        imageUrl: result.imageUrl || previewUrl,
        tagline: formData.tagline,
        about: formData.about,
      });

      onClose();
    } catch (err) {
      console.error('Upload error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to upload hero image'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      tagline: currentTagline,
      about: currentAbout,
      imageFile: null,
    });
    setPreviewUrl(currentImageUrl);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className={`modal-dialog modal-lg ${className}`}>
        <div
          className="modal-content"
          style={{
            borderRadius: '0.5rem',
            border: `2px solid ${MAHARDIKA_COLORS.gold}`,
            boxShadow: '0 10px 30px rgba(13, 27, 42, 0.3)',
          }}
        >
          {/* Header */}
          <div
            className="modal-header"
            style={{
              backgroundColor: MAHARDIKA_COLORS.navy,
              color: 'white',
              borderRadius: '0.5rem 0.5rem 0 0',
            }}
          >
            <div>
              <h5 className="modal-title mb-0 fw-bold">
                <i className="bi bi-image me-2" />
                Update Hero Section
              </h5>
              <small className="opacity-75">
                Upload image, edit tagline & about
              </small>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            />
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            <form onSubmit={handleSubmit}>
              {/* Image Upload Section */}
              <div className="mb-4">
                <label
                  className="form-label fw-bold"
                  style={{ color: MAHARDIKA_COLORS.navy }}
                >
                  Hero Image
                </label>

                {/* Image Preview */}
                {previewUrl && (
                  <div className="mb-3">
                    <img
                      src={previewUrl}
                      alt="Hero preview"
                      className="img-fluid rounded"
                      style={{
                        maxHeight: '200px',
                        width: '100%',
                        objectFit: 'cover',
                        border: `2px solid ${MAHARDIKA_COLORS.gold}40`,
                      }}
                    />
                  </div>
                )}

                {/* Upload Area */}
                <div
                  className={`border rounded p-4 text-center ${
                    dragOver ? 'border-primary' : 'border-secondary'
                  }`}
                  style={{
                    borderRadius: '0.5rem',
                    borderStyle: 'dashed',
                    backgroundColor: dragOver
                      ? `${MAHARDIKA_COLORS.gold}10`
                      : `${MAHARDIKA_COLORS.navy}05`,
                    minHeight: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <i
                    className={`bi ${dragOver ? 'bi-cloud-upload' : 'bi-image'} mb-2`}
                    style={{ fontSize: '2rem', color: MAHARDIKA_COLORS.gold }}
                  />
                  <p
                    className="mb-2 fw-bold"
                    style={{ color: MAHARDIKA_COLORS.navy }}
                  >
                    {dragOver
                      ? 'Drop image here'
                      : 'Click to upload or drag & drop'}
                  </p>
                  <small className="text-muted">
                    Supports JPG, PNG, GIF • Max 5MB • Recommended: 1200x600px
                  </small>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="d-none"
                />
              </div>

              {/* Tagline Section */}
              <div className="mb-3">
                <label
                  htmlFor="tagline"
                  className="form-label fw-bold"
                  style={{ color: MAHARDIKA_COLORS.navy }}
                >
                  Tagline <span className="text-muted">(max 60 chars)</span>
                </label>
                <input
                  type="text"
                  id="tagline"
                  className="form-control"
                  value={formData.tagline}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, tagline: e.target.value }))
                  }
                  placeholder="Enter your catchy tagline..."
                  maxLength={60}
                  style={{
                    borderRadius: '0.5rem',
                    border: `2px solid ${MAHARDIKA_COLORS.gold}40`,
                  }}
                  disabled={loading}
                />
                <div className="form-text">
                  {formData.tagline.length}/60 characters
                </div>
              </div>

              {/* About Section */}
              <div className="mb-4">
                <label
                  htmlFor="about"
                  className="form-label fw-bold"
                  style={{ color: MAHARDIKA_COLORS.navy }}
                >
                  About <span className="text-muted">(Markdown supported)</span>
                </label>
                <textarea
                  id="about"
                  className="form-control"
                  value={formData.about}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, about: e.target.value }))
                  }
                  placeholder="Tell visitors about your agency. You can use **bold**, *italic*, and other markdown formatting..."
                  rows={4}
                  style={{
                    borderRadius: '0.5rem',
                    border: `2px solid ${MAHARDIKA_COLORS.gold}40`,
                    resize: 'vertical',
                  }}
                  disabled={loading}
                />
                <div className="form-text">
                  <small>
                    Tip: Use **text** for bold, *text* for italic, and
                    [link](url) for links
                  </small>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div
                  className="alert alert-danger"
                  style={{ borderRadius: '0.5rem' }}
                >
                  <i className="bi bi-exclamation-triangle-fill me-2" />
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn fw-bold"
                  disabled={loading || !formData.tagline.trim()}
                  style={{
                    backgroundColor: MAHARDIKA_COLORS.navy,
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: 'none',
                    flex: 1,
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2" />
                      Update Hero Section
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleReset}
                  disabled={loading}
                  style={{ borderRadius: '0.5rem' }}
                >
                  <i className="bi bi-arrow-clockwise me-2" />
                  Reset
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onClose}
                  disabled={loading}
                  style={{ borderRadius: '0.5rem' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div
            className="modal-footer"
            style={{
              backgroundColor: `${MAHARDIKA_COLORS.gold}10`,
              borderRadius: '0 0 0.5rem 0.5rem',
            }}
          >
            <small className="text-muted">
              <i className="bi bi-info-circle me-1" />
              Images are uploaded to Supabase Storage. Changes take effect
              immediately.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroImageUploadModal;
