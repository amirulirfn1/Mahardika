/**
 * API Error Handler - Mahardika Platform
 * Standardized error handling for all API routes
 */

import { NextResponse } from 'next/server';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Insufficient permissions') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string = 'Too many requests') {
    super(message);
    this.name = 'RateLimitError';
  }
}

interface ErrorResponse {
  error: string;
  code?: string;
  details?: any;
  requestId?: string;
}

/**
 * Standardized API error handler
 * @param error - The error to handle
 * @param requestId - Optional request ID for tracking
 * @returns NextResponse with appropriate status code and error message
 */
export function apiErrorHandler(
  error: unknown,
  requestId?: string
): NextResponse<ErrorResponse> {
  console.error('API Error:', error);

  const isProduction = process.env.NODE_ENV === 'production';
  
  // Default error response
  let status = 500;
  let errorResponse: ErrorResponse = {
    error: 'An internal error occurred',
    requestId,
  };

  // Handle specific error types
  if (error instanceof ValidationError) {
    status = 400;
    errorResponse = {
      error: error.message,
      code: 'VALIDATION_ERROR',
      requestId,
    };
  } else if (error instanceof AuthenticationError) {
    status = 401;
    errorResponse = {
      error: error.message,
      code: 'AUTHENTICATION_ERROR',
      requestId,
    };
  } else if (error instanceof AuthorizationError) {
    status = 403;
    errorResponse = {
      error: error.message,
      code: 'AUTHORIZATION_ERROR',
      requestId,
    };
  } else if (error instanceof RateLimitError) {
    status = 429;
    errorResponse = {
      error: error.message,
      code: 'RATE_LIMIT_ERROR',
      requestId,
    };
  } else if (error instanceof Error) {
    // Generic error handling
    if (!isProduction) {
      errorResponse = {
        error: error.message,
        code: error.name,
        details: error.stack,
        requestId,
      };
    } else {
      // In production, don't expose internal error details
      errorResponse = {
        error: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR',
        requestId,
      };
    }
  }

  return NextResponse.json(errorResponse, { status });
}

/**
 * Wrap an API handler with error handling
 * @param handler - The API handler function
 * @returns Wrapped handler with error handling
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    const requestId = crypto.randomUUID();
    
    try {
      const response = await handler(...args);
      
      // Add request ID to successful responses
      if (response.headers && !response.headers.get('X-Request-ID')) {
        response.headers.set('X-Request-ID', requestId);
      }
      
      return response;
    } catch (error) {
      return apiErrorHandler(error, requestId);
    }
  }) as T;
}

/**
 * Validate required fields in request body
 * @param body - Request body
 * @param requiredFields - Array of required field names
 * @throws ValidationError if any required field is missing
 */
export function validateRequiredFields(
  body: any,
  requiredFields: string[]
): void {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Invalid request body');
  }

  const missingFields = requiredFields.filter(field => !body[field]);
  
  if (missingFields.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missingFields.join(', ')}`
    );
  }
}

/**
 * Validate email format
 * @param email - Email to validate
 * @throws ValidationError if email is invalid
 */
export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }
}

/**
 * Validate UUID format
 * @param uuid - UUID to validate
 * @throws ValidationError if UUID is invalid
 */
export function validateUUID(uuid: string): void {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(uuid)) {
    throw new ValidationError('Invalid UUID format');
  }
} 